import { User } from "../../module/users/schemas/user.schema";


export type AuthenticatedRequest = {
  user: User;
}

export type JwtPayload = {
  username: string;
  sub: string;
  iat?: number;
  exp?: number;
  refresh_token?: string;
};