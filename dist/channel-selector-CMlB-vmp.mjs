import{n as throwExpectedCliError}from"./expected-cli-error-oDVmXYil.mjs";
//!src/commands/channels/channel-selector.ts
function parseChannelSelector(e){if(e!==void 0&&!e.trim())throwExpectedCliError(`--channel must not be blank`);return e}export{parseChannelSelector as t};