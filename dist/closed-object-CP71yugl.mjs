import{Type}from"typebox";
//!packages/gateway-protocol/src/schema/closed-object.ts
const identityKey=`~openclawClosedObjectIdentity`;function closedObject(e){const t=Type.Object(e,{additionalProperties:false});Object.defineProperty(t,identityKey,{value:Symbol(`closedObject`)});return t}export{closedObject as t};