const TRUE_VALUES = new Set(['1', 'true', 'yes', 'y', 'paid', 'completed', 'complete', 'success', 'successful', 'approved', 'active', 'settled', 'verified', 'charged', 'authorized']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'n', 'pending', 'unpaid', 'failed', 'failure', 'rejected', 'declined', 'cancelled', 'canceled', 'void', 'expired', 'inactive']);

function normalizeKey(value) {
  return String(value || '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

export function normalizePaymentMethod(value) {
  const normalized = normalizeKey(value);
  if (!normalized) return '';
  if (normalized === 'stripe') return 'stripe';
  if (normalized === 'paypal') return 'paypal';
  if (normalized === 'revolut') return 'revolut';
  if (normalized === 'bank') return 'bank';
  if (normalized === 'cash') return 'cash';
  return normalized;
}

export function isPaidValue(value) {
  if (value == null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;

  const text = String(value).trim().toLowerCase();
  if (!text) return false;
  if (TRUE_VALUES.has(text)) return true;
  if (FALSE_VALUES.has(text)) return false;
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text) > 0;
  return false;
}

export function readFieldIgnoreCase(object, keys) {
  if (!object || !keys?.length) return undefined;
  const entries = Object.entries(object);
  for (const wantedKey of keys) {
    const normalizedWanted = normalizeKey(wantedKey);
    const match = entries.find(([actualKey]) => normalizeKey(actualKey) === normalizedWanted);
    if (match && match[1] !== undefined && match[1] !== null && match[1] !== '') {
      return match[1];
    }
  }
  return undefined;
}

export function readPaidFlag(object, keys) {
  const value = readFieldIgnoreCase(object, keys);
  return isPaidValue(value);
}

export function getPaymentState(client) {
  if (!client) {
    return {
      depositPaid: false,
      depositMethod: '',
      rentPaid: false,
      rentMethod: '',
    };
  }

  const depositPaid = readPaidFlag(client, [
    'deposit_paid',
    'security_deposit_paid',
    'deposit_payment_status',
    'security_deposit_payment_status',
    'deposit_status',
    'security_deposit_status',
    'payment_status',
    'payment_state',
  ]);

  const rentPaid = readPaidFlag(client, [
    'rent_paid',
    'monthly_rent_paid',
    'rent_payment_status',
    'monthly_rent_payment_status',
    'rent_status',
    'subscription_status',
    'subscription_payment_status',
    'payment_status',
    'payment_state',
  ]);

  const depositMethod = normalizePaymentMethod(readFieldIgnoreCase(client, [
    'deposit_method',
    'security_deposit_method',
    'mode_of_payment_security_deposit',
    'mode_of_payment',
    'payment_method',
    'payment_type',
  ]));

  const rentMethod = normalizePaymentMethod(readFieldIgnoreCase(client, [
    'rent_method',
    'monthly_rent_method',
    'mode_of_payment_rent',
    'mode_of_payment',
    'payment_method',
    'payment_type',
    'subscription_method',
  ]));

  return {
    depositPaid,
    depositMethod,
    rentPaid,
    rentMethod,
  };
}
