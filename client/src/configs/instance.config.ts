import axios, { AxiosInstance } from "axios";
import {
  getAccessTokenFromLS,
  removeAccessTokenFromLS,
  setAccessTokenToLS,
} from "@/utils/auth.util";

import { AuthResponse } from "@/types/auth.type";
import path from "./path.config";
import { toast } from "sonner";

class Http {
  instance: AxiosInstance;
  private accessToken: string;

  constructor() {
    this.accessToken = getAccessTokenFromLS();

    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // add request interceptors
    this.instance.interceptors.request.use(
      (response) => {
        if (this.accessToken) {
          const token = this.accessToken;
          response.headers.Authorization = `Bearer ${token}`;
          return response;
        }
        return response;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    // add response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === path.login) {
          const data = response.data as AuthResponse;
          this.accessToken = data.accessToken;
          setAccessTokenToLS(this.accessToken);
        }
        return response;
      },
      (error) => {
        const url = error.response.config.url;
        const message = error.response.data.message || error.message;
        console.log("🚀 ~ Http ~ constructor ~ message:", message);

        if (`/${url}` === path.cart && message === "Cart not found") {
          console.log("1");
          return Promise.reject(error);
        } else {
          console.log("2");
          const message = error.response.data.message || error.message;
          toast.error(message);
          this.accessToken = "";
          removeAccessTokenFromLS();
        }
        // if (!error.response.data.success) {
        // 	const message = error.response.data.message || error.message;
        // 	toast(message);
        // 	this.accessToken = "";
        // 	removeAccessTokenFromLS();
        // }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
