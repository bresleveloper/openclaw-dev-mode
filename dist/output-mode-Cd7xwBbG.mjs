import{i as resolveGatewayCommandPath}from"./gateway-run-argv-D8aBgiPG.mjs";
//!src/cli/gateway-cli/output-mode.ts
function isGatewayMachineOutput(e){const[,t,n]=resolveGatewayCommandPath([...e],3)??[];return t===`restart-handoff`&&(n===`capabilities`||n===`consume`)}export{isGatewayMachineOutput as t};