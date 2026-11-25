import{S as sanitizeUntrustedFileName,x as root}from"./fs-safe-Bxzu1j4h.mjs";import path from"node:path";import{createHash}from"node:crypto";import{compileFunction}from"node:vm";
//!src/media/staged-inputs.ts
const STAGED_INPUT_MAX_BYTES=52428800;const STAGED_INPUT_DIRECTORY_PREFIX=`media/inbound/openclaw-staged-`;const STAGED_INPUT_GIT_PATHSPEC=`:(glob)${STAGED_INPUT_DIRECTORY_PREFIX}*/**`;const STAGED_INPUT_GITIGNORE=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`;const STAGED_INPUT_GITIGNORE_SHA256=createHash(`sha256`).update(STAGED_INPUT_GITIGNORE).digest(`hex`);const STAGED_INPUT_PATHS_JS=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(STAGED_INPUT_DIRECTORY_PREFIX)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(STAGED_INPUT_GITIGNORE)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(STAGED_INPUT_GITIGNORE_SHA256)};
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
}`;const{stagedInputPathDirectory,isStagedInputPath,stagedInputDirectoriesFromEntries}=compileFunction(`${STAGED_INPUT_PATHS_JS}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)();function createStagedInputPathMatcher(e){const t=/* @__PURE__ */ new Map;return async n=>{const r=stagedInputPathDirectory(n);if(!r)return false;let i=t.get(r);if(!i){i=e.readText(`${r}/.gitignore`,{maxBytes:78}).then(e=>e===STAGED_INPUT_GITIGNORE,()=>false);t.set(r,i)}return await i}}function stagedInputDirectory(e){return`${STAGED_INPUT_DIRECTORY_PREFIX}${e}`}function stagedInputFileName(e){return sanitizeUntrustedFileName(`input-${e}`,`input-attachment`)}function resolveStagedInputMediaPaths(e){const t=/* @__PURE__ */ new Map;const n=/* @__PURE__ */ new Set;for(const r of e??[]){if(r.staged!==true||!r.path)continue;const e=stagedInputPathDirectory(r.path);const i=e?`${e}/input-`:void 0;if(!i||!r.path.startsWith(i))continue;const a=r.path.slice(i.length);if(!/^file_[^/\\]+$/u.test(a))continue;const o=path.posix.extname(a);const s=o?[a,a.slice(0,-o.length)]:[a];for(const e of s){if(n.has(e))continue;const i=t.get(e);if(i&&i!==r.path){t.delete(e);n.add(e)}else t.set(e,r.path)}}return t}async function ensureStagedInputDirectory(e,t,n){const r=typeof e===`string`?await root(e):e;const i=`${t}/.gitignore`;if(await r.exists(t)){if(await r.readText(i,{maxBytes:1024})!==`# Raw task inputs remain private; copy outputs into the project to publish.
*
`)throw new Error(`Input staging directory is not owned by OpenClaw`);return}n?.throwIfAborted();await r.create(i,STAGED_INPUT_GITIGNORE,{mode:384,assertBeforeMutation:()=>n?.throwIfAborted()})}export{createStagedInputPathMatcher as a,resolveStagedInputMediaPaths as c,stagedInputFileName as d,stagedInputPathDirectory as f,STAGED_INPUT_PATHS_JS as i,stagedInputDirectoriesFromEntries as l,STAGED_INPUT_GIT_PATHSPEC as n,ensureStagedInputDirectory as o,STAGED_INPUT_MAX_BYTES as r,isStagedInputPath as s,STAGED_INPUT_GITIGNORE as t,stagedInputDirectory as u};