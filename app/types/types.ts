import { Session } from "next-auth";

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
  role: string;
};

export type UserToMeeting = {
  name: string | null;
  id: string;
};

export type EditPasswordForm = {
  password: string;
  confirmPassword: string;
};

export type Sector = {
  id: string;
  name: string;
};

export type Model = {
  id: string;
  modelName: string;
};

export interface Field {
  fieldLabel: string;
  id: string;
  value: string;
  options?: Option[];
  type: FieldType;
}

export interface Option {
  id: string;
  value: string;
}

export interface FormDataProps {
  modelName: string;
  fields: Field[];
}

export interface NewModelProps {
  modelName: string;
  sectorId: string;
  fields: Field[];
}

export type LoginWithCode = {
  email: string;
  password: string;
  code: string;
};

export interface NewModelName {
  modelName: string;
}

export interface SectorSelectProps {
  sectors: Sector[];
  selectedSector: string | null;
  setSelectedSector: (sector: string) => void;
}

export interface FieldToEdit {
  id: string;
  fieldLabel: string;
  type: FieldType;
}

export type FieldType = "text" | "number" | "date" | "checkbox" | "select";

export const FieldTypeOptions = [
  { id: "text", value: "Campo de Texto" },
  { id: "number", value: "Campo de Número" },
  { id: "date", value: "Campo de Data" },
  { id: "select", value: "Campo de Seleção" },
];

export interface GenerateReportProps {
  selectedFiles: string[];
}

export interface CustomHeader {
  id: string;
  fieldLabel: string;
}

export type MainSidebarProps = {
  user: Session["user"];
};

export interface UserRole {
  role: string;
}

export interface NewFieldSigle {
  fieldLabel: string;
  id: string;
  value: string;
  options?: Option[];
  type: FieldType;
  fileTemplateId: string;
}

export interface FormattedFields {
  fileTemplateId: string;
  fieldId: string;
  value: string | undefined;
}

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  CREATOR = "CREATOR",
}

export interface UpdateRoleUser {
  role: Role;
}

export interface FileData {
  fileTemplateId: string;
  fieldId: string;
  value: string;
  commonId?: string;
}

export interface createNewModelByImportingProps {
  modelName: string;
  sectorId: string;
  fields: Field[];
}

export interface Data {
  [key: string]: Record<string, unknown>;
}

export interface NewSector {
  name: string;
}

export interface NewMeeting {
  name: string;
  date: string;
  users: UserToMeeting[];
  createdBy: string;
}

export interface Meeting {
  id: string;
  name: string;
  date: string;
  createdBy: string;
}

export interface UpdateMeeting {
  id: string;
  name: string;
  date: string;
}

export interface AllInfoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  sectors: Sector[] | null;
}
