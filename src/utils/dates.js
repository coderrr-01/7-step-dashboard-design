// Lease-term date helpers — the single source of truth for the lease start /
// end dates shown in the UI.
//
// Two rules, and every page relies on them:
//   1. A lease start is always the move-in date from the tenant application.
//      (Which field that is per source is decided by the caller.)
//   2. The term is always exactly one calendar year after the start, and both
//      dates are always displayed as dd-mm-yyyy.
//
// These mirror jrny_add_one_year() and lease_format_dmy() in the WordPress
// plugins, so the UI, the on-screen agreement and the signed PDF can never
// disagree. Anything else in the app (interview date, date of birth, the
// calendar) keeps its own formatting and must not use these.

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Normalise whatever the API hands us into a plain "YYYY-MM-DD" string.
// Accepts the ISO form ("2026-10-01", or the same with a "T..Z" timestamp) and
// the dd/mm/yyyy form the booking / slot APIs use, so a move-in date stored in
// either shape still produces a valid end date. Returns '' when the value cannot
// be parsed — callers treat that as "no date" and show their fallback.
export function toIsoDate(value) {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  if (!raw) return '';

  // "2026-10-01" / "2026-10-01T09:30:00Z" — the value is already date-only, so
  // take it verbatim rather than round-tripping through Date (which would shift
  // it by a day for anyone west of UTC).
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${pad2(iso[2])}-${pad2(iso[3])}`;

  // "01/10/2026" — day first, the format the slot APIs speak.
  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return `${dmy[3]}-${pad2(dmy[2])}-${pad2(dmy[1])}`;

  // Anything else (e.g. the Calendar's "Oct 1, 2026" label). Date parses these
  // in local time, so read the LOCAL parts back — toISOString() would report the
  // previous day for anyone east of UTC.
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
}

// Exactly one calendar year after `value`, clamping the day to the last day of
// the target month (Feb 29 -> Feb 28). Deliberately pure calendar arithmetic:
// `new Date(iso); setFullYear(+1); toISOString()` used to push a Feb 29 start to
// Mar 1, which disagreed with the PHP side that clamps to Feb 28.
export function addOneYear(value) {
  const iso = toIsoDate(value);
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  const targetYear = year + 1;
  // Day 0 of the following month is the last day of `month`.
  const daysInTargetMonth = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
  const clampedDay = Math.min(day, daysInTargetMonth);
  return `${targetYear}-${pad2(month)}-${pad2(clampedDay)}`;
}

// "2026-10-01" -> "01-10-2026", the one format lease dates are displayed in.
// Unparseable input is passed through untouched so the UI never shows
// "Invalid Date" or an empty cell.
export function formatDateDMY(value) {
  const iso = toIsoDate(value);
  if (!iso) return value ? String(value) : '';
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
}
