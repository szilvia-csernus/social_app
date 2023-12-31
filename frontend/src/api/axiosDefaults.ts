import axios from "axios";

axios.defaults.baseURL = '/api';
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // to avoid any CORS errors when sending COOKIES


export const axiosReq = axios.create();
// export const axiosRes = axios.create();