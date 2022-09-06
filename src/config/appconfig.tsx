//TODO inherit this from the environment / build system like in gradle
export const DEVELOPMENT = 0
export const TEST = 1

// export const BUILD_CONFIG = DEVELOPMENT;
export const BUILD_CONFIG = TEST;

// @ts-ignore
// read only
export const isDevMode = () => BUILD_CONFIG == DEVELOPMENT;
