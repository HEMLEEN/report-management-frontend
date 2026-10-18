import axiosInstance from "../../service/axios";

export const createLoginApi = async (data: any) => {
  const response = await axiosInstance.post("/login/register", data);
  return response.data;
};

export const createAuthenticateApi = async (data: any) => {
  const response = await axiosInstance.post("/login", data);
  return response.data;
};
