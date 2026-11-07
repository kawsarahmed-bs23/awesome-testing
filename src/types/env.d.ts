declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV?: 'local' | 'dev' | 'staging' | 'prod';
      BASE_URL?: string;
      API_URL?: string;
      ADMIN_USERNAME?: string;
      ADMIN_PASSWORD?: string;
      CI?: string;
      DEBUG_LOGS?: string;
      SLOW_MO?: string;
    }
  }
}

export {};
