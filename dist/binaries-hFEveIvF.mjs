import{r as defaultRuntime}from"./runtime-DIcLIHcp.mjs";import{n as runExec}from"./exec-DMFvryVA.mjs";
//!src/infra/binaries.ts
async function ensureBinary(e,t=runExec,n=defaultRuntime){await t(`which`,[e]).catch(()=>{n.error(`Missing required binary: ${e}. Please install it.`);n.exit(1)})}export{ensureBinary};