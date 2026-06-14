// Firebase Analytics + Crashlytics via the global Capacitor bridge.
//
// Same no-bundler constraint as admob.js: this app ships as plain ES modules,
// so we must NOT `import` the @capacitor-firebase packages. We reach the native
// plugins through window.Capacitor.Plugins.{FirebaseAnalytics,FirebaseCrashlytics}.
// Everything no-ops on the web AND until the native plugins are wired (they need
// google-services.json + @capacitor-firebase/* synced into the Android project),
// so the browser build and any not-yet-configured build keep working unchanged.

function bridge(name) {
  const C = typeof window !== 'undefined' ? window.Capacitor : null;
  if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return null;
  return (C.Plugins && C.Plugins[name]) || null;
}

// --- Analytics ---------------------------------------------------------------

// Log a custom analytics event. `params` is an optional flat object.
export function logEvent(name, params) {
  const A = bridge('FirebaseAnalytics');
  if (!A) return;
  try { A.logEvent({ name, params: params || {} }); } catch (e) { /* ignore */ }
}

// --- Crashlytics -------------------------------------------------------------

// Record a non-fatal error/exception to Crashlytics.
export function recordError(err) {
  const Cr = bridge('FirebaseCrashlytics');
  if (!Cr) return;
  const message = err && (err.message || err.reason) ? String(err.message || err.reason) : String(err);
  try { Cr.recordException({ message }); } catch (e) { /* ignore */ }
}

// Install global JS error handlers that forward to Crashlytics. Safe on web
// (the handlers run but recordError no-ops without the native plugin).
export function installErrorReporting() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (e) => recordError(e && (e.error || e.message)));
  window.addEventListener('unhandledrejection', (e) => recordError(e && e.reason));
}
