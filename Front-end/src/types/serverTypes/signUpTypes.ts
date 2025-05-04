export interface SignInData {
    username: string;
    email: string;
    password: string
  }

  export interface SignInResponse {
    message: string;
    success: boolean
  }