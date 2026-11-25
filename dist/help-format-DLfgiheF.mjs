import{r as theme}from"./theme-DS2CtI9X.mjs";import{t as formatDocsLink}from"./links-C_FK9uVv.mjs";
//!src/cli/help-format.ts
function formatDocsHelp(e){return`\n${theme.muted(`Docs:`)} ${formatDocsLink(e,`docs.openclaw.ai${e}`)}\n`}function formatHelpExamples(e,t=false){return e.map(([e,n])=>{const r=`  ${theme.command(e)}`;if(t)return n?`${r} ${theme.muted(`# ${n}`)}`:r;return`${r}\n    ${theme.muted(n)}`}).join(`
`)}export{formatHelpExamples as n,formatDocsHelp as t};