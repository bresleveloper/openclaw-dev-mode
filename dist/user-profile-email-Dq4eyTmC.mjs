import{i as ensureCanonicalUserProfileForEmail}from"./user-profile-writes-CFHsa1yU.mjs";
//!src/state/user-profile-email.ts
async function ensureProfileIdForEmail(e,t={},n){n?.();return(await ensureCanonicalUserProfileForEmail(e,{...t,assertCurrent:n})).id}export{ensureProfileIdForEmail as t};