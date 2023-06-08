interface Config {
  isDebug: boolean;
}

export let config: Config = {
  isDebug: false,
};

export const setConfig = (newConfig: Partial<Config>): void => {
  config = {
    ...config,
    ...newConfig,
  };
};

export const getConfig = (): Config => {
  return config;
};
