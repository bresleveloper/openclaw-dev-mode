import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,l as n}from"./worker-chunk-D-pM6VZQ.mjs";import{n as r,r as i,t as a}from"./worker-chunk-D7DfxXyC.mjs";import{n as o,r as s}from"./worker-chunk-O3z06M-B.mjs";import{n as c,t as l}from"./worker-chunk-9eOBldsQ.mjs";import{B as u,N as d,P as f,R as p,_ as m,k as h,w as g}from"./worker-chunk-D-t5pbdl.mjs";import{t as _}from"./worker-chunk-uKvqOJn0.mjs";import{i as v,t as y}from"./worker-chunk-D3C_QfoA.mjs";import{a as ee}from"./worker-chunk-CNgSmAKj.mjs";import{n as te}from"./worker-chunk-BiUp0xOu.mjs";import{n as b,t as x}from"./worker-chunk-B4r2li-F.mjs";import{n as S,t as C}from"./worker-chunk-CjQuUq8V.mjs";import{n as w,t as ne}from"./worker-chunk-Cov1ljF-.mjs";import{i as re,s as T}from"./worker-chunk-ZI3-ais9.mjs";import{r as ie,t as ae}from"./worker-chunk-BQiEiAWV.mjs";import{a as E,n as oe,o as D}from"./worker-chunk-BjbSxtLY.mjs";import{a as O,r as se,t as ce}from"./worker-chunk-BPPcAfEo.mjs";import{n as le,t as k}from"./worker-chunk-LtPf8MRO.mjs";import{n as ue,t as de}from"./worker-chunk-SgtwXAcY.mjs";import{a as fe,n as pe}from"./worker-chunk-Cf-L0HJd.mjs";import{n as A,r as j,t as M}from"./worker-chunk-hLSGsKPV.mjs";import{c as N,s as P}from"./worker-chunk-P18HYFMS.mjs";import F from"node:path";import I from"node:fs/promises";import{compileFunction as L}from"node:vm";function hasForcedWorkerEnvironmentAbandonment(e){return e.destroyRequestedAtMs!==null&&(e.lastError===`Worker result abandoned by forced operator teardown`||e.lastError?.startsWith(R)===!0)}function createWorkerEnvironmentErrorRecorder(e){return async(t,n,r)=>(r?.(),t.teardownTerminalState===`failed`&&t.lastError?t:e.recordError({environmentId:t.environmentId,state:t.state,error:hasForcedWorkerEnvironmentAbandonment(t)?`${R}${k(n,1024-R.length)}`:k(n),assertCurrent:r}))}var WorkerEnvironmentServiceError,workerEnvironmentServiceError,R,z=e((()=>{ie(),le(),WorkerEnvironmentServiceError=class extends Error{constructor(e,t){super(t),this.code=e}},workerEnvironmentServiceError=(e,t)=>new WorkerEnvironmentServiceError(e,t),R=`${ae}; `}));function createWorkerRuntimeRefresher(e){let{store:t,callBootstrap:n,requireCurrentOwner:a,stopOwner:o,identityResolverFor:s}=e,{ensurePendingCredential:c}=e.credentialBroker,u=/* @__PURE__ */ new Map;return{refresh:async(d,f,p,m)=>{if(!p||d.bootstrapReceipt&&w(d.bootstrapReceipt,p))return;if(d.state!==`attached`&&d.state!==`ready`&&d.state!==`idle`||!d.bootstrapReceipt||!d.leaseId)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires an admitted lease`);let h=l(),g=/* @__PURE__ */ new Set,_={settled:h.promise,onProgress:e=>i(g,e)},reportProgress=()=>r(g,void 0);u.set(d.environmentId,_);try{let r=d.state===`attached`?d.attachedSessionIds[0]:void 0,i;if(d.state===`attached`){if(!r||!e.placementStore)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires its placement`);i=await e.placementStore.prepareWorkerRuntimeRefresh({sessionId:r,environmentId:d.environmentId,ownerEpoch:d.ownerEpoch})}let assertCurrent=()=>{m?.throwIfAborted();let t=a(d);if(e.isStopping()||t.destroyRequestedAtMs!==null)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh owner is stopping`);i?.assertCurrent()};try{await o(d,void 0,{assertCurrent});let a=await n(p,async t=>{let n=m?AbortSignal.any([m,t]):t;if(assertCurrent(),d.nodeDeviceId){if(p.install!==`bundle`||!e.ensureNodeWorkerBundle)throw Error(`Worker node bundle installer is unavailable`);return e.ensureNodeWorkerBundle({reason:`refresh`,environmentId:d.environmentId,deviceId:d.nodeDeviceId,artifact:p,prewarm:d.profileSnapshot.executionMode!==`remote-exec`,signal:n,assertCurrent,onProgress:reportProgress})}if(!d.sshEndpoint)throw Error(`Worker runtime refresh has no transport`);return e.bootstrapWorker({operationId:d.provisionOperationId,sshEndpoint:d.sshEndpoint,installation:p,resolveIdentity:s(d,f,d.leaseId),signal:n,assertCurrent})});if(!w(a,p))throw Error(`Worker runtime refresh returned a mismatched build receipt`);let l=await t.refreshBootstrapReceipt({environmentId:d.environmentId,...d.state===`attached`?{expectedState:d.state,expectedPlacementGeneration:i.generation,expectedReclaimResult:i.reclaimResult}:{expectedState:d.state},expectedOwnerEpoch:d.ownerEpoch,expectedNodeDeviceId:d.nodeDeviceId,expectedBootstrapReceipt:d.bootstrapReceipt,bootstrapReceipt:{...a,installKind:`bundle`},assertCurrent});await c(l,r??null)}finally{i?.release()}}finally{u.delete(d.environmentId),h.resolve()}},read:e=>u.get(e)}}var WorkerRuntimeRefreshPendingError,me=e((()=>{c(),a(),ne(),z(),WorkerRuntimeRefreshPendingError=class extends Error{constructor(e){super(`Cloud worker runtime update is pending; recovery will retry when the worker is available: ${e}`),this.code=`invalid_state`}}})),B,V,he=e((()=>{B={maxEntries:6,maxAgeMs:2592e6,temporaryMaxAgeMs:36e5},V=String.raw`
function selectWorkspaceSeedsToPrune(entries, policy, now, preserveKey) {
  const newest = entries
    .filter((entry) => /^(?:[a-f0-9]{64}|\.tmp-[a-f0-9]{64}-.+)$/u.test(entry.name))
    .toSorted((left, right) => right.mtimeMs - left.mtimeMs || left.name.localeCompare(right.name));
  // Reserve a slot for the just-prepared seed even when another entry's clock is ahead.
  let retained = newest.some((entry) => entry.name === preserveKey) ? 1 : 0;
  return newest.filter((entry) => {
    if (entry.name === preserveKey) {
      return false;
    }
    const temporary = entry.name.startsWith(".tmp-");
    return (
      now - entry.mtimeMs > (temporary ? policy.temporaryMaxAgeMs : policy.maxAgeMs) ||
      (!temporary && ++retained > policy.maxEntries)
    );
  });
}`,L(`${V}\nreturn selectWorkspaceSeedsToPrune;`)()}));function resolveRepositoryNodeRequirement(e){for(let t of[`.nvmrc`,`.node-version`]){let n=e[t]?.split(`
`).map(e=>e.split(`#`,1)[0]?.trim()).find(Boolean);if(n)return n}let t=e[`.tool-versions`]?.match(/^\s*(?:nodejs|node)\s+(\S+)/mu)?.[1];if(t)return t;let n=(e[`mise.toml`]?.split(/^\s*\[tools\][ \t]*(?:#.*)?$/mu)[1]?.split(/^\s*\[/mu)[0])?.match(/^\s*node\s*=\s*["']([^"']+)["']/mu)?.[1];if(n)return n;let r=e[`package.json`];if(!r)return;let i=JSON.parse(r)?.engines?.node;return typeof i==`string`&&i.trim()?i.trim():void 0}var ge=e((()=>{})),H,_e=e((()=>{j(),ge(),H=`async (workspaceDir, homeDir, machineHome) => {
  if (process.platform !== "linux" || !["x64", "arm64"].includes(process.arch)) return;
  const fs = require("node:fs");
  const path = require("node:path");
  const { spawnSync } = require("node:child_process");
  const files = {};
  for (const name of [".nvmrc", ".node-version", ".tool-versions", "mise.toml", "package.json"]) {
    const file = path.join(workspaceDir, name);
    try {
      const stat = fs.lstatSync(file);
      if (!stat.isFile() || stat.size > 1048576) throw new Error("Repository Node declaration must be a regular file under 1 MiB: " + name);
      files[name] = fs.readFileSync(file, "utf8");
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const requirement = (${resolveRepositoryNodeRequirement.toString()})(files);
  const manifest = files["package.json"] ? JSON.parse(files["package.json"]) : {};
  let nodeBin = path.dirname(process.execPath);
  let semver, version;
  const fetchText = async (url) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120000), redirect: "error" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      return await response.text();
    } catch (error) { throw new Error("Repository Node release download failed; allow HTTPS access to nodejs.org and retry preparation (" + error.message + ")"); }
  };
  if (requirement && requirement !== "system") {
    const npm = spawnSync("sh", ["-c", "command -v npm"], { encoding: "utf8" });
    if (npm.status !== 0) throw new Error("Repository Node resolution requires npm beside bootstrap Node; repair the image or profile setup and retry");
    semver = require(require.resolve("semver", { paths: [path.dirname(fs.realpathSync(npm.stdout.trim()))] }));
    const releases = JSON.parse(await fetchText("https://nodejs.org/dist/index.json"));
    let candidates = releases.filter((release) => release.files.includes("linux-" + process.arch) && semver.valid(release.version));
    if (requirement === "node" || requirement === "latest") {}
    else if (/^lts\\//i.test(requirement)) {
      const lts = requirement.slice(4);
      candidates = candidates.filter((release) => release.lts && (lts === "*" || release.lts.toLowerCase() === lts.toLowerCase()));
    } else {
      const range = semver.validRange(requirement);
      if (!range) throw new Error("Unsupported repository Node requirement " + requirement + "; use a release, major version, or SemVer range");
      candidates = candidates.filter((release) => semver.satisfies(release.version, range));
    }
    candidates.sort((a, b) => semver.rcompare(a.version, b.version));
    version = candidates[0]?.version.slice(1);
    if (!version) throw new Error("No official Linux Node.js release matches " + requirement + "; fix the repository Node declaration and retry");
    const filename = "node-v" + version + "-linux-" + process.arch + ".tar.gz";
    const sums = await fetchText("https://nodejs.org/dist/v" + version + "/SHASUMS256.txt");
    const digest = sums.split("\\n").map((line) => line.trim().split(/\\s+/)).find((entry) => entry[1] === filename)?.[0];
    if (!digest || !/^[a-f0-9]{64}$/.test(digest)) throw new Error("Node.js release SHA-256 is missing; check nodejs.org connectivity and retry preparation");
    const installed = spawnSync("sh", ["-s", "--", version, digest], {
      input: ${JSON.stringify(`${A}\nopenclaw_install_node "$1" "$2"\n`)},
      env: { PATH: process.env.PATH, HOME: machineHome }, encoding: "utf8", timeout: 660000,
    });
    if (installed.status !== 0) throw new Error("Repository Node installation failed; check nodejs.org access, disk space and image prerequisites, then retry: " + (installed.stderr || installed.error?.message || installed.status));
    nodeBin = installed.stdout.trim();
  }
  const bin = path.join(homeDir, ".local", "bin");
  fs.mkdirSync(bin, { recursive: true, mode: 0o700 });
  // A repository release without Corepack uses the worker's. When its engines reject the repository
  // Node, run a copy whose entry stubs exec the worker Node: enable links shims into the running
  // package, so its shims and any later enable stay on a supported Node.
  const supportedCorepack = (launcher) => {
    const root = path.dirname(path.dirname(fs.realpathSync(launcher)));
    let corepack;
    try { corepack = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")); } catch { return launcher; }
    const engines = corepack.name === "corepack" ? corepack.engines?.node : undefined;
    if (!version || !engines || semver.satisfies(version, engines)) return launcher;
    const copy = path.join(homeDir, ".local", "lib", "openclaw-corepack");
    fs.rmSync(copy, { recursive: true, force: true });
    fs.cpSync(root, copy, { recursive: true });
    // System packages are read-only; cpSync keeps their modes, which would block these rewrites and the next refresh.
    for (const entry of ["", ...fs.readdirSync(copy, { recursive: true })]) fs.chmodSync(path.join(copy, entry), 0o700);
    // Shell runs line two and execs the worker Node; JavaScript reads it as a string and a comment.
    const header = "#!/bin/sh\\n':' //; exec '" + process.execPath.replaceAll("'", "'\\\\''") + "' \\"$0\\" \\"$@\\"\\n";
    for (const entry of fs.readdirSync(path.join(copy, "dist"))) {
      const file = path.join(copy, "dist", entry);
      if (entry.endsWith(".js")) fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/^(#!.*\\n)?/, () => header));
    }
    return path.join(copy, "dist", "corepack.js");
  };
  for (const name of ["node", "npm", "npx", "corepack"]) {
    let target = path.join(nodeBin, name);
    if (name === "corepack" && !fs.existsSync(target)) {
      const corepack = spawnSync("sh", ["-c", "command -v corepack"], { encoding: "utf8" });
      if (corepack.status === 0) target = supportedCorepack(corepack.stdout.trim());
    }
    if (!fs.existsSync(target)) continue;
    const link = path.join(bin, name);
    try { fs.unlinkSync(link); } catch (error) { if (error.code !== "ENOENT") throw error; }
    fs.symlinkSync(target, link);
  }
  const setupPath = bin + path.delimiter + process.env.PATH;
  if (typeof manifest.packageManager === "string" && manifest.packageManager.trim()) {
    const enabled = spawnSync(path.join(bin, "corepack"), ["enable", "--install-directory", bin], {
      env: { PATH: setupPath, HOME: homeDir }, encoding: "utf8", timeout: 60000,
    });
    if (enabled.status !== 0) throw new Error("Corepack enable failed; supply Corepack in the image or profile setup and retry preparation: " + (enabled.stderr || enabled.error?.message || enabled.status));
  }
  return setupPath;
}`}));function createProjectSetupScript(e,t=!1){let n=e.setupEnv===void 0?void 0:U.parse(e.setupEnv);return`set -eu
if [ -n "\${HOME:-}" ] && [ -L "$HOME/.openclaw-worker" ]; then
  echo 'Prepared project directory escaped its owner' >&2
  exit 1
fi
${M}
node <<'PROJECT_SETUP_SCRIPT'
(${G})(${JSON.stringify({...e,...n?{setupEnv:n}:{}})}, ${t})
  .then((result) => {
    process.stdout.write(JSON.stringify(result ?? null));
  })
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SETUP_SCRIPT`}async function runWorkerProjectLifecycle(e){let t=[];if(e.postCreate&&e.recipe.postCreate!==void 0&&t.push(e.recipe.postCreate),e.recipe.postStart!==void 0&&t.push(e.recipe.postStart),!t.length)return;e.assertCurrent();let n=6e5,createScript=(r={})=>(U.parse(r),`const run = ${W};
const startedAt = performance.now();
(async () => {
  for (const command of ${JSON.stringify(t)}) {
    await run(command, { workspaceDir: process.cwd(), homeDir: process.env.HOME, env: ${JSON.stringify({...e.recipe.env,...r})}, settleDescendants: false, timeoutMs: ${n} - (performance.now() - startedAt) });
  }
})().catch((error) => { console.error(error.message + (error.outputTail ? ": " + error.outputTail : "")); process.exitCode = 1; });`);if(e.runSetupCommand&&(!e.workspaceDir||!e.homeDir))throw Error(`Cloud lifecycle setup requires the owned prepared workspace and HOME paths`);let r=e.runSetupCommand&&e.workspaceDir&&e.homeDir?await e.runSetupCommand({createScript,workspaceDir:e.workspaceDir,homeDir:e.homeDir,timeoutMs:n,assertCurrent:e.assertCurrent,signal:e.signal}):void 0;e.assertCurrent();let i=r??await e.tunnel.runWorkspaceCommand({argv:[`node`,`-e`,createScript()],transportRetry:`never`,assertCurrent:e.assertCurrent,timeoutMs:n,signal:e.signal});if(e.assertCurrent(),i.code!==0)throw Error(`Cloud environment lifecycle command failed: ${i.stderr||i.code}`)}var U,W,G,K=e((()=>{_(),j(),_e(),D(),fe(),U=p(u().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u),u().max(4096).refine(e=>!e.includes(`\0`))).refine(e=>Object.keys(e).length<=32&&Buffer.byteLength(JSON.stringify(e))<=32768,`Prepared setup environment exceeds its limit`),W=`async (command, context) => {
const { spawn } = require("node:child_process");
const { workspaceDir, homeDir, timeoutMs, env = {}, settleDescendants = true } = context;
const run = async (command) => {
if (command && !Array.isArray(command) && typeof command === "object") {
  const results = await Promise.allSettled(Object.values(command).map(run));
  const failed = results.find((result) => result.status === "rejected");
  if (failed) throw failed.reason;
  return results.map((result) => result.value).filter(Boolean).join("\\n");
}
const argv = typeof command === "string" ? ["/bin/sh", "-c", command] : command;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 2147483647) throw new Error("Prepared project command budget exhausted");
  let child;
  let timeout;
  let stderr = Buffer.alloc(0);
  let failure;
  // A deadline/signal may retire the group before exit; never signal that group twice.
  let killed = false;
  const killGroup = () => {
    if (child?.pid && !killed) {
      try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; }
      killed = true;
    }
  };
  const stop = (reason) => { failure ??= reason; killGroup(); };
  const signals = ["SIGTERM", "SIGINT"].map((signal) => [signal, () => stop("interrupted by " + signal)]);
  // A recipe can signal its parent before spawn returns. Own those signals
  // before it starts, and release them even when spawn throws synchronously.
  for (const [signal, handler] of signals) process.once(signal, handler);
  return new Promise((resolve, reject) => {
    child = spawn(argv[0], argv.slice(1), {
      cwd: workspaceDir,
      env: Object.fromEntries(Object.entries({ PATH: process.env.PATH, HOME: homeDir, LANG: "C.UTF-8", ...env, OPENCLAW_SOURCE_TREE_PATH: workspaceDir, OPENCLAW_WORKTREE_PATH: workspaceDir }).filter(([, value]) => value !== null)),
      detached: true,
      stdio: ["ignore", "ignore", "pipe"],
    });
    timeout = setTimeout(() => stop("timed out within the provider command budget (" + Math.ceil(timeoutMs) + " ms)"), timeoutMs);
    child.stderr.on("data", (chunk) => {
      stderr = Buffer.concat([stderr, chunk]).subarray(-16384);
      let start = 0;
      while (start < stderr.length && (stderr[start] & 0xc0) === 0x80) start++;
      stderr = stderr.subarray(start);
    });
    child.once("error", (error) => { failure ??= error.message; });
    // Preparation must settle descendants before capture. Successful post-binding
    // services live until worker teardown; close our diagnostic pipe without killing them.
    child.once("exit", (code) => {
      if (settleDescendants || code !== 0 || failure) killGroup();
      else child.stderr.destroy();
    });
    child.once("close", (code) => {
      // Invalid UTF-8 expands when decoded; bound the serialized text as well as raw bytes.
      const output = Buffer.from(stderr.toString("utf8"));
      let start = Math.max(0, output.length - 16384);
      while (start < output.length && (output[start] & 0xc0) === 0x80) start++;
      const outputTail = output.subarray(start).toString("utf8");
      if (code !== 0 || failure) {
        const error = new Error("Prepared project setup failed: " + (failure || "exit " + code));
        error.outputTail = outputTail;
        reject(error);
      } else resolve(outputTail);
    });
  }).finally(() => {
    clearTimeout(timeout);
    for (const [signal, handler] of signals) process.removeListener(signal, handler);
  });
};
return await run(command);
}`,G=`async (input, inspectOnly = false) => {
const startedAt = performance.now();
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const manifestScript = ${JSON.stringify(pe)};
process.umask(0o077);
const machineHome = fs.realpathSync(os.homedir());
let setupPath = process.env.PATH;
const env = { PATH: process.env.PATH, HOME: machineHome, LANG: "C.UTF-8", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: os.devNull, GIT_CONFIG_COUNT: "2", GIT_CONFIG_KEY_0: "core.hooksPath", GIT_CONFIG_VALUE_0: os.devNull, GIT_CONFIG_KEY_1: "core.fsmonitor", GIT_CONFIG_VALUE_1: "false", GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "", SSH_ASKPASS: "" };
const ownedDirectory = (parent, name, create = false) => {
  const target = path.join(parent, name);
  if (create && !fs.existsSync(target)) fs.mkdirSync(target, { mode: 0o700 });
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink() || !stat.isDirectory() || fs.realpathSync(target) !== target) throw new Error("Prepared project directory escaped its owner");
  return target;
};
const git = (root, args) => {
  // Full object verification on cold snapshot storage needs the same budget as seed verification.
  const timeout = 600000;
  const maxBuffer = 262144;
  const result = spawnSync("git", ["-C", root, ...args], { env, encoding: "utf8", timeout, maxBuffer });
  if (result.error || result.status !== 0) {
    const reason = result.error?.code === "ETIMEDOUT" ? "timed out after " + timeout + " ms"
      : result.error?.code === "ENOBUFS" ? "output exceeded " + maxBuffer + " bytes"
      : result.error?.code ?? (result.signal ? "signal " + result.signal : "exit " + result.status);
    // Git output and full arguments can contain private repository paths or contents.
    throw new Error("Prepared project Git verification failed (git " + args[0] + ": " + reason + ")");
  }
  return result.stdout.trim();
};
const manifest = (root, baseCommit = input.baseCommit, priorRefs = [], manifestHome = machineHome) => {
  const result = spawnSync(process.execPath, ["-e", manifestScript, root, baseCommit, "eligible", ...priorRefs.map((ref) => ref.slice(7))], { env: { ...env, HOME: manifestHome }, encoding: "utf8", timeout: 600000, maxBuffer: 262144 });
  if (result.status !== 0 || !/^sha256:[a-f0-9]{64}$/.test(result.stdout.trim())) throw new Error("Prepared project manifest verification failed: " + (result.stderr?.trim() || result.error?.message || result.status));
  return result.stdout.trim();
};
const readManifest = (file, ref) => {
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.size > ${E}) throw new Error("Prepared project manifest is unsafe");
    const bytes = fs.readFileSync(fd);
    if ("sha256:" + crypto.createHash("sha256").update(bytes).digest("hex") !== ref) throw new Error("Prepared project source manifest changed");
    return bytes;
  } finally { fs.closeSync(fd); }
};
const singleArtifact = (directory, pattern) => {
  const entries = fs.opendirSync(directory);
  try {
    const entry = entries.readSync();
    if (!entry || !pattern.test(entry.name) || entries.readSync()) throw new Error("Prepared project completion artifact is invalid");
    return entry.name;
  } finally { entries.closeSync(); }
};
const manifestEntries = (bytes, baseCommit) => {
  const value = JSON.parse(bytes);
  if (value.version !== 1 || value.baseCommit !== baseCommit || !Array.isArray(value.entries) || value.entries.length > ${oe}) throw new Error("Prepared project manifest is invalid");
  for (const entry of value.entries) {
    const relative = entry.path;
    if (typeof relative !== "string" || !relative || relative.includes("\\\\") || path.posix.isAbsolute(relative) || path.posix.normalize(relative) !== relative || relative === "." || relative === ".." || relative.startsWith("../") || relative === ".git" || relative.startsWith(".git/") || !["file", "directory", "symlink"].includes(entry.type)) throw new Error("Prepared project manifest path is unsafe");
  }
  return value.entries;
};
const removeSetupOutputs = (workspaceDir, previous) => {
  const baseline = manifestEntries(previous.sourceBytes, previous.baseCommit);
  const prepared = manifestEntries(previous.preparedBytes, previous.baseCommit);
  const baselineFiles = new Set(baseline.filter((entry) => entry.type !== "directory").map((entry) => entry.path));
  const baselineDirectories = new Set(baseline.filter((entry) => entry.type === "directory").map((entry) => entry.path));
  const targetPath = (relative) => {
    const segments = relative.split("/");
    let parent = workspaceDir;
    for (const segment of segments.slice(0, -1)) parent = ownedDirectory(parent, segment);
    return path.join(parent, segments.at(-1));
  };
  // Remove obsolete eligible setup output here. Git owns replacement of newly
  // tracked paths; unrelated ignored dependency/build caches remain in place.
  for (const entry of prepared) {
    if (entry.type !== "directory" && !baselineFiles.has(entry.path)) fs.unlinkSync(targetPath(entry.path));
  }
  for (const entry of prepared.filter((entry) => entry.type === "directory" && !baselineDirectories.has(entry.path)).sort((left, right) => right.path.split("/").length - left.path.split("/").length)) {
    const target = targetPath(entry.path);
    ownedDirectory(path.dirname(target), path.basename(target));
    if (fs.readdirSync(target).length === 0) fs.rmdirSync(target);
  }
};
const runSetup = (command, workspaceDir, homeDir) => {
  if (!Number.isSafeInteger(input.timeoutMs) || input.timeoutMs > 2147483647) throw new Error("Prepared project command budget exhausted");
  return (${W})(command, {
    workspaceDir, homeDir, env: { PATH: setupPath, ...input.recipe?.env, ...input.setupEnv },
    timeoutMs: input.timeoutMs - (performance.now() - startedAt),
  });
};
  const workerRoot = ownedDirectory(machineHome, ".openclaw-worker");
  const existing = path.join(workerRoot, "prepared", input.namespace, input.cacheKey);
  const exists = fs.existsSync(existing);
  const verified = input.verifiedRetained;
  if (verified !== undefined && (verified !== null) !== exists) throw new Error("Prepared project changed during preparation");
  // Inspection cannot create a workspace or execute repository code before the Gateway rechecks its owner.
  if (inspectOnly && !exists) return;
  let previous;
  if (exists) {
    const parent = ownedDirectory(ownedDirectory(workerRoot, "prepared"), input.namespace);
    const directory = ownedDirectory(parent, input.cacheKey);
    const workspaceDir = ownedDirectory(directory, "workspace");
    const homeDir = ownedDirectory(directory, "home");
    const admin = ownedDirectory(workspaceDir, ".git");
    if (fs.existsSync(path.join(admin, "objects", "info", "alternates")) || fs.existsSync(path.join(admin, "info", "grafts"))) throw new Error("Prepared project Git base is not standalone");
    const baseCommit = git(workspaceDir, ["rev-parse", "--verify", "HEAD^{commit}"]);
    if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(baseCommit)) throw new Error("Prepared project Git base is invalid");
    if (verified === undefined) git(workspaceDir, ["fsck", "--full", "--strict", "--no-reflogs", baseCommit]);
    const manifestRoot = ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker"), "manifests");
    const completionRoot = ownedDirectory(manifestRoot, "prepared");
    const sourceDigest = singleArtifact(completionRoot, /^[a-f0-9]{64}$/);
    const completionDirectory = ownedDirectory(completionRoot, sourceDigest);
    const preparedFile = singleArtifact(completionDirectory, /^[a-f0-9]{64}[.]json$/);
    const sourceManifestRef = "sha256:" + sourceDigest;
    const preparedManifestRef = "sha256:" + preparedFile.slice(0, -5);
    if (verified && (baseCommit !== verified.baseCommit || sourceManifestRef !== verified.sourceManifestRef || preparedManifestRef !== verified.preparedManifestRef)) throw new Error("Prepared project changed during preparation");
    const completedManifest = path.join(completionDirectory, preparedFile);
    const sourceBytes = readManifest(path.join(manifestRoot, sourceDigest + ".json"), sourceManifestRef);
    const preparedBytes = readManifest(completedManifest, preparedManifestRef);
    readManifest(path.join(manifestRoot, preparedFile), preparedManifestRef);
    manifestEntries(sourceBytes, baseCommit);
    if (verified === undefined && manifest(workspaceDir, baseCommit, [preparedManifestRef, sourceManifestRef], homeDir) !== preparedManifestRef) throw new Error("Prepared project completed workspace changed");
    previous = { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, baseCommit, sourceBytes, preparedBytes, completedManifest, completionDirectory, manifestRoot };
    if (inspectOnly) return { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, baseCommit };
  }
  const seeds = ownedDirectory(ownedDirectory(workerRoot, "git-seeds"), input.namespace);
  const seed = ownedDirectory(seeds, input.seedKey);
  ownedDirectory(seed, ".git");
  if (git(seed, ["rev-parse", "HEAD"]) !== input.baseCommit || git(seed, ["status", "--porcelain=v1", "--untracked-files=all"])) throw new Error("Prepared project seed is not pristine");
  const recipe = input.recipe ?? {
    source: input.setupRecipe ? "script" : "none", env: {},
    inputs: input.setupRecipe ? { ".openclaw/worktree-setup.sh": input.setupRecipe } : {},
    ...(input.setupRecipe ? { onCreate: ["./.openclaw/worktree-setup.sh"] } : {}),
  };
  const verifyRecipe = (root, afterSetup = false) => {
    for (const [file, blob] of Object.entries(recipe.inputs)) {
      const tree = git(root, ["ls-tree", input.baseCommit, "--", file]);
      const mode = recipe.source === "script" ? "100755" : "100(?:644|755)";
      let parent = root;
      const segments = file.split("/");
      for (const segment of segments.slice(0, -1)) parent = ownedDirectory(parent, segment);
      const target = path.join(parent, segments.at(-1));
      const stat = fs.lstatSync(target);
      if (!stat.isFile() || stat.isSymbolicLink() || (recipe.source === "script" && (stat.mode & 0o111) === 0)) throw new Error("Prepared project setup recipe is not an executable regular file");
      if (!(new RegExp("^" + mode + " blob " + blob + "\\t")).test(tree) || git(root, ["hash-object", "--", target]) !== blob) throw new Error(afterSetup ? "Prepared project setup recipe changed during setup" : "Prepared project setup recipe differs from its admission");
    }
    if (!input.recipe && !input.setupRecipe && git(root, ["ls-tree", input.baseCommit, "--", ".openclaw/worktree-setup.sh"]).startsWith("100755 ")) throw new Error("Prepared project setup recipe differs from its admission");
  };
  verifyRecipe(seed);
  const sourceManifestRef = manifest(seed);
  const sourceFile = path.join(workerRoot, "manifests", sourceManifestRef.slice(7) + ".json");
  const sourceBytes = readManifest(sourceFile, sourceManifestRef);
  const preparedRoot = ownedDirectory(ownedDirectory(workerRoot, "prepared", true), input.namespace, true);
  const directory = path.join(preparedRoot, input.cacheKey);
  const fresh = !fs.existsSync(directory);
  ownedDirectory(preparedRoot, input.cacheKey, fresh);
  if (fresh) {
    fs.mkdirSync(path.join(directory, "home"), { mode: 0o700 });
    fs.cpSync(seed, path.join(directory, "workspace"), { recursive: true, errorOnExist: true, force: false, verbatimSymlinks: true });
  }
  const workspaceDir = ownedDirectory(directory, "workspace");
  const homeDir = ownedDirectory(directory, "home");
  const manifestRoot = ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker", fresh), "manifests", fresh);
  const completionRoot = ownedDirectory(manifestRoot, "prepared", fresh);
  const changed = previous && previous.baseCommit !== input.baseCommit;
  if (changed) {
    // Invalidate the only completion witness before touching Git or running code.
    // An interrupted update cannot replay setup, even when returning to an older commit.
    fs.unlinkSync(previous.completedManifest);
    fs.rmdirSync(previous.completionDirectory);
    for (const ref of new Set([previous.sourceManifestRef, previous.preparedManifestRef])) fs.unlinkSync(path.join(manifestRoot, ref.slice(7) + ".json"));
    // onCreate is not repeated for a content refresh; retain its generated artifacts.
    if (recipe.source !== "devcontainer") removeSetupOutputs(workspaceDir, previous);
    git(workspaceDir, ["fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--update-shallow", seed, input.baseCommit]);
    git(workspaceDir, ["checkout", "--detach", "--force", input.baseCommit]);
  } else if (!fresh && previous.sourceManifestRef !== sourceManifestRef) {
    throw new Error("Prepared project pristine baseline changed");
  }
  if (fresh || changed) setupPath = await (${H})(workspaceDir, homeDir, machineHome) ?? setupPath;
  const recipePreparation = { source: recipe.source, ...(recipe.ignoredPropertiesNote ? { ignoredPropertiesNote: recipe.ignoredPropertiesNote } : {}), phaseDurationsMs: {} };
  let setupFailure;
  let captureSkipped;
  if ((fresh || changed) && input.runSetupScript !== false) {
    const phases = recipe.source === "detected"
      ? [["detectedInstall", recipe.detectedInstall]]
      : [...(fresh ? [["onCreate", recipe.onCreate]] : recipe.source === "script" ? [["onCreate", recipe.onCreate]] : []), ["updateContent", recipe.updateContent]];
    for (const [phase, command] of phases) {
      if (command === undefined) continue;
      const phaseStart = performance.now();
      try {
        const note = await runSetup(command, workspaceDir, homeDir);
        if (recipe.source === "detected" && note.trim()) recipePreparation.note = note.trim();
      } catch (error) {
        recipePreparation.failure = { reason: error.message, ...(error.outputTail ? { outputTail: error.outputTail } : {}) };
        if (recipe.source === "detected") captureSkipped = "Detected dependency installation failed; starting without a snapshot";
        else setupFailure = error.message;
        break;
      } finally { recipePreparation.phaseDurationsMs[phase] = Math.round(performance.now() - phaseStart); }
    }
  }
  if (setupFailure) return { recipePreparation, setupFailure };
  ownedDirectory(directory, "workspace");
  ownedDirectory(directory, "home");
  ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker"), "manifests");
  ownedDirectory(workspaceDir, ".git");
  if (git(workspaceDir, ["rev-parse", "HEAD"]) !== input.baseCommit) throw new Error("Prepared project setup changed its Git base");
  verifyRecipe(workspaceDir, true);
  const preparedManifestRef = manifest(workspaceDir, input.baseCommit, [sourceManifestRef]);
  const preparedBytes = readManifest(path.join(workerRoot, "manifests", preparedManifestRef.slice(7) + ".json"), preparedManifestRef);
  if (fresh || changed) {
    const completed = new Map([[sourceManifestRef, sourceBytes], [preparedManifestRef, preparedBytes]]);
    for (const [ref, bytes] of completed) fs.writeFileSync(path.join(manifestRoot, ref.slice(7) + ".json"), bytes, { flag: "wx", mode: 0o600 });
    const completionDirectory = ownedDirectory(completionRoot, sourceManifestRef.slice(7), true);
    // Publish this content-addressed pair last. Root B/P artifacts alone cannot
    // turn an interrupted setup into a reusable completed environment.
    fs.writeFileSync(path.join(completionDirectory, preparedManifestRef.slice(7) + ".json"), preparedBytes, { flag: "wx", mode: 0o600 });
  }
  return { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, recipePreparation, ...(captureSkipped ? { captureSkipped } : {}) };
}`}));function createProjectSeedScript(e){return`set -eu
if [ -n "\${HOME:-}" ] && { [ -L "$HOME/.openclaw-worker" ] || [ -L "$HOME/.openclaw-worker/git-seeds" ]; }; then
  echo 'Project seed directory escaped its owner' >&2
  exit 1
