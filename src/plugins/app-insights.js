import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.VUE_APP_APP_INSIGHTS,
    /* ...Other Configuration Options... */
  },
});

appInsights.loadAppInsights();

/**
 * Install function passed to Vue.use() show documentation on vue.js website.
 *
 * @param Vue
 * @param options
 */
function install(Vue, options) {
  Vue.appInsights = appInsights;

  const router = options.router;

  // Watch route event if router option is defined.
  if (router) {
    if (options.trackInitialPageView !== false) {
      setupPageTracking(options, Vue);
    } else {
      router.onReady(() => setupPageTracking(options, Vue));
    }
  }

  Object.defineProperty(Vue.prototype, "$appInsights", {
    get: () => Vue.appInsights,
  });
}

/**
 * Track route changes as page views with AppInsights
 * @param options
 */
function setupPageTracking(options, Vue) {
  const router = options.router;

  const baseName = options.baseName || "(Vue App)";

  router.beforeEach((route, from, next) => {
    const name = baseName + " / " + route.name;
    Vue.appInsights.startTrackPage(name);
    next();
  });

  router.afterEach((route) => {
    const name = baseName + " / " + route.name;
    Vue.appInsights.stopTrackPage(name);
  });
}

// auto install for navigator
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(install);
}

export default install;

export { appInsights };
