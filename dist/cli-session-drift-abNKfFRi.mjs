import{n as sha256Hex}from"./node-crypto-DPk8agfR.mjs";import{b as readInterSessionPromptEnvelope}from"./input-provenance-C8_14SbD.mjs";
//!src/agents/cli-runner/reseed-envelope.ts
const RESEED_HEADER=[`Continue this conversation using the OpenClaw transcript below as prior session history.`,`Treat it as authoritative context for this fresh CLI session.`,``,`<conversation_history>`].join(`
`);const RESEED_PREFIX=`${RESEED_HEADER}\n`;const RESEED_USER_BOUNDARY=`
</conversation_history>

<next_user_message>
`;const RESEED_USER_CLOSE=`
</next_user_message>`;function hashCliReseedPrompt(e){return sha256Hex(e)}function parseCliReseedPrompt(e){if(!e.startsWith(RESEED_PREFIX))return e.startsWith(RESEED_HEADER)?{kind:`invalid`}:{kind:`none`};const t=e.indexOf(RESEED_USER_BOUNDARY);if(t!==e.lastIndexOf(RESEED_USER_BOUNDARY))return{kind:`invalid`};if(t<=RESEED_PREFIX.length)return{kind:`invalid`};const n=t+46;const r=e.lastIndexOf(RESEED_USER_CLOSE);if(r<n)return{kind:`invalid`};return{kind:`legacy`,userMessage:e.slice(n,r)}}
//!src/agents/cli-session-drift.ts
const CLI_SESSION_DRIFT_NOTE_PREFIX=`OpenClaw resumed this CLI session after prompt content changed.`;function buildCliSessionDriftNote(e){return`${CLI_SESSION_DRIFT_NOTE_PREFIX} Follow the current turn's instructions; changed=${e.join(`,`)}.`}const CLI_SESSION_DRIFT_NOTES=[buildCliSessionDriftNote([`system-prompt`]),buildCliSessionDriftNote([`prompt-tools`]),buildCliSessionDriftNote([`system-prompt`,`prompt-tools`])];function stripCliSessionDriftNote(e){const t=readInterSessionPromptEnvelope(e)?.length??0;const n=t>0?`
`:`

`;for(const r of CLI_SESSION_DRIFT_NOTES){const i=`${r}${n}`;if(e.startsWith(i,t))return e.slice(0,t)+e.slice(t+i.length)}return e}export{parseCliReseedPrompt as i,stripCliSessionDriftNote as n,hashCliReseedPrompt as r,buildCliSessionDriftNote as t};