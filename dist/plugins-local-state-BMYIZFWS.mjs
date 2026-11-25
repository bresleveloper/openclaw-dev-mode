import{t as runWithLocalStateOwner}from"./local-state-owner-BWo4_U8L.mjs";
//!src/cli/plugins-local-state.ts
async function runWithLocalPluginState(e,t){return await runWithLocalStateOwner({method:`plugins.${e}`,params:{},target:`openclaw plugins ${e}`,onForeignOwner:`refuse`,runLocal:({assertCurrent:e})=>t(e)})}export{runWithLocalPluginState as t};