import{t as AsyncContext}from"./async-context-BikFC1Fp.mjs";import{stripVTControlCharacters}from"node:util";
//!src/process/spawn-broker/context-state.ts
const context=new AsyncContext(Symbol(`spawnBroker`));const gatewaySpawnBrokerState={startupDisabled:false};function getSpawnBroker(){const e=context.getStore();return gatewaySpawnBrokerState.startupDisabled||e===null?void 0:e??gatewaySpawnBrokerState.host}
//!src/process/spawn-broker/execa-protocol.ts
const decoder=new TextDecoder;const commonEscapes=/* @__PURE__ */ new Map([[` `,` `],[`
`,`
`],[`\b`,`\\b`],[`\f`,`\\f`],[`\r`,`\\r`],[`	`,`\\t`]]);function renderOutput(e){let t=typeof e===`string`?e:decoder.decode(e);if(t.endsWith(`
`))t=t.slice(0,t.endsWith(`\r
`)?-2:-1);return stripVTControlCharacters(t).replace(/[\p{Separator}\p{Other}]/gu,e=>{const t=commonEscapes.get(e);if(t!==void 0)return t;const n=e.codePointAt(0);const r=n.toString(16);return n<=65535?`\\u${r.padStart(4,`0`)}`:`\\U${r}`})}function decodeExecaMessage(e,t){return e.messageOutputs?[e.message,...e.messageOutputs.map(e=>renderOutput(t[e]))].join(`

`):e.message}function restoreError(e,t){const n=new Error(decodeExecaMessage(e,t),{cause:e.cause?restoreError(e.cause,t):void 0});return Object.assign(n,{name:e.name,code:e.code})}function restoreExecaResult(e){const{error:t,...n}=e;const r={...n,stdout:n.stdout,stderr:n.stderr,shortMessage:n.shortMessage,code:n.code};if(t){const e=restoreError(t,r);return Object.assign(e,r,{cause:e.cause})}return{...r,cause:void 0}}export{getSpawnBroker as n,restoreExecaResult as t};