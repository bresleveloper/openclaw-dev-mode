import{i as ErrorCodes}from"./missing-scope-error-CkgBgh6d.mjs";import{p as errorShape}from"./error-codes-CQNGhXT-.mjs";
//!src/gateway/server-methods/connect.ts
const connectHandlers={connect:({respond:e})=>{e(false,void 0,errorShape(ErrorCodes.INVALID_REQUEST,`connect is only valid as the first request`))}};export{connectHandlers};