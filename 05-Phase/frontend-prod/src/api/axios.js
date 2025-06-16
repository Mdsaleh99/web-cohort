import axios from "axios";
import { StorageKeys } from "../utils/constants";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000, // 10s
    //   https://axios-http.com/docs/intro
});

// https://axios-http.com/docs/interceptors

// interceptors is like a middleware
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(StorageKeys.ACCESS_TOKEN)
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,

    async(error) => {
        const originalRequest = error.config // konsi request gayi thi jo uspe error aaya
        console.log(error.config);
        
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            // originalRequest._retry ----> see this _retry property from axios docs
            try {
                const refreshToken = localStorage.getItem(
                    StorageKeys.REFRESH_TOKEN
                );

                if (!refreshToken) {
                    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const response = await axios.post( // axiosInstance use mat karo idher directly axios se send karo request
                    `${API_URL}/auth/refresh-token`,
                    { refreshToken },
                    {
                        withCredentials: true,
                    }
                );

                if (response.data?.data?.accessToken) {
                    localStorage.setItem(
                        StorageKeys.ACCESS_TOKEN,
                        response.data.data.accessToken
                    );
                }
                if (response.data?.data?.refreshToken) {
                    localStorage.setItem(
                        StorageKeys.REFRESH_TOKEN,
                        response.data.data.accessToken
                    );
                }

                originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                return axiosInstance(originalRequest); // yah pe axios ka kaam hai hamara nhi
            } catch (error) {
                localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
                localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
                window.location.href = "/login";

                return Promise.reject(error);
            }
        }
    }
)


export default axiosInstance;
