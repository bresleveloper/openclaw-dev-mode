import{constants}from"node:os";
//!src/cli/subprocess-exit-code.ts
function resolveSubprocessExitCode(e,t){if(typeof e===`number`)return e;const n=t?constants.signals[t]:void 0;return typeof n===`number`?128+n:1}export{resolveSubprocessExitCode as t};