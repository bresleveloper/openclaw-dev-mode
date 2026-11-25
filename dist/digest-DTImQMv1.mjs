import{i as sha256StableValue,n as sha256Hex}from"./node-crypto-DPk8agfR.mjs";
//!src/templates/digest.ts
function digestTemplateValue(e){return`sha256:${sha256StableValue(e).digest}`}function digestTemplateBytes(e){return`sha256:${sha256Hex(e)}`}export{digestTemplateValue as n,digestTemplateBytes as t};