fi
${M}
node <<'PROJECT_SEED_SCRIPT'
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const input = ${JSON.stringify(e)};
const retention = ${JSON.stringify(B)};
${V}
const prepareWorkspace = ${e.preparation?G:`undefined`};
process.umask(0o077);
const env = { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(GIT_|GH_TOKEN$|GITHUB_TOKEN$)/i.test(key))), GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: os.devNull, GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "", SSH_ASKPASS: "" };
const git = (root, args, stdin, networkEnv) => {
  const result = spawnSync("git", ["-c", "core.hooksPath=" + os.devNull, "-c", "core.fsmonitor=false", "-c", "credential.helper=", "-c", "core.askPass=", "-c", "init.templateDir=", "-C", root, ...args], { env: networkEnv ?? env, encoding: "utf8", timeout: 600000, maxBuffer: 262144, stdio: [stdin ?? "ignore", "pipe", "pipe"] });
  if (result.status !== 0) throw new Error(networkEnv ? "Project repository fetch failed" : "Project Git preparation failed: " + (result.stderr?.trim() || result.error?.message || "exit " + result.status));
  return result.stdout.trim();
};
const ownedDirectory = (parent, target) => {
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink() || !stat.isDirectory() || path.dirname(fs.realpathSync(target)) !== parent) throw new Error("Project seed directory escaped its owner");
  return stat;
};
(async () => {
  const home = fs.realpathSync(os.homedir());
  const workerRoot = path.join(home, ".openclaw-worker");
  fs.mkdirSync(workerRoot, { recursive: true, mode: 0o700 });
  ownedDirectory(home, workerRoot);
  const root = path.join(workerRoot, "git-seeds");
  fs.mkdirSync(root, { mode: 0o700, recursive: true });
  ownedDirectory(workerRoot, root);
  const namespace = path.join(root, input.namespace);
  fs.mkdirSync(namespace, { recursive: true, mode: 0o700 });
  ownedDirectory(root, namespace);
  const prune = () => {
    const entries = fs.readdirSync(namespace, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({ name: entry.name, mtimeMs: ownedDirectory(namespace, path.join(namespace, entry.name)).mtimeMs }));
    for (const entry of selectWorkspaceSeedsToPrune(entries, retention, Date.now(), input.seedKey)) {
      const target = path.join(namespace, entry.name);
      if (ownedDirectory(namespace, target).mtimeMs === entry.mtimeMs) fs.rmSync(target, { recursive: true });
    }
  };
  const seed = path.join(namespace, input.seedKey);
  const stagingPrefix = ".tmp-" + input.seedKey + "-";
  if (input.pack && input.repository) throw new Error("Project seed transports are mutually exclusive");
  const transport = input.pack ?? input.repository;
  const directory = transport?.directory;
  if (directory !== undefined) {
    if (path.dirname(directory) !== namespace || !path.basename(directory).startsWith(stagingPrefix)) throw new Error("Project staging path escaped its owner");
    ownedDirectory(namespace, directory);
  }
  try {
    const retained = input.preparation && await prepareWorkspace({ ...input, ...input.preparation }, true);
    const retainedWorkspace = input.preparation ? { retainedWorkspace: retained ?? null } : {};
    if (!transport) {
      if (fs.existsSync(seed)) {
        ownedDirectory(namespace, seed);
        ownedDirectory(seed, path.join(seed, ".git"));
        const preparedWorkspace = retained?.baseCommit === input.baseCommit ? retained : undefined;
        if (git(seed, ["rev-parse", "--verify", "HEAD"]) !== input.baseCommit || git(seed, ["status", "--porcelain=v1", "--untracked-files=all"])) throw new Error("Prepared project seed is not pristine");
        prune();
        process.stdout.write(JSON.stringify({ ready: true, preparedWorkspace, ...retainedWorkspace }));
        return;
      }
      // Provisioning serializes this lease. Discard only this project's abandoned staging.
      for (const entry of fs.readdirSync(namespace)) {
        if (!entry.startsWith(stagingPrefix)) continue;
        const stale = path.join(namespace, entry);
        ownedDirectory(namespace, stale);
        fs.rmSync(stale, { recursive: true });
      }
      const directory = fs.mkdtempSync(path.join(namespace, stagingPrefix));
      process.stdout.write(JSON.stringify({ ready: false, directory, ...retainedWorkspace }));
      return;
    }
    const repository = path.join(directory, "repository");
    fs.mkdirSync(repository, { mode: 0o700 });
    git(repository, ["init", "--quiet", "--object-format=" + (input.baseCommit.length === 40 ? "sha1" : "sha256"), "."]);
    const repositoryUrl = input.repository?.url ?? input.pack?.repositoryUrl;
    if (repositoryUrl !== undefined) {
      const url = new URL(repositoryUrl);
      const segments = url.pathname.slice(1).split("/");
      if (url.protocol !== "https:" || (input.repository && url.origin !== "https://github.com") || url.href !== repositoryUrl || url.username || url.password || url.search || url.hash || segments.length !== 2 || segments.some((segment) => !/^[A-Za-z0-9_.-]+$/.test(segment)) || !segments[1].endsWith(".git") || !/^[a-f0-9]{40}$/.test(input.baseCommit)) throw new Error("Project repository source is invalid");
    }
    if (input.repository) {
      // Public fetches cannot use ambient credentials, helpers, or redirects.
      // Git enables libcurl's netrc lookup independently of credential helpers.
      const authHome = fs.mkdtempSync(path.join(directory, ".fetch-home-"));
      const networkEnv = { ...Object.fromEntries(Object.entries(env).filter(([key]) => !/^(HOME|USERPROFILE|NETRC)$/i.test(key))), HOME: authHome, USERPROFILE: authHome };
      git(repository, ["-c", "http.followRedirects=false", "-c", "protocol.allow=never", "-c", "protocol.https.allow=always", "fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--no-recurse-submodules", repositoryUrl, input.baseCommit], undefined, networkEnv);
    } else {
      const pack = path.join(directory, "base.pack");
      const stat = fs.lstatSync(pack);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.size !== input.pack.bytes) throw new Error("Project pack size does not match");
      const hash = crypto.createHash("sha256");
      for await (const chunk of fs.createReadStream(pack)) hash.update(chunk);
      if (hash.digest("hex") !== input.pack.sha256) throw new Error("Project pack digest does not match");
      if (input.pack.retainedCommit) {
        if (retained?.baseCommit !== input.pack.retainedCommit) throw new Error("Prepared project retained Git base changed before transfer");
        // Fetch one local snapshot into independent objects, without alternates or
        // ancestors that the retained checkout may never have received.
        git(repository, ["fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--update-shallow", retained.workspaceDir, input.pack.retainedCommit]);
      }
      fs.writeFileSync(path.join(repository, ".git", "shallow"), [...new Set([input.baseCommit, input.pack.retainedCommit].filter(Boolean))].join("\\n") + "\\n", { mode: 0o600 });
      const fd = fs.openSync(pack, "r");
      try { git(repository, ["index-pack", "--stdin", "--fix-thin"], fd); } finally { fs.closeSync(fd); }
    }
    // Session workspace binding verifies this credential-free source identity.
    if (repositoryUrl !== undefined) git(repository, ["remote", "add", "origin", repositoryUrl]);
    if (git(repository, ["rev-parse", "--verify", input.baseCommit + "^{commit}"]) !== input.baseCommit) throw new Error("Project seed commit does not match");
    git(repository, ["fsck", "--full", "--strict", "--no-reflogs", input.baseCommit]);
    git(repository, ["checkout", "--detach", "--force", input.baseCommit]);
    if (git(repository, ["status", "--porcelain=v1", "--untracked-files=all"])) throw new Error("Prepared project checkout is not pristine");
    fs.renameSync(repository, seed);
    prune();
    // Repository code keeps its separate Gateway authority check. A checkout that
    // cannot run setup can complete under this seed command's existing owner.
    const preparedWorkspace = input.preparation && (!input.preparation.setupRecipe || input.preparation.runSetupScript === false)
      ? await prepareWorkspace({ ...input, ...input.preparation, runSetupScript: false })
      : undefined;
    process.stdout.write(JSON.stringify({ ready: true, preparedWorkspace }));
  } finally { if (directory !== undefined) fs.rmSync(directory, { recursive: true, force: true }); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SEED_SCRIPT`}var ve=e((()=>{he(),j(),K()})),q,J,Y,X,Z,ye=e((()=>{y(),_(),b(),q=u().min(1).max(64).refine(e=>{let t=v(e);return t.ok&&t.value===e}),J=d().int().positive().max(2**53-1),Y=g(`source`,[f({source:h(`anonymous`)}).strict(),f({source:h(`system-detected`),accountId:J}).strict(),f({source:m([`system-configured`,`agent-override`]),profileId:u().regex(x),accountId:J}).strict()]),X=f({agentId:q,provenance:f({agentId:q,createdVia:m([`operator`,`agent`,`claw`]),creatorAgentId:q.nullable(),createdAtMs:d().int().nonnegative().max(2**53-1)}).strict().nullable()}).strict().refine(e=>e.provenance===null||e.provenance.agentId===e.agentId),Z=f({key:u().regex(/^[a-f0-9]{64}$/u),baseCommit:u().regex(/^[a-f0-9]{40}$/u),source:f({kind:h(`repository`),url:u().max(2048),repositoryId:u().min(1).max(256).regex(/^[A-Za-z0-9_+/=-]+$/u),owner:f({agent:X,identity:Y}).strict()}).strict()})}));function readRepositoryWorkerProjectSnapshot(e){if(!n(e)||e.source===void 0)return;let t=Z.safeParse(e),r=t.success?t.data.source:void 0,i=r&&URL.canParse(r.url)?new URL(r.url).hostname.toLowerCase():void 0;if(Object.keys(e).some(e=>![`key`,`baseCommit`,`source`,`preparation`].includes(e))||!t.success||!i||ue(t.data.source.url,i)?.url!==t.data.source.url)throw Error(`Worker environment has an invalid repository preparation snapshot`);return t.data}var Q=e((()=>{t(),de(),ye()}));async function readWorkerProjectEnvironmentRecipe(e,t){return N(async n=>{let r=await T(e.root,[`ls-tree`,`-z`,e.baseCommit,`--`,n],{signal:t,timeoutMs:3e4}),i=/^(100644|100755) blob ([a-f0-9]{40}(?:[a-f0-9]{24})?)\t[^\0]+\0$/u.exec(r);if(!i?.[2])return;let a=i[2],o=n.endsWith(`devcontainer.json`)||n===`package.json`?await T(e.root,[`cat-file`,`blob`,a],{signal:t,timeoutMs:3e4}):void 0;return{blob:a,executable:i[1]===`100755`,...o===void 0?{}:{content:o}}})}function readWorkerProjectSnapshot(e){if(e!==void 0){if(n(e)&&e.source!==void 0)return readRepositoryWorkerProjectSnapshot(e);if(!n(e)||typeof e.key!=`string`||!/^[a-f0-9]{64}$/u.test(e.key)||typeof e.baseCommit!=`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(e.baseCommit)||e.label!==void 0&&typeof e.label!=`string`||typeof e.root!=`string`||e.root.length>4096||!F.isAbsolute(e.root))throw Error(`Worker environment has an invalid project preparation snapshot`);return{key:e.key,root:e.root,baseCommit:e.baseCommit,...e.label===void 0?{}:{label:e.label}}}}function createWorkerProjectPreparation(e){if(!/^[A-Za-z0-9_-]{1,128}$/u.test(e.namespace))throw Error(`Worker project preparation namespace is invalid`);let t=e.preparation;if(t?.setupRecipe&&t.runSetupScript!==!1&&!e.setupAuthorized)throw Error(`Prepared project setup requires operator.admin authorization`);let r=new AbortController,i=e.signal?AbortSignal.any([r.signal,e.signal]):r.signal,a=O(e.project),o=`source`in e.project?S(e.project.source.url):e.project.label,c,l,u,requireCurrent=()=>{i.throwIfAborted();try{e.requireCurrent()}catch(e){throw r.abort(e),e}},readPreparedWorkspace=r=>{if(!t)throw Error(`Project preparation did not request a prepared workspace`);let i=`/.openclaw-worker/prepared/${e.namespace}/${t.cacheKey}`;if(!n(r)||typeof r.workspaceDir!=`string`||r.workspaceDir.length>4096||!F.posix.isAbsolute(r.workspaceDir)||F.posix.normalize(r.workspaceDir)!==r.workspaceDir||!r.workspaceDir.endsWith(`${i}/workspace`)||r.homeDir!==F.posix.join(F.posix.dirname(r.workspaceDir),`home`)||typeof r.sourceManifestRef!=`string`||!/^sha256:[a-f0-9]{64}$/u.test(r.sourceManifestRef)||typeof r.preparedManifestRef!=`string`||!/^sha256:[a-f0-9]{64}$/u.test(r.preparedManifestRef))throw Error(`Prepared project returned invalid workspace identity`);return Object.freeze({preparationKey:t.key,cacheKey:t.cacheKey,workspaceDir:r.workspaceDir,homeDir:r.homeDir,sourceManifestRef:r.sourceManifestRef,preparedManifestRef:r.preparedManifestRef})},d=t&&{preparationKey:t.key,cacheKey:t.cacheKey,setupRecipe:t.setupRecipe,runSetupScript:t.runSetupScript,recipe:t.recipe},f={namespace:e.namespace,seedKey:a,baseCommit:e.project.baseCommit},p={...f,...d?{preparation:d}:{}},prepareSeed=async r=>{requireCurrent();let o=JSON.parse(await r.runScript(createProjectSeedScript(p),i));if(requireCurrent(),!n(o)||typeof o.ready!=`boolean`)throw Error(`Project preparation returned invalid seed status`);if(t){let t=o.retainedWorkspace;if(t===null)u=null;else{if(!n(t)||typeof t.baseCommit!=`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(t.baseCommit)||t.baseCommit.length!==e.project.baseCommit.length)throw Error(`Project preparation returned an invalid retained Git base`);let r=readPreparedWorkspace(t);u={baseCommit:t.baseCommit,sourceManifestRef:r.sourceManifestRef,preparedManifestRef:r.preparedManifestRef}}}if(o.ready)return{seedKey:a,cacheHit:!0,...o.preparedWorkspace===void 0?{}:{preparedWorkspace:readPreparedWorkspace(o.preparedWorkspace)}};let c=o.directory,l=u?.baseCommit;if(typeof c!=`string`||c.length>4096||!F.posix.isAbsolute(c)||!c.includes(`/.openclaw-worker/git-seeds/${e.namespace}/`)||F.posix.normalize(c)!==c||F.posix.basename(F.posix.dirname(c))!==e.namespace||!F.posix.basename(c).startsWith(`.tmp-${a}-`))throw Error(`Project preparation returned an invalid staging directory`);let d=await I.mkdtemp(F.join(s(),`openclaw-project-base-`));try{requireCurrent();let t;if(`source`in e.project&&!e.prepareRepositoryGitPack)t={repository:{directory:c,url:e.project.source.url}};else{let n=`source`in e.project?e.project.source:void 0,a=`root`in e.project?await se({root:e.project.root,baseCommit:e.project.baseCommit,...typeof l==`string`?{retainedCommit:l}:{},temporaryRoot:d,signal:i}):await e.prepareRepositoryGitPack({temporaryRoot:d,signal:i});requireCurrent();let o=(await I.stat(a)).size;if(o>4294967296)throw Error(`Project Git pack exceeds the workspace byte limit`);let s;{await using e=await I.open(a,`r`);({digest:s}=await ee(e,{signal:i}))}requireCurrent(),await r.upload(a,F.posix.join(c,`base.pack`),i),requireCurrent(),t={pack:{directory:c,bytes:o,sha256:s,...n?{repositoryUrl:n.url}:typeof l==`string`?{retainedCommit:l}:{}}}}let o=JSON.parse(await r.runScript(createProjectSeedScript({...p,...t,verifiedRetained:u}),i));if(requireCurrent(),!n(o)||o.ready!==!0)throw Error(`Project checkout was not verified before capture`);return{seedKey:a,cacheHit:!1,...o.preparedWorkspace===void 0?{}:{preparedWorkspace:readPreparedWorkspace(o.preparedWorkspace),captureRequired:!0,...n(o.preparedWorkspace)&&o.preparedWorkspace.recipePreparation?{recipePreparation:$.parse(o.preparedWorkspace.recipePreparation)}:{}}}}finally{await I.rm(d,{recursive:!0,force:!0})}},prepare=async t=>{if(requireCurrent(),`source`in e.project){if(!e.revalidateRepositorySource)throw Error(`Repository project preparation has no current source authority`);await e.revalidateRepositorySource(i),requireCurrent()}if(d&&!t.runScriptWithBudget)throw Error(`Prepared workspaces require a provider command budget`);let r=await prepareSeed(t);if(requireCurrent(),!d)return r;if(r.preparedWorkspace)return l=r.preparedWorkspace,r;let a=JSON.parse(await t.runScriptWithBudget((e,t)=>createProjectSetupScript({...f,...d,timeoutMs:e,setupEnv:t,verifiedRetained:u}),i));if(requireCurrent(),!n(a))throw Error(`Prepared project returned invalid setup status`);let o=$.parse(a.recipePreparation);if(await t.recordRecipePreparation?.(o),requireCurrent(),typeof a.setupFailure==`string`)throw Error(`${a.setupFailure}${o.failure?.outputTail?`: ${o.failure.outputTail}`:``}`);return l=readPreparedWorkspace(a),{...r,preparedWorkspace:l,recipePreparation:o,...typeof a.captureSkipped==`string`?{captureSkipped:a.captureSkipped}:{captureRequired:!0}}};return{getPreparedWorkspace:()=>l,project:{key:e.project.key,baseCommit:e.project.baseCommit,...t?.recipe?.secretNames?{secretNames:t.recipe.secretNames}:{},...`source`in e.project?{}:{root:e.project.root},...o===void 0?{}:{label:o},...t&&d?{preparation:{key:t.key,cacheKey:t.cacheKey,purpose:t.purpose,demandAtMs:t.demandAtMs},inspectPreparedWorkspace:async t=>{requireCurrent();let r=JSON.parse(await t.runScript(createProjectSetupScript({...f,...d},!0),i));if(requireCurrent(),!n(r)||r.baseCommit!==e.project.baseCommit)throw Error(`Enrolled project has no matching completed workspace`);l=readPreparedWorkspace(r)}}:{},signal:i,assertCurrent:requireCurrent,prepare:e=>(requireCurrent(),c??=prepare(e))},close:()=>r.abort(new DOMException(`Project preparation operation is closed`,`AbortError`))}}var $,be=e((()=>{t(),_(),re(),C(),te(),o(),P(),ve(),K(),Q(),ce(),D(),$=f({source:m([`devcontainer`,`script`,`detected`,`none`]),ignoredPropertiesNote:u().optional(),note:u().optional(),phaseDurationsMs:f({onCreate:d().int().nonnegative().optional(),updateContent:d().int().nonnegative().optional(),detectedInstall:d().int().nonnegative().optional()}).optional(),failure:f({reason:u(),outputTail:u().refine(e=>Buffer.byteLength(e)<=16384).optional()}).optional()})}));export{Q as a,runWorkerProjectLifecycle as c,me as d,WorkerEnvironmentServiceError as f,workerEnvironmentServiceError as g,z as h,readWorkerProjectSnapshot as i,WorkerRuntimeRefreshPendingError as l,hasForcedWorkerEnvironmentAbandonment as m,be as n,readRepositoryWorkerProjectSnapshot as o,createWorkerEnvironmentErrorRecorder as p,readWorkerProjectEnvironmentRecipe as r,K as s,createWorkerProjectPreparation as t,createWorkerRuntimeRefresher as u};