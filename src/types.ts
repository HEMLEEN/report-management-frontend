export type Selection = {
  source: string;
  category: string;
  company: string;
  segment: "Residential" | "Commercial";
};
export type Appointment = {
  _id?: string;
  title: string;
  client: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  location: string;
};
export type User = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};
export type Department = {
  _id?: string;
  name: string;
  head: string;
  status: "Active" | "Inactive";
};
export type Schedule = {
  _id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  assignee: string;
  status: "Open" | "Done";
};
export type LocationRow = {
  _id?: string;
  clientName: string;
  location: string;
  status: "Active" | "Inactive";
};
export type Client = {
  _id?: string;
  name: string;
  company: string;
  segment: string;
  phone: string;
  email: string;
  status: string;
};
