export function hasStoredAuth(storage) {
  let item = JSON.parse(storage.getItem("auth"));
  return item && item.isAuthenticated;
}
export default {
  hasStoredAuth,
};
