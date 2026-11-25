import{S as parseDateStringTimestampMs}from"./number-coercion-B3CfI447.mjs";import"./number-runtime-G0nhUVZu.mjs";import{f as createEmptyTransportUsage}from"./provider-stream-shared-BnWdi3CF.mjs";import{_ as withSessionTranscriptWrite}from"./session-transcript-runtime-D5sAxf79.mjs";import{t as CLAUDE_CLI_BACKEND_ID}from"./cli-constants-Cc2K557b.mjs";
//!extensions/anthropic/session-catalog-history.ts
function importedClaudeMessage(e,t){const n=parseDateStringTimestampMs(e.timestamp)??t;const r=e.text?.trim();if(!r&&e.type===`reasoning`)return;const i=r||`[Unsupported Claude chat history item]`;if(e.type===`userMessage`)return{role:`user`,content:i,timestamp:n,__openclaw:{mirrorOrigin:`claude-catalog-import`}};return{role:`assistant`,content:[{type:`text`,text:`${e.type===`reasoning`?`Thinking

`:e.type===`toolCall`?`Tool call

`:e.type===`toolResult`?`Tool result

`:``}${i}`}],timestamp:n,api:`anthropic-messages`,provider:CLAUDE_CLI_BACKEND_ID,model:`native-history`,usage:createEmptyTransportUsage(),stopReason:`stop`}}async function importClaudeHistory(e){const t=e.items.toReversed();await withSessionTranscriptWrite(e,async n=>{for(const[r,i]of t.entries()){const t=importedClaudeMessage(i,Date.now()+r);if(!t)continue;const a={...t,idempotencyKey:`claude-catalog:${e.threadId}:${i.uuid??r}`};await n.appendMessage({message:a,idempotencyLookup:`scan`,cwd:e.cwd})}})}export{importClaudeHistory as t};