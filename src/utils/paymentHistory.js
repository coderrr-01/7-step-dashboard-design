import { isPaidValue, normalizePaymentMethod, readFieldIgnoreCase } from "./paymentState";

const TRUE_VALUES_DONE = { paid: 1, completed: 1, success: 1, approved: 1, settled: 1, verified: 1 };

const TYPE_HINTS = {
  deposit: ["deposit", "security deposit", "security_deposit", "dp", "booking"],
  rent: ["rent", "monthly", "installment", "subscription", "fee"],
};

function matchType(value) {
  const v = String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!v) return null;
  for (const [type, hints] of Object.entries(TYPE_HINTS)) {
    if (hints.some((h) => v.includes(h.replace(/[^a-z0-9]/g, "")))) return type;
  }
  return null;
}

function pickNumber(obj, keys) {
  const v = readFieldIgnoreCase(obj, keys);
  if (v == null || v === "") return null;
  const n = parseFloat(String(v).replace(/[$,]/g, ""));
  return isNaN(n) ? v : n;
}

function pickText(obj, keys) {
  const v = readFieldIgnoreCase(obj, keys);
  return v == null || v === "" ? "" : String(v);
}

// Normalise one raw payment entry (object or primitive) into a record.
function normalizeRecord(raw, fallbackType) {
  if (raw == null) return null;
  if (typeof raw !== "object") {
    // Bare value (amount or status string) — wrap it.
    return { type: fallbackType, amount: raw, date: "", method: "", status: "", txnId: "", receipt: "" };
  }

  const type = matchType(pickText(raw, ["type", "category", "kind", "payment_type", "name", "label", "section"])) || fallbackType;

  let amount = pickNumber(raw, ["amount", "total", "total_amount", "paid_amount", "value", "security_deposit", "rent_amount"]);
  if (amount == null) {
    amount = pickNumber(raw, ["payment", "payments"]) ?? "";
  }

  let date = pickText(raw, ["date", "paid_date", "payment_date", "transaction_date", "created_at", "timestamp", "added_on", "recorded_on"]);
  if (date) date = date.replace("T", " ").slice(0, 10);

  const status = pickText(raw, ["status", "state", "payment_status", "result", "paid"]);
  const method = pickText(raw, ["method", "payment_method", "mode", "mode_of_payment", "gateway", "source"]);
  const txnId = pickText(raw, ["txn_id", "transaction_id", "transactionId", "payment_id", "stripe_id", "charge_id", "id", "reference", "ref"]);
  const receipt = pickText(raw, ["receipt", "receipt_url", "receiptUrl", "invoice", "invoice_url", "pdf"]);

  return { type, amount, date, method, status, txnId, receipt };
}

// Recursively walk the client record for arrays of payment entries.
function findPaymentArrays(client, acc = [], seen = new Set()) {
  if (!client || typeof client !== "object" || seen.has(client)) return acc;
  seen.add(client);
  for (const [key, value] of Object.entries(client)) {
    const k = String(key).toLowerCase();
    const arrayish = /pay|txn|transact|invoice|receipt|history|record/.test(k);
    if (Array.isArray(value) && value.length && arrayish) {
      acc.push(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      findPaymentArrays(value, acc, seen);
    } else if (Array.isArray(value)) {
      findPaymentArrays(value, acc, seen);
    }
  }
  return acc;
}

/**
 * Extract a payment history from the client record.
 * Priority: explicit arrays (payments / payment_history / deposit_history /
 * rent_history / …); otherwise falls back to the single deposit + rent records.
 * Every record gets: { type, amount, date, method, status, txnId, receipt }.
 */
export function getPaymentHistory(client) {
  const records = [];

  for (const arr of findPaymentArrays(client)) {
    for (const raw of arr) {
      const rec = normalizeRecord(raw, null);
      if (!rec || rec.amount === "" && !rec.txnId && !rec.receipt) continue;
      records.push(rec);
    }
  }

  // Explicit single-record keys (latest payment for each type).
  const singleKeys = [
    ["deposit", "deposit_receipt", "deposit_txn", "security_deposit_receipt", "booking_receipt"],
    ["rent", "rent_receipt", "rent_txn", "monthly_rent_receipt"],
  ];
  for (const [type, keys] of singleKeys) {
    const raw = readFieldIgnoreCase(client, keys);
    if (raw && typeof raw === "object") records.push(normalizeRecord(raw, type));
  }

  // Fallback: build one record per type from the flat paid flags.
  const depositPaid = isPaidValue(readFieldIgnoreCase(client, ["deposit_paid", "security_deposit_paid", "deposit_payment_status", "payment_status"]));
  const rentPaid = isPaidValue(readFieldIgnoreCase(client, ["rent_paid", "monthly_rent_paid", "rent_payment_status", "payment_status"]));

  if (depositPaid && !records.some((r) => r.type === "deposit")) {
    records.push({
      type: "deposit",
      amount: pickNumber(client, ["security_deposit", "deposit_amount", "booking_amount"]),
      date: pickText(client, ["deposit_paid_at", "deposit_paid_date", "security_deposit_paid_at"]),
      method: pickText(client, ["deposit_method", "security_deposit_method", "mode_of_payment_security_deposit", "mode_of_payment", "payment_method"]),
      status: "paid",
      txnId: pickText(client, ["deposit_txn_id", "deposit_transaction_id", "security_deposit_txn_id"]),
      receipt: pickText(client, ["deposit_receipt_url", "deposit_receipt", "security_deposit_receipt"]),
    });
  }
  if (rentPaid && !records.some((r) => r.type === "rent")) {
    records.push({
      type: "rent",
      amount: pickNumber(client, ["rent_amount", "monthly_rent", "rent_value"]),
      date: pickText(client, ["rent_paid_at", "rent_paid_date", "monthly_rent_paid_at"]),
      method: pickText(client, ["rent_method", "monthly_rent_method", "mode_of_payment_rent", "mode_of_payment", "payment_method"]),
      status: "paid",
      txnId: pickText(client, ["rent_txn_id", "rent_transaction_id", "monthly_rent_txn_id"]),
      receipt: pickText(client, ["rent_receipt_url", "rent_receipt", "monthly_rent_receipt"]),
    });
  }

  return records.filter((r) => r && r.type && (r.amount !== "" || r.txnId || r.receipt));
}

export function isPaymentRecordDone(rec) {
  if (!rec) return false;
  const v = String(rec.status || "").toLowerCase().trim();
  if (!v) return true; // records without a status are treated as done
  if (TRUE_VALUES_DONE[v]) return true;
  if (/^\d+(\.\d+)?$/.test(v)) return Number(v) > 0;
  return false;
}