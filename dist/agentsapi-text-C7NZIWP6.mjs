//!extensions/agentsapi/agentsapi-text.ts
function readAgentsApiFinalText(e){const t=e.filter(e=>e.type===`message`&&e.role===`assistant`&&e.status===`completed`);const n=t.filter(e=>e.phase===`final_answer`);return(n.length?n:t.filter(e=>e.phase!==`commentary`)).map(e=>e.content?.filter(e=>e.type===`output_text`).map(e=>e.text??``).join(``)??``).join(`
`)}export{readAgentsApiFinalText as t};