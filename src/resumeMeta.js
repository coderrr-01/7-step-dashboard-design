// Shared one-shot flag set by main.jsx when the app's initial entry was
// restored from jrny_last_route (the exact screen the user logged out from).
// StepContext's server-sync redirect reads it so it never yanks the user off
// that resumed screen — its only permitted override is forcing fully-paid
// users onto /payment-screen (the congratulations rule).
export const resumeMeta = { fromLastRoute: false };
