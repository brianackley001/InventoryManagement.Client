/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log("Service Worker: ready...");
    },
    registered(registration) {
      // Routinely check for app updates by testing for a new service worker.
      setInterval(() => {
        console.log("... service worker interval check: registration.update()");
        registration.update();
      }, 1000 * 60 * 30); // half-hourly checks
    },
    cached() {},
    updatefound() {
      console.log("* * * New content is downloading...");
    },
    updated(registration) {
      console.log("... updated: registration...");
      window.localStorage.setItem("appUpdateAvailable", true);
      document.dispatchEvent(
        new CustomEvent("swUpdated", {
          detail: registration,
        })
      );
    },
    offline() {},
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
