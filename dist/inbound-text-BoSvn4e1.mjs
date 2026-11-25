//!src/auto-reply/reply/inbound-text.ts
function normalizeInboundTextNewlines(e){return e.replaceAll(`\r
`,`
`).replaceAll(`\r`,`
`)}export{normalizeInboundTextNewlines as t};