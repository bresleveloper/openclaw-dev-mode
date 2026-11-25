import{r as promptYesNo}from"./prompt-Cy3o3NWH.mjs";import{stdin,stdout}from"node:process";
//!src/cli/clawhub-install-confirmation.ts
function resolveClawHubInstallConfirmation(){if(!stdin.isTTY||!stdout.isTTY)return;return async()=>await promptYesNo(`Proceed with installation?`)}export{resolveClawHubInstallConfirmation as t};