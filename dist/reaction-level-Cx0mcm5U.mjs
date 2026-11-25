import{g as resolveReactionLevel}from"./status-helpers-DImWR0RR.mjs";import{r as inspectTelegramAccount}from"./account-inspect-DswA8niz.mjs";
//!extensions/telegram/src/reaction-level.ts
function resolveTelegramReactionLevel(e){return resolveReactionLevel({value:inspectTelegramAccount(e).config.reactionLevel,defaultLevel:`minimal`,invalidFallback:`ack`})}export{resolveTelegramReactionLevel as t};