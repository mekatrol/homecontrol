declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      HOST_IP?: string;
      HOST_PORT?: string;
      DATA_DIRECTORY: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      USE_SSL?: string;
      SSL_CERT_FILENAME?: string;
      SSL_KEY_FILENAME?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
