import{t as rawDataToString$1}from"./websocket-data-C4k8D7VE.mjs";
//!src/infra/ws.ts
function rawDataToString(e,t=`utf8`){return rawDataToString$1(e,t)}function rawDataByteLength(e){return Array.isArray(e)?e.reduce((e,t)=>e+t.byteLength,0):e.byteLength}export{rawDataToString as n,rawDataByteLength as t};