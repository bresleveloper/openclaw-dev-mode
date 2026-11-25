import{Buffer}from"node:buffer";
//!packages/gateway-client/src/websocket-data.ts
function rawDataToString(e,t=`utf8`){if(Array.isArray(e))return Buffer.concat(e).toString(t);return e instanceof ArrayBuffer?Buffer.from(e).toString(t):e.toString(t)}export{rawDataToString as t};