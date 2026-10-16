import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { c as sha256File } from "./directory-durability-CqSvP1tc.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { t as FORCED_WORKER_ABANDONMENT_ERROR } from "./placement-record-BfcBeilz.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { c as requireGit } from "./git-DK_u9XbK.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-UY5ll8uc.mjs";
import { n as WORKSPACE_SEED_RETENTION_JS, t as WORKSPACE_SEED_RETENTION } from "./workspace-seed-retention-CLuCf_ZX.mjs";
import { i as workerProjectSeedKey, n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-4x9Itm3z.mjs";
import { t as readRepositoryWorkerProjectSnapshot } from "./repository-project-source-BDUCsCdT.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/service-contract.ts
function deriveEnvironmentIntent(idempotencyKey) {
	const digest = createHash("sha256").update(idempotencyKey).digest("hex");
	return {
		environmentId: `worker:${digest.slice(0, 32)}`,
		provisionOperationId: `provision:v2:${digest}`
	};
}
/** Canonical admission rejected the session owner, not a caller or process cancellation. */
var WorkerPlacementAdmissionTargetError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
//#endregion
//#region src/gateway/worker-environments/environment-errors.ts
var WorkerEnvironmentServiceError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
const workerEnvironmentServiceError = (code, message) => new WorkerEnvironmentServiceError(code, message);
const FORCED_ABANDONMENT_DIAGNOSTIC_PREFIX = `${FORCED_WORKER_ABANDONMENT_ERROR}; `;
function hasForcedWorkerEnvironmentAbandonment(record) {
	return record.destroyRequestedAtMs !== null && (record.lastError === "Worker result abandoned by forced operator teardown" || record.lastError?.startsWith(FORCED_ABANDONMENT_DIAGNOSTIC_PREFIX) === true);
}
function createWorkerEnvironmentErrorRecorder(store) {
	return async (record, error, assertCurrent) => {
		assertCurrent?.();
		if (record.teardownTerminalState === "failed" && record.lastError) return record;
		return store.recordError({
			environmentId: record.environmentId,
			state: record.state,
			error: hasForcedWorkerEnvironmentAbandonment(record) ? `${FORCED_ABANDONMENT_DIAGNOSTIC_PREFIX}${boundedWorkerError(error, 1024 - FORCED_ABANDONMENT_DIAGNOSTIC_PREFIX.length)}` : boundedWorkerError(error),
			assertCurrent
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-runtime-refresh.ts
var WorkerRuntimeRefreshPendingError = class extends Error {
	constructor(detail) {
		super(`Cloud worker runtime update is pending; recovery will retry when the worker is available: ${detail}`);
		this.code = "invalid_state";
	}
};
function createWorkerRuntimeRefresher(options) {
	const { store, callBootstrap, requireCurrentOwner, stopOwner, identityResolverFor } = options;
	const { ensurePendingCredential } = options.credentialBroker;
	const inFlight = /* @__PURE__ */ new Map();
	const refresh = async (record, provider, installation, signal) => {
		if (!installation || record.bootstrapReceipt && sameWorkerBuild(record.bootstrapReceipt, installation)) return;
		if (record.state !== "attached" && record.state !== "ready" && record.state !== "idle" || !record.bootstrapReceipt || !record.leaseId) throw workerEnvironmentServiceError("invalid_state", "Worker runtime refresh requires an admitted lease");
		const settled = createDeferredCore();
		const listeners = /* @__PURE__ */ new Set();
		const fact = {
			settled: settled.promise,
			onProgress: (listener) => registerListener(listeners, listener)
		};
		const reportProgress = () => notifyListeners(listeners, void 0);
		inFlight.set(record.environmentId, fact);
		try {
			const sessionId = record.state === "attached" ? record.attachedSessionIds[0] : void 0;
			let placementAuthority;
			if (record.state === "attached") {
				if (!sessionId || !options.placementStore) throw workerEnvironmentServiceError("invalid_state", "Worker runtime refresh requires its placement");
				placementAuthority = await options.placementStore.prepareWorkerRuntimeRefresh({
					sessionId,
					environmentId: record.environmentId,
					ownerEpoch: record.ownerEpoch
				});
			}
			const assertCurrent = () => {
				signal?.throwIfAborted();
				const current = requireCurrentOwner(record);
				if (options.isStopping() || current.destroyRequestedAtMs !== null) throw workerEnvironmentServiceError("invalid_state", "Worker runtime refresh owner is stopping");
				placementAuthority?.assertCurrent();
			};
			try {
				assertCurrent();
				await stopOwner(record, void 0, { assertCurrent });
				assertCurrent();
				const receipt = await callBootstrap(installation, async (timeoutSignal) => {
					const refreshSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
					assertCurrent();
					if (record.nodeDeviceId) {
						if (installation.install !== "bundle" || !options.ensureNodeWorkerBundle) throw new Error("Worker node bundle installer is unavailable");
						return options.ensureNodeWorkerBundle({
							reason: "refresh",
							environmentId: record.environmentId,
							deviceId: record.nodeDeviceId,
							artifact: installation,
							prewarm: record.profileSnapshot.executionMode !== "remote-exec",
							signal: refreshSignal,
							assertCurrent,
							onProgress: reportProgress
						});
					}
					if (!record.sshEndpoint) throw new Error("Worker runtime refresh has no transport");
					return options.bootstrapWorker({
						operationId: record.provisionOperationId,
						sshEndpoint: record.sshEndpoint,
						installation,
						resolveIdentity: identityResolverFor(record, provider, record.leaseId),
						signal: refreshSignal,
						assertCurrent
					});
				});
				assertCurrent();
				if (!sameWorkerBuild(receipt, installation)) throw new Error("Worker runtime refresh returned a mismatched build receipt");
				const refreshed = await store.refreshBootstrapReceipt({
					environmentId: record.environmentId,
					...record.state === "attached" ? {
						expectedState: record.state,
						expectedPlacementGeneration: placementAuthority.generation,
						expectedReclaimResult: placementAuthority.reclaimResult
					} : { expectedState: record.state },
					expectedOwnerEpoch: record.ownerEpoch,
					expectedNodeDeviceId: record.nodeDeviceId,
					expectedBootstrapReceipt: record.bootstrapReceipt,
					bootstrapReceipt: {
						...receipt,
						installKind: "bundle"
					},
					assertCurrent
				});
				assertCurrent();
				await ensurePendingCredential(refreshed, sessionId ?? null);
			} finally {
				placementAuthority?.release();
			}
		} finally {
			if (inFlight.get(record.environmentId) === fact) inFlight.delete(record.environmentId);
			settled.resolve();
		}
	};
	return {
		refresh,
		read: (environmentId) => inFlight.get(environmentId)
	};
}
//#endregion
//#region src/gateway/worker-environments/project-setup-script.ts
const PREPARE_PROJECT_WORKSPACE_JS = `async (input, inspectOnly = false) => {
const startedAt = performance.now();
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawn, spawnSync } = require("node:child_process");
const manifestScript = ${JSON.stringify(REMOTE_WORKSPACE_MANIFEST_JS)};
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
}`;
/** Setup runs at the final absolute paths, before enrollment or session overlays. */
function createProjectSetupScript(input, inspectOnly = false) {
	return `set -eu
node <<'PROJECT_SETUP_SCRIPT'
(${PREPARE_PROJECT_WORKSPACE_JS})(${JSON.stringify(input)}, ${inspectOnly})
  .then((result) => process.stdout.write(JSON.stringify(result ?? null)))
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
PROJECT_SETUP_SCRIPT`;
}
//#endregion
//#region src/gateway/worker-environments/project-seed-script.ts
/** Only immutable Git content and non-secret preparation metadata enter the machine image. */
function createProjectSeedScript(input) {
	return `set -eu
node <<'PROJECT_SEED_SCRIPT'
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const input = ${JSON.stringify(input)};
const retention = ${JSON.stringify(WORKSPACE_SEED_RETENTION)};
${WORKSPACE_SEED_RETENTION_JS}
const prepareWorkspace = ${input.preparation ? PREPARE_PROJECT_WORKSPACE_JS : "undefined"};
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
PROJECT_SEED_SCRIPT`;
}
//#endregion
//#region src/gateway/worker-environments/project-preparation.ts
async function readWorkerProjectSetupRecipe(project, signal) {
	const tree = await requireGit(project.root, [
		"ls-tree",
		"-z",
		project.baseCommit,
		"--",
		".openclaw/worktree-setup.sh"
	], {
		signal,
		timeoutMs: 3e4
	});
	return /^100755 blob ([a-f0-9]{40}(?:[a-f0-9]{24})?)\t\.openclaw\/worktree-setup\.sh\0$/u.exec(tree)?.[1];
}
function readWorkerProjectSnapshot(value) {
	if (value === void 0) return;
	if (isRecord(value) && value.source !== void 0) return readRepositoryWorkerProjectSnapshot(value);
	if (!isRecord(value) || typeof value.key !== "string" || !/^[a-f0-9]{64}$/u.test(value.key) || typeof value.baseCommit !== "string" || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(value.baseCommit) || value.label !== void 0 && typeof value.label !== "string" || typeof value.root !== "string" || value.root.length > 4096 || !path.isAbsolute(value.root)) throw new Error("Worker environment has an invalid project preparation snapshot");
	return {
		key: value.key,
		root: value.root,
		baseCommit: value.baseCommit,
		...value.label !== void 0 ? { label: value.label } : {}
	};
}
function createWorkerProjectPreparation(params) {
	if (!/^[A-Za-z0-9_-]{1,128}$/u.test(params.namespace)) throw new Error("Worker project preparation namespace is invalid");
	const preparation = params.preparation;
	if (preparation && (!/^[a-f0-9]{64}$/u.test(preparation.key) || !/^[a-f0-9]{64}$/u.test(preparation.cacheKey) || preparation.purpose !== "session" && preparation.purpose !== "reserve" || !Number.isSafeInteger(preparation.demandAtMs) || preparation.demandAtMs < 0 || preparation.setupRecipe !== void 0 && !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(preparation.setupRecipe))) throw new Error("Worker project preparation identity is invalid");
	if (preparation?.setupRecipe && preparation.runSetupScript !== false && !params.setupAuthorized) throw new Error("Prepared project setup requires operator.admin authorization");
	const abort = new AbortController();
	const signal = params.signal ? AbortSignal.any([abort.signal, params.signal]) : abort.signal;
	const seedKey = workerProjectSeedKey(params.project);
	const label = "source" in params.project ? normalizeCloudRepo(params.project.source.url) : params.project.label;
	let active;
	let preparedWorkspace;
	let verifiedRetained;
	const requireCurrent = () => {
		signal.throwIfAborted();
		try {
			params.requireCurrent();
		} catch (error) {
			abort.abort(error);
			throw error;
		}
	};
	const readPreparedWorkspace = (prepared) => {
		if (!preparation) throw new Error("Project preparation did not request a prepared workspace");
		const suffix = `/.openclaw-worker/prepared/${params.namespace}/${preparation.cacheKey}`;
		if (!isRecord(prepared) || typeof prepared.workspaceDir !== "string" || prepared.workspaceDir.length > 4096 || !path.posix.isAbsolute(prepared.workspaceDir) || path.posix.normalize(prepared.workspaceDir) !== prepared.workspaceDir || !prepared.workspaceDir.endsWith(`${suffix}/workspace`) || prepared.homeDir !== path.posix.join(path.posix.dirname(prepared.workspaceDir), "home") || typeof prepared.sourceManifestRef !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(prepared.sourceManifestRef) || typeof prepared.preparedManifestRef !== "string" || !/^sha256:[a-f0-9]{64}$/u.test(prepared.preparedManifestRef)) throw new Error("Prepared project returned invalid workspace identity");
		return Object.freeze({
			preparationKey: preparation.key,
			cacheKey: preparation.cacheKey,
			workspaceDir: prepared.workspaceDir,
			homeDir: prepared.homeDir,
			sourceManifestRef: prepared.sourceManifestRef,
			preparedManifestRef: prepared.preparedManifestRef
		});
	};
	const prepareSeed = async (transport) => {
		requireCurrent();
		const scriptInput = {
			namespace: params.namespace,
			seedKey,
			baseCommit: params.project.baseCommit,
			...preparation ? { preparation: {
				preparationKey: preparation.key,
				cacheKey: preparation.cacheKey,
				setupRecipe: preparation.setupRecipe,
				runSetupScript: preparation.runSetupScript
			} } : {}
		};
		const inspection = JSON.parse(await transport.runScript(createProjectSeedScript(scriptInput), signal));
		requireCurrent();
		if (!isRecord(inspection) || typeof inspection.ready !== "boolean") throw new Error("Project preparation returned invalid seed status");
		if (preparation) {
			const retained = inspection.retainedWorkspace;
			if (retained === null) verifiedRetained = null;
			else {
				if (!isRecord(retained) || typeof retained.baseCommit !== "string" || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(retained.baseCommit) || retained.baseCommit.length !== params.project.baseCommit.length) throw new Error("Project preparation returned an invalid retained Git base");
				const workspace = readPreparedWorkspace(retained);
				verifiedRetained = {
					baseCommit: retained.baseCommit,
					sourceManifestRef: workspace.sourceManifestRef,
					preparedManifestRef: workspace.preparedManifestRef
				};
			}
		}
		if (inspection.ready) return {
			seedKey,
			cacheHit: true,
			...inspection.preparedWorkspace !== void 0 ? { preparedWorkspace: readPreparedWorkspace(inspection.preparedWorkspace) } : {}
		};
		const directory = inspection.directory;
		const retainedCommit = verifiedRetained?.baseCommit;
		if (typeof directory !== "string" || directory.length > 4096 || !path.posix.isAbsolute(directory) || !directory.includes(`/.openclaw-worker/git-seeds/${params.namespace}/`) || path.posix.normalize(directory) !== directory || path.posix.basename(path.posix.dirname(directory)) !== params.namespace || !path.posix.basename(directory).startsWith(`.tmp-${seedKey}-`)) throw new Error("Project preparation returned an invalid staging directory");
		const temporaryRoot = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-project-base-"));
		try {
			requireCurrent();
			let transfer;
			if ("source" in params.project && !params.prepareRepositoryGitPack) transfer = { repository: {
				directory,
				url: params.project.source.url
			} };
			else {
				const repository = "source" in params.project ? params.project.source : void 0;
				const pack = "root" in params.project ? await prepareWorkerWorkspaceGitPack({
					root: params.project.root,
					baseCommit: params.project.baseCommit,
					...typeof retainedCommit === "string" ? { retainedCommit } : {},
					temporaryRoot,
					signal
				}) : await params.prepareRepositoryGitPack({
					temporaryRoot,
					signal
				});
				requireCurrent();
				const bytes = (await fs.stat(pack)).size;
				if (bytes > 4294967296) throw new Error("Project Git pack exceeds the workspace byte limit");
				let sha256;
				try {
					var _usingCtx$1 = _usingCtx();
					const handle = _usingCtx$1.a(await fs.open(pack, "r"));
					({digest: sha256} = await sha256File(handle, { signal }));
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					await _usingCtx$1.d();
				}
				requireCurrent();
				await transport.upload(pack, path.posix.join(directory, "base.pack"), signal);
				requireCurrent();
				transfer = { pack: {
					directory,
					bytes,
					sha256,
					...repository ? { repositoryUrl: repository.url } : typeof retainedCommit === "string" ? { retainedCommit } : {}
				} };
			}
			const installed = JSON.parse(await transport.runScript(createProjectSeedScript({
				...scriptInput,
				...transfer,
				verifiedRetained
			}), signal));
			requireCurrent();
			if (!isRecord(installed) || installed.ready !== true) throw new Error("Project checkout was not verified before capture");
			return {
				seedKey,
				cacheHit: false,
				...installed.preparedWorkspace !== void 0 ? {
					preparedWorkspace: readPreparedWorkspace(installed.preparedWorkspace),
					captureRequired: true
				} : {}
			};
		} finally {
			await fs.rm(temporaryRoot, {
				recursive: true,
				force: true
			});
		}
	};
	const prepare = async (transport) => {
		requireCurrent();
		if ("source" in params.project) {
			if (!params.revalidateRepositorySource) throw new Error("Repository project preparation has no current source authority");
			await params.revalidateRepositorySource(signal);
			requireCurrent();
		}
		if (!preparation) {
			const result = await prepareSeed(transport);
			requireCurrent();
			return result;
		}
		if (!transport.runScriptWithBudget) throw new Error("Prepared workspaces require a provider command budget");
		const result = await prepareSeed(transport);
		requireCurrent();
		if (result.preparedWorkspace) {
			preparedWorkspace = result.preparedWorkspace;
			return result;
		}
		const prepared = JSON.parse(await transport.runScriptWithBudget((timeoutMs) => createProjectSetupScript({
			namespace: params.namespace,
			seedKey,
			preparationKey: preparation.key,
			cacheKey: preparation.cacheKey,
			baseCommit: params.project.baseCommit,
			setupRecipe: preparation.setupRecipe,
			runSetupScript: preparation.runSetupScript,
			timeoutMs,
			verifiedRetained
		}), signal));
		requireCurrent();
		preparedWorkspace = readPreparedWorkspace(prepared);
		return {
			...result,
			preparedWorkspace,
			captureRequired: true
		};
	};
	return {
		getPreparedWorkspace: () => preparedWorkspace,
		project: {
			key: params.project.key,
			baseCommit: params.project.baseCommit,
			..."source" in params.project ? {} : { root: params.project.root },
			...label !== void 0 ? { label } : {},
			...preparation ? {
				preparation: {
					key: preparation.key,
					cacheKey: preparation.cacheKey,
					purpose: preparation.purpose,
					demandAtMs: preparation.demandAtMs
				},
				inspectPreparedWorkspace: async (transport) => {
					requireCurrent();
					const inspected = JSON.parse(await transport.runScript(createProjectSetupScript({
						namespace: params.namespace,
						seedKey,
						preparationKey: preparation.key,
						cacheKey: preparation.cacheKey,
						baseCommit: params.project.baseCommit,
						setupRecipe: preparation.setupRecipe,
						runSetupScript: preparation.runSetupScript
					}, true), signal));
					requireCurrent();
					if (!isRecord(inspected) || inspected.baseCommit !== params.project.baseCommit) throw new Error("Enrolled project has no matching completed workspace");
					preparedWorkspace = readPreparedWorkspace(inspected);
				}
			} : {},
			signal,
			assertCurrent: requireCurrent,
			prepare: (transport) => {
				requireCurrent();
				return active ??= prepare(transport);
			}
		},
		close: () => abort.abort(new DOMException("Project preparation operation is closed", "AbortError"))
	};
}
//#endregion
export { createWorkerRuntimeRefresher as a, hasForcedWorkerEnvironmentAbandonment as c, deriveEnvironmentIntent as d, WorkerRuntimeRefreshPendingError as i, workerEnvironmentServiceError as l, readWorkerProjectSetupRecipe as n, WorkerEnvironmentServiceError as o, readWorkerProjectSnapshot as r, createWorkerEnvironmentErrorRecorder as s, createWorkerProjectPreparation as t, WorkerPlacementAdmissionTargetError as u };
