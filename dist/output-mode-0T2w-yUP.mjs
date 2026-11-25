import{s as getRootOptionAwareCommandPath}from"./cli-root-options-eez2TgAl.mjs";
//!src/cli/nodes-cli/output-mode.ts
function isNodesMachineOutput(e){const[,t]=getRootOptionAwareCommandPath(e,2);return t===`invoke`||t===`approve`||t===`reject`}export{isNodesMachineOutput as t};