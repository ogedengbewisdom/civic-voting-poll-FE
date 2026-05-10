export interface IHttpResponse<T> {
  statusCode: number;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// export interface APIResponse<T> {
//     status: string;
//     statusCode: number;
//     success: boolean;
//     message: string;
//     data: T;
//     timestamp: string;
//   }

export type TUserRole = 'admin' | 'user';

export interface IUser {
  id: number;
  email: string;
  role: TUserRole;
  first_name: string;
  last_name: string;
  state_id: number;
  state: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegResponse {
  statusCode: number;
  message: string;
  status: string;
  timestamp: string;
}

export interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  state_id: number;
}

export interface IUpdateUser {
  first_name: string;
  last_name: string;
  state_id: number;
}

export interface IResetPasswordData {
  password: string;
  confirm_password: string;
}
