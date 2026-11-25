import{s as measureDiagnosticsTimelineSpan}from"./diagnostics-timeline-CxNgJ72q.mjs";
//!src/agents/startup-timing.ts
function measureAgentStartup(e,t,n={}){return measureDiagnosticsTimelineSpan(`agent.startup`,t,{config:n.config,phase:`agent.startup`,attributes:{stage:e}})}export{measureAgentStartup as t};