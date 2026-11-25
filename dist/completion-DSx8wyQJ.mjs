import{t as finalizePluginModelUsage}from"./runtime-model-usage-DoUzlRt7.mjs";
//!src/decisions/completion.ts
function completeDecisionEvaluation(e){if(e.outcome.status===`ok`&&e.usageFacts)finalizePluginModelUsage({...e.usageFacts,rawUsage:e.outcome.result.usage,estimate:`none`});return e.outcome}export{completeDecisionEvaluation as t};