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
