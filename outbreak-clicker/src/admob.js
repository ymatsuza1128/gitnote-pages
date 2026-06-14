// AdMob integration through the global Capacitor bridge.
//
// This app ships as plain ES modules with NO bundler, so we must NOT `import`
// the @capacitor-community/admob package — bare specifiers don't resolve in the
// browser or inside the Capacitor WebView. Instead we reach the native plugin
// via window.Capacitor.Plugins.AdMob and pass the documented string values for
// ad size / position / events. On the web (no native bridge) every call is a
// no-op, so the browser build keeps its existing dummy ad UI.

import { AD_UNITS } from './ad-config.js';

// Documented string values (kept in sync with @capacitor-community/admob v6):
const BANNER_SIZE = 'ADAPTIVE_BANNER';
const BANNER_POSITION = 'BOTTOM_CENTER';
const EVENT_REWARDED = 'onRewardedVideoAdReward'; // RewardAdPluginEvents.Rewarded

function adMob() {
  const C = typeof window !== 'undefined' ? window.Capacitor : null;
  if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return null;
  return (C.Plugins && C.Plugins.AdMob) || null;
}

export function isNative() {
  return !!adMob();
}

// Initialize the SDK and show the bottom banner. Safe to call on the web (no-op).
export async function initAds() {
  const AdMob = adMob();
  if (!AdMob) return;
  try {
    await AdMob.initialize();
    await AdMob.showBanner({
      adId: AD_UNITS.banner,
      adSize: BANNER_SIZE,
      position: BANNER_POSITION,
      margin: 0,
    });
  } catch (e) {
    console.warn('[admob] initialize/banner failed:', e);
  }
}

// Show a rewarded ad. onReward() runs only when the user actually earns the
// reward; onUnavailable() runs when no ad could be shown. Returns false when not
// running natively, so the caller can fall back to the web dummy.
export async function showRewarded(onReward, onUnavailable) {
  const AdMob = adMob();
  if (!AdMob) return false;

  const rid = AD_UNITS.rewarded;
  if (!rid || rid.indexOf('TODO') !== -1) {
    // Rewarded unit not configured yet — don't block the player.
    if (onUnavailable) onUnavailable();
    return true;
  }

  let rewarded = false;
  let sub;
  try {
    sub = await AdMob.addListener(EVENT_REWARDED, () => {
      rewarded = true;
      if (onReward) onReward();
    });
    await AdMob.prepareRewardVideoAd({ adId: rid });
    await AdMob.showRewardVideoAd();
  } catch (e) {
    console.warn('[admob] rewarded failed:', e);
    if (!rewarded && onUnavailable) onUnavailable();
  } finally {
    if (sub && typeof sub.remove === 'function') {
      try { await sub.remove(); } catch (e) { /* ignore */ }
    }
  }
  return true;
}
