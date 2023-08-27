export const state = {
  appLoading: true,
  apiToken: null,
  apiTokenExpiration: null,
  darkTheme: JSON.parse(window.localStorage.getItem("darkTheme")) || false,
  displaySettingsIcon: true,
  installCompleted: false,
  installPrompt: null,
  loading: false,
  notificationType: "info",
  notificationMessage: "",
  notificationTimeout: 5000,
  notificationVisible: false,
  showInstallAlert:
    JSON.parse(window.localStorage.getItem("showInstallAlert")) || true,
};

export const getters = {
  apiTokenValue: (state) => {
    return state.apiToken;
  },
  apiTokenExpirationValue: (state) => {
    return state.apiTokenExpiration;
  },
  appLoadingStatus: (state) => {
    return state.appLoading;
  },
  darkTheme: (state) => {
    return state.darkTheme;
  },
  displaySettingsIcon: (state) => {
    return state.displaySettingsIcon;
  },
  installCompleted: (state) => {
    return state.installCompleted;
  },
  installPrompt: (state) => {
    return state.installPrompt;
  },
  loading: (state) => {
    return state.loading;
  },
  notificationType: (state) => {
    return state.notificationType;
  },
  notificationMessage: (state) => {
    return state.notificationMessage;
  },
  notificationTimeout: (state) => {
    return state.notificationTimeout;
  },
  notificationVisible: (state) => {
    return state.notificationVisible;
  },
  showInstallAlert: (state) => {
    return state.showInstallAlert;
  },
};

export const actions = {
  setApiToken({ commit }, newValue) {
    commit("SET_API_TOKEN_VALUE", newValue);
  },
  setApiTokenExpiration({ commit }, newValue) {
    commit("SET_API_TOKEN_EXPIRATION_VALUE", newValue);
  },
  setDarkTheme({ commit }, newValue) {
    commit("SET_DARK_THEME_VALUE", newValue);
  },
  setInstallCompleted({ commit }, newValue) {
    commit("SET_INSTALL_COMPLETED_VALUE", newValue);
  },
  setInstallPrompt({ commit }, newValue) {
    commit("SET_INSTALL_PROMPT_VALUE", newValue);
  },
  setNotificationVisibility({ commit }, newValue) {
    commit("SET_NOTIFICATION_VISIBILITY", newValue);
  },
  setSettingsIconVisibility({ commit }, newValue) {
    commit("SET_SETTINGS_ICON_VISIBILITY", newValue);
  },
  showErrorNotification({ commit }, newValue) {
    commit("SET_NOTIFICATION_MESSAGE", newValue);
    commit("SET_NOTIFICATION_TYPE", "error");
    commit("SET_NOTIFICATION_VISIBILITY", true);
  },
  showInfoNotification({ commit }, newValue) {
    commit("SET_NOTIFICATION_MESSAGE", newValue);
    commit("SET_NOTIFICATION_TYPE", "info");
    commit("SET_NOTIFICATION_VISIBILITY", true);
  },
  setInstallAlert({ commit }, newValue) {
    commit("SET_INSTALL_ALERT_VALUE", newValue);
  },
  showSuccessNotification({ commit }, newValue) {
    commit("SET_NOTIFICATION_MESSAGE", newValue);
    commit("SET_NOTIFICATION_TYPE", "success");
    commit("SET_NOTIFICATION_VISIBILITY", true);
  },
  showWarningNotification({ commit }, newValue) {
    commit("SET_NOTIFICATION_MESSAGE", newValue);
    commit("SET_NOTIFICATION_TYPE", "warning");
    commit("SET_NOTIFICATION_VISIBILITY", true);
  },
  toggleAppLoadingStatus({ commit }) {
    commit("APP_LOADING_STATUS_TOGGLE");
  },
  toggleLoadingState({ commit }, newValue) {
    commit("LOADING_STATE_TOGGLE", newValue);
  },
};

export const mutations = {
  APP_LOADING_STATUS_TOGGLE(state) {
    state.appLoading = !state.appLoading;
  },
  LOADING_STATE_TOGGLE(state, value) {
    state.loading = value;
  },
  SET_API_TOKEN_VALUE(state, value) {
    state.apiToken = value;
  },
  SET_API_TOKEN_EXPIRATION_VALUE(state, value) {
    state.apiTokenExpiration = value;
  },
  SET_DARK_THEME_VALUE(state, value) {
    window.localStorage.setItem("darkTheme", JSON.stringify(value));
    state.darkTheme = value;
  },
  SET_INSTALL_COMPLETED_VALUE(state, value) {
    state.installCompleted = value;
  },
  SET_INSTALL_ALERT_VALUE(state, value) {
    window.localStorage.setItem("showInstallAlert", JSON.stringify(value));
    state.showInstallAlert = value;
  },
  SET_INSTALL_PROMPT_VALUE(state, value) {
    state.installPrompt = value;
  },
  SET_NOTIFICATION_MESSAGE(state, value) {
    state.notificationMessage = value;
  },
  SET_NOTIFICATION_TYPE(state, value) {
    state.notificationType = value;
  },
  SET_NOTIFICATION_VISIBILITY(state, value) {
    state.notificationVisible = value;
  },
  SET_SETTINGS_ICON_VISIBILITY(state, value) {
    state.displaySettingsIcon = value;
  },
};
