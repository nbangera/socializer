export interface IUser {
  userName: string;
  displayName: string;
  token: string;
  refreshToken:string;
  image?: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
}
