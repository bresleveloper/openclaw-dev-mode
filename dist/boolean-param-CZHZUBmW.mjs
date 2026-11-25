import{t as parseBoolean}from"./boolean-coercion-CzFC463r.mjs";import{t as readSnakeCaseParamRaw}from"./param-key-DiWYJErL.mjs";
//!src/plugin-sdk/boolean-param.ts
function readBooleanParam(e,t){return parseBoolean(readSnakeCaseParamRaw(e,t))}export{readBooleanParam as t};