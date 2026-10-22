// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...require('@repo/config/eslint'),
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
};
