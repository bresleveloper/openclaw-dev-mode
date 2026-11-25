import{n as SILENT_REPLY_TOKEN}from"./tokens-DD0Y_anD.mjs";
//!src/auto-reply/reply/mixed-silent-reply-tokens.ts
function stripMixedSilentReplyTokens(e){const t=`${SILENT_REPLY_TOKEN}\n`;return e.slice(0,t.length).toUpperCase()===t?e.slice(t.length):null}export{stripMixedSilentReplyTokens as t};