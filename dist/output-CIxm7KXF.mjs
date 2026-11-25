import{n as isRich,r as theme,t as colorize}from"./theme-DS2CtI9X.mjs";
//!src/daemon/output.ts
const normalizeWindowsPathSeparators=e=>e.replace(/\\/g,`/`);function formatLine(e,t){const n=isRich();return`${colorize(n,theme.muted,`${e}:`)} ${colorize(n,theme.command,t)}`}function writeFormattedLines(e,t){e.write(`
`);for(const n of t)e.write(`${formatLine(n.label,n.value)}\n`)}export{normalizeWindowsPathSeparators as n,writeFormattedLines as r,formatLine as t};