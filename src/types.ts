export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating?: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare',
}

export enum EntryType {
  HealthCheck = 'HealthCheck',
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare'
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;


export type NewEntry = Omit<Entry, 'id'>;