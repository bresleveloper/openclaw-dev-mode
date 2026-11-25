import{Type}from"typebox";
//!packages/gateway-protocol/src/schema/string-literal-union.ts
function stringLiteralUnion(e){const t=e.map(e=>Type.Literal(e));return Type.Union(t)}export{stringLiteralUnion as t};