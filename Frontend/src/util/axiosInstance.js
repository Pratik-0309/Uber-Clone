import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isCaptainRequest = originalRequest.url.includes('/api/captain');

    const refreshUrl = isCaptainRequest ? "/api/captain/refresh-token" : "/api/user/refresh-token";

    const isRefreshCall = originalRequest.url.includes(
      "refresh-token",
    );

    if (status === 401 && !isRefreshCall && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log(`Refreshing token via: ${refreshUrl}`);
        await axios.post(
          `http://localhost:8080${refreshUrl}`,
          {},
          {
            withCredentials: true,
          },
        );
        console.log("Token refreshed successfully");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
