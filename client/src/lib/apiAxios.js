import axios from "axios";

const apiAxios = axios.create({
    baseURL: "",
});
apiAxios.interceptors.response.use((response) => response?.data, (error) => {
    let unauthorized = error.response && error.response.status && error.response.status === 401;
    let forbidden = error.response && error.response.status && error.response.status === 403;
    // if (forbidden) window.location.replace(window.location.origin + "/")
    if (unauthorized && !window.location.pathname.includes("/auth")) {
        localStorage.clear();
        setTimeout(() => {
            window.location.replace(window.location.origin + "/auth/login")
        }, 1000)
    }
    return Promise.reject(error);
});

apiAxios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});
export default apiAxios;
