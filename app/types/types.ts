import { FieldType } from "@prisma/client";

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
  type: keyof typeof FieldType;
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

export const fieldTypes: { label: string; type: keyof typeof FieldType }[] = [
  { label: "Nome Completo", type: "nomecompleto" },
  { label: "CPF", type: "cpf" },
  { label: "CNPJ", type: "cnpj" },
  { label: "Data de Admissão", type: "datadeadmissao" },
  { label: "Data de Rescisão", type: "dataderecisao" },
  { label: "Data", type: "data" },
  { label: "Dia", type: "dia" },
  { label: "Mês", type: "mes" },
  { label: "Ano", type: "ano" },
];

export type LoginWithCode = {
  email: string;
  password: string;
  code: string;
};
