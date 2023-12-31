import { getInstance } from "./index";
//import Store from "../store/";

export const authGuard = (to, from, next) => {
  const authService = getInstance();

  const fn = () => {
    let auth = JSON.parse(window.localStorage.getItem("auth"));
    // If the user is authenticated, continue with the route
    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      auth &&
      auth.isAuthenticated
    ) {
      return next();
    }

    // Otherwise, log in
    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If loading has already finished, check our auth state using `fn()`
  if (!authService.loading) {
    return fn();
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch("loading", (loading) => {
    if (loading === false) {
      return fn();
    }
  });
};
