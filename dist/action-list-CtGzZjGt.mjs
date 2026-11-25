import{n as commandReply}from"./command-gates-BoV3xbNq.mjs";import{r as readSubagentListSessionEntries,t as buildSubagentList}from"./subagent-list-B8Qdxv7w.mjs";import"./shared-2XpXqw9Y.mjs";
//!src/auto-reply/reply/commands-subagents/action-list.ts
async function handleSubagentsListAction(e){const{params:t,readContext:n}=e;const r=buildSubagentList({context:n.list,sessionEntries:await readSubagentListSessionEntries(t.cfg,n.list),taskMaxChars:110});const formatRows=e=>e.length?e.map(e=>e.line).join(`
`):`(none)`;return commandReply([`active subagents:`,`-----`,formatRows(r.active),``,`recent subagents (last ${30}m):`,`-----`,formatRows(r.recent)].join(`
`))}export{handleSubagentsListAction};