const e=/^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u,t=[{major:24,minor:16,patch:0},{major:26,minor:1,patch:0}],n=t[t.length-1];`${t.map(({major:e,minor:n,patch:r},i)=>`>=${e}.${n}.${r}${i<t.length-1?` <${e+1}`:``}`).join(` || `).replaceAll(` || `,`, `).replace(/, ([^,]+)$/,`, or $1`)}`;function parseNodeReleaseVersion(t){if(typeof t!=`string`)return null;let r=e.exec(t.trim());if(!r)return null;let i={major:Number(r[1]),minor:Number(r[2]),patch:Number(r[3])};return Object.values(i).every(Number.isSafeInteger)&&(!r[4]||i.major>n.major)?i:null}function isNodeVersionAtLeast(e,t){return e?e.major===t.major?e.minor===t.minor?e.patch>=t.patch:e.minor>t.minor:e.major>t.major:!1}function renderProcessNodeVersionCheck(){return`((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(e.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(t)};
  if (match[4] && version.major <= floors[floors.length - 1].major) return false;
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`}renderProcessNodeVersionCheck();export{parseNodeReleaseVersion as n,isNodeVersionAtLeast as t};