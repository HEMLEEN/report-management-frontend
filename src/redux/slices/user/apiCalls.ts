import axiosInstance from "../../service/axios";


export const userDetailsApi = async ({ userCode }: { userCode: string }) => {
  const response = await axiosInstance.get(`/user/profile/${userCode}`);
  return response.data;
};

export const listUserApi = async (body: any) => {
  const response = await axiosInstance.post("/user/list", body);
  return response.data;
};

export const assignRoleApi = async (body: any) => {
  const response = await axiosInstance.post("/user/assign/role", body);
  return response.data;
};

export const approveUserApi = async (body: any) => {
  const response = await axiosInstance.patch("/user/status", body);
  return response.data;
};