import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{Ct as t}from"./worker-chunk-ARwSM3No.mjs";import{a as n,n as r}from"./worker-chunk-BLTrvFP2.mjs";import i from"node:path";import{createHash as a}from"node:crypto";import{compileFunction as o}from"node:vm";function createStagedInputPathMatcher(e){let t=/* @__PURE__ */ new Map;return async n=>{let r=p(n);if(!r)return!1;let i=t.get(r);return i||(i=e.readText(`${r}/.gitignore`,{maxBytes:78}).then(e=>e===u,()=>!1),t.set(r,i)),await i}}function stagedInputDirectory(e){return`${c}${e}`}function stagedInputFileName(e){return t(`input-${e}`,`input-attachment`)}function resolveStagedInputMediaPaths(e){let t=/* @__PURE__ */ new Map,n=/* @__PURE__ */ new Set;for(let r of e??[]){if(r.staged!==!0||!r.path)continue;let e=p(r.path),a=e?`${e}/input-`:void 0;if(!a||!r.path.startsWith(a))continue;let o=r.path.slice(a.length);if(!/^file_[^/\\]+$/u.test(o))continue;let s=i.posix.extname(o),c=s?[o,o.slice(0,-s.length)]:[o];for(let e of c){if(n.has(e))continue;let i=t.get(e);i&&i!==r.path?(t.delete(e),n.add(e)):t.set(e,r.path)}}return t}async function ensureStagedInputDirectory(e,t,r){let i=typeof e==`string`?await n(e):e,a=`${t}/.gitignore`;if(await i.exists(t)){if(await i.readText(a,{maxBytes:1024})!==`# Raw task inputs remain private; copy outputs into the project to publish.
*
`)throw Error(`Input staging directory is not owned by OpenClaw`);return}r?.throwIfAborted(),await i.create(a,u,{mode:384,assertBeforeMutation:()=>r?.throwIfAborted()})}var s,c,l,u,d,f,p,m,h,g=e((()=>{r(),s=52428800,c=`media/inbound/openclaw-staged-`,l=`:(glob)${c}*/**`,u=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`,d=a(`sha256`).update(u).digest(`hex`),f=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(c)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(u)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(d)};
// A producer-shaped name is only a candidate; the marker establishes ownership.
function stagedInputPathDirectory(relativePath) {
  if (!relativePath.startsWith(STAGED_INPUT_DIRECTORY_PREFIX)) {
    return undefined;
  }
  const identity = relativePath.slice(STAGED_INPUT_DIRECTORY_PREFIX.length).split("/")[0];
  const match =
    /^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/u.exec(
      identity,
    );
  return match?.[0] === identity ? STAGED_INPUT_DIRECTORY_PREFIX + identity : undefined;
}

function isStagedInputPath(relativePath, directories) {
  const directory = stagedInputPathDirectory(relativePath);
  return directory !== undefined && directories.has(directory);
}

// Complete manifests bind the regular marker's exact bytes through their file digest.
function stagedInputDirectoriesFromEntries(entries) {
  const directories = new Set();
  for (const entry of entries) {
    const directory = stagedInputPathDirectory(entry.path);
    if (
      directory &&
      entry.path === directory + "/.gitignore" &&
      entry.type === "file" &&
      entry.size === STAGED_INPUT_GITIGNORE.length &&
      entry.sha256 === STAGED_INPUT_GITIGNORE_SHA256
    ) {
      directories.add(directory);
    }
  }
  return directories;
}`,{stagedInputPathDirectory:p,isStagedInputPath:m,stagedInputDirectoriesFromEntries:h}=o(`${f}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)()}));export{createStagedInputPathMatcher as a,m as c,stagedInputDirectory as d,stagedInputFileName as f,f as i,resolveStagedInputMediaPaths as l,l as n,ensureStagedInputDirectory as o,p,s as r,g as s,u as t,h as u};