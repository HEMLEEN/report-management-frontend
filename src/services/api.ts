import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Appointment,
  User,
  Department,
  Schedule,
  LocationRow,
  Client,
} from "../types";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (h, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) h.set("authorization", `Bearer ${token}`);
      return h;
    },
  }),
  tagTypes: [
    "Appointments",
    "Users",
    "Departments",
    "Schedules",
    "Locations",
    "Clients",
  ],
  endpoints: (b) => ({
    login: b.mutation<
      { token: string; user: { name: string; email: string } },
      { email: string; password: string }
    >({ query: (body) => ({ url: "/auth/login", method: "POST", body }) }),
    appointments: b.query<Appointment[], void>({
      query: () => "/appointments",
      providesTags: ["Appointments"],
    }),
    createAppointment: b.mutation<Appointment, Partial<Appointment>>({
      query: (body) => ({ url: "/appointments", method: "POST", body }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: b.mutation<
      Appointment,
      { id: string; body: Partial<Appointment> }
    >({
      query: ({ id, body }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Appointments"],
    }),
    deleteAppointment: b.mutation<void, string>({
      query: (id) => ({ url: `/appointments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Appointments"],
    }),
    users: b.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: b.mutation<User, Partial<User>>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    updateUser: b.mutation<User, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: b.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    departments: b.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
    createDepartment: b.mutation<Department, Partial<Department>>({
      query: (body) => ({ url: "/departments", method: "POST", body }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: b.mutation<
      Department,
      { id: string; body: Partial<Department> }
    >({
      query: ({ id, body }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: b.mutation<void, string>({
      query: (id) => ({ url: `/departments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Departments"],
    }),
    schedules: b.query<Schedule[], void>({
      query: () => "/schedules",
      providesTags: ["Schedules"],
    }),
    createSchedule: b.mutation<Schedule, Partial<Schedule>>({
      query: (body) => ({ url: "/schedules", method: "POST", body }),
      invalidatesTags: ["Schedules"],
    }),
    updateSchedule: b.mutation<
      Schedule,
      { id: string; body: Partial<Schedule> }
    >({
      query: ({ id, body }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Schedules"],
    }),
    deleteSchedule: b.mutation<void, string>({
      query: (id) => ({ url: `/schedules/${id}`, method: "DELETE" }),
      invalidatesTags: ["Schedules"],
    }),
    locations: b.query<LocationRow[], void>({
      query: () => "/locations",
      providesTags: ["Locations"],
    }),
    clients: b.query<Client[], void>({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
  }),
});
export const {
  useLoginMutation,
  useAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useLocationsQuery,
  useClientsQuery,
} = api;
