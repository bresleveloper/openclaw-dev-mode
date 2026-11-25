import{s as getRootOptionAwareCommandPath}from"./cli-root-options-eez2TgAl.mjs";
//!src/cli/devices-output-mode.ts
function isDevicesMachineOutput(e){const[,t]=getRootOptionAwareCommandPath(e,2);return t===`rotate`||t===`revoke`}export{isDevicesMachineOutput as t};