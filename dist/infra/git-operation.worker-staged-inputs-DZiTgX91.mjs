import{o as e}from"./git-operation.worker-fs-safe-2XqdJR5K.mjs";import"node:path";import{createHash as t}from"node:crypto";import{compileFunction as n}from"node:vm";var r=/* @__PURE__ */ e({STAGED_INPUT_GITIGNORE:()=>i,STAGED_INPUT_GIT_PATHSPEC:()=>STAGED_INPUT_GIT_PATHSPEC,STAGED_INPUT_MAX_BYTES:()=>STAGED_INPUT_MAX_BYTES,STAGED_INPUT_PATHS_JS:()=>o,createStagedInputPathMatcher:()=>createStagedInputPathMatcher,isStagedInputPath:()=>c,stagedInputDirectoriesFromEntries:()=>l,stagedInputPathDirectory:()=>s});const i=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`,a=t(`sha256`).update(i).digest(`hex`),o=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(`media/inbound/openclaw-staged-`)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(i)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(a)};
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
}`,{stagedInputPathDirectory:s,isStagedInputPath:c,stagedInputDirectoriesFromEntries:l}=n(`${o}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)();function createStagedInputPathMatcher(e){let t=/* @__PURE__ */ new Map;return async n=>{let r=s(n);if(!r)return!1;let a=t.get(r);return a||(a=e.readText(`${r}/.gitignore`,{maxBytes:78}).then(e=>e===i,()=>!1),t.set(r,a)),await a}}export{s as a,l as i,createStagedInputPathMatcher as n,r as o,c as r,o as t};