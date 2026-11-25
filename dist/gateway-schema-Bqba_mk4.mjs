import{o as optionalPositiveIntegerSchema}from"./typebox-pxCMyoM2.mjs";import{Type}from"typebox";
//!src/agents/tools/gateway-schema.ts
function gatewayCallOptionSchemaProperties(){return{gatewayUrl:Type.Optional(Type.String()),gatewayToken:Type.Optional(Type.String()),timeoutMs:optionalPositiveIntegerSchema()}}export{gatewayCallOptionSchemaProperties as t};