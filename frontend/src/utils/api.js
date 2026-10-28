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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            const currentHash = window.location.hash;
            if (currentHash !== "#/" && currentHash !== "" && currentHash !== "#/oauth-success") {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.hash = "#/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
