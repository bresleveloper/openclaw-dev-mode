import{n as e,r as t}from"./worker-chunk-DyeIuPEC.mjs";import"node:path";import{createHash as n}from"node:crypto";import{compileFunction as r}from"node:vm";var i=/* @__PURE__ */ t({createStagedInputPathMatcher:()=>createStagedInputPathMatcher});function createStagedInputPathMatcher(e){let t=/* @__PURE__ */ new Map;return async n=>{let r=l(n);if(!r)return!1;let i=t.get(r);return i||(i=e.readText(`${r}/.gitignore`,{maxBytes:78}).then(e=>e===o,()=>!1),t.set(r,i)),await i}}var a,o,s,c,l,u,d;function init_staged_inputs(){return(init_staged_inputs=e((()=>{a=`media/inbound/openclaw-staged-`,o=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`,s=n(`sha256`).update(o).digest(`hex`),c=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(a)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(o)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(s)};
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
}`,{stagedInputPathDirectory:l,isStagedInputPath:u,stagedInputDirectoriesFromEntries:d}=r(`${c}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)()})))()}export{d as a,u as i,createStagedInputPathMatcher as n,l as o,init_staged_inputs as r,i as s,c as t};