//!src/channels/plugins/account-action-gate.ts
function createAccountActionGate(e){return(t,n=true)=>e.accountActions?.[t]??e.baseActions?.[t]??n}export{createAccountActionGate as t};