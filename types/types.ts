export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface User extends LoginUser {
  id: string;
}
