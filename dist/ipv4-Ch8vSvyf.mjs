import{i as isCanonicalDottedDecimalIPv4}from"./ip-CLwE61h2.mjs";
//!packages/net-policy/src/ipv4.ts
function validateDottedDecimalIPv4Input(e){if(!e)return`IP address is required for custom bind mode`;if(isCanonicalDottedDecimalIPv4(e))return;return`Invalid IPv4 address (e.g., 192.168.1.100)`}export{validateDottedDecimalIPv4Input as t};