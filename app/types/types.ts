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
  id: string;
  value: string;
  type: FieldType;
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

export type FieldType = "text" | "number" | "date" | "checkbox" | "select";

export const FieldTypeOptions = [
  { id: "text", value: "Campo de Texto" },
  { id: "number", value: "Campo de Número" },
  { id: "date", value: "Campo de Data" },
  { id: "checkbox", value: "Checkbox" },
  { id: "select", value: "Campo de Seleção" },
];
