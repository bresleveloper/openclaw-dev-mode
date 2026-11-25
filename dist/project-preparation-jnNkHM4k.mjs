import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{c as sha256File}from"./directory-durability-o_aQCRBZ.mjs";import{t as createDeferredCore}from"./deferred-QsZCoVH-.mjs";import{n as notifyListeners,r as registerListener}from"./listeners-awzYn4LE.mjs";import{t as _usingCtx}from"./usingCtx-CUVyQ_FT.mjs";import{r as resolvePreferredOpenClawTmpDir}from"./tmp-openclaw-dir-BisosRri.mjs";import{Et as _enum,Fn as object,Jn as string,Pn as number,Un as record}from"./schemas-DuCQi-Qb.mjs";import{n as readWorkerPreparation,o as resolveEnvironmentRecipe}from"./preparation-identity.schema-BKTtM6v_.mjs";import{t as normalizeCloudRepo}from"./cloud-worker-project-profiles-Bh5EGicx.mjs";import{r as assertWorkerResourceReceiptMatch}from"./session-repository-workspaces.authority-DjWwMkZY.mjs";import{i as gitMaintenanceEnvironmentExpression,r as gitMaintenanceEnvironment}from"./git-maintenance-env-CIA5le3f.mjs";import{o as requireGit}from"./git-CVwI6eYm.mjs";import{a as MAX_WORKSPACE_MANIFEST_BYTES,i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES,n as MAX_WORKSPACE_INVENTORY_ENTRIES}from"./workspace-inventory-limits-BmPI7yuU.mjs";import{t as sameWorkerBuild}from"./worker-build-identity-K5xlOZic.mjs";import{n as REMOTE_WORKSPACE_MANIFEST_JS}from"./workspace-sync-scripts-BjQz6bWQ.mjs";import{n as WORKSPACE_SEED_RETENTION_JS,t as WORKSPACE_SEED_RETENTION}from"./workspace-seed-retention-fLHaNPnl.mjs";import{i as workerProjectSeedKey,n as prepareWorkerWorkspaceGitPack}from"./workspace-git-base-Dq8W76lX.mjs";import{l as requireWorkerLeaseStatus,v as workerEnvironmentServiceError}from"./service-validation-DKzUEY1E.mjs";import{n as DEFAULT_NODE_TOOLCHAIN_SETUP_SH,r as NODE_TOOLCHAIN_INSTALL_SH}from"./node-toolchain-4ZQYlHEY.mjs";import{t as readRepositoryWorkerProjectSnapshot}from"./repository-project-source-CXsJwF_5.mjs";import path from"node:path";import fs from"node:fs/promises";
//!src/gateway/worker-environments/provider-runtime-refresh.ts
var WorkerRuntimeRefreshPendingError=class extends Error{constructor(e){super(`Cloud worker runtime update is pending; recovery will retry when the worker is available: ${e}`);this.code=`invalid_state`}};function createWorkerRuntimeRefresher(e){const{store:t,callBootstrap:n,requireCurrentOwner:r,stopOwner:i,identityResolverFor:a}=e;const{ensurePendingCredential:o}=e.credentialBroker;const s=/* @__PURE__ */ new Map;const refresh=async(c,l,u,d,f)=>{if(!u||c.bootstrapReceipt&&sameWorkerBuild(c.bootstrapReceipt,u))return;if(c.state!==`attached`&&c.state!==`ready`&&c.state!==`idle`||!c.bootstrapReceipt||!c.leaseId)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires an admitted lease`);const p=createDeferredCore();const m=/* @__PURE__ */ new Set;const h={settled:p.promise,onProgress:e=>registerListener(m,e)};const reportProgress=()=>notifyListeners(m,void 0);s.set(c.environmentId,h);try{const s=c.state===`attached`?c.attachedSessionIds[0]:void 0;let p;if(c.state===`attached`){if(!s||!e.placementStore)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh requires its placement`);p=await e.placementStore.prepareWorkerRuntimeRefresh({sessionId:s,environmentId:c.environmentId,ownerEpoch:c.ownerEpoch})}const assertCurrent=()=>{d?.throwIfAborted();f?.();const t=r(c);if(e.isStopping()||t.destroyRequestedAtMs!==null)throw workerEnvironmentServiceError(`invalid_state`,`Worker runtime refresh owner is stopping`);p?.assertCurrent()};try{await i(c,void 0,{assertCurrent});const r=await n(u,async t=>{const n=d?AbortSignal.any([d,t]):t;assertCurrent();if(c.nodeDeviceId){if(u.install!==`bundle`||!e.ensureNodeWorkerBundle)throw new Error(`Worker node bundle installer is unavailable`);return e.ensureNodeWorkerBundle({reason:`refresh`,environmentId:c.environmentId,deviceId:c.nodeDeviceId,artifact:u,prewarm:c.profileSnapshot.executionMode!==`remote-exec`,signal:n,assertCurrent,onProgress:reportProgress})}if(!c.sshEndpoint)throw new Error(`Worker runtime refresh has no transport`);return e.bootstrapWorker({operationId:c.provisionOperationId,sshEndpoint:c.sshEndpoint,installation:u,resolveIdentity:a(c,l,c.leaseId),signal:n,assertCurrent})});if(!sameWorkerBuild(r,u))throw new Error(`Worker runtime refresh returned a mismatched build receipt`);const f=await t.refreshBootstrapReceipt({environmentId:c.environmentId,...c.state===`attached`?{expectedState:c.state,expectedPlacementGeneration:p.generation,expectedReclaimResult:p.reclaimResult}:{expectedState:c.state},expectedOwnerEpoch:c.ownerEpoch,expectedNodeDeviceId:c.nodeDeviceId,expectedBootstrapReceipt:c.bootstrapReceipt,bootstrapReceipt:{...r,installKind:`bundle`},assertCurrent});await o(f,s??null)}finally{p?.release()}}finally{s.delete(c.environmentId);p.resolve()}};const resumeNodeInOperation=async(n,i)=>{i.assertCurrent();const a=t.get(n);if(!a)throw workerEnvironmentServiceError(`invalid_state`,`Worker environment is unavailable`);const o=e.providerFor(a.providerId);const s=readWorkerPreparation(a.profileSnapshot);const c=o.resumeNode;const l=a.nodeDeviceId;if(!c||!s||!l||!a.leaseId)return;const u=AbortSignal.any([i.signal,e.ownerSignal]);let d=true;const assertCurrent=()=>{u.throwIfAborted();i.assertCurrent();const t=r(a);if(!d||e.isStopping()||t.state!==a.state||![`ready`,`idle`,`attached`].includes(t.state)||t.sharedHost!==false||t.destroyRequestedAtMs!==null||t.attachedSessionIds.length!==(a.state===`attached`?1:0)||t.attachedSessionIds[0]!==a.attachedSessionIds[0])throw workerEnvironmentServiceError(`invalid_state`,`Worker node recovery owner changed`)};const f={...e.lifecycleLease(a,a.leaseId),signal:u};try{assertCurrent();await e.callProvider(n,`resume-node`,async()=>{assertCurrent();const e=await o.inspect(f);assertWorkerResourceReceiptMatch(a.resourceReceipt,e.resourceReceipt);requireWorkerLeaseStatus(e);assertCurrent();if(e.status!==`active`||e.sharedHost!==false)throw workerEnvironmentServiceError(`invalid_state`,`Worker node recovery requires an active dedicated lease`);await c({...f,deviceId:l,nodeBootstrapSha256:s.artifacts.nodeBootstrapSha256,openclawVersion:s.artifacts.openclawVersion,platform:s.target.platform,assertCurrent});assertCurrent()})}finally{d=false}};const resumeNode=(n,r)=>e.withLock(n,()=>resumeNodeInOperation(n,{...r,assertCurrent:()=>{r.assertCurrent();if(t.get(n)?.state!==`attached`)throw workerEnvironmentServiceError(`invalid_state`,`Worker node recovery requires an attached environment`)}}));return{refresh,resumeNode,resumeNodeInOperation,read:e=>s.get(e)}}
//!src/gateway/worker-environments/repository-node-requirement.generated.ts
const REPOSITORY_NODE_REQUIREMENT_SOURCE=`(() => {
var __openclawRuntimeScript=(()=>{var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __hasOwnProp=Object.prototype.hasOwnProperty;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:true})};var __copyProps=(to,from,except,desc)=>{if(from&&typeof from==="object"||typeof from==="function"){for(let key of __getOwnPropNames(from))if(!__hasOwnProp.call(to,key)&&key!==except)__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable})}return to};var __toCommonJS=mod=>__copyProps(__defProp({},"__esModule",{value:true}),mod);var runtime_script_exports={};__export(runtime_script_exports,{run:()=>resolveRepositoryNodeRequirement});function resolveRepositoryNodeRequirement(files){for(const name of[".nvmrc",".node-version"]){const value=files[name]?.split("\\n").map(line=>line.split("#",1)[0]?.trim()).find(Boolean);if(value){return value}}const tools=files[".tool-versions"]?.match(/^\\s*(?:nodejs|node)\\s+(\\S+)/mu)?.[1];if(tools){return tools}const mise=files["mise.toml"];const section=mise?.split(/^\\s*\\[tools\\][ \\t]*(?:#.*)?$/mu)[1]?.split(/^\\s*\\[/mu)[0];const node=section?.match(/^\\s*node\\s*=\\s*["']([^"']+)["']/mu)?.[1];if(node){return node}const manifest=files["package.json"];if(!manifest){return void 0}const requirement=JSON.parse(manifest)?.engines?.node;return typeof requirement==="string"&&requirement.trim()?requirement.trim():void 0}return __toCommonJS(runtime_script_exports);})();

return __openclawRuntimeScript.run;
})()`;
//!src/gateway/worker-environments/repository-node-toolchain.ts
const PREPARE_REPOSITORY_NODE_JS=`async (workspaceDir, homeDir, machineHome, reusePrepared = false) => {
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
  const requirement = (${REPOSITORY_NODE_REQUIREMENT_SOURCE})(files);
  const manifest = files["package.json"] ? JSON.parse(files["package.json"]) : {};
  const bin = path.join(homeDir, ".local", "bin");
  const recordFile = path.join(homeDir, ".local", "repository-node.json");
  const identity = JSON.stringify([requirement ?? null, manifest.packageManager ?? null, process.platform, process.arch, process.execPath]);
  if (reusePrepared) {
    try {
      const previous = JSON.parse(fs.readFileSync(recordFile, "utf8"));
      if (previous.identity === identity && Object.entries(previous.links).every(([name, target]) => {
        const link = path.join(bin, name);
        fs.accessSync(link, fs.constants.X_OK);
        return fs.readlinkSync(link) === target;
      })) return previous.setupPath;
    } catch { /* Old images and incomplete toolchains take the full preparation path. */ }
  }
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
      input: ${JSON.stringify(`${NODE_TOOLCHAIN_INSTALL_SH}\nopenclaw_install_node "$1" "$2"\n`)},
      env: { PATH: process.env.PATH, HOME: machineHome }, encoding: "utf8", timeout: 660000,
    });
    if (installed.status !== 0) throw new Error("Repository Node installation failed; check nodejs.org access, disk space and image prerequisites, then retry: " + (installed.stderr || installed.error?.message || installed.status));
    nodeBin = installed.stdout.trim();
  }
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
    // This bootstrap runs on a remote machine without OpenClaw modules. Keep its bounded
    // Dirent traversal local, and never chmod a symlink (chmod follows its target).
    const pending = [{ directory: copy, depth: 0 }];
    let count = 0;
    while (pending.length) {
      const { directory, depth } = pending.pop();
      fs.chmodSync(directory, 0o700);
      const handle = fs.opendirSync(directory);
      try {
        for (let entry = handle.readSync(); entry; entry = handle.readSync()) {
          if (++count > 100000 || depth >= 64) throw new Error("Corepack copy directory scan limit exceeded");
          if (entry.isSymbolicLink()) continue;
          const file = path.join(directory, entry.name);
          if (entry.isDirectory()) pending.push({ directory: file, depth: depth + 1 });
          else if (entry.isFile()) fs.chmodSync(file, 0o700);
        }
      } finally { handle.closeSync(); }
    }
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
  const links = Object.fromEntries(fs.readdirSync(bin).filter((name) => fs.lstatSync(path.join(bin, name)).isSymbolicLink()).map((name) => [name, fs.readlinkSync(path.join(bin, name))]));
  fs.writeFileSync(recordFile, JSON.stringify({ identity, setupPath, links }), { mode: 0o600 });
  return setupPath;
}`;
//!src/gateway/worker-environments/project-setup-script.ts
const PreparedSetupEnvironment=record(string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/u),string().max(4096).refine(e=>!e.includes(`\0`))).refine(e=>Object.keys(e).length<=32&&Buffer.byteLength(JSON.stringify(e))<=32768,`Prepared setup environment exceeds its limit`);const RUN_ENVIRONMENT_COMMAND_JS=`async (command, context) => {
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
}`;const PREPARE_PROJECT_WORKSPACE_JS=`async (input, inspectOnly = false, phaseDurationsMs = {}) => {
const startedAt = performance.now();
let phaseStart = startedAt;
const phase = (name) => { const now = performance.now(); phaseDurationsMs[name] = (phaseDurationsMs[name] ?? 0) + Math.round(now - phaseStart); phaseStart = now; };
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const manifestScript = ${JSON.stringify(REMOTE_WORKSPACE_MANIFEST_JS)};
process.umask(0o077);
const machineHome = fs.realpathSync(os.homedir());
let setupPath = process.env.PATH;
const env = { PATH: process.env.PATH, HOME: machineHome, LANG: "C.UTF-8", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: os.devNull, ...${gitMaintenanceEnvironmentExpression([[JSON.stringify(`core.hooksPath`),`os.devNull`],[JSON.stringify(`core.fsmonitor`),JSON.stringify(`false`)]])}, GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "", SSH_ASKPASS: "" };
const ownedDirectory = (parent, name, create = false) => {
  const target = path.join(parent, name);
  if (create && !fs.existsSync(target)) fs.mkdirSync(target, { mode: 0o700 });
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink() || !stat.isDirectory() || fs.realpathSync(target) !== target) throw new Error("Prepared project directory escaped its owner");
  return target;
};
const git = (root, args) => {
  // Git operations share the seed preparation budget.
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
const manifest = (root, baseCommit = input.baseCommit, priorRefs = [], manifestHome = machineHome, memoFiles = []) => {
  const result = spawnSync(process.execPath, ["-e", manifestScript, root, baseCommit, "eligible", ...priorRefs.map((ref) => ref.slice(7)), ...memoFiles.map((file) => "memo:" + file)], { env: { ...env, HOME: manifestHome }, encoding: "utf8", timeout: 600000, maxBuffer: 262144 });
  if (result.status !== 0 || !/^sha256:[a-f0-9]{64}$/.test(result.stdout.trim())) throw new Error("Prepared project manifest verification failed: " + (result.stderr?.trim() || result.error?.message || result.status));
  return result.stdout.trim();
};
const readManifest = (file, ref) => {
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.size > ${MAX_WORKSPACE_MANIFEST_BYTES}) throw new Error("Prepared project manifest is unsafe");
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
  if (value.version !== 1 || value.baseCommit !== baseCommit || !Array.isArray(value.entries) || value.entries.length > ${MAX_WORKSPACE_INVENTORY_ENTRIES}) throw new Error("Prepared project manifest is invalid");
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
  return (${RUN_ENVIRONMENT_COMMAND_JS})(command, {
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
  if (inspectOnly && !exists) { phase("inspection"); return; }
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
    // Completed worker-owned objects were checked on transfer; only new packs need fsck.
    phase("retainedGit");
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
    phase("retainedManifest");
    previous = { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, baseCommit, sourceBytes, preparedBytes, completedManifest, completionDirectory, manifestRoot };
    if (inspectOnly) { phase("inspection"); return { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, baseCommit, recipePreparation: { source: input.recipe?.source ?? (input.setupRecipe ? "script" : "none"), phaseDurationsMs } }; }
  }
  phase("inspection");
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
  phase("seedVerification");
  const sourceManifestRef = previous?.baseCommit === input.baseCommit
    ? previous.sourceManifestRef : manifest(seed, input.baseCommit, previous ? [previous.sourceManifestRef] : []);
  const sourceFile = path.join(workerRoot, "manifests", sourceManifestRef.slice(7) + ".json");
  const sourceBytes = previous?.sourceManifestRef === sourceManifestRef ? previous.sourceBytes : readManifest(sourceFile, sourceManifestRef);
  phase("seedManifest");
  const preparedRoot = ownedDirectory(ownedDirectory(workerRoot, "prepared", true), input.namespace, true);
  const directory = path.join(preparedRoot, input.cacheKey);
  const fresh = !fs.existsSync(directory);
  ownedDirectory(preparedRoot, input.cacheKey, fresh);
  if (fresh) {
    fs.mkdirSync(path.join(directory, "home"), { mode: 0o700 });
    fs.cpSync(seed, path.join(directory, "workspace"), { recursive: true, errorOnExist: true, force: false, verbatimSymlinks: true });
    // The copy has new inodes but the seed's index. A stale index makes the next forced checkout rewrite every file.
    git(path.join(directory, "workspace"), ["update-index", "-q", "--refresh"]);
  }
  const workspaceDir = ownedDirectory(directory, "workspace");
  const homeDir = ownedDirectory(directory, "home");
  const manifestRoot = ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker", fresh), "manifests", fresh);
  const completionRoot = ownedDirectory(manifestRoot, "prepared", fresh);
  const changed = previous && previous.baseCommit !== input.baseCommit;
  let skipInstall = false;
  if (changed) {
    // Invalidate the only completion witness before touching Git or running code.
    // An interrupted update cannot replay setup, even when returning to an older commit.
    fs.unlinkSync(previous.completedManifest);
    fs.rmdirSync(previous.completionDirectory);
    for (const ref of new Set([previous.sourceManifestRef, previous.preparedManifestRef])) fs.unlinkSync(path.join(manifestRoot, ref.slice(7) + ".json"));
    let linked = false;
    try {
      const seedGit = path.join(seed, ".git");
      const workspaceGit = path.join(workspaceDir, ".git");
      const sourcePacks = ownedDirectory(ownedDirectory(seedGit, "objects"), "pack");
      const targetPacks = ownedDirectory(ownedDirectory(workspaceGit, "objects"), "pack");
      const packs = fs.readdirSync(sourcePacks).filter((name) => name.endsWith(".pack"));
      if (packs.length) {
        // The seed verified new objects against the same retained base. Share immutable
        // packs instead of making fetch walk and transfer both object stores again.
        for (const pack of packs) {
          for (const name of [pack, pack.slice(0, -5) + ".idx"]) {
            try { fs.linkSync(path.join(sourcePacks, name), path.join(targetPacks, name)); }
            catch (error) { if (error.code !== "EEXIST") throw error; }
          }
        }
        const shallow = path.join(workspaceGit, "shallow");
        const boundaries = [fs.readFileSync(path.join(seedGit, "shallow"), "utf8"), fs.existsSync(shallow) ? fs.readFileSync(shallow, "utf8") : ""];
        fs.writeFileSync(shallow, [...new Set(boundaries.join("\\n").trim().split(/\\s+/))].join("\\n") + "\\n", { mode: 0o600 });
        linked = git(workspaceDir, ["rev-parse", "--verify", input.baseCommit + "^{commit}"]) === input.baseCommit;
      }
    } catch { /* Unsupported links or incomplete packs use the existing local fetch. */ }
    if (!linked) git(workspaceDir, ["fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--update-shallow", "--negotiation-tip=HEAD", seed, input.baseCommit]);
    // Content-only refreshes retain install outputs; lifecycle scripts reading other tracked files do not rerun.
    skipInstall = recipe.source === "detected" && !git(workspaceDir, ["diff", "--no-renames", "--name-only", "-z", previous.baseCommit, input.baseCommit]).split("\\0").some((file) => /(^|\\/)(package\\.json|pnpm-lock\\.yaml|pnpm-workspace\\.yaml|\\.npmrc|\\.pnpmfile\\.cjs|yarn\\.lock|\\.yarnrc(?:\\.yml)?|package-lock\\.json|npm-shrinkwrap\\.json|bun\\.lockb?|\\.nvmrc|\\.node-version|\\.tool-versions|mise\\.toml)$|(^|\\/)(patches|\\.yarn\\/(plugins|releases))\\//.test(file));
    // onCreate is not repeated for a content refresh; retain its generated artifacts.
    if (recipe.source !== "devcontainer" && !skipInstall) removeSetupOutputs(workspaceDir, previous);
    // Images captured with a stale index must not rewrite unchanged files on this forced checkout.
    git(workspaceDir, ["update-index", "-q", "--refresh"]);
    git(workspaceDir, ["checkout", "--detach", "--force", input.baseCommit]);
  } else if (!fresh && previous.sourceManifestRef !== sourceManifestRef) {
    throw new Error("Prepared project pristine baseline changed");
  }
  phase("gitUpdate");
  if (fresh || changed) setupPath = await (${PREPARE_REPOSITORY_NODE_JS})(workspaceDir, homeDir, machineHome, Boolean(changed)) ?? setupPath;
  phase("toolchainPreparation");
  const recipePreparation = { source: recipe.source, ...(recipe.ignoredPropertiesNote ? { ignoredPropertiesNote: recipe.ignoredPropertiesNote } : {}), phaseDurationsMs };
  let setupFailure;
  let captureSkipped;
  if ((fresh || changed) && input.runSetupScript !== false) {
    if (skipInstall) recipePreparation.note = "Dependency installation skipped: no dependency inputs changed";
    const phases = recipe.source === "detected"
      ? skipInstall ? [] : [["detectedInstall", recipe.detectedInstall]]
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
  phaseStart = performance.now();
  if (setupFailure) return { recipePreparation, setupFailure };
  ownedDirectory(directory, "workspace");
  ownedDirectory(directory, "home");
  ownedDirectory(ownedDirectory(homeDir, ".openclaw-worker"), "manifests");
  ownedDirectory(workspaceDir, ".git");
  if (git(workspaceDir, ["rev-parse", "HEAD"]) !== input.baseCommit) throw new Error("Prepared project setup changed its Git base");
  verifyRecipe(workspaceDir, true);
  // Keep each tree's memo in its own HOME, even when their manifest digests are identical.
  if (fresh || changed) fs.writeFileSync(path.join(manifestRoot, sourceManifestRef.slice(7) + ".json"), sourceBytes, { flag: "wx", mode: 0o600 });
  const preparedManifestRef = !fresh && !changed ? previous.preparedManifestRef : manifest(workspaceDir, input.baseCommit, [sourceManifestRef], homeDir, changed ? [path.join(manifestRoot, previous.preparedManifestRef.slice(7) + ".memo")] : []);
  const preparedBytes = !fresh && !changed ? previous.preparedBytes : readManifest(path.join(manifestRoot, preparedManifestRef.slice(7) + ".json"), preparedManifestRef);
  if (fresh || changed) {
    const completionDirectory = ownedDirectory(completionRoot, sourceManifestRef.slice(7), true);
    // Publish this content-addressed pair last. Root B/P artifacts alone cannot
    // turn an interrupted setup into a reusable completed environment.
    fs.writeFileSync(path.join(completionDirectory, preparedManifestRef.slice(7) + ".json"), preparedBytes, { flag: "wx", mode: 0o600 });
  }
  phase("preparedManifest");
  return { workspaceDir, homeDir, sourceManifestRef, preparedManifestRef, recipePreparation, ...(captureSkipped ? { captureSkipped } : {}) };
}`;function createProjectSetupScript(e,t=false){const n=e.setupEnv===void 0?void 0:PreparedSetupEnvironment.parse(e.setupEnv);return`set -eu
if [ -n "\${HOME:-}" ] && [ -L "$HOME/.openclaw-worker" ]; then
  echo 'Prepared project directory escaped its owner' >&2
  exit 1
fi
${DEFAULT_NODE_TOOLCHAIN_SETUP_SH}
node <<'PROJECT_SETUP_SCRIPT'
(${PREPARE_PROJECT_WORKSPACE_JS})(${JSON.stringify({...e,...n?{setupEnv:n}:{}})}, ${t})
  .then((result) => {
    process.stdout.write(JSON.stringify(result ?? null));
  })
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SETUP_SCRIPT`}async function runWorkerProjectLifecycle(e){const t=[];if(e.postCreate&&e.recipe.postCreate!==void 0)t.push(e.recipe.postCreate);if(e.recipe.postStart!==void 0)t.push(e.recipe.postStart);if(!t.length)return;e.assertCurrent();const n=6e5;const createScript=(r={})=>{PreparedSetupEnvironment.parse(r);return`const run = ${RUN_ENVIRONMENT_COMMAND_JS};
const startedAt = performance.now();
(async () => {
  for (const command of ${JSON.stringify(t)}) {
    await run(command, { workspaceDir: process.cwd(), homeDir: process.env.HOME, env: ${JSON.stringify({...e.recipe.env,...r})}, settleDescendants: false, timeoutMs: ${n} - (performance.now() - startedAt) });
  }
})().catch((error) => { console.error(error.message + (error.outputTail ? ": " + error.outputTail : "")); process.exitCode = 1; });`};if(e.runSetupCommand&&(!e.workspaceDir||!e.homeDir))throw new Error(`Cloud lifecycle setup requires the owned prepared workspace and HOME paths`);const r=e.runSetupCommand&&e.workspaceDir&&e.homeDir?await e.runSetupCommand({createScript,workspaceDir:e.workspaceDir,homeDir:e.homeDir,timeoutMs:n,assertCurrent:e.assertCurrent,signal:e.signal}):void 0;e.assertCurrent();const i=r??await e.tunnel.runWorkspaceCommand({argv:[`node`,`-e`,createScript()],transportRetry:`never`,assertCurrent:e.assertCurrent,timeoutMs:n,signal:e.signal});e.assertCurrent();if(i.code!==0)throw new Error(`Cloud environment lifecycle command failed: ${i.stderr||i.code}`)}
//!src/gateway/worker-environments/project-seed-script.ts
function createProjectSeedScript(e){if(e.preparation?.setupEnv)PreparedSetupEnvironment.parse(e.preparation.setupEnv);return`set -eu
if [ -n "\${HOME:-}" ] && { [ -L "$HOME/.openclaw-worker" ] || [ -L "$HOME/.openclaw-worker/git-seeds" ]; }; then
  echo 'Project seed directory escaped its owner' >&2
  exit 1
fi
${DEFAULT_NODE_TOOLCHAIN_SETUP_SH}
node <<'PROJECT_SEED_SCRIPT'
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const input = ${JSON.stringify(e)};
const retention = ${JSON.stringify(WORKSPACE_SEED_RETENTION)};
${WORKSPACE_SEED_RETENTION_JS}
const prepareWorkspace = ${e.preparation?PREPARE_PROJECT_WORKSPACE_JS:`undefined`};
const phaseDurationsMs = {};
const startedAt = performance.now();
let phaseStart = performance.now();
const phase = (name) => { const now = performance.now(); phaseDurationsMs[name] = (phaseDurationsMs[name] ?? 0) + Math.round(now - phaseStart); phaseStart = now; };
process.umask(0o077);
const env = { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(GIT_|GH_TOKEN$|GITHUB_TOKEN$)/i.test(key))), GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: os.devNull, GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "", SSH_ASKPASS: "" };
Object.assign(env, ${JSON.stringify(gitMaintenanceEnvironment())});
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
  let directory = transport?.directory;
  if (directory !== undefined) {
    if (path.dirname(directory) !== namespace || !path.basename(directory).startsWith(stagingPrefix)) throw new Error("Project staging path escaped its owner");
    ownedDirectory(namespace, directory);
  }
  try {
    phase("seedPreparation");
    const retained = input.preparation && await prepareWorkspace({ ...input, ...input.preparation }, true, phaseDurationsMs);
    input.verifiedRetained = retained ? { baseCommit: retained.baseCommit, sourceManifestRef: retained.sourceManifestRef, preparedManifestRef: retained.preparedManifestRef } : null;
    const retainedSeedKey = retained && input.projectKey ? crypto.createHash("sha256").update(input.projectKey + "\\0" + retained.baseCommit).digest("hex") : undefined;
    phaseStart = performance.now();
    const retainedWorkspace = input.preparation ? { retainedWorkspace: retained ?? null } : {};
    if (directory === undefined) {
      if (fs.existsSync(seed)) {
        ownedDirectory(namespace, seed);
        ownedDirectory(seed, path.join(seed, ".git"));
        const preparedWorkspace = retained?.baseCommit === input.baseCommit ? retained : undefined;
        if (git(seed, ["rev-parse", "--verify", "HEAD"]) !== input.baseCommit || git(seed, ["status", "--porcelain=v1", "--untracked-files=all"])) throw new Error("Prepared project seed is not pristine");
        phase("seedVerification");
        prune();
        phase("seedPreparation");
        return { ready: true, cacheHit: true, preparedWorkspace, ...retainedWorkspace };
      }
      // Provisioning serializes this lease. Discard only this project's abandoned staging.
      for (const entry of fs.readdirSync(namespace)) {
        if (!entry.startsWith(stagingPrefix)) continue;
        const stale = path.join(namespace, entry);
        ownedDirectory(namespace, stale);
        fs.rmSync(stale, { recursive: true });
      }
      directory = fs.mkdtempSync(path.join(namespace, stagingPrefix));
      phase("seedPreparation");
      if (!transport) return { ready: false, directory, ...retainedWorkspace };
    }
    const repository = path.join(directory, "repository");
    let reused = false;
    if (retainedSeedKey && retained) {
      const donor = path.join(namespace, retainedSeedKey);
      try {
        ownedDirectory(namespace, donor);
        ownedDirectory(donor, path.join(donor, ".git"));
        reused = git(donor, ["rev-parse", "--verify", "HEAD"]) === retained.baseCommit && !git(donor, ["status", "--porcelain=v1", "--untracked-files=all"]);
      } catch { /* Missing or unusable retained seeds use the fresh path. */ }
      // A failure after this move consumes the donor; the next attempt starts fresh.
      if (reused) fs.renameSync(donor, repository);
    }
    if (!reused) {
      fs.mkdirSync(repository, { mode: 0o700 });
      git(repository, ["init", "--quiet", "--object-format=" + (input.baseCommit.length === 40 ? "sha1" : "sha256"), "."]);
    }
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
      // Detached HEAD is not advertised by default; name it to negotiate the retained objects.
      git(repository, ["-c", "fetch.unpackLimit=1", "-c", "fetch.fsckObjects=true", "-c", "http.followRedirects=false", "-c", "protocol.allow=never", "-c", "protocol.https.allow=always", "fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--no-recurse-submodules", ...(reused ? ["--negotiation-tip=HEAD"] : []), repositoryUrl, input.baseCommit], undefined, networkEnv);
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
        if (!reused) git(repository, ["-c", "fetch.unpackLimit=1", "fetch", "--depth=1", "--no-tags", "--no-write-fetch-head", "--update-shallow", retained.workspaceDir, input.pack.retainedCommit]);
      }
      fs.writeFileSync(path.join(repository, ".git", "shallow"), [...new Set([input.baseCommit, input.pack.retainedCommit].filter(Boolean))].join("\\n") + "\\n", { mode: 0o600 });
      const fd = fs.openSync(pack, "r");
      try { git(repository, ["index-pack", "--strict", "--stdin", "--fix-thin"], fd); } finally { fs.closeSync(fd); }
    }
    phase("seedTransfer");
    // Session workspace binding verifies this credential-free source identity.
    if (repositoryUrl !== undefined) {
      if (reused) {
        if (git(repository, ["remote", "get-url", "origin"]) !== repositoryUrl) throw new Error("Project seed source changed");
      } else git(repository, ["remote", "add", "origin", repositoryUrl]);
    }
    if (git(repository, ["rev-parse", "--verify", input.baseCommit + "^{commit}"]) !== input.baseCommit) throw new Error("Project seed commit does not match");
    if (reused) git(repository, ["rev-list", "--objects", "--quiet", "--missing=error", input.baseCommit, "^" + retained.baseCommit]);
    else git(repository, ["fsck", "--full", "--strict", "--no-reflogs", input.baseCommit]);
    phase("seedVerification");
    if (reused) git(repository, ["update-index", "-q", "--refresh"]);
    git(repository, ["checkout", "--detach", "--force", input.baseCommit]);
    if (git(repository, ["status", "--porcelain=v1", "--untracked-files=all"])) throw new Error("Prepared project checkout is not pristine");
    fs.renameSync(repository, seed);
    prune();
    phase("seedCheckout");
    return { ready: true, cacheHit: false, ...retainedWorkspace };
  } finally { phaseStart = performance.now(); if (transport && directory !== undefined) fs.rmSync(directory, { recursive: true, force: true }); phase("seedPreparation"); }
})().then(async (result) => {
  // Only budgeted runs may execute repository code. Seed time consumes that same budget.
  if (result.ready && !result.preparedWorkspace && input.preparation && (input.preparation.timeoutMs !== undefined || (result.cacheHit === false && (!input.preparation.setupRecipe || input.preparation.runSetupScript === false)))) {
    result.preparedWorkspace = await prepareWorkspace({ ...input, ...input.preparation, ...(input.preparation.timeoutMs !== undefined ? { timeoutMs: Math.floor(input.preparation.timeoutMs - (performance.now() - startedAt)) } : { runSetupScript: false }) }, false, phaseDurationsMs);
  }
  process.stdout.write(JSON.stringify({ ...result, phaseDurationsMs }));
}).catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SEED_SCRIPT`}
//!src/gateway/worker-environments/project-preparation.ts
const RecipePreparation=object({source:_enum([`devcontainer`,`script`,`detected`,`none`]),ignoredPropertiesNote:string().optional(),note:string().optional(),phaseDurationsMs:object({retainedGit:number().int().nonnegative().optional(),retainedManifest:number().int().nonnegative().optional(),inspection:number().int().nonnegative().optional(),seedPreparation:number().int().nonnegative().optional(),seedTransfer:number().int().nonnegative().optional(),seedVerification:number().int().nonnegative().optional(),seedCheckout:number().int().nonnegative().optional(),seedManifest:number().int().nonnegative().optional(),gitUpdate:number().int().nonnegative().optional(),toolchainPreparation:number().int().nonnegative().optional(),preparedManifest:number().int().nonnegative().optional(),onCreate:number().int().nonnegative().optional(),updateContent:number().int().nonnegative().optional(),detectedInstall:number().int().nonnegative().optional()}).optional(),failure:object({reason:string(),outputTail:string().refine(e=>Buffer.byteLength(e)<=16384).optional()}).optional()});async function readWorkerProjectEnvironmentRecipe(e,t){return resolveEnvironmentRecipe(async n=>{const r=await requireGit(e.root,[`ls-tree`,`-z`,e.baseCommit,`--`,n],{signal:t,timeoutMs:3e4});const i=/^(100644|100755) blob ([a-f0-9]{40}(?:[a-f0-9]{24})?)\t[^\0]+\0$/u.exec(r);if(!i?.[2])return;const a=i[2];const o=n.endsWith(`devcontainer.json`)||n===`package.json`?await requireGit(e.root,[`cat-file`,`blob`,a],{signal:t,timeoutMs:3e4}):void 0;return{blob:a,executable:i[1]===`100755`,...o!==void 0?{content:o}:{}}})}function readWorkerProjectSnapshot(e){if(e===void 0)return;if(isRecord(e)&&e.source!==void 0)return readRepositoryWorkerProjectSnapshot(e);if(!isRecord(e)||typeof e.key!==`string`||!/^[a-f0-9]{64}$/u.test(e.key)||typeof e.baseCommit!==`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(e.baseCommit)||e.label!==void 0&&typeof e.label!==`string`||typeof e.root!==`string`||e.root.length>4096||!path.isAbsolute(e.root))throw new Error(`Worker environment has an invalid project preparation snapshot`);return{key:e.key,root:e.root,baseCommit:e.baseCommit,...e.label!==void 0?{label:e.label}:{}}}function createWorkerProjectPreparation(e){if(!/^[A-Za-z0-9_-]{1,128}$/u.test(e.namespace))throw new Error(`Worker project preparation namespace is invalid`);const t=e.preparation;if(t?.setupRecipe&&t.runSetupScript!==false&&!e.setupAuthorized)throw new Error(`Prepared project setup requires operator.admin authorization`);const n=new AbortController;const r=e.signal?AbortSignal.any([n.signal,e.signal]):n.signal;const i=workerProjectSeedKey(e.project);const a=`source`in e.project?normalizeCloudRepo(e.project.source.url):e.project.label;let o;let s;let c;let l;const u={};const collectPhases=e=>{for(const[t,n]of Object.entries(RecipePreparation.shape.phaseDurationsMs.parse(e)??{}))u[t]=(u[t]??0)+n};const readRecipePreparation=e=>{const n=RecipePreparation.parse(e??{source:t?.recipe?.source??(t?.setupRecipe?`script`:`none`)});collectPhases(n.phaseDurationsMs);return{...n,phaseDurationsMs:u}};const requireCurrent=()=>{r.throwIfAborted();try{e.requireCurrent()}catch(e){n.abort(e);throw e}};const readPreparedWorkspace=n=>{if(!t)throw new Error(`Project preparation did not request a prepared workspace`);const r=`/.openclaw-worker/prepared/${e.namespace}/${t.cacheKey}`;if(!isRecord(n)||typeof n.workspaceDir!==`string`||n.workspaceDir.length>4096||!path.posix.isAbsolute(n.workspaceDir)||path.posix.normalize(n.workspaceDir)!==n.workspaceDir||!n.workspaceDir.endsWith(`${r}/workspace`)||n.homeDir!==path.posix.join(path.posix.dirname(n.workspaceDir),`home`)||typeof n.sourceManifestRef!==`string`||!/^sha256:[a-f0-9]{64}$/u.test(n.sourceManifestRef)||typeof n.preparedManifestRef!==`string`||!/^sha256:[a-f0-9]{64}$/u.test(n.preparedManifestRef))throw new Error(`Prepared project returned invalid workspace identity`);return Object.freeze({preparationKey:t.key,cacheKey:t.cacheKey,workspaceDir:n.workspaceDir,homeDir:n.homeDir,sourceManifestRef:n.sourceManifestRef,preparedManifestRef:n.preparedManifestRef})};const d=t&&{preparationKey:t.key,cacheKey:t.cacheKey,setupRecipe:t.setupRecipe,runSetupScript:t.runSetupScript,recipe:t.recipe};const f={namespace:e.namespace,seedKey:i,baseCommit:e.project.baseCommit};const p={...f,projectKey:e.project.key,...d?{preparation:d}:{}};const prepareSeed=async n=>{requireCurrent();const runSeed=async e=>{requireCurrent();return JSON.parse(await(d&&(e.pack||e.repository)?n.runScriptWithBudget((t,n)=>createProjectSeedScript({...e,preparation:{...d,timeoutMs:t,setupEnv:n}}),r):n.runScript(createProjectSeedScript(e),r)))};const a=`source`in e.project&&!e.prepareRepositoryGitPack?{url:e.project.source.url}:void 0;const o=await runSeed({...p,...a?{repository:a}:{}});requireCurrent();if(!isRecord(o)||typeof o.ready!==`boolean`)throw new Error(`Project preparation returned invalid seed status`);collectPhases(o.phaseDurationsMs);if(t){const t=o.retainedWorkspace;if(t===null)l=null;else{if(!isRecord(t)||typeof t.baseCommit!==`string`||!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(t.baseCommit)||t.baseCommit.length!==e.project.baseCommit.length)throw new Error(`Project preparation returned an invalid retained Git base`);const n=readPreparedWorkspace(t);l={baseCommit:t.baseCommit,sourceManifestRef:n.sourceManifestRef,preparedManifestRef:n.preparedManifestRef}}}if(o.ready){c=o.preparedWorkspace;return{seedKey:i,cacheHit:o.cacheHit!==false,recipePreparation:readRecipePreparation()}}const s=o.directory;const u=l?.baseCommit;if(typeof s!==`string`||s.length>4096||!path.posix.isAbsolute(s)||!s.includes(`/.openclaw-worker/git-seeds/${e.namespace}/`)||path.posix.normalize(s)!==s||path.posix.basename(path.posix.dirname(s))!==e.namespace||!path.posix.basename(s).startsWith(`.tmp-${i}-`))throw new Error(`Project preparation returned an invalid staging directory`);const f=await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(),`openclaw-project-base-`));try{requireCurrent();const t=`source`in e.project?e.project.source:void 0;const a=`root`in e.project?await prepareWorkerWorkspaceGitPack({root:e.project.root,baseCommit:e.project.baseCommit,...typeof u===`string`?{retainedCommit:u}:{},temporaryRoot:f,signal:r}):await e.prepareRepositoryGitPack({temporaryRoot:f,signal:r,retainedCommit:u});requireCurrent();const o=(await fs.stat(a)).size;if(o>4294967296)throw new Error(`Project Git pack exceeds the workspace byte limit`);let d;try{var m=_usingCtx();const e=m.a(await fs.open(a,`r`));({digest:d}=await sha256File(e,{signal:r}))}catch(e){m.e=e}finally{await m.d()}requireCurrent();await n.upload(a,path.posix.join(s,`base.pack`),r);requireCurrent();const h={directory:s,bytes:o,sha256:d,...t?{repositoryUrl:t.url}:{},...u?{retainedCommit:u}:{}};const g=await runSeed({...p,pack:h,verifiedRetained:l});requireCurrent();if(!isRecord(g)||g.ready!==true)throw new Error(`Project checkout was not verified before capture`);collectPhases(g.phaseDurationsMs);c=g.preparedWorkspace;return{seedKey:i,cacheHit:false,recipePreparation:readRecipePreparation()}}finally{await fs.rm(f,{recursive:true,force:true})}};const prepare=async t=>{requireCurrent();if(`source`in e.project){if(!e.revalidateRepositorySource)throw new Error(`Repository project preparation has no current source authority`);await e.revalidateRepositorySource(r);requireCurrent()}if(d&&!t.runScriptWithBudget)throw new Error(`Prepared workspaces require a provider command budget`);const n=await prepareSeed(t);requireCurrent();if(!d){await t.recordRecipePreparation?.(n.recipePreparation);requireCurrent();return n}const i=c??JSON.parse(await t.runScriptWithBudget((e,t)=>createProjectSetupScript({...f,...d,timeoutMs:e,setupEnv:t,verifiedRetained:l}),r));requireCurrent();if(!isRecord(i))throw new Error(`Prepared project returned invalid setup status`);const a=c?{...RecipePreparation.parse(i.recipePreparation),phaseDurationsMs:u}:readRecipePreparation(i.recipePreparation);await t.recordRecipePreparation?.(a);requireCurrent();if(typeof i.setupFailure===`string`)throw new Error(`${i.setupFailure}${a.failure?.outputTail?`: ${a.failure.outputTail}`:``}`);s=readPreparedWorkspace(i);return{...n,preparedWorkspace:s,recipePreparation:a,...typeof i.captureSkipped===`string`?{captureSkipped:i.captureSkipped}:n.cacheHit&&l?.baseCommit===e.project.baseCommit?{}:{captureRequired:true}}};return{getPreparedWorkspace:()=>s,project:{key:e.project.key,baseCommit:e.project.baseCommit,...t?.recipe?.secretNames?{secretNames:t.recipe.secretNames}:{},...`source`in e.project?{}:{root:e.project.root},...a!==void 0?{label:a}:{},...t&&d?{preparation:{key:t.key,cacheKey:t.cacheKey,purpose:t.purpose,demandAtMs:t.demandAtMs},inspectPreparedWorkspace:async t=>{requireCurrent();const n=JSON.parse(await t.runScript(createProjectSetupScript({...f,...d},true),r));requireCurrent();if(!isRecord(n)||n.baseCommit!==e.project.baseCommit)throw new Error(`Enrolled project has no matching completed workspace`);s=readPreparedWorkspace(n);await t.recordRecipePreparation?.(readRecipePreparation(n.recipePreparation));requireCurrent()}}:{},signal:r,assertCurrent:requireCurrent,prepare:e=>{requireCurrent();return o??=prepare(e)}},close:()=>n.abort(new DOMException(`Project preparation operation is closed`,`AbortError`))}}function projectReplayIdentity(e){if(!isRecord(e))return e;const t={...e};delete t.label;if(!Object.hasOwn(t,`source`))delete t.root;return t}export{runWorkerProjectLifecycle as a,readWorkerProjectSnapshot as i,projectReplayIdentity as n,WorkerRuntimeRefreshPendingError as o,readWorkerProjectEnvironmentRecipe as r,createWorkerRuntimeRefresher as s,createWorkerProjectPreparation as t};