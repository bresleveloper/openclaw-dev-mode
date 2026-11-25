import{t as getPairingAdapter}from"./pairing-CfIEGGN2.mjs";
//!src/pairing/pairing-labels.ts
function resolvePairingIdLabel(e){return getPairingAdapter(e)?.idLabel??`userId`}export{resolvePairingIdLabel as t};