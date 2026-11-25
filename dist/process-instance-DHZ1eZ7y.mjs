import{randomUUID}from"node:crypto";
//!src/gateway/process-instance.ts
const gatewayProcessInstanceId=randomUUID();function getGatewayProcessInstanceId(){return gatewayProcessInstanceId}export{getGatewayProcessInstanceId as t};