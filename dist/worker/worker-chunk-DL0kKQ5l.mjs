import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,l as n}from"./worker-chunk-D-pM6VZQ.mjs";import{n as r,r as i,t as a}from"./worker-chunk-D7DfxXyC.mjs";import{n as o,r as s}from"./worker-chunk-O3z06M-B.mjs";import{n as c,t as l}from"./worker-chunk-9eOBldsQ.mjs";import{B as u,C as d,N as f,O as p,P as m,_ as h}from"./worker-chunk-D2K_jjRS.mjs";import{t as g}from"./worker-chunk-CFioHTQa.mjs";import{i as _,t as v}from"./worker-chunk-D3C_QfoA.mjs";import{o as y}from"./worker-chunk-DuUytNfU.mjs";import{n as b}from"./worker-chunk-CUSFQFQE.mjs";import{n as x,t as ee}from"./worker-chunk-B4r2li-F.mjs";import{n as te,t as ne}from"./worker-chunk-593yr_j3.mjs";import{n as S,t as C}from"./worker-chunk-CJNYeQOi.mjs";import{a as w,l as re}from"./worker-chunk-BXRs6y4U.mjs";import{r as ie,t as T}from"./worker-chunk-AdMiNDz1.mjs";import{a as E,n as ae,o as D}from"./worker-chunk-BjbSxtLY.mjs";import{r as oe,t as O}from"./worker-chunk-CPNZBq_T.mjs";import{a as se,r as k,t as A}from"./worker-chunk-CnBX14k7.mjs";import{n as j,t as M}from"./worker-chunk-CZpCC6kF.mjs";import{a as N,n as P}from"./worker-chunk-Bn4Xj2XL.mjs";import F from"node:path";import{createHash as I}from"node:crypto";import L from"node:fs/promises";import{compileFunction as R}from"node:vm";function deriveEnvironmentIntent(e){let t=I(`sha256`).update(e).digest(`hex`);return{environmentId:`worker:${t.slice(0,32)}`,provisionOperationId:`provision:v2:${t}`}}var WorkerPlacementAdmissionTargetError,z=e((()=>{WorkerPlacementAdmissionTargetError=class extends Error{constructor(...e){super(...e),this.code=`invalid_state`}}}));function hasForcedWorkerEnvironmentAbandonment(e){return e.destroyRequestedAtMs!==null&&(e.lastError===`Worker result abandoned by forced operator teardown`||e.lastError?.startsWith(B)===!0)}function createWorkerEnvironmentErrorRecorder(e){return async(t,n,r)=>(r?.(),t.teardownTerminalState===`failed`&&t.lastError?t:e.recordError({environmentId:t.environmentId,state:t.state,error:hasForcedWorkerEnvironmentAbandonment(t)?`${B}${O(n,1024-B.length)}`:O(n),assertCurrent:r}))}var WorkerEnvironmentServiceError,workerEnvironmentServiceError,B,V=e((()=>{ie(),oe(),WorkerEnvironmentServiceError=class extends Error{constructor(e,t){super(t),this.code=e}},workerEnvironmentServiceError=(e,t)=>new WorkerEnvironmentServiceError(e,t),B=`${T}; `}));function createWorkerRuntimeRefresher(e){let{store:t,callBootstrap:n,requireCurrentOwner:a,stopOwner:o,identityResolverFor:s}=e,{ensurePendingCredential:c}=e.credentialBroker,u=/* @__PURE__ */ new Map;return{refresh:async(d,f,p,m)=>{if(!p||d.bootstrapReceipt&&S(d.bootstrapReceipt,p))return;if(d.state!==`attached`&&d.state!==`ready`&&d.state!==`idle`||!d.bootstrapReceipt||!d.leaseId)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires an admitted lease`);let h=l(),g=/* @__PURE__ */ new Set,_={settled:h.promise,onProgress:e=>i(g,e)},reportProgress=()=>r(g,void 0);u.set(d.environmentId,_);try{let r=d.state===`attached`?d.attachedSessionIds[0]:void 0,i;if(d.state===`attached`){if(!r||!e.placementStore)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires its placement`);i=await e.placementStore.prepareWorkerRuntimeRefresh({sessionId:r,environmentId:d.environmentId,ownerEpoch:d.ownerEpoch})}let assertCurrent=()=>{m?.throwIfAborted();let t=a(d);if(e.isStopping()||t.destroyRequestedAtMs!==null)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh owner is stopping`);i?.assertCurrent()};try{assertCurrent(),await o(d,void 0,{assertCurrent}),assertCurrent();let a=await n(p,async t=>{let n=m?AbortSignal.any([m,t]):t;if(assertCurrent(),d.nodeDeviceId){if(p.install!==`bundle`||!e.ensureNodeWorkerBundle)throw Error(`Worker node bundle installer is unavailable`);return e.ensureNodeWorkerBundle({reason:`refresh`,environmentId:d.environmentId,deviceId:d.nodeDeviceId,artifact:p,prewarm:d.profileSnapshot.executionMode!==`remote-exec`,signal:n,assertCurrent,onProgress:reportProgress})}if(!d.sshEndpoint)throw Error(`Worker runtime refresh has no transport`);return e.bootstrapWorker({operationId:d.provisionOperationId,sshEndpoint:d.sshEndpoint,installation:p,resolveIdentity:s(d,f,d.leaseId),signal:n,assertCurrent})});if(assertCurrent(),!S(a,p))throw Error(`Worker runtime refresh returned a mismatched build receipt`);let l=await t.refreshBootstrapReceipt({environmentId:d.environmentId,...d.state===`attached`?{expectedState:d.state,expectedPlacementGeneration:i.generation,expectedReclaimResult:i.reclaimResult}:{expectedState:d.state},expectedOwnerEpoch:d.ownerEpoch,expectedNodeDeviceId:d.nodeDeviceId,expectedBootstrapReceipt:d.bootstrapReceipt,bootstrapReceipt:{...a,installKind:`bundle`},assertCurrent});assertCurrent(),await c(l,r??null)}finally{i?.release()}}finally{u.get(d.environmentId)===_&&u.delete(d.environmentId),h.resolve()}},read:e=>u.get(e)}}var WorkerRuntimeRefreshPendingError,H=e((()=>{c(),a(),C(),V(),WorkerRuntimeRefreshPendingError=class extends Error{constructor(e){super(`Cloud worker runtime update is pending; recovery will retry when the worker is available: ${e}`),this.code=`invalid_state`}}})),U,W,G=e((()=>{U={maxEntries:6,maxAgeMs:2592e6,temporaryMaxAgeMs:36e5},W=String.raw`
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
}`,R(`${W}\nreturn selectWorkspaceSeedsToPrune;`)()}));function createProjectSetupScript(e,t=!1){return`set -eu
node <<'PROJECT_SETUP_SCRIPT'
(${K})(${JSON.stringify(e)}, ${t})
  .then((result) => process.stdout.write(JSON.stringify(result ?? null)))
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SETUP_SCRIPT`}var K,q=e((()=>{D(),N(),K=`async (input, inspectOnly = false) => {
const startedAt = performance.now();
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawn, spawnSync } = require("node:child_process");
const manifestScript = ${JSON.stringify(P)};
process.umask(0o077);
const machineHome = fs.realpathSync(os.homedir());
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
  if (value.version !== 1 || value.baseCommit !== baseCommit || !Array.isArray(value.entries) || value.entries.length > ${ae}) throw new Error("Prepared project manifest is invalid");
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
const runSetup = (script, workspaceDir, homeDir) => {
  // Verification and copying consume this command's budget before repository code starts.
  const timeoutMs = input.timeoutMs - (performance.now() - startedAt);
  if (!Number.isSafeInteger(input.timeoutMs) || input.timeoutMs > 2147483647 || timeoutMs <= 0) throw new Error("Prepared project command budget exhausted");
  let child;
  let timeout;
  let stderr = "";
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
    child = spawn(script, [], {
      cwd: workspaceDir,
      env: { PATH: process.env.PATH, HOME: homeDir, LANG: "C.UTF-8", OPENCLAW_SOURCE_TREE_PATH: workspaceDir, OPENCLAW_WORKTREE_PATH: workspaceDir },
      detached: true,
      stdio: ["ignore", "ignore", "pipe"],
    });
    timeout = setTimeout(() => stop("timed out within the provider command budget (" + input.timeoutMs + " ms)"), timeoutMs);
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-16384); });
    child.once("error", (error) => { failure ??= error.message; });
    // Descendants can retain stderr after the script exits. Kill them at exit,
    // then await close to prove all inherited pipes are drained before capture.
    child.once("exit", killGroup);
    child.once("close", (code) => {
      if (code !== 0 || failure) reject(new Error("Prepared project setup failed: " + (failure || stderr.trim() || "exit " + code)));
      else resolve();
    });
  }).finally(() => {
    clearTimeout(timeout);
    for (const [signal, handler] of signals) process.removeListener(signal, handler);
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
  const recipe = git(seed, ["ls-tree", input.baseCommit, "--", ".openclaw/worktree-setup.sh"]);
  const expectedRecipe = input.setupRecipe ? "100755 blob " + input.setupRecipe + "\\t.openclaw/worktree-setup.sh" : null;
  if (expectedRecipe ? recipe !== expectedRecipe : recipe.startsWith("100755 ")) throw new Error("Prepared project setup recipe differs from its admission");
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
    removeSetupOutputs(workspaceDir, previous);
    git(workspaceDir, ["fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--update-shallow", seed, input.baseCommit]);
    git(workspaceDir, ["checkout", "--detach", "--force", input.baseCommit]);
  } else if (!fresh && previous.sourceManifestRef !== sourceManifestRef) {
    throw new Error("Prepared project pristine baseline changed");
  }
  if ((fresh || changed) && input.setupRecipe && input.runSetupScript !== false) {
    const script = path.join(ownedDirectory(workspaceDir, ".openclaw"), "worktree-setup.sh");
    const stat = fs.lstatSync(script);
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o111) === 0) throw new Error("Prepared project setup is not an executable regular file");
    await runSetup(script, workspaceDir, homeDir);
  }
  ownedDirectory(directory, "workspace");
  ownedDirectory(directory, "home");
  ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker"), "manifests");
  ownedDirectory(workspaceDir, ".git");
  if (git(workspaceDir, ["rev-parse", "HEAD"]) !== input.baseCommit) throw new Error("Prepared project setup changed its Git base");
  if (input.setupRecipe) {
    const script = path.join(ownedDirectory(workspaceDir, ".openclaw"), "worktree-setup.sh");
    const stat = fs.lstatSync(script);
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o111) === 0 || git(workspaceDir, ["hash-object", "--", script]) !== input.setupRecipe) throw new Error("Prepared project setup recipe changed during setup");
  }
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
  return { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef };
}`}));function createProjectSeedScript(e){return`set -eu
node <<'PROJECT_SEED_SCRIPT'
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const input = ${JSON.stringify(e)};
const retention = ${JSON.stringify(U)};
${W}
const prepareWorkspace = ${e.preparation?K:`undefined`};
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
PROJECT_SEED_SCRIPT`}var ce=e((()=>{G(),q()})),J,Y,X,Z,Q,le=e((()=>{v(),g(),x(),J=u().min(1).max(64).refine(e=>{let t=_(e);return t.ok&&t.value===e}),Y=f().int().positive().max(2**53-1),X=d(`source`,[m({source:p(`anonymous`)}).strict(),m({source:p(`system-detected`),accountId:Y}).strict(),m({source:h([`system-configured`,`agent-override`]),profileId:u().regex(ee),accountId:Y}).strict()]),Z=m({agentId:J,provenance:m({agentId:J,createdVia:h([`operator`,`agent`,`claw`]),creatorAgentId:J.nullable(),createdAtMs:f().int().nonnegative().max(2**53-1)}).strict().nullable()}).strict().refine(e=>e.provenance===null||e.provenance.agentId===e.agentId),Q=m({key:u().regex(/^[a-f0-9]{64}$/u),baseCommit:u().regex(/^[a-f0-9]{40}$/u),source:m({kind:p(`repository`),url:u().max(2048),repositoryId:u().min(1).max(256).regex(/^[A-Za-z0-9_+/=-]+$/u),owner:m({agent:Z,identity:X}).strict()}).strict()})}));function readRepositoryWorkerProjectSnapshot(e){if(!n(e)||e.source===void 0)return;let t=Q.safeParse(e),r=t.success?t.data.source:void 0,i=r&&URL.canParse(r.url)?new URL(r.url).hostname.toLowerCase():void 0;if(Object.keys(e).some(e=>![`key`,`baseCommit`,`source`,`preparation`].includes(e))||!t.success||!i||j(t.data.source.url,i)?.url!==t.data.source.url)throw Error(`Worker environment has an invalid repository preparation snapshot`);return t.data}var $=e((()=>{t(),M(),le()}));async function readWorkerProjectSetupRecipe(e,t){let n=await re(e.root,[`ls-tree`,`-z`,e.baseCommit,`--`,`.openclaw/worktree-setup.sh`],{signal:t,timeoutMs:3e4});return/^100755 blob ([a-f0-9]{40}(?:[a-f0-9]{24})?)\t\.openclaw\/worktree-setup\.sh\0$/u.exec(n)?.[1]}function readWorkerProjectSnapshot(e){if(e!==void 0){if(n(e)&&e.source!==void 0)return readRepositoryWorkerProjectSnapshot(e);if(!n(e)||typeof e.key!=`string`||!/^[a-f0-9]{64}$/u.test(e.key)||typeof e.baseCommit!=`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(e.baseCommit)||e.label!==void 0&&typeof e.label!=`string`||typeof e.root!=`string`||e.root.length>4096||!F.isAbsolute(e.root))throw Error(`Worker environment has an invalid project preparation snapshot`);return{key:e.key,root:e.root,baseCommit:e.baseCommit,...e.label===void 0?{}:{label:e.label}}}}function createWorkerProjectPreparation(e){if(!/^[A-Za-z0-9_-]{1,128}$/u.test(e.namespace))throw Error(`Worker project preparation namespace is invalid`);let t=e.preparation;if(t&&(!/^[a-f0-9]{64}$/u.test(t.key)||!/^[a-f0-9]{64}$/u.test(t.cacheKey)||t.purpose!==`session`&&t.purpose!==`reserve`||!Number.isSafeInteger(t.demandAtMs)||t.demandAtMs<0||t.setupRecipe!==void 0&&!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(t.setupRecipe)))throw Error(`Worker project preparation identity is invalid`);if(t?.setupRecipe&&t.runSetupScript!==!1&&!e.setupAuthorized)throw Error(`Prepared project setup requires operator.admin authorization`);let r=new AbortController,i=e.signal?AbortSignal.any([r.signal,e.signal]):r.signal,a=se(e.project),o=`source`in e.project?te(e.project.source.url):e.project.label,c,l,u,requireCurrent=()=>{i.throwIfAborted();try{e.requireCurrent()}catch(e){throw r.abort(e),e}},readPreparedWorkspace=r=>{if(!t)throw Error(`Project preparation did not request a prepared workspace`);let i=`/.openclaw-worker/prepared/${e.namespace}/${t.cacheKey}`;if(!n(r)||typeof r.workspaceDir!=`string`||r.workspaceDir.length>4096||!F.posix.isAbsolute(r.workspaceDir)||F.posix.normalize(r.workspaceDir)!==r.workspaceDir||!r.workspaceDir.endsWith(`${i}/workspace`)||r.homeDir!==F.posix.join(F.posix.dirname(r.workspaceDir),`home`)||typeof r.sourceManifestRef!=`string`||!/^sha256:[a-f0-9]{64}$/u.test(r.sourceManifestRef)||typeof r.preparedManifestRef!=`string`||!/^sha256:[a-f0-9]{64}$/u.test(r.preparedManifestRef))throw Error(`Prepared project returned invalid workspace identity`);return Object.freeze({preparationKey:t.key,cacheKey:t.cacheKey,workspaceDir:r.workspaceDir,homeDir:r.homeDir,sourceManifestRef:r.sourceManifestRef,preparedManifestRef:r.preparedManifestRef})},prepareSeed=async r=>{requireCurrent();let o={namespace:e.namespace,seedKey:a,baseCommit:e.project.baseCommit,...t?{preparation:{preparationKey:t.key,cacheKey:t.cacheKey,setupRecipe:t.setupRecipe,runSetupScript:t.runSetupScript}}:{}},c=JSON.parse(await r.runScript(createProjectSeedScript(o),i));if(requireCurrent(),!n(c)||typeof c.ready!=`boolean`)throw Error(`Project preparation returned invalid seed status`);if(t){let t=c.retainedWorkspace;if(t===null)u=null;else{if(!n(t)||typeof t.baseCommit!=`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(t.baseCommit)||t.baseCommit.length!==e.project.baseCommit.length)throw Error(`Project preparation returned an invalid retained Git base`);let r=readPreparedWorkspace(t);u={baseCommit:t.baseCommit,sourceManifestRef:r.sourceManifestRef,preparedManifestRef:r.preparedManifestRef}}}if(c.ready)return{seedKey:a,cacheHit:!0,...c.preparedWorkspace===void 0?{}:{preparedWorkspace:readPreparedWorkspace(c.preparedWorkspace)}};let l=c.directory,d=u?.baseCommit;if(typeof l!=`string`||l.length>4096||!F.posix.isAbsolute(l)||!l.includes(`/.openclaw-worker/git-seeds/${e.namespace}/`)||F.posix.normalize(l)!==l||F.posix.basename(F.posix.dirname(l))!==e.namespace||!F.posix.basename(l).startsWith(`.tmp-${a}-`))throw Error(`Project preparation returned an invalid staging directory`);let f=await L.mkdtemp(F.join(s(),`openclaw-project-base-`));try{requireCurrent();let t;if(`source`in e.project&&!e.prepareRepositoryGitPack)t={repository:{directory:l,url:e.project.source.url}};else{let n=`source`in e.project?e.project.source:void 0,a=`root`in e.project?await k({root:e.project.root,baseCommit:e.project.baseCommit,...typeof d==`string`?{retainedCommit:d}:{},temporaryRoot:f,signal:i}):await e.prepareRepositoryGitPack({temporaryRoot:f,signal:i});requireCurrent();let o=(await L.stat(a)).size;if(o>4294967296)throw Error(`Project Git pack exceeds the workspace byte limit`);let s;{await using e=await L.open(a,`r`);({digest:s}=await y(e,{signal:i}))}requireCurrent(),await r.upload(a,F.posix.join(l,`base.pack`),i),requireCurrent(),t={pack:{directory:l,bytes:o,sha256:s,...n?{repositoryUrl:n.url}:typeof d==`string`?{retainedCommit:d}:{}}}}let s=JSON.parse(await r.runScript(createProjectSeedScript({...o,...t,verifiedRetained:u}),i));if(requireCurrent(),!n(s)||s.ready!==!0)throw Error(`Project checkout was not verified before capture`);return{seedKey:a,cacheHit:!1,...s.preparedWorkspace===void 0?{}:{preparedWorkspace:readPreparedWorkspace(s.preparedWorkspace),captureRequired:!0}}}finally{await L.rm(f,{recursive:!0,force:!0})}},prepare=async n=>{if(requireCurrent(),`source`in e.project){if(!e.revalidateRepositorySource)throw Error(`Repository project preparation has no current source authority`);await e.revalidateRepositorySource(i),requireCurrent()}if(!t){let e=await prepareSeed(n);return requireCurrent(),e}if(!n.runScriptWithBudget)throw Error(`Prepared workspaces require a provider command budget`);let r=await prepareSeed(n);if(requireCurrent(),r.preparedWorkspace)return l=r.preparedWorkspace,r;let o=JSON.parse(await n.runScriptWithBudget(n=>createProjectSetupScript({namespace:e.namespace,seedKey:a,preparationKey:t.key,cacheKey:t.cacheKey,baseCommit:e.project.baseCommit,setupRecipe:t.setupRecipe,runSetupScript:t.runSetupScript,timeoutMs:n,verifiedRetained:u}),i));return requireCurrent(),l=readPreparedWorkspace(o),{...r,preparedWorkspace:l,captureRequired:!0}};return{getPreparedWorkspace:()=>l,project:{key:e.project.key,baseCommit:e.project.baseCommit,...`source`in e.project?{}:{root:e.project.root},...o===void 0?{}:{label:o},...t?{preparation:{key:t.key,cacheKey:t.cacheKey,purpose:t.purpose,demandAtMs:t.demandAtMs},inspectPreparedWorkspace:async r=>{requireCurrent();let o=JSON.parse(await r.runScript(createProjectSetupScript({namespace:e.namespace,seedKey:a,preparationKey:t.key,cacheKey:t.cacheKey,baseCommit:e.project.baseCommit,setupRecipe:t.setupRecipe,runSetupScript:t.runSetupScript},!0),i));if(requireCurrent(),!n(o)||o.baseCommit!==e.project.baseCommit)throw Error(`Enrolled project has no matching completed workspace`);l=readPreparedWorkspace(o)}}:{},signal:i,assertCurrent:requireCurrent,prepare:e=>(requireCurrent(),c??=prepare(e))},close:()=>r.abort(new DOMException(`Project preparation operation is closed`,`AbortError`))}}var ue=e((()=>{t(),w(),ne(),b(),o(),ce(),q(),$(),A(),D()}));export{z as _,$ as a,createWorkerRuntimeRefresher as c,createWorkerEnvironmentErrorRecorder as d,hasForcedWorkerEnvironmentAbandonment as f,deriveEnvironmentIntent as g,WorkerPlacementAdmissionTargetError as h,readWorkerProjectSnapshot as i,H as l,workerEnvironmentServiceError as m,ue as n,readRepositoryWorkerProjectSnapshot as o,V as p,readWorkerProjectSetupRecipe as r,WorkerRuntimeRefreshPendingError as s,createWorkerProjectPreparation as t,WorkerEnvironmentServiceError as u};