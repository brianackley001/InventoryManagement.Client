// Register each file as a corresponding Vuex module. Module nesting
// will mirror [sub-]directory hierarchy and modules are namespaced
// as the camelCase equivalent of their file name.
import camelCase from "lodash/camelCase";

// https://webpack.js.org/guides/dependency-management/#require-context
const requireModule = require.context(
  // Search for files in the current directory
  ".",
  // Search for files in subdirectories
  true,
  // Include any .js files that are not unit tests
  /^((?!\.unit\.).)*\.js$/
);
const root = {
  modules: {},
};

requireModule.keys().forEach((fileName) => {
  // Skip this file, as it's not a module
  if (fileName === "./index.js" || fileName === "./_template.js") {
    return;
  }

  // Get the module path as an array
  const modulePath = fileName
    // Remove the "./" from the beginning
    .replace(/^\.\//, "")
    // Remove the file extension from the end
    .replace(/\.\w+$/, "")
    // Split nested modules into an array path
    .split(/\//)
    // camelCase all module namespaces and names
    .map(camelCase);

  // Get the modules object for the current path
  const { modules } = getNamespace(root, modulePath);

  const thisModule = requireModule(fileName);

  const namespace = modulePath.pop();

  if (namespace !== "request") {
    // Create a request/{method} action in all modules that forward to the actual request module.
    // This is for convenience so every request doesn't have to pass the { root: true } parameter.
    thisModule.actions["request/get"] = forwardRequest("get");
    thisModule.actions["request/post"] = forwardRequest("post");
    thisModule.actions["request/put"] = forwardRequest("put");
    thisModule.actions["request/delete"] = forwardRequest("delete");
  }

  // Add the module to our modules object
  modules[namespace] = {
    // Modules are namespaced by default
    namespaced: true,
    ...thisModule,
  };

  // Recursively get the namespace of the module, even if nested
  function getNamespace(subtree, path) {
    if (path.length === 1) return subtree;

    const namespace = path.shift();
    subtree.modules[namespace] = {
      modules: {},
      ...subtree.modules[namespace],
    };
    return getNamespace(subtree.modules[namespace], path);
  }

  function forwardRequest(method) {
    return async ({ dispatch }, config) => {
      return dispatch(`request/${method}`, config, { root: true });
    };
  }
});

export default root.modules;
