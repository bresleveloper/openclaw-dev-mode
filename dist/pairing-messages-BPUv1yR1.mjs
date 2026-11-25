import{t as formatCliCommand}from"./command-format-vlx1VIWT.mjs";
//!src/pairing/pairing-messages.ts
function buildPairingReply(e){const{channel:t,idLine:n,code:r}=e;return[`OpenClaw: access not configured.`,``,n,`Pairing code:`,"```",r,"```",``,`Ask the bot owner to approve with:`,"```",formatCliCommand(`openclaw pairing approve ${t} ${r}`),"```"].join(`
`)}export{buildPairingReply as t};