import{t as sha256Base64Url}from"./crypto-digest-T8X5EZni.mjs";
//!src/infra/approval-resolution-ref.ts
function buildApprovalResolutionRef(e){return sha256Base64Url(`${e.approvalKind}\0${e.approvalId}`)}export{buildApprovalResolutionRef as t};