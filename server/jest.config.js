/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// const config = {
//     transform: {
//       "\\.[jt]sx?$": "ts-jest",
//     },
//     globals: {
//       "ts-jest": {
//         useESM: true,
//       },
//     },
//     moduleNameMapper: {
//       "(.+)\\.js": "$1",
//     },
//     extensionsToTreatAsEsm: [".ts"],
//   };

const x = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/setupTest.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  modulePaths: ["<rootDir>"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },
};

export default x;
