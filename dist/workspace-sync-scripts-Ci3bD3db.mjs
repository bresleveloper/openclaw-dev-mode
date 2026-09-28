import { t as STAGED_INPUT_GIT_PATHSPEC } from "./staged-inputs-De-HBXyz.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES, r as MAX_WORKSPACE_INVENTORY_PATH_BYTES, t as MAX_WORKSPACE_GIT_CANDIDATES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { m as WORKSPACE_STAGED_INPUT_OWNERSHIP_JS, p as WORKSPACE_PATH_EXCLUSIONS_JS, t as MAX_RECONCILIATION_ENTRIES } from "./workspace-manifest-453LPGpv.mjs";
import { _ as workspaceStatIdentity, n as MAX_WORKSPACE_HASH_MEMO_ENTRIES, t as MAX_WORKSPACE_HASH_MEMO_BYTES, u as selectWorkerWorkspaceHashMemoEntries } from "./workspace-hash-memo-R41irJvf.mjs";
//#region src/gateway/worker-environments/workspace-manifest-remote-script.ts
const REMOTE_WORKSPACE_MANIFEST_CANONICAL_JS = String.raw`function canonicalMode(type, mode) {
  if (type === "directory") return 0o700;
  if (type === "symlink") return 0o777;
  return (mode & 0o111) === 0 ? 0o644 : 0o755;
}
function canonicalEntry(entry) {
  if (entry.type === "directory") {
    return { path: entry.path, type: entry.type, mode: canonicalMode(entry.type, entry.mode) };
  }
  if (entry.type === "file") {
    return {
      path: entry.path,
      type: entry.type,
      mode: canonicalMode(entry.type, entry.mode),
      size: entry.size,
      sha256: entry.sha256,
    };
  }
  if (entry.type === "symlink") {
    return {
      path: entry.path,
      type: entry.type,
      mode: canonicalMode(entry.type, entry.mode),
      target: entry.target,
    };
  }
  fail("unsupported worker workspace manifest entry");
}
function compareManifestPaths(left, right) {
  return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}
function serializeManifest(baseCommit, entries, comparePaths = compareManifestPaths) {
  const stagedInputs = stagedInputDirectoriesFromEntries(entries);
  return JSON.stringify({
    version: 1,
    baseCommit,
    entries: entries
      .filter((entry) => !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputs)))
      .map(canonicalEntry)
      .sort(comparePaths),
  });
}`;
const REMOTE_WORKSPACE_MANIFEST_REGISTRY_JS = String.raw`function publishManifest(manifestRoot, manifest) {
  if (Buffer.byteLength(manifest) > MAX_WORKSPACE_MANIFEST_BYTES) {
    fail("worker workspace manifest exceeds its serialized byte limit");
  }
  const digest = crypto.createHash("sha256").update(manifest).digest("hex");
  const manifestPath = path.join(manifestRoot, digest + ".json");
  const temporaryPath = manifestPath + "." + process.pid + "." + crypto.randomBytes(4).toString("hex");
  fs.writeFileSync(temporaryPath, manifest, { encoding: "utf8", flag: "wx", mode: 0o600 });
  try {
    try {
      fs.linkSync(temporaryPath, manifestPath);
    } catch (error) {
      const existing = error && error.code === "EEXIST" ? fs.lstatSync(manifestPath) : null;
      if (
        !existing ||
        existing.isSymbolicLink() ||
        !existing.isFile() ||
        fs.readFileSync(manifestPath, "utf8") !== manifest
      ) {
        throw error;
      }
    }
  } finally {
    fs.rmSync(temporaryPath, { force: true });
  }
  return digest;
}
function readManifestFile(manifestPath) {
  const descriptor = fs.openSync(manifestPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const stats = fs.fstatSync(descriptor);
    if (!stats.isFile() || stats.size > MAX_WORKSPACE_MANIFEST_BYTES) {
      fail("unsafe worker workspace manifest file");
    }
    return fs.readFileSync(descriptor, "utf8");
  } finally {
    fs.closeSync(descriptor);
  }
}
function resolveManifest(manifestRoot, requestedDigest) {
  if (!/^[a-f0-9]{64}$/.test(requestedDigest || "")) fail("invalid workspace manifest digest");
  const requestedPath = path.join(manifestRoot, requestedDigest + ".json");
  try {
    fs.lstatSync(requestedPath);
    // The bounded inbound transfer remains authoritative for validating an
    // already-addressable manifest's type, size, and content digest.
    return requestedDigest;
  } catch (error) {
    if (!error || error.code !== "ENOENT") throw error;
  }

  const candidates = fs
    .readdirSync(manifestRoot)
    .filter((name) => /^[a-f0-9]{64}\.json$/.test(name))
    .map((name) => {
      try {
        return { name, mtimeMs: fs.lstatSync(path.join(manifestRoot, name)).mtimeMs };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((left, right) =>
      right.mtimeMs - left.mtimeMs || (left.name < right.name ? -1 : left.name > right.name ? 1 : 0),
    )
    .slice(0, 256);
  let scannedBytes = 0;
  for (const { name } of candidates) {
    const candidatePath = path.join(manifestRoot, name);
    let raw;
    try {
      raw = readManifestFile(candidatePath);
    } catch {
      continue;
    }
    scannedBytes += Buffer.byteLength(raw);
    if (scannedBytes > 256 * 1024 * 1024) break;
    if (crypto.createHash("sha256").update(raw).digest("hex") !== name.slice(0, -5)) continue;
    let value;
    try {
      value = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!value || value.version !== 1 || !Array.isArray(value.entries)) continue;
    let canonical;
    try {
      canonical = serializeManifest(value.baseCommit ?? null, value.entries);
    } catch {
      continue;
    }
    if (crypto.createHash("sha256").update(canonical).digest("hex") !== requestedDigest) continue;
    if (publishManifest(manifestRoot, canonical) !== requestedDigest) {
      fail("resolved workspace manifest digest mismatch");
    }
    return requestedDigest;
  }
  fail("worker workspace manifest is unavailable: " + requestedDigest);
}`;
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
String.raw`const childProcess = require("node:child_process");
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
const REMOTE_GIT_WORKSPACE_RETRY_RESET_JS = String.raw`const crypto = require("node:crypto");
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
String.raw`const childProcess = require("node:child_process");
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
const REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS = String.raw`const crypto = require("node:crypto");
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
//#region src/gateway/worker-environments/workspace-sync-setup-script.ts
const REMOTE_WORKSPACE_SETUP_SCRIPT = String.raw`set -eu
relative=$1
canonical_home=$(cd "$HOME" && pwd -P)

ensure_private_directory() {
  directory=$1
  if [ -e "$directory" ] || [ -L "$directory" ]; then
    if [ ! -d "$directory" ] || [ -L "$directory" ]; then
      printf '%s\n' 'unsafe worker workspace directory' >&2
      exit 2
    fi
  else
    mkdir "$directory"
  fi
  chmod 700 "$directory"
}

current=$canonical_home
old_ifs=$IFS
IFS=/
set -- $relative
IFS=$old_ifs
for segment in "$@"; do
  current=$current/$segment
  ensure_private_directory "$current"
done
cd "$current"
find . -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
canonical_workspace=$(pwd -P)
node -e 'process.stdout.write(JSON.stringify({tag:"openclaw-workspace-setup-v1",canonicalHome:process.argv[1],canonicalWorkspace:process.argv[2]})+"\n")' "$canonical_home" "$canonical_workspace"
`;
//#endregion
//#region src/gateway/worker-environments/workspace-sync-scripts.ts
const REMOTE_GIT_WORKSPACE_SETUP_SCRIPT = String.raw`set -eu
workspace=$1
pack=$2
base=$3
author_name=$4
author_email=$5
cd "$workspace"
if ! command -v git >/dev/null 2>&1; then
  printf '%s\n' 'git is required for a git worker workspace' >&2
  exit 2
fi
case ${"${"}#base} in
  40) git init -q . ;;
  64) git init -q --object-format=sha256 . ;;
  *) printf '%s\n' 'invalid worker git base object id' >&2; exit 2 ;;
esac
git index-pack --stdin < "$pack" >/dev/null
printf '%s\n' "$base" > .git/shallow
actual=$(git rev-parse --verify "$base^{commit}")
if [ "$actual" != "$base" ]; then
  printf '%s\n' 'worker git base does not match the synced pack' >&2
  exit 2
fi
git update-ref refs/heads/openclaw-worker "$base"
git symbolic-ref HEAD refs/heads/openclaw-worker
git read-tree "$base"
git ls-files --stage -z | node -e '
const childProcess = require("node:child_process");
const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const paths = Buffer.concat(chunks)
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .flatMap((record) => {
      const separator = record.indexOf("\t");
      return separator >= 0 && record.startsWith("160000 ") ? [record.slice(separator + 1)] : [];
    });
  if (paths.length > 0) {
    childProcess.execFileSync("git", ["update-index", "--skip-worktree", "--", ...paths]);
  }
});'
rm -f -- "$pack"
if [ -n "$author_name" ]; then git config user.name "$author_name"; fi
if [ -n "$author_email" ]; then git config user.email "$author_email"; fi
`;
function createRemoteWorkspaceManifestScript(maxHashMemoBytes = MAX_WORKSPACE_HASH_MEMO_BYTES) {
	return String.raw`const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
${WORKSPACE_PATH_EXCLUSIONS_JS}
const workspaceStatIdentity = ${workspaceStatIdentity.toString()};
const selectWorkerWorkspaceHashMemoEntries = ${selectWorkerWorkspaceHashMemoEntries.toString()};
const MAX_WORKSPACE_HASH_MEMO_ENTRIES = ${MAX_WORKSPACE_HASH_MEMO_ENTRIES};
const MAX_WORKSPACE_HASH_MEMO_BYTES = ${maxHashMemoBytes};
const root = fs.realpathSync(process.argv[1]);
${WORKSPACE_STAGED_INPUT_OWNERSHIP_JS}
const requestedBaseCommit = process.argv[2] || null;
const eligibleOnly = process.argv[3] === "eligible";
const requestedManifestDigest = process.argv[3] === "resolve" ? process.argv[4] : null;
const publishedManifestDigest = process.argv[3] === "publish" ? process.argv[4] : null;
const memoMode = process.argv.at(-1) === "memo-v1";
const priorManifestDigests = [
  ...new Set(process.argv.slice(4).filter((value) => value && value !== "memo-v1")),
];
const MAX_WORKSPACE_GIT_CANDIDATES = ${MAX_WORKSPACE_GIT_CANDIDATES};
const MAX_WORKSPACE_INVENTORY_ENTRIES = ${MAX_WORKSPACE_INVENTORY_ENTRIES};
const MAX_WORKSPACE_INVENTORY_PATH_BYTES = ${MAX_WORKSPACE_INVENTORY_PATH_BYTES};
const MAX_WORKSPACE_INVENTORY_TOTAL_BYTES = ${MAX_WORKSPACE_INVENTORY_TOTAL_BYTES};
const MAX_WORKSPACE_MANIFEST_BYTES = ${MAX_WORKSPACE_MANIFEST_BYTES};
const entriesByPath = new Map();
let inventoryPathBytes = 0;
let eligibleBytes = 0;
const usedHashMemo = new Map();
const metrics = {
  contentHashCount: 0,
  contentHashDurationMs: 0,
  memoHitCount: 0,
  memoTruncatedCount: 0,
};
const startedAt = performance.now();
function fail(message) {
  throw new Error(message);
}
function readHashMemo() {
  if (!memoMode) return new Map();
  const raw = fs.readFileSync(0, "utf8");
  if (Buffer.byteLength(raw) > MAX_WORKSPACE_HASH_MEMO_BYTES) {
    fail("workspace hash memo exceeds its byte limit");
  }
  let entries;
  try {
    entries = JSON.parse(raw);
  } catch {
    fail("invalid workspace hash memo");
  }
  if (
    !Array.isArray(entries) ||
    entries.length > MAX_WORKSPACE_HASH_MEMO_ENTRIES
  ) {
    fail("invalid workspace hash memo");
  }
  return new Map(entries);
}
const hashMemo = readHashMemo();
${REMOTE_WORKSPACE_MANIFEST_CANONICAL_JS}
function recordEntry(relative, entry) {
  if (entriesByPath.has(relative)) return;
  if (entriesByPath.size + 1 > MAX_WORKSPACE_INVENTORY_ENTRIES) {
    fail("worker workspace manifest has too many entries");
  }
  inventoryPathBytes += Buffer.byteLength(relative);
  if (inventoryPathBytes > MAX_WORKSPACE_INVENTORY_PATH_BYTES) {
    fail("worker workspace manifest paths exceed their byte limit");
  }
  eligibleBytes +=
    entry.type === "file"
      ? entry.size
      : entry.type === "symlink"
        ? Buffer.byteLength(entry.target)
        : 0;
  if (eligibleBytes > MAX_WORKSPACE_INVENTORY_TOTAL_BYTES) {
    fail("worker workspace manifest exceeds its eligible byte limit");
  }
  entriesByPath.set(relative, entry);
}
function addEntry(relative) {
  if (
    !relative ||
    path.posix.isAbsolute(relative) ||
    path.posix.normalize(relative) !== relative ||
    relative === ".." ||
    relative.startsWith("../")
  ) {
    fail("unsafe worker workspace path: " + relative);
  }
  if (isDerivedWorkspacePath(relative, isStagedInput(relative))) return;
  if (entriesByPath.has(relative)) return;
  const absolute = path.join(root, relative);
  let stats;
  try {
    stats = fs.lstatSync(absolute);
  } catch (error) {
    if (error && (error.code === "ENOENT" || error.code === "ENOTDIR")) return;
    throw error;
  }
  recordNode(relative, absolute, stats);
}
function recordNode(relative, absolute, stats) {
  const mode = stats.mode & 0o777;
  if (stats.isDirectory()) {
    recordEntry(relative, { path: relative, type: "directory", mode });
  } else if (stats.isFile()) {
    recordEntry(relative, { path: relative, type: "file", mode, size: stats.size, sha256: null });
  } else if (stats.isSymbolicLink()) {
    const target = fs.readlinkSync(absolute);
    if (target.includes("\\") || path.posix.isAbsolute(target) || path.win32.parse(target).root) {
      fail("worker workspace symlink must be portable and relative: " + relative);
    }
    const resolvedTarget = path.resolve(path.dirname(absolute), target);
    if (resolvedTarget !== root && !resolvedTarget.startsWith(root + path.sep)) {
      fail("worker workspace symlink escapes the sync root: " + relative);
    }
    recordEntry(relative, { path: relative, type: "symlink", mode, target });
  } else {
    fail("unsupported worker workspace entry: " + relative);
  }
}
function addWithParents(relative) {
  if (isDerivedWorkspacePath(relative, isStagedInput(relative))) return;
  const segments = relative.split("/");
  for (let index = 1; index < segments.length; index += 1) {
    addEntry(segments.slice(0, index).join("/"));
  }
  addEntry(relative);
}
function walk(relativeDirectory) {
  const absoluteDirectory = relativeDirectory ? path.join(root, relativeDirectory) : root;
  const names = [];
  const directory = fs.opendirSync(absoluteDirectory);
  try {
    for (;;) {
      const entry = directory.readSync();
      if (!entry) break;
      const relative = relativeDirectory ? relativeDirectory + "/" + entry.name : entry.name;
      if ((!relativeDirectory && entry.name === ".git") || isDerivedWorkspacePath(relative, isStagedInput(relative))) {
        continue;
      }
      names.push(entry.name);
      if (names.length > MAX_WORKSPACE_INVENTORY_ENTRIES) {
        fail("worker workspace directory has too many entries");
      }
    }
  } finally {
    directory.closeSync();
  }
  for (const name of names.sort()) {
    const relative = relativeDirectory ? relativeDirectory + "/" + name : name;
    const absolute = path.join(root, relative);
    const stats = fs.lstatSync(absolute);
    recordNode(relative, absolute, stats);
    if (stats.isDirectory()) {
      walk(relative);
    }
  }
}
function nulPaths(args) {
  const value = childProcess.execFileSync("git", ["-C", root, "ls-files", "-z", ...args], {
    encoding: "buffer",
    maxBuffer: MAX_WORKSPACE_INVENTORY_PATH_BYTES,
  });
  const paths = value.toString("utf8").split("\0").filter(Boolean);
  if (paths.length > MAX_WORKSPACE_GIT_CANDIDATES) {
    fail("worker workspace has too many Git path candidates");
  }
  return paths;
}
function readPriorManifestEntries(manifestRoot, digest) {
  if (!/^[a-f0-9]{64}$/.test(digest)) fail("invalid prior workspace manifest digest");
  const raw = readManifestFile(path.join(manifestRoot, digest + ".json"));
  if (crypto.createHash("sha256").update(raw).digest("hex") !== digest) {
    fail("prior workspace manifest digest mismatch");
  }
  const prior = JSON.parse(raw);
  if (
    !prior ||
    prior.version !== 1 ||
    !Array.isArray(prior.entries) ||
    prior.entries.length > MAX_WORKSPACE_INVENTORY_ENTRIES
  ) {
    fail("invalid prior workspace manifest");
  }
  return prior.entries;
}
function eligiblePaths() {
  const selected = new Set();
  let selectedPathBytes = 0;
  function addSelected(relative) {
    if (selected.has(relative)) return;
    if (selected.size + 1 > MAX_WORKSPACE_GIT_CANDIDATES) {
      fail("worker workspace has too many Git path candidates");
    }
    selectedPathBytes += Buffer.byteLength(relative) + 1;
    if (selectedPathBytes > MAX_WORKSPACE_INVENTORY_PATH_BYTES) {
      fail("worker workspace Git path candidates exceed their byte limit");
    }
    selected.add(relative);
  }
  function removeSelected(relative) {
    if (!selected.delete(relative)) return;
    selectedPathBytes -= Buffer.byteLength(relative) + 1;
  }
  for (const relative of nulPaths(["--full-name", "--cached", "--others", "--exclude-standard"])) {
    addSelected(relative);
  }
  removeSelected(".openclaw-base.pack");
  const includePath = path.join(root, ".worktreeinclude");
  const hasIncludes = fs.existsSync(includePath) && fs.lstatSync(includePath).isFile();
  const ignored = new Set(nulPaths(["--full-name", "--others", "--ignored", "--exclude-standard",
    ...(hasIncludes ? [] : ["--", ${JSON.stringify(STAGED_INPUT_GIT_PATHSPEC)}]),
  ]));
  for (const candidate of ignored) {
    if (isStagedInput(candidate)) addSelected(candidate);
  }
  if (hasIncludes) {
    // Keep standard excludes out of this query. Their union would select every
    // ignored path instead of only explicit .worktreeinclude matches.
    for (const candidate of nulPaths([
      "--full-name",
      "--others",
      "--ignored",
      "--exclude-from=" + includePath,
    ])) {
      if (ignored.has(candidate)) addSelected(candidate);
    }
  }
  for (const priorManifestDigest of priorManifestDigests) {
    const manifestRoot = path.join(process.env.HOME, ".openclaw-worker", "manifests");
    for (const entry of readPriorManifestEntries(manifestRoot, priorManifestDigest)) {
      if (!entry || typeof entry.path !== "string") fail("invalid prior workspace manifest entry");
      if (entry.path !== ".openclaw-base.pack" && !isDerivedWorkspacePath(entry.path, isStagedInput(entry.path))) {
        addSelected(entry.path);
      }
    }
  }
  const paths = [...selected].filter((relative) => !isDerivedWorkspacePath(relative, isStagedInput(relative))).sort();
  if (paths.length > MAX_WORKSPACE_GIT_CANDIDATES) {
    fail("worker workspace has too many Git path candidates");
  }
  let pathBytes = 0;
  for (const relative of paths) {
    pathBytes += Buffer.byteLength(relative) + 1;
    if (pathBytes > MAX_WORKSPACE_INVENTORY_PATH_BYTES) {
      fail("worker workspace eligible paths exceed their byte limit");
    }
  }
  return paths;
}
function assertSerializedManifestBudget(baseCommit, entries) {
  let bytes = Buffer.byteLength(JSON.stringify({ version: 1, baseCommit, entries: [] }));
  for (const [index, entry] of entries.entries()) {
    const projected =
      entry.type === "file" ? { ...entry, sha256: "0".repeat(64) } : entry;
    bytes += Buffer.byteLength(JSON.stringify(canonicalEntry(projected)));
    if (index > 0) bytes += 1;
    if (bytes > MAX_WORKSPACE_MANIFEST_BYTES) {
      fail("worker workspace manifest exceeds its serialized byte limit");
    }
  }
}
async function hashFiles(entries) {
  // Inventory file sizes can change before open; reserve their actual sizes below.
  let openedBytes = entries.reduce(
    (bytes, entry) => bytes + (entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0),
    0,
  );
  let next = 0;
  let failure;
  const controller = new AbortController();
  const stop = (error) => {
    if (!failure) {
      failure = { error };
      controller.abort(error);
    }
  };
  async function worker() {
    while (!failure && next < entries.length) {
      const entry = entries[next++];
      if (entry.type !== "file") {
        continue;
      }
      const absolute = path.join(root, entry.path);
      let handle;
      try {
        handle = await fs.promises.open(
          absolute,
          fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK,
        );
        controller.signal.throwIfAborted();
        const before = await handle.stat({ bigint: true });
        controller.signal.throwIfAborted();
        if (!before.isFile()) fail("worker workspace file changed while it was being read");
        const openedSize = Number(before.size);
        openedBytes += openedSize;
        if (openedBytes > MAX_WORKSPACE_INVENTORY_TOTAL_BYTES) {
          fail("worker workspace manifest exceeds its eligible byte limit");
        }
        const identity = workspaceStatIdentity("worker", before);
        let sha256 = hashMemo.get(identity);
        if (sha256) {
          metrics.memoHitCount += 1;
        } else {
          const hashStartedAt = performance.now();
          const hash = crypto.createHash("sha256");
          const stream = handle.createReadStream({ autoClose: false, signal: controller.signal });
          let bytes = 0;
          for await (const chunk of stream) {
            bytes += chunk.length;
            if (bytes > openedSize) fail("worker workspace file changed while it was being read");
            hash.update(chunk);
          }
          sha256 = hash.digest("hex");
          metrics.contentHashCount += 1;
          // Concurrent samples overlap; their sum is hashing effort, not wall time.
          metrics.contentHashDurationMs += performance.now() - hashStartedAt;
        }
        const after = await handle.stat({ bigint: true });
        if (workspaceStatIdentity("worker", after) !== identity) {
          fail("worker workspace file changed while it was being read");
        }
        entry.mode = Number(after.mode & 0o777n);
        entry.size = Number(after.size);
        entry.sha256 = sha256;
        usedHashMemo.set(identity, sha256);
      } catch (error) {
        stop(error);
      } finally {
        try {
          await handle?.close();
        } catch (error) {
          stop(error);
        }
      }
    }
  }
  // The standalone child cannot import the shared pool. Stop admission on the
  // first failure and join every reader before publishing or returning it.
  await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));
  if (failure) throw failure.error;
}
function ensurePrivateDirectory(directory) {
  try {
    const stats = fs.lstatSync(directory);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      fail("unsafe worker manifest directory");
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      fs.mkdirSync(directory, { mode: 0o700 });
    } else {
      throw error;
    }
  }
  fs.chmodSync(directory, 0o700);
}
${REMOTE_WORKSPACE_MANIFEST_REGISTRY_JS}
async function readPublishedManifest() {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of process.stdin) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += value.byteLength;
    if (bytes > MAX_WORKSPACE_MANIFEST_BYTES) {
      fail("published workspace manifest exceeds its byte limit");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
function preserveWindowsFileModes(entries, manifestRoot) {
  if (process.platform !== "win32" || priorManifestDigests.length === 0) return;
  const modes = new Map();
  for (const digest of priorManifestDigests) {
    for (const entry of readPriorManifestEntries(manifestRoot, digest)) {
      if (entry.type === "file" && !modes.has(entry.path)) {
        if (entry.mode !== 0o644 && entry.mode !== 0o755) {
          fail("invalid prior workspace file mode");
        }
        modes.set(entry.path, entry.mode);
      }
    }
  }
  // Windows cannot persist POSIX execute bits; the authenticated prior manifest owns them.
  for (const entry of entries) {
    if (entry.type === "file" && modes.has(entry.path)) entry.mode = modes.get(entry.path);
  }
}
async function main() {
  const workerRoot = path.join(process.env.HOME, ".openclaw-worker");
  const manifestRoot = path.join(workerRoot, "manifests");
  ensurePrivateDirectory(workerRoot);
  ensurePrivateDirectory(manifestRoot);
  if (publishedManifestDigest) {
    const manifest = await readPublishedManifest();
    if (crypto.createHash("sha256").update(manifest).digest("hex") !== publishedManifestDigest) {
      fail("published workspace manifest digest mismatch");
    }
    if (publishManifest(manifestRoot, manifest) !== publishedManifestDigest) {
      fail("published workspace manifest reference mismatch");
    }
    process.stdout.write("sha256:" + publishedManifestDigest + "\n");
    return;
  }
  if (requestedManifestDigest) {
    process.stdout.write("sha256:" + resolveManifest(manifestRoot, requestedManifestDigest) + "\n");
    return;
  }
  if (eligibleOnly) {
    for (const relative of eligiblePaths()) addWithParents(relative);
  } else {
    walk("");
  }
  const entries = [...entriesByPath.values()];
  assertSerializedManifestBudget(requestedBaseCommit, entries);
  await hashFiles(entries);
  preserveWindowsFileModes(entries, manifestRoot);
  const baseCommit = requestedBaseCommit;
  const manifest = serializeManifest(baseCommit, entries);
  const digest = publishManifest(manifestRoot, manifest);
  const manifestRef = "sha256:" + digest;
  if (memoMode) {
    const memo = selectWorkerWorkspaceHashMemoEntries(
      usedHashMemo, MAX_WORKSPACE_HASH_MEMO_ENTRIES, MAX_WORKSPACE_HASH_MEMO_BYTES,
    );
    metrics.memoTruncatedCount = usedHashMemo.size - memo.length;
    const measured = { ...metrics, totalDurationMs: performance.now() - startedAt };
    process.stdout.write(JSON.stringify({
      version: 1,
      manifestRef,
      memo,
      metrics: measured,
    }) + "\n");
  } else {
    process.stdout.write(manifestRef + "\n");
  }
}
main().catch((error) => {
  process.stderr.write(String(error && error.stack ? error.stack : error) + "\n");
  process.exitCode = 1;
});`;
}
const REMOTE_WORKSPACE_MANIFEST_JS = createRemoteWorkspaceManifestScript();
//#endregion
export { REMOTE_WORKSPACE_ACCEPTED_TRANSACTION_JS as a, REMOTE_WORKSPACE_SETUP_SCRIPT as i, REMOTE_WORKSPACE_MANIFEST_JS as n, REMOTE_GIT_WORKSPACE_RETRY_RESET_JS as o, createRemoteWorkspaceManifestScript as r, REMOTE_GIT_WORKSPACE_SETUP_SCRIPT as t };
