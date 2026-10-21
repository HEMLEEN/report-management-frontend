import axiosInstance from "../../service/axios";
import { UploadReportBody } from "./thunkApi";

export const uploadReportApi = async (body: UploadReportBody) => {
  const formData = new FormData();

  formData.append("headers", JSON.stringify(body.headers));
  formData.append("file", body.file, body.file.name);

  const response = await axiosInstance.post(
    "/report/builder",
    formData
  );

  return response.data;
};

export const listReportExcelApi = async (body: any) => {
  const response = await axiosInstance.post("/report/builder/list", body);
  return response.data;
};