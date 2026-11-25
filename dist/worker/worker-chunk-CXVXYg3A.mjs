import{n as e}from"./worker-chunk-DyeIuPEC.mjs";function parseNodeReleaseVersion(e){if(typeof e!=`string`)return null;let n=t.exec(e.trim());if(!n)return null;let i={major:Number(n[1]),minor:Number(n[2]),patch:Number(n[3])};return Object.values(i).every(Number.isSafeInteger)&&(!n[4]||i.major>r.major)?i:null}function isNodeVersionAtLeast(e,t){return e?e.major===t.major?e.minor===t.minor?e.patch>=t.patch:e.minor>t.minor:e.major>t.major:!1}function renderProcessNodeVersionCheck(){return`((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(t.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(n)};
  if (match[4] && version.major <= floors[floors.length - 1].major) return false;
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`}var t,n,r,i;function init_node_version(){return(init_node_version=e((()=>{t=/^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u,n=[{major:24,minor:16,patch:0},{major:26,minor:1,patch:0}],r=n[n.length-1],i=n.map(({major:e,minor:t,patch:r},i)=>`>=${e}.${t}.${r}${i<n.length-1?` <${e+1}`:``}`).join(` || `),`${i.replaceAll(` || `,`, `).replace(/, ([^,]+)$/,`, or $1`)}`,renderProcessNodeVersionCheck()})))()}export{isNodeVersionAtLeast as n,parseNodeReleaseVersion as r,init_node_version as t};