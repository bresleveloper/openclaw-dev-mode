import{t as loadVoiceWakeRoutingConfig}from"./voicewake-routing-D_d_Rswk.mjs";
//!src/gateway/server-methods/voicewake-routing.ts
const voicewakeRoutingHandlers={"voicewake.routing.get":async({respond:e})=>{e(true,{config:await loadVoiceWakeRoutingConfig()})}};export{voicewakeRoutingHandlers};