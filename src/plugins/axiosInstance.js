import axios from "axios";
import tokenUtils from "@/utils/token.js";
import { getInstance } from "@/auth/index";

const defaultOptions = {
  baseURL: process.env.VUE_APP_IM_API_URL,
  timeout: 20000,
  crossDomain: true,
  headers: {},

  // request interceptor handler
  reqHandleFunc: async (config) => {
    let token = await tokenUtils.checkExpriation();

    if (!token) {
      throw new axios.Cancel("axiosInstance Interceptor: Bad token");
    }

    config.headers.common.Authorization = `Bearer ${token}`;

    return config;
  },
  reqErrorFunc: async (error) => {
    throw error;
  },

  // response interceptor handler
  resHandleFunc: (response) => response,
  resErrorFunc: (error) => {
    const authService = getInstance();
    if (error.message === "Bad token") {
      console.error("Bad token");
      //   authService.reset();
      //   authService.login();
      return Promise.reject(error);
    }
    if (error.message === "Login required") {
      console.error("Login required");
      // REDIRECT to log in
      authService.loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
      });
      return Promise.reject(error);
    }

    // if (!error.response) {
    //   console.error("Network error. Check your connection.");
    //   return Promise.reject(error);
    // }

    // const authHeader = error.response.headers["www-authenticate"];
    // if (authHeader === 'Bearer error="invalid_token"') {
    //   console.error("Bad token provided", error);
    //   authService.login();
    //   return;
    // }

    // appInsights.trackException({ exception: error });

    return Promise.reject(error);
  },
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use(
  async (config) => defaultOptions.reqHandleFunc(config),
  async (error) => defaultOptions.reqErrorFunc(error)
);

axiosInstance.interceptors.response.use(
  (response) => defaultOptions.resHandleFunc(response),
  (error) => defaultOptions.resErrorFunc(error)
);
export default axiosInstance;
