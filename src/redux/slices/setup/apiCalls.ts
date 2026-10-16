import axiosInstance from "../../service/axios";

export const createReportModeApi = async ({ name }: any) => {
  const response = await axiosInstance.post("/report/mode", { name });
  return response.data;
};

export const listReportModeApi = async ({ name }: any) => {
  const response = await axiosInstance.post("/report/mode/list", { name });
  return response.data;
};

export const assignCategoryApi = async (body: any) => {
  const response = await axiosInstance.post(
    "/report/mode/assign/category",
    body,
  );
  return response.data;
};

export const assignCompanyApi = async (body: any) => {
  const response = await axiosInstance.post(
    "/report/mode/assign/company",
    body,
  );
  return response.data;
};

export const createCategoryApi = async ({ name }: any) => {
  const response = await axiosInstance.post("/category", { name });
  return response.data;
};

export const listCategoryApi = async (body: any) => {
  const response = await axiosInstance.post("/category/list", body);
  return response.data;
};

export const createCompanyApi = async ({ name }: any) => {
  const response = await axiosInstance.post("/company", name);
  return response.data;
};

export const listCompanyApi = async (body: any) => {
  const response = await axiosInstance.post("/company/list", body);
  return response.data;
};