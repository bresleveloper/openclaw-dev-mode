import{n as throwExpectedCliError}from"./expected-cli-error-oDVmXYil.mjs";
//!src/commands/channels/account-selector.ts
function parseAccountSelector(e){if(e!==void 0&&!e.trim())throwExpectedCliError(`--account must not be blank`);return e}export{parseAccountSelector as t};