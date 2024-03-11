module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    reporters: [
      "default",
      ["jest-junit", {
        outputFile: "results/test-results.xml",
        ancestorSeparator: " > ",
      }]
    ]
  };