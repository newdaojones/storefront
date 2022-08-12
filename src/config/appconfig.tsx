
export const DEVELOPMENT = 0
export const TEST = 1

export const BUILD_CONFIG = DEVELOPMENT;
// export const BUILD_CONFIG = TEST;

// @ts-ignore
export const isDevMode = () => BUILD_CONFIG == DEVELOPMENT;
