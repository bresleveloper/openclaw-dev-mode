import{s as getRootOptionAwareCommandPath}from"./cli-root-options-eez2TgAl.mjs";
//!src/cli/system-output-mode.ts
const DEFAULT_JSON_PATHS=/* @__PURE__ */ new Set([`heartbeat disable`,`heartbeat enable`,`heartbeat last`,`presence`]);function isSystemMachineOutput(e){return DEFAULT_JSON_PATHS.has(getRootOptionAwareCommandPath(e,3).slice(1).join(` `))}export{isSystemMachineOutput as t};