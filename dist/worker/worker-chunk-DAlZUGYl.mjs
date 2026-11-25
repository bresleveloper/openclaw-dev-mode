import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{r as t,t as n}from"./worker-chunk-B5K5a_z9.mjs";import{u as r,x as i}from"./worker-chunk-CuEyWK0Z.mjs";function hashCliReseedPrompt(e){return t(e)}function parseCliReseedPrompt(e){if(!e.startsWith(o))return e.startsWith(a)?{kind:`invalid`}:{kind:`none`};let t=e.indexOf(s);if(t!==e.lastIndexOf(s)||t<=o.length)return{kind:`invalid`};let n=t+46,r=e.lastIndexOf(c);return r<n?{kind:`invalid`}:{kind:`legacy`,userMessage:e.slice(n,r)}}var a,o,s,c,l=e((()=>{n(),a=`Continue this conversation using the OpenClaw transcript below as prior session history.
Treat it as authoritative context for this fresh CLI session.

<conversation_history>`,o=`${a}\n`,s=`
</conversation_history>

<next_user_message>
`,c=`
</next_user_message>`}));function buildCliSessionDriftNote(e){return`${u} Follow the current turn's instructions; changed=${e.join(`,`)}.`}function stripCliSessionDriftNote(e){let t=i(e)?.length??0,n=t>0?`
`:`

`;for(let r of d){let i=`${r}${n}`;if(e.startsWith(i,t))return e.slice(0,t)+e.slice(t+i.length)}return e}var u,d,f=e((()=>{r(),u=`OpenClaw resumed this CLI session after prompt content changed.`,d=[buildCliSessionDriftNote([`system-prompt`]),buildCliSessionDriftNote([`prompt-tools`]),buildCliSessionDriftNote([`system-prompt`,`prompt-tools`])]}));export{l as a,hashCliReseedPrompt as i,f as n,parseCliReseedPrompt as o,stripCliSessionDriftNote as r,buildCliSessionDriftNote as t};