import Vue from "vue";
import VueRouter from "vue-router";
import Lander from "../views/Lander.vue";
import Logout from "../views/Logout.vue";
import _404 from "../views/404.vue";
import LowQuantity from "../views/LowQuantity.vue";
import App from "@/layouts/App.vue";
import { authGuard } from "@/auth/authGuard";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "lander",
    component: Lander,
    meta: { requiresAuth: false },
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
    meta: { requiresAuth: false },
  },
  {
    path: "/app",
    component: App,
    beforeEnter: authGuard,
    children: [
      {
        path: "group/:id",
        name: "group",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "group-collection" */ "../views/detail/Group.vue"
          ),
      },
      {
        path: "groups",
        name: "groups",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "group-management" */ "../views/Groups.vue"
          ),
      },
      {
        path: "home",
        name: "home",
        component: LowQuantity,
        meta: { requiresAuth: true },
      },
      {
        path: "items",
        name: "items",
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "all-items" */ "../views/Items.vue"),
      },
      {
        path: "sandbox/:id?",
        name: "sandbox",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "ux-uat-sandbox" */ "../views/Sandbox.vue"
          ),
      },
      {
        path: "search",
        name: "search-results",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "search-results" */ "../views/SearchResults.vue"
          ),
      },
      {
        path: "shopping-list/:id",
        name: "shopping-list",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "shopping-list-collection" */ "../views/detail/shoppingList/Manage.vue"
          ),
      },
      {
        path: "shopping-lists",
        name: "shopping-lists",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "shopping-list-management" */ "../views/ShoppingLists.vue"
          ),
      },
      {
        path: "stock-items",
        name: "stock-items",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "stock-items" */ "../views/StockItems.vue"
          ),
      },
      {
        path: "tag/:id",
        name: "tag",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "tag-collection" */ "../views/detail/Tag.vue"
          ),
      },
      {
        path: "tags",
        name: "tags",
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "tag-management" */ "../views/Tags.vue"),
      },
    ],
  },
  {
    path: "/checkout/:id",
    name: "checkout",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "shopping-list-checkout" */ "../layouts/Checkout.vue"
      ),
  },
  {
    path: "/settings",
    name: "settings",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "settings-home" */ "../layouts/Settings.vue"),
    children: [
      {
        path: "account",
        name: "account-settings",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "settings-account" */ "../views/settings/Account.vue"
          ),
      },
      {
        path: "general",
        name: "general-settings",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "settings-general" */ "../views/settings/General.vue"
          ),
      },
      {
        path: "share",
        name: "share-settings",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "settings-share" */ "../views/settings/Share.vue"
          ),
      },
      {
        path: "theme",
        name: "theme-settings",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "settings-theme" */ "../views/settings/Theme.vue"
          ),
      },
    ],
  },
  // Default Route
  {
    path: "*",
    name: "404",
    meta: { requiresAuth: false },
    component: _404,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  if (store.getters["selections/selectionMode"]) {
    store.dispatch("selections/resetSelectionMode");
  }
  if (
    (to.name == "search-results" || to.name == "items" || to.name == "home") &&
    store.getters["items/pagedCollection"].pageNumber > 1
  ) {
    store.dispatch("items/setCurrentPage", 1);
  }
  //this.$refs.appSearchBar.onClearClicked();
  next();
});

export default router;
