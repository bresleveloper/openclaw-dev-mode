import{a as resolveCliParentCommandPath}from"./config-output-mode-zXCwdxLP.mjs";import{C as hasMachineOutputOption}from"./argv-BgC5-KlV.mjs";
//!src/cli/skills-output-mode.ts
function isSkillsMachineOutput(e,t){return resolveCliParentCommandPath(e,`skills`)?.[1]===`verify`&&!hasMachineOutputOption(e,`--card`,t)}export{isSkillsMachineOutput as t};