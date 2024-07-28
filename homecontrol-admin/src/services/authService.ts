import { TOKEN_SESSION_KEY, useAppStore } from '@/stores/app';
import { httpGet, httpPost, type HandleErrorCallback } from './http';
import { useLocalSessionJsonObject } from '@/composables/local-session';
import { useLogin } from '@/composables/login';

export const REFRESH_TOKEN_URL = '/auth/refresh-token';
export const LOGIN_URL = '/auth/login';
export const LOGOUT_URL = '/auth/logout';
export const USER_URL = '/auth/user';

export interface RefreshedToken {
  accessToken: string;
}

export interface AccessToken extends RefreshedToken {
  userName: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

export interface User {
  id: number;
  userName: string;
  roles: string[];
}

interface LoginRequest {
  userName: string;
  password: string;
}

export interface AuthService {
  loadStorageToken(): Promise<void>;
  refreshToken(): Promise<boolean>;
  login(userName: string, password: string, errorHandlerCallback?: HandleErrorCallback): Promise<AccessToken | undefined>;
  logout(errorHandlerCallback?: HandleErrorCallback): Promise<void>;
  updateUser(): Promise<void>;
}

class AuthServiceImpl implements AuthService {
  async loadStorageToken(): Promise<void> {
    const { logout } = useLogin();

    // Check to see if there a a local storage access token
    const persistSettings = useLocalSessionJsonObject<AccessToken>(TOKEN_SESSION_KEY);
    const appStore = useAppStore();

    if (persistSettings.setting) {
      // Store token from browser storage to store
      appStore.setUserToken(persistSettings.setting, true);

      try {
        // Refresh the token
        const success = await this.refreshToken();

        console.log(`success: ${success}`);

        if (!success) {
          logout();
          return;
        }

        await updateUser();
      } catch {
        // Error refreshing token so force logout (and user will need to login again)
        logout();
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const appStore = useAppStore();

      if (!appStore.userToken) {
        return false;
      }

      const refreshedToken = await httpGet<RefreshedToken>(REFRESH_TOKEN_URL, undefined, true);

      // Set new access token
      appStore.userToken.accessToken = refreshedToken.accessToken;

      return !!refreshedToken;
    } catch {
      return false;
    }
  }

  async login(userName: string, password: string, errorHandlerCallback?: HandleErrorCallback): Promise<AccessToken | undefined> {
    try {
      return await httpPost<LoginRequest, AccessToken>({ userName, password }, LOGIN_URL, errorHandlerCallback);
    } catch {
      return undefined;
    }
  }

  async logout(errorHandlerCallback?: HandleErrorCallback): Promise<void> {
    try {
      await httpGet(LOGOUT_URL, errorHandlerCallback);
    } catch {
      return undefined;
    } finally {
      // Clear current user info
      const appStore = useAppStore();
      appStore.setUserToken(undefined, false);
    }
  }

  async updateUser(): Promise<void> {
    // Refresh user as the user object includes their included security roles
    const appStore = useAppStore();
    appStore.user = await httpGet<User>(USER_URL);
  }
}

export const useAuthService = (): AuthService => {
  return new AuthServiceImpl();
};
