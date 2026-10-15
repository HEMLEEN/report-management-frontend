import axiosInstance from "../../service/axios";

export const createLoginApi = async (formData: FormData) => {
  const response = await axiosInstance.post("/login/create", formData);
  return response.data;
};

export const createAuthenticateApi = async (formData: FormData) => {
  const response = await axiosInstance.post("/login", formData);
  return response.data;
};
