export interface JwtUser {
  userId: string;
  role: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}