import { axiosApi } from './axios';
import { type HandleErrorCallback, defaultConfig, handleApiError } from './http';

const apiInstance = {
  async getSystemConfig(errorHandlerCallback?: HandleErrorCallback): Promise<any> {
    const url = '/configuration';

    try {
      const resp = await axiosApi.get(url, defaultConfig);
      return resp.data;
    } catch (err: unknown) {
      throw handleApiError(err, url, 'Load', errorHandlerCallback);
    }
  }
};

export const api = apiInstance;
