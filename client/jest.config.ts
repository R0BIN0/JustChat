/* eslint-disable no-undef */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./src/setupTest.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass|gif|png|svg)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
};
