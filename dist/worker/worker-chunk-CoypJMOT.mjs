import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{compileFunction as t}from"node:vm";var n,r,i,a,o=e((()=>{n=[`.openclaw`,`sandbox-skills`],r=n.join(`/`),i=`
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(r)};
function isManagedSandboxSkillsPath(relativePath) {
  return (
    relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE ||
    relativePath.startsWith(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE + "/")
  );
}`,a=t(`${i}\nreturn isManagedSandboxSkillsPath;`)()}));export{a,o as i,r as n,n as r,i as t};