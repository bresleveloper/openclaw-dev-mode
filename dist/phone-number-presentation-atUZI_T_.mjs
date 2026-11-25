import{t as formatInternationalPhoneNumberForDisplay}from"./phone-presentation-CBTfzrqL.mjs";
//!src/infra/phone-number-presentation.ts
function formatPhoneNumberForCli(e,t){const n=e.trim();const r=t?.allowInternationalDigits===true&&/^\d{7,15}$/u.test(n)?`+${n}`:e;const i=formatInternationalPhoneNumberForDisplay(r);return i&&i!==e?`${i} (id: ${e})`:e}export{formatPhoneNumberForCli as t};