import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import path from "node:path";
import { compileFunction } from "node:vm";
//#region src/media/staged-inputs.ts
const STAGED_INPUT_DIRECTORY_PREFIX = "media/inbound/openclaw-staged-";
const STAGED_INPUT_GITIGNORE = "# Raw task inputs remain private; copy outputs into the project to publish.\n*\n";
const STAGED_INPUT_GITIGNORE_SHA256 = createHash("sha256").update(STAGED_INPUT_GITIGNORE).digest("hex");
/** A producer-shaped name is only a candidate; the marker establishes ownership. */
function stagedInputPathDirectory(relativePath) {
	if (!relativePath.startsWith(STAGED_INPUT_DIRECTORY_PREFIX)) return;
	const identity = relativePath.slice(30).split("/")[0];
	return /^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/u.exec(identity)?.[0] === identity ? STAGED_INPUT_DIRECTORY_PREFIX + identity : void 0;
}
function isStagedInputPath(relativePath, directories) {
	const directory = stagedInputPathDirectory(relativePath);
	return directory !== void 0 && directories.has(directory);
}
/** Complete manifests bind the regular marker's exact bytes through their file digest. */
function stagedInputDirectoriesFromEntries(entries) {
	const directories = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const directory = stagedInputPathDirectory(entry.path);
		if (directory && entry.path === `${directory}/.gitignore` && entry.type === "file" && entry.size === 78 && entry.sha256 === STAGED_INPUT_GITIGNORE_SHA256) directories.add(directory);
	}
	return directories;
}
const STAGED_INPUT_PATHS_JS = `
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(STAGED_INPUT_DIRECTORY_PREFIX)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(STAGED_INPUT_GITIGNORE)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(STAGED_INPUT_GITIGNORE_SHA256)};
const stagedInputPathDirectory = ${stagedInputPathDirectory.toString()};
const isStagedInputPath = ${isStagedInputPath.toString()};
const stagedInputDirectoriesFromEntries = ${stagedInputDirectoriesFromEntries.toString()};`;
//#endregion
//#region src/gateway/worker-environments/workspace-inventory-limits.ts
const MAX_WORKSPACE_INVENTORY_ENTRIES = 25e4;
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = [".openclaw", "sandbox-skills"].join("/");
function isManagedSandboxSkillsPath$1(relativePath) {
	return relativePath === MATERIALIZED_SANDBOX_SKILLS_WORKSPACE || relativePath.startsWith(`${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}/`);
}
//#endregion
//#region src/gateway/worker-environments/workspace-path-exclusions.ts
const isManagedSandboxSkillsPath = isManagedSandboxSkillsPath$1;
const DERIVED_WORKSPACE_DIRECTORY_NAMES = [
	"__pycache__",
	".pytest_cache",
	".mypy_cache",
	".ruff_cache",
	"node_modules"
];
const DERIVED_WORKSPACE_FILE_NAMES = [".DS_Store"];
const DERIVED_WORKSPACE_FILE_SUFFIXES = [".pyc", ".pyo"];
const WORKER_ATTACHMENT_DIRECTORY_PREFIX = "openclaw-inbound-";
const UUID_HEX = "[0-9a-f]";
const WORKER_ATTACHMENT_DIRECTORY_PATTERN = WORKER_ATTACHMENT_DIRECTORY_PREFIX + [
	UUID_HEX.repeat(8),
	UUID_HEX.repeat(4),
	`4${UUID_HEX.repeat(3)}`,
	`[89ab]${UUID_HEX.repeat(3)}`,
	UUID_HEX.repeat(12)
].join("-");
const WORKER_ATTACHMENT_DIRECTORY_RE = new RegExp(`^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$`);
function isDerivedWorkspacePath(relativePath, retainedInput = false) {
	if (isManagedSandboxSkillsPath(relativePath)) return true;
	if (retainedInput) return false;
	return relativePath.split("/").some((segment) => WORKER_ATTACHMENT_DIRECTORY_RE.exec(segment)?.[0] === segment || DERIVED_WORKSPACE_DIRECTORY_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_SUFFIXES.some((suffix) => segment.endsWith(suffix)));
}
[
	`${MATERIALIZED_SANDBOX_SKILLS_WORKSPACE}`,
	...DERIVED_WORKSPACE_DIRECTORY_NAMES,
	...DERIVED_WORKSPACE_FILE_NAMES,
	...DERIVED_WORKSPACE_FILE_SUFFIXES.map((suffix) => `*${suffix}`)
];
const WORKSPACE_PATH_EXCLUSIONS_JS = `
${STAGED_INPUT_PATHS_JS}
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE = ${JSON.stringify(MATERIALIZED_SANDBOX_SKILLS_WORKSPACE)};
const isManagedSandboxSkillsPath = ${isManagedSandboxSkillsPath.toString()};
const DERIVED_WORKSPACE_DIRECTORY_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_DIRECTORY_NAMES)};
const DERIVED_WORKSPACE_FILE_NAMES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_NAMES)};
const DERIVED_WORKSPACE_FILE_SUFFIXES = ${JSON.stringify(DERIVED_WORKSPACE_FILE_SUFFIXES)};
const WORKER_ATTACHMENT_DIRECTORY_RE = ${WORKER_ATTACHMENT_DIRECTORY_RE.toString()};
const isDerivedWorkspacePath = ${isDerivedWorkspacePath.toString()};`;
const WORKSPACE_STAGED_INPUT_OWNERSHIP_JS = String.raw`
const stagedInputOwnership = new Map();
function isStagedInput(relativePath) {
  const directory = stagedInputPathDirectory(relativePath);
  if (!directory) return false;
  if (stagedInputOwnership.has(directory)) return stagedInputOwnership.get(directory);
  let owned = false;
  let descriptor;
  try {
    let parent = root;
    for (const segment of directory.split("/")) {
      parent = path.join(parent, segment);
      const stats = fs.lstatSync(parent);
      if (!stats.isDirectory() || stats.isSymbolicLink()) return false;
    }
    const marker = path.join(parent, ".gitignore");
    const before = fs.lstatSync(marker);
    if (!before.isFile() || before.nlink !== 1 || before.size !== STAGED_INPUT_GITIGNORE.length) return false;
    descriptor = fs.openSync(marker, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
    const opened = fs.fstatSync(descriptor);
    if (!opened.isFile() || opened.nlink !== 1 || opened.dev !== before.dev || opened.ino !== before.ino) return false;
    const bytes = Buffer.alloc(STAGED_INPUT_GITIGNORE.length + 1);
    const length = fs.readSync(descriptor, bytes, 0, bytes.length, 0);
    const after = fs.lstatSync(marker);
    owned = after.isFile() && after.nlink === 1 && after.dev === opened.dev && after.ino === opened.ino &&
      after.mtimeMs === opened.mtimeMs && after.ctimeMs === opened.ctimeMs &&
      fs.realpathSync(marker) === marker && length === STAGED_INPUT_GITIGNORE.length &&
      bytes.subarray(0, length).toString("utf8") === STAGED_INPUT_GITIGNORE;
  } catch {
    // An ignored project directory with an absent or unsafe marker is not an input.
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    stagedInputOwnership.set(directory, owned);
  }
  return owned;
}`;
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.ts
const MAX_RECONCILIATION_ENTRIES = MAX_WORKSPACE_INVENTORY_ENTRIES * 2;
//#endregion
//#region src/gateway/worker-environments/workspace-mutation-lock-remote-script.ts
const REMOTE_WORKSPACE_MUTATION_LOCK_JS = String.raw`const lockRoot = path.join(
  transactionRoot,
  ".openclaw-accepted-lock-" + workspaceKey,
);
const lockToken = crypto.randomBytes(16).toString("hex");
const lockOwner = {
  action,
  nonce,
  pid: lockOwnerPid,
  controllerPid: process.pid,
  token: lockToken,
};
const lockWait = new Int32Array(new SharedArrayBuffer(4));
const lockDeadlineMs = Date.now() + 9 * 60 * 1000;
let acquiredLock;
function encodeLockIdentity(identity) {
  return [
    identity.action,
    identity.nonce,
    identity.pid,
    identity.controllerPid,
    identity.token,
  ].join(".");
}
// Lock files are transient current-runtime state; unknown identity shapes fail closed.
function parseLockIdentity(parts) {
  if (parts.length !== 5) return null;
  const [entryAction, entryNonce, rawPid, rawControllerPid, token] = parts;
  const pid = Number(rawPid);
  const controllerPid = Number(rawControllerPid);
  if (
    !mutationActions.includes(entryAction) ||
    !/^[a-f0-9]{32}$/.test(entryNonce || "") ||
    !/^[1-9][0-9]*$/.test(rawPid || "") ||
    !Number.isSafeInteger(pid) ||
    !/^[1-9][0-9]*$/.test(rawControllerPid || "") ||
    !Number.isSafeInteger(controllerPid) ||
    (entryAction !== "receiver" && controllerPid !== pid) ||
    !/^[a-f0-9]{32}$/.test(token || "")
  ) {
    return null;
  }
  return { action: entryAction, nonce: entryNonce, pid, controllerPid, token };
}
function sameLockIdentity(left, right) {
  return (
    left.action === right.action &&
    left.nonce === right.nonce &&
    left.pid === right.pid &&
    left.controllerPid === right.controllerPid &&
    left.token === right.token
  );
}
function processIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error && error.code === "EPERM") return true;
    if (error && error.code === "ESRCH") return false;
    throw error;
  }
}
function processGroupIsAlive(pid) {
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    if (error && error.code === "EPERM") return true;
    if (error && error.code === "ESRCH") return false;
    throw error;
  }
}
function lockIdentityIsAlive(identity) {
  if (identity.action === "receiver") {
    // Receiver descendants own mutation liveness; the wrapper owns acquire/release.
    // Reclaim is safe only after both the receiver group and wrapper are dead.
    return processIsAlive(identity.pid) ||
      processGroupIsAlive(identity.pid) ||
      processIsAlive(identity.controllerPid);
  }
  return processIsAlive(identity.pid);
}
function ownerEntryName(owner) {
  return "owner." + encodeLockIdentity(owner);
}
function reclaimEntryName(owner, reclaimer) {
  return "reclaim." + encodeLockIdentity(owner) + "." + encodeLockIdentity(reclaimer);
}
function parseLockEntry(name) {
  const parts = name.split(".");
  if (parts[0] === "owner" && parts.length === 6) {
    const owner = parseLockIdentity(parts.slice(1));
    return owner ? { kind: "owner", owner } : null;
  }
  if (parts[0] === "reclaim" && parts.length === 11) {
    const owner = parseLockIdentity(parts.slice(1, 6));
    const reclaimer = parseLockIdentity(parts.slice(6));
    return owner && reclaimer ? { kind: "reclaim", owner, reclaimer } : null;
  }
  return null;
}
function readLock() {
  let directoryStats;
  let names;
  try {
    directoryStats = fs.lstatSync(lockRoot);
    names = fs.readdirSync(lockRoot);
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
  if (directoryStats.isSymbolicLink() || !directoryStats.isDirectory()) {
    throw new Error("unsafe workspace mutation lock");
  }
  if (names.length !== 1) throw new Error("invalid workspace mutation lock");
  const entry = parseLockEntry(names[0]);
  if (!entry) throw new Error("invalid workspace mutation lock owner");
  const entryPath = path.join(lockRoot, names[0]);
  try {
    const entryStats = fs.lstatSync(entryPath);
    if (entryStats.isSymbolicLink() || !entryStats.isFile()) {
      throw new Error("unsafe workspace mutation lock owner");
    }
    return { ...entry, name: names[0], entryPath, directoryStats, entryStats };
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
}
function sameLock(left, right) {
  return (
    left.kind === right.kind &&
    left.name === right.name &&
    sameInode(left.directoryStats, right.directoryStats) &&
    sameInode(left.entryStats, right.entryStats)
  );
}
function observedLockIdentity(lock) {
  return [
    lock.directoryStats.dev,
    lock.directoryStats.ino,
    lock.entryStats.dev,
    lock.entryStats.ino,
    lock.name,
  ].join(":");
}
function restoreOwnerEntry(observed) {
  const current = readLock();
  if (!current || !sameLock(current, observed)) return false;
  try {
    fs.renameSync(current.entryPath, path.join(lockRoot, ownerEntryName(current.owner)));
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
  return true;
}
function restoreAbandonedTransition(observed) {
  if (observed.kind !== "reclaim" || lockIdentityIsAlive(observed.reclaimer)) return false;
  const current = readLock();
  if (!current || !sameLock(current, observed) || lockIdentityIsAlive(current.reclaimer)) {
    return false;
  }
  return restoreOwnerEntry(current);
}
function reclaimDeadOwner(observed) {
  const current = readLock();
  if (
    !current ||
    current.kind !== "owner" ||
    !sameLock(current, observed) ||
    lockIdentityIsAlive(current.owner)
  ) {
    return false;
  }
  const claimName = reclaimEntryName(current.owner, lockOwner);
  try {
    // This sole-entry rename is the reclaim CAS. Only one dead-owner contender
    // can install its complete owner+reclaimer identity.
    fs.renameSync(current.entryPath, path.join(lockRoot, claimName));
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
  let claimed = readLock();
  if (
    !claimed ||
    claimed.kind !== "reclaim" ||
    claimed.name !== claimName ||
    !sameInode(claimed.directoryStats, current.directoryStats) ||
    !sameInode(claimed.entryStats, current.entryStats) ||
    !sameLockIdentity(claimed.owner, current.owner) ||
    !sameLockIdentity(claimed.reclaimer, lockOwner)
  ) {
    throw new Error("workspace mutation reclaim ownership changed");
  }
  let quarantined = false;
  const quarantine = lockRoot + ".stale." + process.pid + "." + lockToken;
  try {
    if (lockIdentityIsAlive(claimed.owner)) return false;
    const validated = readLock();
    if (!validated || !sameLock(validated, claimed) || lockIdentityIsAlive(validated.owner)) {
      return false;
    }
    claimed = validated;
    fs.renameSync(lockRoot, quarantine);
    quarantined = true;
    const quarantinedDirectory = fs.lstatSync(quarantine);
    const quarantinedEntry = fs.lstatSync(path.join(quarantine, claimed.name));
    if (
      !sameInode(quarantinedDirectory, claimed.directoryStats) ||
      !sameInode(quarantinedEntry, claimed.entryStats)
    ) {
      throw new Error("workspace mutation lock changed during reclamation");
    }
    removeTree(quarantine);
    return true;
  } finally {
    if (!quarantined) restoreOwnerEntry(claimed);
  }
}
function acquireWorkspaceLock() {
  const candidate = lockRoot + "." + process.pid + "." + lockToken;
  const ownerName = ownerEntryName(lockOwner);
  fs.mkdirSync(candidate, { mode: 0o700 });
  fs.writeFileSync(path.join(candidate, ownerName), "", { flag: "wx", mode: 0o600 });
  let acquired = false;
  let previousIdentity = "";
  let waitMs = 10;
  try {
    while (Date.now() < lockDeadlineMs) {
      try {
        // The owner entry is complete before this atomic namespace operation,
        // so contenders never mistake an initializing live owner for stale.
        fs.renameSync(candidate, lockRoot);
        acquired = true;
        const observed = readLock();
        if (
          !observed ||
          observed.kind !== "owner" ||
          !sameLockIdentity(observed.owner, lockOwner)
        ) {
          throw new Error("workspace mutation lock acquisition changed");
        }
        acquiredLock = observed;
        return;
      } catch (error) {
        if (!error || (error.code !== "EEXIST" && error.code !== "ENOTEMPTY")) throw error;
      }
      const observed = readLock();
      if (!observed) {
        previousIdentity = "";
        waitMs = 10;
        continue;
      }
      const identity = observedLockIdentity(observed);
      if (identity !== previousIdentity) {
        previousIdentity = identity;
        waitMs = 10;
      }
      if (observed.kind !== "owner") {
        if (restoreAbandonedTransition(observed)) continue;
      } else if (!lockIdentityIsAlive(observed.owner) && reclaimDeadOwner(observed)) {
        continue;
      }
      Atomics.wait(lockWait, 0, 0, waitMs);
      waitMs = Math.min(waitMs * 2, 500);
    }
    throw new Error("timed out waiting for workspace mutation lock");
  } finally {
    if (!acquired) removeTree(candidate);
  }
}
function releaseWorkspaceLock() {
  const current = readLock();
  if (
    !current ||
    !acquiredLock ||
    current.kind !== "owner" ||
    !sameLock(current, acquiredLock) ||
    !sameLockIdentity(current.owner, lockOwner)
  ) {
    throw new Error("workspace mutation lock ownership changed");
  }
  const validated = readLock();
  if (!validated || !sameLock(validated, current)) {
    throw new Error("workspace mutation lock changed during release");
  }
  const quarantine = lockRoot + ".released." + process.pid + "." + lockToken;
  fs.renameSync(lockRoot, quarantine);
  const quarantinedDirectory = fs.lstatSync(quarantine);
  const quarantinedEntry = fs.lstatSync(path.join(quarantine, validated.name));
  if (
    !sameInode(quarantinedDirectory, validated.directoryStats) ||
    !sameInode(quarantinedEntry, validated.entryStats)
  ) {
    throw new Error("workspace mutation lock changed during release");
  }
  removeTree(quarantine);
}`;
//#endregion
//#region src/gateway/worker-environments/workspace-mutation-remote-script.ts
const REMOTE_WORKSPACE_MUTATION_CONTEXT_JS = String.raw`const mutationActions = [
  "begin", "apply", "rollback", "recover", "commit", "settle", "receiver", "reset",
];
const workspace = process.argv[1];
const canonicalHome = process.argv[2];
const remoteRelative = process.argv[3];
const nonce = process.argv[4];
const currentHome = process.env.HOME;
if (
  !currentHome ||
  typeof workspace !== "string" ||
  typeof canonicalHome !== "string" ||
  typeof remoteRelative !== "string" ||
  !path.posix.isAbsolute(canonicalHome) ||
  path.posix.normalize(canonicalHome) !== canonicalHome ||
  path.posix.isAbsolute(remoteRelative) ||
  path.posix.normalize(remoteRelative) !== remoteRelative ||
  path.posix.join(canonicalHome, remoteRelative) !== workspace ||
  !/^[a-f0-9]{32}$/.test(nonce || "") ||
  fs.realpathSync(currentHome) !== canonicalHome
) {
  throw new Error("worker workspace mutation no longer matches its attested owner");
}
const workspaceStats = fs.lstatSync(workspace);
if (
  !workspaceStats.isDirectory() ||
  workspaceStats.isSymbolicLink() ||
  fs.realpathSync(workspace) !== workspace
) {
  throw new Error("worker workspace mutation no longer matches its attested owner");
}
const root = workspace;
const transactionRoot = path.dirname(root);
const transactionRootStats = fs.lstatSync(transactionRoot);
if (transactionRootStats.isSymbolicLink() || !transactionRootStats.isDirectory()) {
  throw new Error("unsafe workspace mutation directory");
}
const workspaceKey = crypto.createHash("sha256").update(root).digest("hex");
function removeTree(target) {
  let stats;
  try {
    stats = fs.lstatSync(target);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    fs.chmodSync(target, 0o700);
    for (const name of fs.readdirSync(target)) removeTree(path.join(target, name));
    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
}
function sameInode(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}`;
const REMOTE_WORKSPACE_RSYNC_RECEIVER_RUNTIME_JS = String.raw`const receiverArgs = process.argv.slice(receiverArgvIndex);
const receiverDestination = receiverArgs.at(-1);
if (
  receiverArgs[0] !== "--server" ||
  receiverArgs.includes("--sender") ||
  typeof receiverDestination !== "string" ||
  !path.posix.isAbsolute(receiverDestination) ||
  path.posix.normalize(receiverDestination).replace(/\/+$/, "") !== receiverTarget
) {
  throw new Error("invalid worker workspace rsync receiver command");
}
const receiver = childProcess.spawn(
  "sh",
  ["-c", 'IFS= read -r gate <&3 && [ "$gate" = open ] && exec rsync "$@"', "openclaw-rsync", ...receiverArgs],
  { detached: true, stdio: ["inherit", "inherit", "inherit", "pipe"] },
);
if (!Number.isSafeInteger(receiver.pid) || receiver.pid < 1) {
  throw new Error("worker workspace rsync receiver did not start");
}
const lockOwnerPid = receiver.pid;
${REMOTE_WORKSPACE_MUTATION_LOCK_JS}
const receiverExit = new Promise((resolve, reject) => {
  receiver.once("error", reject);
  receiver.once("close", (code, signal) => resolve({ code, signal }));
});
const gate = receiver.stdio[3];
let lockAcquired = false;
let gateOpened = false;
(async () => {
  try {
    acquireWorkspaceLock();
    lockAcquired = true;
    validateReceiverTarget();
    gateOpened = true;
    gate.end("open\n");
    const result = await receiverExit;
    const groupWait = new Int32Array(new SharedArrayBuffer(4));
    while (processGroupIsAlive(lockOwnerPid)) Atomics.wait(groupWait, 0, 0, 10);
    releaseWorkspaceLock();
    lockAcquired = false;
    if (result.signal) process.kill(process.pid, result.signal);
    process.exitCode = result.code === null ? 1 : result.code;
  } finally {
    if (!gateOpened) gate.end();
    await receiverExit.catch(() => undefined);
    if (lockAcquired) releaseWorkspaceLock();
  }
})().catch((error) => {
  process.stderr.write(String(error && error.stack ? error.stack : error) + "\n");
  process.exitCode = 1;
});`;
const REMOTE_WORKSPACE_RSYNC_RECEIVER_JS = String.raw`const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const action = "receiver";
${REMOTE_WORKSPACE_MUTATION_CONTEXT_JS}
const receiverTarget = process.argv[5];
function validateReceiverTarget() {
  if (
    typeof receiverTarget !== "string" ||
    !path.posix.isAbsolute(receiverTarget) ||
    path.posix.normalize(receiverTarget) !== receiverTarget ||
    (receiverTarget !== root && path.posix.dirname(receiverTarget) !== root)
  ) {
    throw new Error("invalid worker workspace rsync receiver target");
  }
  if (receiverTarget === root) return;
  try {
    if (fs.lstatSync(receiverTarget).isSymbolicLink()) {
      throw new Error("unsafe worker workspace rsync receiver target");
    }
  } catch (error) {
    if (!error || error.code !== "ENOENT") throw error;
  }
}
validateReceiverTarget();
const receiverArgvIndex = 6;
${REMOTE_WORKSPACE_RSYNC_RECEIVER_RUNTIME_JS}`;
String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const action = "reset";
${REMOTE_WORKSPACE_MUTATION_CONTEXT_JS}
const lockOwnerPid = process.pid;
${REMOTE_WORKSPACE_MUTATION_LOCK_JS}
${WORKSPACE_PATH_EXCLUSIONS_JS}
${WORKSPACE_STAGED_INPUT_OWNERSHIP_JS}
function clean(directory, relativeDirectory) {
  const originalMode = fs.lstatSync(directory).mode & 0o7777;
  fs.chmodSync(directory, originalMode | 0o700);
  for (const name of fs.readdirSync(directory)) {
    const relative = relativeDirectory ? relativeDirectory + "/" + name : name;
    // Match the initial rsync receiver protections exactly: retry cleanup owns
    // transferable workspace bytes, never Git metadata or derived scratch state.
    if (name === ".git" || isDerivedWorkspacePath(relative, isStagedInput(relative))) continue;
    const target = path.join(directory, name);
    const stats = fs.lstatSync(target);
    if (stats.isDirectory() && !stats.isSymbolicLink()) {
      clean(target, relative);
      if (fs.readdirSync(target).length === 0) fs.rmdirSync(target);
    } else {
      fs.unlinkSync(target);
    }
  }
  fs.chmodSync(directory, originalMode);
}
acquireWorkspaceLock();
try {
  clean(root, "");
  process.stdout.write("reset " + nonce + "\n");
} finally {
  releaseWorkspaceLock();
}`;
//#endregion
//#region src/gateway/worker-environments/workspace-accepted-remote-script.ts
const REMOTE_WORKSPACE_ACCEPTED_RSYNC_RECEIVER_JS = String.raw`const childProcess = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const action = "receiver";
${REMOTE_WORKSPACE_MUTATION_CONTEXT_JS}
const transaction = path.join(
  transactionRoot,
  ".openclaw-accepted-" + workspaceKey + "-" + nonce,
);
const receiverRoot = path.join(transaction, "next");
function validateReceiverTarget() {
  const phase = JSON.parse(fs.readFileSync(path.join(transaction, "phase.json"), "utf8"));
  if (phase.version !== 1 || phase.nonce !== nonce || phase.phase !== "begun") {
    throw new Error("invalid accepted workspace staging receiver phase");
  }
  const receiverRootStats = fs.lstatSync(receiverRoot);
  if (
    receiverRootStats.isSymbolicLink() ||
    !receiverRootStats.isDirectory() ||
    fs.realpathSync(receiverRoot) !== receiverRoot
  ) {
    throw new Error("unsafe accepted workspace staging receiver");
  }
}
validateReceiverTarget();
const receiverTarget = receiverRoot;
const receiverArgvIndex = 5;
${REMOTE_WORKSPACE_RSYNC_RECEIVER_RUNTIME_JS}`;
String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const action = process.argv[1];
const acceptedActions = ["begin", "apply", "rollback", "recover", "commit", "settle"];
const mutationActions = [...acceptedActions, "receiver", "reset"];
if (!acceptedActions.includes(action)) throw new Error("invalid accepted workspace transaction action");
const root = fs.realpathSync(process.argv[2]);
const nonce = process.argv[3];
if (!/^[a-f0-9]{32}$/.test(nonce || "")) throw new Error("invalid accepted workspace transaction");
// REMOTE_WORKSPACE_SETUP_SCRIPT creates and chmods every workspace parent for this worker.
// Keeping the transaction beside the workspace makes all live swaps same-filesystem renames.
const transactionRoot = path.dirname(root);
const transactionRootStats = fs.lstatSync(transactionRoot);
if (transactionRootStats.isSymbolicLink() || !transactionRootStats.isDirectory()) {
  throw new Error("unsafe accepted workspace transaction directory");
}
const workspaceKey = crypto.createHash("sha256").update(root).digest("hex");
const lockOwnerPid = process.pid;
const transactionPrefix = ".openclaw-accepted-" + workspaceKey + "-";
const cleanupPrefix = ".openclaw-accepted-cleanup-" + workspaceKey + "-";
const transaction = path.join(transactionRoot, transactionPrefix + nonce);
const cleanup = path.join(transactionRoot, cleanupPrefix + nonce);
const nextRoot = path.join(transaction, "next");
const backupRoot = path.join(transaction, "backup");
const pathsFile = path.join(transaction, "paths.json");
const stateFile = path.join(transaction, "state.json");
const ancestorModesFile = path.join(transaction, "ancestor-modes.json");
function isSafeRelativePath(relative) {
  return (
    typeof relative === "string" &&
    relative &&
    !relative.includes("\\") &&
    !path.posix.isAbsolute(relative) &&
    path.posix.normalize(relative) === relative &&
    relative !== "." &&
    relative !== ".." &&
    relative !== ".git" &&
    !relative.startsWith(".git/") &&
    !relative.startsWith("../")
  );
}
function parsePaths(raw) {
  const values = JSON.parse(raw);
  if (!Array.isArray(values) || values.length > ${MAX_RECONCILIATION_ENTRIES}) {
    throw new Error("invalid accepted workspace paths");
  }
  const paths = [...new Set(values)];
  for (const relative of paths) {
    if (!isSafeRelativePath(relative)) throw new Error("unsafe accepted workspace path");
  }
  const selected = new Set(paths);
  // Directory modes are canonical, so a changed directory is added, removed, or
  // replaced and all of its accepted descendants are changed and staged too.
  return paths
    .filter((relative) => {
      const segments = relative.split("/");
      for (let index = 1; index < segments.length; index += 1) {
        if (selected.has(segments.slice(0, index).join("/"))) return false;
      }
      return true;
    })
    .sort();
}
function targetPath(base, relative) {
  return path.join(base, relative);
}
function livePath(relative) {
  const segments = relative.split("/");
  let parent = root;
  for (const segment of segments.slice(0, -1)) {
    parent = path.join(parent, segment);
    const stats = fs.lstatSync(parent);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error("unsafe accepted workspace parent");
    }
  }
  return path.join(root, relative);
}
function exists(target) {
  try {
    fs.lstatSync(target);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
}
function removeTree(target) {
  let stats;
  try {
    stats = fs.lstatSync(target);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  if (stats.isDirectory() && !stats.isSymbolicLink()) {
    fs.chmodSync(target, 0o700);
    for (const name of fs.readdirSync(target)) removeTree(path.join(target, name));
    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
}
function sameInode(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
${REMOTE_WORKSPACE_MUTATION_LOCK_JS}
function readPaths() {
  return parsePaths(fs.readFileSync(pathsFile, "utf8"));
}
function readPhase(candidate, required = true) {
  let value;
  try {
    value = JSON.parse(fs.readFileSync(path.join(candidate, "phase.json"), "utf8"));
  } catch (error) {
    if (!required && error && error.code === "ENOENT") return null;
    throw error;
  }
  if (
    !value ||
    value.version !== 1 ||
    !/^[a-f0-9]{32}$/.test(value.nonce || "") ||
    !candidate.endsWith("-" + value.nonce) ||
    !["begun", "applying", "applied", "committed"].includes(value.phase)
  ) {
    throw new Error("invalid accepted workspace transaction phase");
  }
  return value.phase;
}
function transitionPhase(candidate, current, expected, next) {
  const allowed =
    (expected === null && next !== null) ||
    (expected === "begun" && next === "applying") ||
    (expected === "applying" && next === "applied") ||
    (expected === "applied" && next === "committed");
  if (current !== expected || !allowed) {
    throw new Error("invalid accepted workspace transaction phase transition");
  }
  const candidateNonce = path.basename(candidate).slice(-32);
  if (!/^[a-f0-9]{32}$/.test(candidateNonce)) {
    throw new Error("invalid accepted workspace transaction phase path");
  }
  const candidatePhase = path.join(candidate, "phase.json");
  const temporary = candidatePhase + "." + process.pid + "." + crypto.randomBytes(4).toString("hex");
  fs.writeFileSync(temporary, JSON.stringify({ version: 1, nonce: candidateNonce, phase: next }), {
    flag: "wx",
    mode: 0o600,
  });
  fs.renameSync(temporary, candidatePhase);
}
function normalizeRecoveredPhase(candidate, cleanupNamespace = false) {
  const phase = readPhase(candidate, false);
  if (phase !== null) return phase;
  const inferred = cleanupNamespace
    ? "committed"
    : exists(path.join(candidate, "applied"))
      ? "applied"
      : exists(path.join(candidate, "state.json")) ||
          exists(path.join(candidate, "ancestor-modes.json"))
        ? "applying"
        : "begun";
  // Transactions from pre-phase beta workers are normalized only while the
  // locked recovery owner is deciding their existing durable rollback state.
  transitionPhase(candidate, null, null, inferred);
  return inferred;
}
function readState(candidate) {
  const value = JSON.parse(fs.readFileSync(path.join(candidate, "state.json"), "utf8"));
  if (!Array.isArray(value) || value.length > ${MAX_RECONCILIATION_ENTRIES}) {
    throw new Error("invalid accepted workspace transaction state");
  }
  const relatives = parsePaths(JSON.stringify(value.map((entry) => entry && entry.relative)));
  if (
    relatives.length !== value.length ||
    value.some(
      (entry, index) =>
        !entry ||
        entry.relative !== relatives[index] ||
        typeof entry.hadLive !== "boolean" ||
        (entry.directoryMode !== undefined &&
          (!Number.isInteger(entry.directoryMode) ||
            entry.directoryMode < 0 ||
            entry.directoryMode > 0o7777)),
    )
  ) {
    throw new Error("invalid accepted workspace transaction state");
  }
  return value;
}
function readAncestorModes(candidate) {
  const candidateModes = path.join(candidate, "ancestor-modes.json");
  if (!exists(candidateModes)) return [];
  const value = JSON.parse(fs.readFileSync(candidateModes, "utf8"));
  if (!Array.isArray(value) || value.length > 250_000) {
    throw new Error("invalid accepted workspace ancestor modes");
  }
  const seen = new Set();
  for (const entry of value) {
    if (
      !entry ||
      (entry.relative !== "" && !isSafeRelativePath(entry.relative)) ||
      seen.has(entry.relative) ||
      !Number.isInteger(entry.mode) ||
      entry.mode < 0 ||
      entry.mode > 0o7777
    ) {
      throw new Error("invalid accepted workspace ancestor modes");
    }
    seen.add(entry.relative);
  }
  return value;
}
function writeAncestorModes(value) {
  const temporary = ancestorModesFile + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(value), { flag: "wx", mode: 0o600 });
  fs.renameSync(temporary, ancestorModesFile);
}
function ancestorPaths(paths) {
  const ancestors = new Set();
  for (const relative of paths) {
    const segments = relative.split("/");
    for (let index = 1; index < segments.length; index += 1) {
      ancestors.add(segments.slice(0, index).join("/"));
    }
  }
  if (ancestors.size + 1 > 250_000) {
    throw new Error("accepted workspace transaction has too many ancestors");
  }
  return [...ancestors].sort((left, right) => {
    const depth = left.split("/").length - right.split("/").length;
    return depth || (left < right ? -1 : left > right ? 1 : 0);
  });
}
function prepareWritableAncestors(paths) {
  // parsePaths removes descendants of changed directories, so these are all
  // unchanged live ancestors. Read every mode before mutating any permission.
  const modes = ["", ...ancestorPaths(paths)].map((relative) => {
    const target = relative ? targetPath(root, relative) : root;
    const stats = fs.lstatSync(target);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error("unsafe accepted workspace parent");
    }
    return { relative, mode: stats.mode & 0o7777 };
  });
  writeAncestorModes(modes);
  makeAncestorsWritable(modes);
  return modes;
}
function makeAncestorsWritable(modes) {
  const widened = [];
  try {
    for (const entry of modes) {
      const target = entry.relative ? targetPath(root, entry.relative) : root;
      const stats = fs.lstatSync(target);
      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw new Error("unsafe accepted workspace parent");
      }
      const currentMode = stats.mode & 0o7777;
      const writableMode = entry.mode | 0o700;
      if (currentMode !== writableMode) {
        fs.chmodSync(target, writableMode);
        widened.push(entry);
      }
    }
  } catch (error) {
    try {
      restoreAncestorModes(widened);
    } catch (restoreError) {
      const failure = new Error("accepted workspace ancestor mode rollback failed", {
        cause: error,
      });
      Object.defineProperty(failure, "restoreFailure", { value: restoreError });
      throw failure;
    }
    throw error;
  }
}
function restoreAncestorModes(modes) {
  for (const entry of [...modes].reverse()) {
    const target = entry.relative ? targetPath(root, entry.relative) : root;
    const stats = fs.lstatSync(target);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      throw new Error("unsafe accepted workspace parent");
    }
    if ((stats.mode & 0o7777) !== entry.mode) fs.chmodSync(target, entry.mode);
  }
}
function removeTransaction(candidate = transaction) {
  removeTree(candidate);
}
function restoreTransaction(candidate) {
  if (!exists(candidate)) return;
  const ancestorModes = readAncestorModes(candidate);
  makeAncestorsWritable(ancestorModes);
  const candidateState = path.join(candidate, "state.json");
  try {
    if (exists(candidateState)) {
      const candidateBackup = path.join(candidate, "backup");
      for (const entry of [...readState(candidate)].reverse()) {
        const live = livePath(entry.relative);
        const backup = targetPath(candidateBackup, entry.relative);
        if (exists(backup)) {
          removeTree(live);
          fs.renameSync(backup, live);
          if (entry.directoryMode !== undefined) fs.chmodSync(live, entry.directoryMode);
        } else if (!entry.hadLive) {
          removeTree(live);
        } else if (entry.directoryMode !== undefined && exists(live)) {
          fs.chmodSync(live, entry.directoryMode);
        }
      }
    }
  } finally {
    restoreAncestorModes(ancestorModes);
  }
  removeTransaction(candidate);
}
function recoverTransaction(candidate) {
  const phase = normalizeRecoveredPhase(candidate);
  if (phase === "committed") {
    throw new Error("committed accepted workspace transaction is outside cleanup");
  }
  restoreTransaction(candidate);
}
function recoverCleanup(candidate) {
  const phase = normalizeRecoveredPhase(candidate, true);
  if (phase === "applied") transitionPhase(candidate, phase, "applied", "committed");
  else if (phase !== "committed") throw new Error("invalid accepted workspace cleanup phase");
  removeTransaction(candidate);
}
function recoverTransactions() {
  for (const name of fs.readdirSync(transactionRoot)) {
    if (name.startsWith(cleanupPrefix) && /^[a-f0-9]{32}$/.test(name.slice(cleanupPrefix.length))) {
      recoverCleanup(path.join(transactionRoot, name));
    }
  }
  for (const name of fs.readdirSync(transactionRoot)) {
    if (
      name.startsWith(transactionPrefix) &&
      /^[a-f0-9]{32}$/.test(name.slice(transactionPrefix.length))
    ) {
      recoverTransaction(path.join(transactionRoot, name));
    }
  }
}
function writeSettlementOutcome(outcome) {
  process.stdout.write(JSON.stringify({ version: 1, outcome }) + "\n");
}
function runAction() {
  if (action === "begin") {
    const paths = parsePaths(fs.readFileSync(0, "utf8"));
    recoverTransactions();
    fs.mkdirSync(transaction, { mode: 0o700 });
    fs.mkdirSync(nextRoot, { mode: 0o700 });
    fs.mkdirSync(backupRoot, { mode: 0o700 });
    fs.writeFileSync(pathsFile, JSON.stringify(paths), { mode: 0o600 });
    transitionPhase(transaction, null, null, "begun");
    process.stdout.write(nextRoot + "\n");
    return;
  }
  if (action === "apply") {
    const phase = readPhase(transaction);
    if (phase === "applied") return;
    if (phase === "applying") {
      restoreTransaction(transaction);
      throw new Error("recovered interrupted accepted workspace apply");
    }
    if (phase !== "begun") throw new Error("accepted workspace transaction cannot be applied");
    transitionPhase(transaction, phase, "begun", "applying");
    const paths = readPaths();
    try {
      const ancestorModes = prepareWritableAncestors(paths);
      const state = paths.map((relative) => {
        const live = livePath(relative);
        if (!exists(live)) return { relative, hadLive: false };
        const stats = fs.lstatSync(live);
        return {
          relative,
          hadLive: true,
          ...(stats.isDirectory() && !stats.isSymbolicLink()
            ? { directoryMode: stats.mode & 0o7777 }
            : {}),
        };
      });
      const temporaryStateFile = stateFile + ".tmp";
      fs.writeFileSync(temporaryStateFile, JSON.stringify(state), { flag: "wx", mode: 0o600 });
      fs.renameSync(temporaryStateFile, stateFile);
      for (const entry of state) {
        if (!entry.hadLive) continue;
        const source = livePath(entry.relative);
        const sourceStats = fs.lstatSync(source);
        const destination = targetPath(backupRoot, entry.relative);
        fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
        try {
          if (sourceStats.isDirectory() && !sourceStats.isSymbolicLink()) {
            fs.chmodSync(source, 0o700);
          }
          fs.renameSync(source, destination);
        } catch (error) {
          if (entry.directoryMode !== undefined && exists(source)) {
            fs.chmodSync(source, entry.directoryMode);
          }
          throw error;
        }
      }
      for (const entry of state) {
        const source = targetPath(nextRoot, entry.relative);
        if (exists(source)) fs.renameSync(source, livePath(entry.relative));
      }
      restoreAncestorModes(ancestorModes);
      transitionPhase(transaction, "applying", "applying", "applied");
    } catch (error) {
      restoreTransaction(transaction);
      throw error;
    }
    return;
  }
  if (action === "rollback") {
    if (exists(cleanup)) {
      if (exists(transaction)) throw new Error("ambiguous accepted workspace transaction state");
      const cleanupPhase = normalizeRecoveredPhase(cleanup, true);
      if (cleanupPhase !== "applied" && cleanupPhase !== "committed") {
        throw new Error("accepted workspace cleanup cannot be rolled back");
      }
      fs.renameSync(cleanup, transaction);
      restoreTransaction(transaction);
    } else if (exists(transaction)) {
      recoverTransaction(transaction);
    }
    return;
  }
  if (action === "recover") {
    recoverTransactions();
    return;
  }
  if (action === "settle") {
    if (exists(transaction) && exists(cleanup)) {
      throw new Error("ambiguous accepted workspace transaction state");
    }
    if (exists(cleanup)) {
      const phase = normalizeRecoveredPhase(cleanup, true);
      if (phase === "applied") transitionPhase(cleanup, phase, "applied", "committed");
      else if (phase !== "committed") throw new Error("invalid accepted workspace cleanup phase");
      writeSettlementOutcome("committed");
      return;
    }
    if (!exists(transaction)) {
      writeSettlementOutcome("rolled-back");
      return;
    }
    const phase = normalizeRecoveredPhase(transaction);
    if (phase === "applied") {
      writeSettlementOutcome("applied");
      return;
    }
    if (phase === "applying") {
      restoreTransaction(transaction);
      writeSettlementOutcome("rolled-back");
      return;
    }
    if (phase === "begun") {
      writeSettlementOutcome("begun");
      return;
    }
    throw new Error("invalid accepted workspace settlement phase");
  }
  if (action === "commit") {
    if (exists(transaction) && exists(cleanup)) {
      throw new Error("ambiguous accepted workspace transaction state");
    }
    if (exists(cleanup)) {
      const phase = readPhase(cleanup);
      if (phase === "applied") transitionPhase(cleanup, phase, "applied", "committed");
      else if (phase !== "committed") throw new Error("accepted workspace cleanup is not committed");
    } else if (exists(transaction)) {
      const phase = readPhase(transaction);
      if (phase !== "applied") throw new Error("accepted workspace transaction is not applied");
      // The namespace rename is the commit point. Later recovery removes the backup
      // only after the gateway has had a chance to observe this command's success.
      fs.renameSync(transaction, cleanup);
      transitionPhase(cleanup, phase, "applied", "committed");
    }
    return;
  }
  throw new Error("invalid accepted workspace transaction action");
}
// Every mutating action and SSH-loss settlement shares this remote owner lock;
// a disconnected gateway can never overlap rollback with the live apply process.
acquireWorkspaceLock();
try {
  runAction();
} finally {
  releaseWorkspaceLock();
}`;
//#endregion
//#region src/worker/workspace-rsync-receiver.ts
const FIXED_DESTINATION = "openclaw-rsync-destination";
const [mode, encodedContext, nonce, ...receiverArgs] = process.argv.slice(2);
if (!/^(?:workspace-root|git-pack|accepted-next)$/u.test(mode ?? "") || !/^[A-Za-z0-9_-]+$/u.test(encodedContext ?? "") || !/^[a-f0-9]{32}$/u.test(nonce ?? "") || receiverArgs.at(-1) !== FIXED_DESTINATION) throw new Error("invalid worker workspace rsync receiver invocation");
const contextBytes = Buffer.from(encodedContext, "base64url");
const context = JSON.parse(contextBytes.toString("utf8"));
if (contextBytes.toString("base64url") !== encodedContext || !Array.isArray(context) || context.length !== 3 || !context.every((value) => typeof value === "string")) throw new Error("invalid worker workspace rsync receiver context");
const [workspace, canonicalHome, remoteRelative] = context;
const receiverMode = mode;
const receiverNonce = nonce;
const receiverTarget = receiverMode === "git-pack" ? path.posix.join(workspace, ".openclaw-base.pack") : receiverMode === "accepted-next" ? path.posix.join(path.posix.dirname(workspace), `.openclaw-accepted-${createHash("sha256").update(workspace).digest("hex")}-${receiverNonce}`, "next") : workspace;
process.argv = [
	process.argv[0],
	workspace,
	canonicalHome,
	remoteRelative,
	receiverNonce,
	...receiverMode === "accepted-next" ? [] : [receiverTarget],
	...receiverArgs.with(receiverArgs.length - 1, receiverTarget)
];
compileFunction(receiverMode === "accepted-next" ? REMOTE_WORKSPACE_ACCEPTED_RSYNC_RECEIVER_JS : REMOTE_WORKSPACE_RSYNC_RECEIVER_JS, ["require"])(createRequire(import.meta.url));
//#endregion
export {};
