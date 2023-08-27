import jwt_decode from "jwt-decode";
import store from "../store/";
import Vue from "vue";

async function retriveApiToken() {
  // retrieve apiToken
  let tokenResponse = await Vue.prototype.$auth.getTokenSilently();
  store.dispatch("appState/setApiToken", tokenResponse);
  decodeToken(tokenResponse);
  let expirationDate = await store.getters["appState/apiTokenExpirationValue"];
  return expirationDate;
}
export function decodeToken(token) {
  let decoded = jwt_decode(token);
  let storedExp = store.getters["appState/apiTokenExpirationValue"];
  if (!storedExp) {
    store.dispatch("appState/setApiTokenExpiration", decoded.exp);
  }
  return decoded.exp; //console.log(decoded);
}
export async function checkExpriation() {
  let storedTokenExpirationDate =
    store.getters["appState/apiTokenExpirationValue"];

  if (!storedTokenExpirationDate) {
    storedTokenExpirationDate = await retriveApiToken();
  }

  // evaluate token expiration
  if (new Date().getTime() / 1000 > storedTokenExpirationDate) {
    // refresh the token attempt
    storedTokenExpirationDate = await retriveApiToken();
  }

  let apiTokenValue = await store.getters["appState/apiTokenValue"];
  return apiTokenValue;
}

export default {
  checkExpriation,
  decodeToken,
};
