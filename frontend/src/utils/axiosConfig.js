import axios from 'axios';

axios.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axios.interceptors.response.use(
    response => {
        console.log('Received response from:', response.config.url);
        return response;
    },
    error => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
); 