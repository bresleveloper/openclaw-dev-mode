import{Type}from"typebox";
//!packages/gateway-protocol/src/schema/closed-object.ts
const identityKey=`~openclawClosedObjectIdentity`;function closedObject(e){const t=Type.Object(e,{additionalProperties:false});Object.defineProperty(t,identityKey,{value:Symbol(`closedObject`)});return t}
//!packages/gateway-protocol/src/schema/string-literal-union.ts
function stringLiteralUnion(e){const t=e.map(e=>Type.Literal(e));return Type.Union(t)}export{closedObject as n,stringLiteralUnion as t};