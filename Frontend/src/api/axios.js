import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // IMPORTANT for refresh token cookie
});


// =============================
// REQUEST INTERCEPTOR
// Attach access token to every request
// =============================
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =============================
// RESPONSE INTERCEPTOR
// Handle expired token (401)
// Auto refresh access token
// =============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // if token expired and request not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        // call refresh token API
        const res = await api.get("/users/refresh-token");

        const newAccessToken = res.data.accessToken;

        // store new token
        localStorage.setItem("token", newAccessToken);

        // update header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // retry original request
        return api(originalRequest);

      } catch (err) {

        console.log("Refresh token failed → redirect to login");

        localStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;