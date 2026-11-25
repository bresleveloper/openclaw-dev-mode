import{parse}from"acorn";
//!src/agents/code-mode-script-syntax.ts
function buildCodeModeScriptParseSource(e){return{source:`(async () => {
${e}\n})`,codeOffset:15}}function parseCodeModeScriptSyntax(e){const{source:t}=buildCodeModeScriptParseSource(e);try{return{ok:true,program:parse(t,{ecmaVersion:`latest`})}}catch(e){const t=e;return{ok:false,message:t.message.replace(/ \(\d+:\d+\)$/u,``),line:t.loc.line-1,column:t.loc.column}}}export{parseCodeModeScriptSyntax as n,buildCodeModeScriptParseSource as t};