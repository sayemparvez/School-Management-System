import axios from "axios";

const getBaseURL = () => {
    if (import.meta.env.VITE_BACKEND) {
        return import.meta.env.VITE_BACKEND;
    }
    if (typeof window !== "undefined") {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "http://localhost:5000";
        }
        return "https://pregnant-profits-sunrise-protected.trycloudflare.com";
    }
    return "http://localhost:5000";
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Automatically attach Bearer token to all outgoing requests if token exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // NEVER redirect or clear session on login/auth requests or when already on login page
            const requestUrl = error.config?.url || "";
            const isAuthOrPublicRequest = requestUrl.includes("/api/auth/") || requestUrl.includes("/api/public/");
            const currentHash = window.location.hash || "";
            const isLoginPage = currentHash.startsWith("#/login");

            if (!isAuthOrPublicRequest && !isLoginPage && currentHash !== "#/" && currentHash !== "" && currentHash !== "#/oauth-success") {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.hash = "#/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
