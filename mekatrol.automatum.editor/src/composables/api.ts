import { Api } from '@/services/api-generated';

export const useApi = (): Api<unknown> => {
  // The server API base URL is embedded in a hidden field in the page
  // it is set by the server on page load
  const serverBaseUrlElement = document.getElementById('server-base-url') as HTMLInputElement;
  const serverBaseUrl = serverBaseUrlElement?.value ?? '/api';

  // Create an Api singleton to use for calling server APIs
  const api = new Api({
    baseURL: serverBaseUrl
  });

  return api;
};
