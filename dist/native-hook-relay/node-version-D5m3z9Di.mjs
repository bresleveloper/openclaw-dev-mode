const NODE_RELEASE_VERSION_RE=/^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;const NODE_RELEASE_FLOORS=[{major:24,minor:16,patch:0},{major:26,minor:1,patch:0}];const HIGHEST_RELEASE_FLOOR=NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length-1];const SUPPORTED_NODE_VERSION_RANGE=NODE_RELEASE_FLOORS.map(({major:e,minor:t,patch:n},r)=>`>=${e}.${t}.${n}${r<NODE_RELEASE_FLOORS.length-1?` <${e+1}`:``}`).join(` || `);const SUPPORTED_NODE_VERSIONS=`${SUPPORTED_NODE_VERSION_RANGE.replaceAll(` || `,`, `).replace(/, ([^,]+)$/,`, or $1`)} (Node 26 recommended)`;function parseNodeReleaseVersion(e){if(typeof e!==`string`)return null;const t=NODE_RELEASE_VERSION_RE.exec(e.trim());if(!t)return null;const n={major:Number(t[1]),minor:Number(t[2]),patch:Number(t[3])};return Object.values(n).every(Number.isSafeInteger)&&(!t[4]||n.major>HIGHEST_RELEASE_FLOOR.major)?n:null}function isNodeVersionAtLeast(e,t){if(!e)return false;if(e.major!==t.major)return e.major>t.major;if(e.minor!==t.minor)return e.minor>t.minor;return e.patch>=t.patch}function renderProcessNodeVersionCheck(){return`((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  if (match[4] && version.major <= floors[floors.length - 1].major) return false;
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`}const PROCESS_NODE_VERSION_CHECK=renderProcessNodeVersionCheck();export{parseNodeReleaseVersion as n,isNodeVersionAtLeast as t};