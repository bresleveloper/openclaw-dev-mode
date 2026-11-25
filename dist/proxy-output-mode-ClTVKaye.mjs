import{s as getRootOptionAwareCommandPath}from"./cli-root-options-eez2TgAl.mjs";
//!src/cli/proxy-output-mode.ts
const MACHINE_OUTPUT_COMMANDS=/* @__PURE__ */ new Set([`blob`,`coverage`,`purge`,`query`,`sessions`]);function isProxyMachineOutput(e){const[,t]=getRootOptionAwareCommandPath(e,2);return MACHINE_OUTPUT_COMMANDS.has(t??``)}export{isProxyMachineOutput as t};