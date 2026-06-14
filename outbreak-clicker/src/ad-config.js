// AdMob ad-unit IDs.
//
// During development/testing we MUST use Google's official *test* ad units —
// displaying or tapping your own live ads triggers "invalid traffic" and can get
// the AdMob account suspended. Flip USE_TEST_ADS to false ONLY for a store
// release build, so the real units below are used instead.
//
// The native *App ID* (ca-app-pub-3652166615907322~1538381320) is NOT here — it
// goes in android/app/src/main/AndroidManifest.xml as
// com.google.android.gms.ads.APPLICATION_ID.

// Google official test ad units (safe to show/tap anywhere):
const TEST = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// Real production units from the AdMob console:
const PROD = {
  banner: 'ca-app-pub-3652166615907322/7569773912',
  // TODO: リワード広告ユニットを AdMob で作成し、ここに差し替える（未作成）。
  rewarded: 'TODO_CREATE_REWARDED_UNIT',
};

// Keep true while developing/testing. Set false only for the store release.
export const USE_TEST_ADS = true;

export const AD_UNITS = USE_TEST_ADS ? TEST : PROD;
