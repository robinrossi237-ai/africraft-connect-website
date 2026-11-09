// Site settings to fill in before going live. A null value hides the
// element that needs it, so nothing points to a wrong address.
export const SITE = {
  // Android download (APK or Google Play page). Null: "Bientôt" is shown.
  androidUrl: null,
  // iOS: not yet.
  iosUrl: null,
  // Team contact. Null: the contact lines are hidden.
  contactEmail: null,
  whatsappNumber: null, // e.g. '2376XXXXXXXX', digits only
  domain: 'africraft.cm',
};

// Prices shown on the site (XAF), the same as in the app.
export const PRICES = {
  unlock: 200,
  pass24h: 300,
  pass3d: 500,
  pass7d: 1000,
  artisanFreeDays: 90,
};
