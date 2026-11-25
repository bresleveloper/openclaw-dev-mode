import{i as stripAnsi}from"./ansi-54CEWBZf.mjs";
//!packages/terminal-core/src/safe-text.ts
function hasTerminalControl(e){return e.search(/\p{Cc}/u)!==-1}function sanitizeTerminalText(e){return stripAnsi(e).replace(/[\p{Cc}\p{Bidi_Control}]/gu,e=>e===`\r`?`\\r`:e===`
`?`\\n`:e===`	`?`\\t`:``)}function terminalText(e,...t){let n=``;let r=0;for(const i of e){n+=i;if(r<t.length)n+=sanitizeTerminalText(String(t[r++]))}return n}export{sanitizeTerminalText as n,terminalText as r,hasTerminalControl as t};