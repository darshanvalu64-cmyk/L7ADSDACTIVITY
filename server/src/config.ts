import path from 'node:path';

export interface AppConfig {
  port: number;
  storeType: string;
  publicDir: string;
  version: string;
}

function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    storeType: process.env.STORE_TYPE ?? 'memory',
    publicDir: path.resolve(process.env.PUBLIC_DIR ?? 'public'),
    version: process.env.APP_VERSION ?? 'dev',
  };
}

export const config: AppConfig = Object.freeze(loadConfig());
