import axiosInstance from "../../service/axios";

export const createWorkspaceApi = async (body: any) => {
  const response = await axiosInstance.post("/workspace", body);
  return response.data;
};

export const listWorkspaceApi = async (body: any) => {
  const response = await axiosInstance.post("/workspace/list", body);
  return response.data;
};

export const byUserCodeApi = async ({ userCode }: { userCode: string }) => {
  const response = await axiosInstance.get(`/workspace/by/${userCode}`);
  return response.data;
};