export interface LoginUser {
  username: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export interface User extends LoginUser {
  id: string;
}
