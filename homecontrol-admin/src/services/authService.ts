import { TOKEN_SESSION_KEY, useAppStore } from '@/stores/app';
import { httpGet, httpPost, type HandleErrorCallback } from './http';
import { useLocalSessionJsonObject } from '@/composables/local-session';
import { useLogin } from '@/composables/login';

export const REFRESH_TOKEN_URL = '/auth/refresh-token';
export const LOGIN_URL = '/auth/login';
export const LOGOUT_URL = '/auth/logout';

export interface AccessToken {
  userName: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string;
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
}

class AuthServiceImpl implements AuthService {
  async loadStorageToken(): Promise<void> {
    const { logout } = useLogin();

    // Check to see if there a a local storage access token
    const persistSettings = useLocalSessionJsonObject<AccessToken>(TOKEN_SESSION_KEY);
    const appStore = useAppStore();

    if (persistSettings.setting) {
      // Store cached token token
      appStore.setUserToken(persistSettings.setting, true);

      try {
        // Refresh the token
        const success = await this.refreshToken();

        if (!success) {
          logout();
        }
      } catch {
        // Error refreshing token so force logout (and user will need to login again)
        logout();
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const appStore = useAppStore();

      if (!appStore.currentUser) {
        return false;
      }

      const token = await httpGet<string>(REFRESH_TOKEN_URL, undefined, true);

      // Set new access token
      appStore.currentUser.accessToken = token;

      return !!token;
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
}

export const useAuthService = (): AuthService => {
  return new AuthServiceImpl();
};
