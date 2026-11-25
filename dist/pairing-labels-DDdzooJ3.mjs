import{t as getPairingAdapter}from"./pairing-BJ21x8-B.mjs";
//!src/pairing/pairing-labels.ts
function resolvePairingIdLabel(e){return getPairingAdapter(e)?.idLabel??`userId`}export{resolvePairingIdLabel as t};