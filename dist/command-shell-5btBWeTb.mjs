import{t as buildNodeShellCommand}from"./node-shell-DnGPyK5E.mjs";
//!src/cron/command-shell.ts
function buildCronCommandShellArgv(e,t){return t===`win32`?buildNodeShellCommand(e,t):[`sh`,`-lc`,e]}export{buildCronCommandShellArgv as t};