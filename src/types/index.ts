export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface PointOfContact {
  id: string;
  sourceId: string;
  name: string;
}

export interface Project {
  id: string;
  name: 'Forsite' | 'Modhaus' | 'Fanzart';
  description: string;
  accent: string;
}

export type PropertyType = 'Residential' | 'Commercial';

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  type: PropertyType;
  status: 'Active' | 'Pending' | 'Closed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Available' | 'Busy';
}

export interface Appointment {
  id: string;
  client: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  owner: string;
}