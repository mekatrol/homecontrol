import { httpPost, type HandleErrorCallback } from './http';

export interface AccessToken {
  userName: string;
  accessToken: string;
  refreshToken: string;
  expiry: string;
}

interface LoginRequest {
  userName: string;
  password: string;
}

export interface AuthService {
  acquireToken(): Promise<AccessToken | undefined>;
  authenticateUser(userName: string, password: string, errorHandlerCallback?: HandleErrorCallback): Promise<AccessToken | undefined>;
}

class AuthServiceImpl implements AuthService {
  async acquireToken(): Promise<AccessToken | undefined> {
    throw new Error('Method not implemented.');
  }

  async authenticateUser(userName: string, password: string, errorHandlerCallback?: HandleErrorCallback): Promise<AccessToken | undefined> {
    try {
      return await httpPost<LoginRequest, AccessToken>({ userName, password }, '/auth/login', errorHandlerCallback);
    } catch {
      return undefined;
    }
  }
}

export const useAuthService = (): AuthService => {
  return new AuthServiceImpl();
};
