import axios from 'axios';


const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
const api = axios.create(
  {
    baseURL:BASE_URL,
    withCredentials:true
  }
);

api.interceptors.request.use(
  (config)=>{
    const token  = localStorage.getItem("token");
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error)=>{
    return Promise.reject(error)
});

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error,token = null)=>{
  failedQueue.forEach((prom)=>{
    if(error){
      prom.reject(error)
    }else{
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
(response)=>{
  
  
  console.log(response);
  
  return response},
async(error)=>{
  const originalRequest = error.config;
  console.log('error response',error.response);
  console.log("I am here",error.config);
  if(error.response?.status === 401 && !originalRequest._retry){
    if(isRefreshing){
      return new Promise((resolve,reject)=>{
        failedQueue.push({resolve,reject})
      }).then((token)=>{
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest)
      })
      .catch((err)=>Promise.reject(err))
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try{
      const {data} = await axios.post(
        `${api.defaults.baseURL}/user/refresh-token`,
        {},
        {withCredentials:true}
      );
      const newAccessToken = data.accessToken;
      localStorage.setItem('token', newAccessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      processQueue(null,newAccessToken);
      return api(originalRequest);
    }catch(refreshError){
      processQueue(refreshError,null);
      localStorage.removeItem('token');
      window.location.href = "/signin";
      return Promise.reject(refreshError);
    }
    finally{
      isRefreshing = false;
    }
  }
  
  return Promise.reject(error)}
);

export default api;