import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { r as resolveOpenClawPackageRootSync } from "../../openclaw-root-CBoxhfke.mjs";
import { n as createLazyPromise } from "../../lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { w as root } from "../../fs-safe-BUXBSN-4.mjs";
import { _ as redactSensitiveText } from "../../redact-DJ8j6ADa.mjs";
import { r as resolveStateDir } from "../../state-dir-BHJORNly.mjs";
import "../../paths-DGIwWbpu.mjs";
import { t as PROCESS_NODE_VERSION_CHECK } from "../../node-version-DdJ6cN09.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as VERSION } from "../../version-BJGPJZu6.mjs";
import { i as runCommandWithTimeout } from "../../exec-DJvyCA0D.mjs";
import { t as resolveNpmJsonEntries } from "../../npm-json-output-Z3qrSjbB.mjs";
import { r as isExactSemverVersion } from "../../npm-registry-spec-Dw2vyAJw.mjs";
import { c as sha256File } from "../../directory-durability-CqSvP1tc.mjs";
import { t as _usingCtx } from "../../usingCtx-DwOBYOJf.mjs";
import { pc as validateWorkerAdmissionHandshake } from "../../src-l2dWvEsN.mjs";
import "../../worker-admission-CNeLWzVQ.mjs";
import { i as WORKER_BUNDLE_MANIFEST_VERSION, n as WORKER_BUNDLE_CHUNK_PATH_PATTERN, o as compareWorkerBundlePaths, s as hashWorkerBundleManifest, t as WORKER_BUNDLE_ARTIFACT_PATHS } from "../../worker-bundle-hash-drgRPFuP.mjs";
import { t as DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS } from "../../worker-bundle-limits-CF239rpc.mjs";
import { n as readWorkerBundleArchiveManifest } from "../../worker-bundle-archive-wzW8sYwP.mjs";
import { t as resolveSecretRefString } from "../../resolve-DDYPuZjk.mjs";
import { r as normalizeScpRemotePath } from "../../scp-host-DbBwyscY.mjs";
import { a as workerSshOptions, i as workerSshCommandOptions, o as workerSshRemoteCommand, r as runWorkerSshCandidates, t as prepareWorkerSsh } from "../../ssh-C8PSYwfX.mjs";
import { i as bundleTransferTimeoutMs } from "../../bootstrap-timeouts-CDaMuZ4A.mjs";
import { createReadStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import * as tar from "tar";
//#region src/gateway/worker-environments/bootstrap-command.ts
function commandFailure(phase, result) {
	const output = truncateUtf16Safe(redactSensitiveText(result.stderr.trim() || result.stdout.trim(), { mode: "tools" }).replace(/\s+/gu, " "), 512);
	const status = result.termination === "exit" ? `exit ${result.code ?? "unknown"}` : result.termination;
	return /* @__PURE__ */ new Error(`Worker bootstrap ${phase} failed (${status})${output ? `: ${output}` : ""}`);
}
function isSuccess(result) {
	return result.termination === "exit" && result.code === 0;
}
function matchesCommandFailure(result, code, marker) {
	return result.code === code || result.stderr.includes(marker) || result.stdout.includes(marker);
}
async function runSshScript(params) {
	return await params.runCommand([
		"ssh",
		...workerSshOptions(params.prepared, { forwarding: "disabled" }),
		"-a",
		"-x",
		"-T",
		"-p",
		String(params.port ?? params.prepared.port),
		"--",
		params.prepared.sshTarget,
		workerSshRemoteCommand([
			"sh",
			"-s",
			"--",
			...params.scriptArgs
		])
	], workerSshCommandOptions({
		input: params.script,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	}));
}
//#endregion
//#region src/gateway/worker-environments/bootstrap.ts
const BOOTSTRAP_ROOT = ".openclaw-worker";
const BOOTSTRAP_RECEIPT = "bootstrap-receipt.json";
const NODE_MISSING_EXIT_CODE = 42;
const NPM_MISSING_EXIT_CODE = 43;
const LOCK_TIMEOUT_EXIT_CODE = 44;
const NODE_UNSUPPORTED_EXIT_CODE = 45;
const LOCK_MAX_AGE_SECONDS = 3600;
const NODE_MISSING_MARKER = "OPENCLAW_WORKER_NODE_MISSING";
const NODE_UNSUPPORTED_MARKER = "OPENCLAW_WORKER_NODE_UNSUPPORTED";
const NPM_MISSING_MARKER = "OPENCLAW_WORKER_NPM_MISSING";
const BOOTSTRAP_OUTPUT_TAG = "OPENCLAW_WORKER_BOOTSTRAP_V1";
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const NPM_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]{86}==$/u;
const NODE_RUNTIME_CHECK_JS = String.raw`const parse = (value) => /^(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number); const atLeast = (version, floor) => version[0] > floor[0] || (version[0] === floor[0] && (version[1] > floor[1] || (version[1] === floor[1] && version[2] >= floor[2])));
const nodeSafe = ${PROCESS_NODE_VERSION_CHECK};
if (!nodeSafe) process.exit(1);
try { const { DatabaseSync } = require("node:sqlite"); const db = new DatabaseSync(":memory:");
  const sqlite = parse(String(db.prepare("SELECT sqlite_version() AS version").get()?.version ?? ""));
  db.close(); if (!sqlite) process.exit(1);
  const sqliteSafe = atLeast(sqlite, [3, 51, 3]) || (sqlite[0] === 3 && ((sqlite[1] === 50 && sqlite[2] >= 7) || (sqlite[1] === 44 && sqlite[2] >= 6)));
  process.exit(sqliteSafe ? 0 : 1); } catch { process.exit(1); }`;
const RECEIPT_MATCH_JS = String.raw`const fs = require("node:fs");
try {
  const actual = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const expected = JSON.parse(process.argv[2]);
  const shapeMatches =
    Object.keys(actual).sort().join(",") === "bundleHash,openclawVersion,protocolFeatures";
  const featuresMatch =
    Array.isArray(actual.protocolFeatures) &&
    Array.isArray(expected.protocolFeatures) &&
    actual.protocolFeatures.length === expected.protocolFeatures.length &&
    actual.protocolFeatures.every((feature, index) => feature === expected.protocolFeatures[index]);
  process.exit(
    shapeMatches &&
      actual.bundleHash === expected.bundleHash &&
      actual.openclawVersion === expected.openclawVersion &&
      featuresMatch
      ? 0
      : 1,
  );
} catch {
  process.exit(1);
}`;
const VERIFY_ARCHIVE_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const npm = process.argv[3] === "npm";
  const actual = (npm ? "sha512-" : "") + crypto.createHash(npm ? "sha512" : "sha256").update(fs.readFileSync(process.argv[1])).digest(npm ? "base64" : "hex");
  process.exit(actual === process.argv[2] ? 0 : 1);
} catch {
  process.exit(1);
}`;
const READ_NPM_PACK_FILENAME_JS = String.raw`const fs = require("node:fs");
const path = require("node:path");
try {
  const value = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const filename = Array.isArray(value) && value.length === 1 ? value[0]?.filename : undefined;
  if (typeof filename !== "string" || !filename || path.basename(filename) !== filename) {
    process.exit(1);
  }
  process.stdout.write(filename);
} catch {
  process.exit(1);
}`;
const WORKER_ARTIFACT_PATHS_JS = `const artifactPaths = ${JSON.stringify(WORKER_BUNDLE_ARTIFACT_PATHS)};
const chunkPathPattern = ${WORKER_BUNDLE_CHUNK_PATH_PATTERN.toString()};`;
const SELECT_NPM_WORKER_FILES_JS = String.raw`const fs = require("node:fs");
const expected = "package/dist/worker-artifacts/" + process.argv[2] + ".tar.gz";
const selected = fs.readFileSync(process.argv[1], "utf8").split("\n").filter((entry) => entry === expected);
if (selected.length !== 1) throw new Error("missing or duplicate packaged worker bundle archive");
process.stdout.write(selected.join("\n") + "\n");`;
const VERIFY_INSTALL_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[1];
const expected = process.argv[2];
const install = process.argv[3];
${WORKER_ARTIFACT_PATHS_JS}
const entries = [];
function fail(message) {
  throw new Error(message);
}
function assertRoot() {
  const stats = fs.lstatSync(root);
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    fail("unsafe worker install root");
  }
  fs.chmodSync(root, 0o700);
}
function addFile(relative) {
  const absolute = path.join(root, relative);
  const stats = fs.lstatSync(absolute);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    fail("unsafe worker file: " + relative);
  }
  const contents = fs.readFileSync(absolute);
  const mode = 0o700;
  fs.chmodSync(absolute, mode);
  entries.push({
    path: relative,
    mode,
    size: contents.byteLength,
    sha256: crypto.createHash("sha256").update(contents).digest("hex"),
  });
}
try {
  assertRoot();
  if (install === "npm" || install === "bundle") {
    const allowedPaths = new Set([...artifactPaths, "bootstrap-receipt.json"]);
    for (const name of fs.readdirSync(root)) {
      if (chunkPathPattern.test(name)) {
        artifactPaths.push(name);
      } else if (!allowedPaths.has(name)) {
        fail("unexpected worker bundle path: " + name);
      }
    }
    for (const artifactPath of artifactPaths) addFile(artifactPath);
  } else {
    fail("invalid worker install channel");
  }
  entries.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  const separator = String.fromCharCode(0);
  const hash = crypto.createHash("sha256");
  hash.update("${WORKER_BUNDLE_MANIFEST_VERSION}" + separator);
  for (const entry of entries) {
    hash.update(entry.path + separator + entry.mode.toString(8) + separator + entry.size + separator + entry.sha256 + separator);
  }
  process.exit(hash.digest("hex") === expected ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}`;
const ENSURE_PRIVATE_DIRECTORY_SH = String.raw`ensure_private_directory() {
  directory=$1
  if [ -e "$directory" ] || [ -L "$directory" ]; then
    if [ ! -d "$directory" ] || [ -L "$directory" ]; then
      printf '%s\n' 'unsafe worker bootstrap directory' >&2
      exit 2
    fi
  else
    mkdir "$directory"
  fi
  chmod 700 "$directory"
}`;
const PREFLIGHT_SCRIPT = String.raw`set -eu
umask 077
hash=$1
expected_receipt=$2
install=$3
operation_token=$4
root=$HOME/${BOOTSTRAP_ROOT}
install_dir=$root/$hash
receipt=$install_dir/${BOOTSTRAP_RECEIPT}

case "$operation_token" in
  *[!a-f0-9]*|'') printf '%s\n' 'invalid worker bootstrap operation token' >&2; exit 2 ;;
esac
if [ "${"${"}#operation_token}" -ne 64 ]; then
  printf '%s\n' 'invalid worker bootstrap operation token' >&2
  exit 2
fi

${ENSURE_PRIVATE_DIRECTORY_SH}

ensure_private_directory "$root"

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' '${NODE_MISSING_MARKER}' >&2
  exit ${NODE_MISSING_EXIT_CODE}
fi

if ! node -e '${NODE_RUNTIME_CHECK_JS}'; then
  printf '%s: ' '${NODE_UNSUPPORTED_MARKER}' >&2
  node --version >&2 || true
  exit ${NODE_UNSUPPORTED_EXIT_CODE}
fi

incoming=$root/.incoming
ensure_private_directory "$incoming"
incoming=$(cd "$incoming" && pwd -P)
find "$incoming" -type f -name 'openclaw-upload-*.tgz.*' -mmin +60 -exec rm -f -- {} + 2>/dev/null || true
upload=$incoming/openclaw-upload-$hash.tgz.$operation_token

if [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
  node -e '${RECEIPT_MATCH_JS}' "$receipt" "$expected_receipt" &&
  node -e '${VERIFY_INSTALL_JS}' "$install_dir" "$hash" "$install"; then
  rm -f -- "$upload"
  printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' current
  cat "$receipt"
  printf '\n'
  exit 0
fi

if [ ! -e "$upload" ] && [ ! -L "$upload" ]; then
  (set -C; : > "$upload") 2>/dev/null || true
fi
if [ ! -f "$upload" ] || [ -L "$upload" ]; then
  printf '%s\n' 'unsafe worker bootstrap upload' >&2
  exit 2
fi
chmod 600 "$upload"
printf '%s\t%s\t%s\n' '${BOOTSTRAP_OUTPUT_TAG}' install "$upload"
`;
const INSTALL_SCRIPT = String.raw`set -eu
umask 077
install=$1
hash=$2
package_spec=$3
package_integrity=$4
receipt_json=$5
upload=$6
archive_sha256=$7
root=$HOME/${BOOTSTRAP_ROOT}
install_dir=$root/$hash
receipt=$install_dir/${BOOTSTRAP_RECEIPT}
staging=$root/.staging-$hash-$$
lock_root=$root/.locks
lock=$lock_root/$hash
locked=0
lock_identity="$$:$(date +%s)"

${ENSURE_PRIVATE_DIRECTORY_SH}

ensure_private_directory "$root"
ensure_private_directory "$lock_root"

cleanup() {
  rm -rf "$staging"
  if [ "$locked" -eq 1 ]; then
    owner=$(readlink "$lock" 2>/dev/null || true)
    if [ "$owner" = "$lock_identity" ]; then
      rm -f "$lock"
    fi
  fi
}
trap cleanup 0
trap 'exit 1' 1 2 15

receipt_matches() {
  [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
    node -e '${RECEIPT_MATCH_JS}' "$receipt" "$receipt_json" &&
    node -e '${VERIFY_INSTALL_JS}' "$install_dir" "$hash" "$install"
}

finish_with_receipt() {
  # A durable receipt makes retries independent of this operation's upload.
  rm -f -- "$upload"
  printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' receipt
  cat "$receipt"
  printf '\n'
}

read_lock_owner() {
  if [ -L "$lock" ]; then
    readlink "$lock" 2>/dev/null || true
  elif [ -r "$lock/pid" ]; then
    cat "$lock/pid" 2>/dev/null || true
  fi
}

remove_observed_lock() {
  current_owner=$(read_lock_owner)
  if [ "$current_owner" = "$owner" ]; then
    if [ -L "$lock" ]; then rm -f "$lock"; else rm -rf "$lock"; fi
  fi
}

attempt=0
while ! ln -s "$lock_identity" "$lock" 2>/dev/null; do
  if receipt_matches; then
    finish_with_receipt
    exit 0
  fi
  owner=$(read_lock_owner)
  stale_owner=0
  case "$owner" in
    *:*:*) valid_owner=0 ;;
    *:*)
      owner_pid=${"${"}owner%%:*}
      owner_started=${"${"}owner#*:}
      case "$owner_pid" in
        *[!0-9]*|'') valid_owner=0 ;;
        *)
          case "$owner_started" in
            *[!0-9]*|'') valid_owner=0 ;;
            *)
              now=$(date +%s)
              if [ "$owner_started" -le "$now" ] && [ $((now - owner_started)) -le ${LOCK_MAX_AGE_SECONDS} ]; then
                valid_owner=1
              else
                valid_owner=0
                stale_owner=1
              fi
              ;;
          esac
          ;;
      esac
      ;;
    *) valid_owner=0 ;;
  esac
  if [ "$stale_owner" -eq 1 ]; then
    remove_observed_lock
    continue
  fi
  if [ "$valid_owner" -eq 1 ] && kill -0 "$owner_pid" 2>/dev/null; then
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ]; then
      printf '%s\n' 'worker bootstrap lock timed out' >&2
      exit ${LOCK_TIMEOUT_EXIT_CODE}
    fi
    sleep 1
    continue
  fi
  if [ "$valid_owner" -eq 1 ]; then
    remove_observed_lock
    continue
  fi
  attempt=$((attempt + 1))
  if [ "$valid_owner" -eq 0 ] && [ "$attempt" -ge 5 ]; then
    remove_observed_lock
    continue
  fi
  sleep 1
done
locked=1

# The per-hash lock makes cleanup safe: no live installer for this build can own an older staging dir.
for stale_staging in "$root"/.staging-"$hash"-*; do
  if [ -L "$stale_staging" ]; then
    rm -f "$stale_staging"
  elif [ -d "$stale_staging" ]; then
    rm -rf "$stale_staging"
  fi
done

if receipt_matches; then
  finish_with_receipt
  exit 0
fi

rm -rf "$staging"
mkdir -p "$staging"
case "$install" in
  bundle)
    if ! node -e '${VERIFY_ARCHIVE_JS}' "$upload" "$archive_sha256" "$install"; then
      printf '%s\n' 'worker bundle archive digest mismatch' >&2
      exit 2
    fi
    tar -xzf "$upload" -C "$staging"
    ;;
  npm)
    if ! command -v npm >/dev/null 2>&1; then
      printf '%s\n' '${NPM_MISSING_MARKER}' >&2
      exit ${NPM_MISSING_EXIT_CODE}
    fi
    npm_pack_json=$staging/npm-pack.json
    npm pack "$package_spec" --pack-destination "$staging" --ignore-scripts --json --registry=https://registry.npmjs.org/ > "$npm_pack_json"
    package_archive=$(node -e '${READ_NPM_PACK_FILENAME_JS}' "$npm_pack_json")
    package_archive=$staging/$package_archive
    if ! node -e '${VERIFY_ARCHIVE_JS}' "$package_archive" "$package_integrity" "$install"; then
      printf '%s\n' 'worker npm package integrity mismatch' >&2
      exit 2
    fi
    tar -tzf "$package_archive" > "$staging/npm-members.txt"
    node -e '${SELECT_NPM_WORKER_FILES_JS}' "$staging/npm-members.txt" "$hash" > "$staging/npm-worker-files.txt"
    tar -xzf "$package_archive" -C "$staging" --strip-components=3 -T "$staging/npm-worker-files.txt"
    worker_archive=$staging/$hash.tar.gz
    tar -xzf "$worker_archive" -C "$staging"
    rm -f "$worker_archive"
    rm -f "$npm_pack_json" "$package_archive" "$staging/npm-members.txt" "$staging/npm-worker-files.txt"
    ;;
  *)
    printf '%s\n' 'invalid worker install channel' >&2
    exit 2
    ;;
esac

if ! node -e '${VERIFY_INSTALL_JS}' "$staging" "$hash" "$install"; then
  printf '%s\n' 'worker install content does not match the expected bundle hash' >&2
  exit 2
fi
printf '%s\n' "$receipt_json" > "$staging/${BOOTSTRAP_RECEIPT}"
chmod 600 "$staging/${BOOTSTRAP_RECEIPT}"
rm -rf "$install_dir"
mv "$staging" "$install_dir"
finish_with_receipt
`;
function normalizeHandshake(artifact) {
	const bundleHash = artifact.bundleHash.trim();
	const openclawVersion = artifact.openclawVersion.trim();
	const protocolFeatures = artifact.protocolFeatures.map((feature) => feature.trim());
	if (!BUNDLE_HASH_PATTERN.test(bundleHash)) throw new Error("Worker bundle hash must be a lowercase SHA-256 digest");
	if (!openclawVersion) throw new Error("Worker OpenClaw version must be non-empty");
	if (protocolFeatures.length > 64 || protocolFeatures.some((feature) => !feature) || protocolFeatures.some((feature) => feature.length > 128) || new Set(protocolFeatures).size !== protocolFeatures.length) throw new Error("Worker protocol features must be unique non-empty strings");
	if (artifact.install === "npm") {
		if (!isExactSemverVersion(openclawVersion) || artifact.packageSpec !== `openclaw@${openclawVersion}`) throw new Error(`Worker npm install must use exact package openclaw@${openclawVersion}`);
		if (!NPM_INTEGRITY_PATTERN.test(artifact.packageIntegrity)) throw new Error("Worker npm install requires a pinned SHA-512 package integrity");
	} else if (!BUNDLE_HASH_PATTERN.test(artifact.tarballSha256)) throw new Error("Worker bundle archive digest must be a lowercase SHA-256 digest");
	return {
		bundleHash,
		openclawVersion,
		protocolFeatures
	};
}
function parseReceiptJson(value, expected) {
	let parsed;
	try {
		parsed = JSON.parse(value ?? "");
	} catch {
		throw new Error("Worker bootstrap returned an invalid receipt");
	}
	if (!validateWorkerAdmissionHandshake(parsed)) throw new Error("Worker bootstrap returned an invalid receipt");
	if (parsed.bundleHash !== expected.bundleHash || parsed.openclawVersion !== expected.openclawVersion || parsed.protocolFeatures.length !== expected.protocolFeatures.length || parsed.protocolFeatures.some((feature, index) => feature !== expected.protocolFeatures[index])) throw new Error("Worker bootstrap receipt does not match the requested artifact");
	return parsed;
}
const CLEANUP_UPLOAD_SCRIPT = String.raw`set -eu
hash=$1
operation_token=$2
case "$hash" in
  *[!a-f0-9]*|'') exit 2 ;;
esac
case "$operation_token" in
  *[!a-f0-9]*|'') exit 2 ;;
esac
if [ "${"${"}#hash}" -ne 64 ] || [ "${"${"}#operation_token}" -ne 64 ]; then
  exit 2
fi
root=$HOME/${BOOTSTRAP_ROOT}
if [ ! -e "$root" ] && [ ! -L "$root" ]; then
  exit 0
fi
if [ ! -d "$root" ] || [ -L "$root" ]; then
  exit 2
fi
incoming=$root/.incoming
if [ ! -d "$incoming" ] || [ -L "$incoming" ]; then
  exit 0
fi
incoming=$(cd "$incoming" && pwd -P)
rm -f -- "$incoming/openclaw-upload-$hash.tgz.$operation_token"
`;
async function cleanupRemoteUpload(params) {
	const cleanupTimeoutMs = Math.min(params.timeoutMs, 1e4);
	await runWorkerSshCandidates(params.prepared, cleanupTimeoutMs, (port, remainingTimeoutMs) => {
		return runSshScript({
			prepared: params.prepared,
			runCommand: params.runCommand,
			script: CLEANUP_UPLOAD_SCRIPT,
			scriptArgs: [params.bundleHash, params.operationToken],
			timeoutMs: remainingTimeoutMs,
			port
		});
	}).catch(() => void 0);
}
function parseTaggedOutput(stdout) {
	const prefix = `${BOOTSTRAP_OUTPUT_TAG}\t`;
	const record = stdout.split(/\r?\n/u).findLast((line) => line.startsWith(prefix));
	if (!record) return;
	const actionEnd = record.indexOf("	", prefix.length);
	if (actionEnd === -1) return;
	const action = record.slice(prefix.length, actionEnd);
	const payload = record.slice(actionEnd + 1).trim();
	return action && payload ? {
		action,
		payload
	} : void 0;
}
function parsePreflight(result, expected, expectedUploadFilename) {
	if (matchesCommandFailure(result, NODE_MISSING_EXIT_CODE, NODE_MISSING_MARKER)) throw new Error("Worker bootstrap requires Node.js on the leased host; install Node in the provider setup phase and retry");
	if (matchesCommandFailure(result, NODE_UNSUPPORTED_EXIT_CODE, NODE_UNSUPPORTED_MARKER)) throw new Error("Worker bootstrap requires Node 24.16.0+ or 26.1.0+ with WAL-reset-safe SQLite on the leased host; install a supported Node runtime in the provider setup phase and retry");
	if (!isSuccess(result)) throw commandFailure("preflight", result);
	const output = parseTaggedOutput(result.stdout);
	if (output?.action === "current") return {
		action: "current",
		receipt: parseReceiptJson(output.payload, expected)
	};
	const remotePath = output?.action === "install" ? output.payload : void 0;
	const normalizedPath = normalizeScpRemotePath(remotePath);
	const expectedSuffix = `/${BOOTSTRAP_ROOT}/.incoming/${expectedUploadFilename}`;
	const hasCanonicalSegments = normalizedPath?.split("/").slice(1).every((segment) => segment !== "" && segment !== "." && segment !== "..");
	if (!normalizedPath || !hasCanonicalSegments || !normalizedPath.endsWith(expectedSuffix)) throw new Error("Worker bootstrap preflight returned an invalid upload path");
	return {
		action: "install",
		path: normalizedPath
	};
}
/** Installs one exact worker artifact over SSH and returns its admission receipt. */
async function bootstrapWorker(request, dependencies) {
	const artifact = request.artifact;
	const timeoutMs = dependencies.timeoutMs ?? 6e5;
	const transferTimeoutMs = artifact.install === "bundle" ? bundleTransferTimeoutMs(artifact.tarballBytes, timeoutMs) : timeoutMs;
	const receipt = normalizeHandshake(artifact);
	const operationToken = createHash("sha256").update(request.operationId).digest("hex");
	const uploadFilename = `openclaw-upload-${receipt.bundleHash}.tgz.${operationToken}`;
	const run = dependencies.runCommand ?? runCommandWithTimeout;
	let needsUploadCleanup = false;
	const assertCurrent = () => {
		dependencies.signal?.throwIfAborted();
		dependencies.assertCurrent?.();
	};
	const runCommand = (argv, options) => {
		assertCurrent();
		needsUploadCleanup = true;
		return run(argv, options);
	};
	const prepared = await prepareWorkerSsh({
		assertCurrent,
		ssh: request.ssh,
		pinnedHostKey: request.pinnedHostKey,
		resolveIdentity: dependencies.resolveIdentity,
		temporaryDirectoryPrefix: "openclaw-worker-bootstrap-"
	});
	try {
		const preflightResult = await runWorkerSshCandidates(prepared, timeoutMs, (port, remainingTimeoutMs) => runSshScript({
			prepared,
			runCommand,
			script: PREFLIGHT_SCRIPT,
			scriptArgs: [
				receipt.bundleHash,
				JSON.stringify(receipt),
				artifact.install,
				operationToken
			],
			timeoutMs: remainingTimeoutMs,
			port,
			signal: dependencies.signal
		}));
		assertCurrent();
		const preflight = parsePreflight(preflightResult, receipt, uploadFilename);
		if (preflight.action === "current") {
			needsUploadCleanup = false;
			return preflight.receipt;
		}
		if (artifact.install === "bundle") {
			const transfer = await runWorkerSshCandidates(prepared, transferTimeoutMs, (port, remainingTimeoutMs) => runCommand([
				"scp",
				...workerSshOptions(prepared, { forwarding: "disabled" }),
				"-P",
				String(port),
				"--",
				artifact.tarballPath,
				`${prepared.scpTarget}:${preflight.path}`
			], workerSshCommandOptions({
				timeoutMs: remainingTimeoutMs,
				signal: dependencies.signal
			})));
			if (!isSuccess(transfer)) throw commandFailure("bundle transfer", transfer);
		}
		const install = await runWorkerSshCandidates(prepared, timeoutMs, (port, remainingTimeoutMs) => runSshScript({
			prepared,
			runCommand,
			script: INSTALL_SCRIPT,
			scriptArgs: [
				artifact.install,
				receipt.bundleHash,
				artifact.install === "npm" ? artifact.packageSpec : "",
				artifact.install === "npm" ? artifact.packageIntegrity : "",
				JSON.stringify(receipt),
				preflight.path,
				artifact.install === "bundle" ? artifact.tarballSha256 : ""
			],
			timeoutMs: remainingTimeoutMs,
			port,
			signal: dependencies.signal
		}));
		assertCurrent();
		if (matchesCommandFailure(install, NPM_MISSING_EXIT_CODE, NPM_MISSING_MARKER)) throw new Error("Worker npm bootstrap requires npm on the leased host; use bundle install or provide npm in the provider setup phase");
		if (!isSuccess(install)) throw commandFailure("install", install);
		const output = parseTaggedOutput(install.stdout);
		if (output?.action !== "receipt") throw new Error("Worker bootstrap install returned an invalid receipt");
		return parseReceiptJson(output.payload, receipt);
	} finally {
		if (needsUploadCleanup) await cleanupRemoteUpload({
			prepared,
			bundleHash: receipt.bundleHash,
			operationToken,
			runCommand: run,
			timeoutMs
		});
		await prepared.dispose();
	}
}
//#endregion
//#region src/gateway/worker-environments/bundle-staging.ts
async function stageWorkerDeployArtifact(params) {
	const relativeSourcePath = `dist/worker/${params.artifactPath}`;
	const sourcePath = path.join(params.sourceRoot, relativeSourcePath);
	let expectedRealPath;
	try {
		expectedRealPath = await fs$1.realpath(sourcePath);
	} catch (error) {
		throw new Error(`OpenClaw worker deploy artifact is missing; build the running package at ${params.sourceRoot}`, { cause: error });
	}
	const expectedPath = path.resolve(params.sourceRoot, relativeSourcePath);
	if (expectedRealPath !== expectedPath) throw new Error(`Unsafe worker deploy artifact: ${relativeSourcePath}`);
	const initialStats = await fs$1.lstat(sourcePath);
	if (initialStats.isSymbolicLink() || !initialStats.isFile()) throw new Error(`Unsafe worker deploy artifact: ${relativeSourcePath}`);
	await params.staging.copyIn(params.artifactPath, {
		root: params.source,
		relativePath: sourcePath
	}, {
		overwrite: false,
		sourceHardlinks: "allow",
		mode: 448,
		maxBytes: Infinity,
		durable: false,
		clone: "never"
	});
	const opened = await params.staging.open(params.artifactPath);
	try {
		const { bytes, digest } = await sha256File(opened.handle, { maxBytes: opened.stat.size });
		if (bytes !== opened.stat.size) throw new Error(`Worker deploy artifact changed while packaging: ${relativeSourcePath}`);
		return {
			path: params.artifactPath,
			mode: 448,
			size: bytes,
			sha256: digest
		};
	} finally {
		await opened.handle.close();
	}
}
async function collectWorkerBundleManifest(sourceRoot, stagingRoot) {
	const [source, artifacts] = await Promise.all([root(sourceRoot, { maxBytes: Infinity }), fs$1.readdir(path.join(sourceRoot, "dist/worker"))]).catch((error) => {
		throw new Error(`OpenClaw worker deploy artifact is missing; build the running package at ${sourceRoot}`, { cause: error });
	});
	const staging = await root(stagingRoot, { maxBytes: Infinity });
	const manifest = [];
	const chunks = artifacts.filter((name) => WORKER_BUNDLE_CHUNK_PATH_PATTERN.test(name));
	for (const artifactPath of [...WORKER_BUNDLE_ARTIFACT_PATHS, ...chunks]) manifest.push(await stageWorkerDeployArtifact({
		sourceRoot,
		source,
		staging,
		artifactPath
	}));
	return manifest.toSorted((left, right) => compareWorkerBundlePaths(left.path, right.path));
}
//#endregion
//#region src/gateway/worker-environments/bundle.ts
const OPENCLAW_NPM_REGISTRY = "https://registry.npmjs.org/";
const NPM_RELEASE_PROOF_TIMEOUT_MS = 6e4;
const NPM_SHA512_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]{86}==$/u;
const BUNDLE_TARBALL_NAME_PATTERN = /^([a-f0-9]{64})\.tgz$/u;
const BUNDLE_STAGING_NAME_PATTERN = /^\.staging-[A-Za-z0-9_-]+$/u;
const BUNDLE_TEMP_NAME_PATTERN = /^[a-f0-9]{64}\.tgz\.[0-9]+\.[0-9a-f-]{36}\.tmp$/u;
const PACKAGED_BUNDLE_NAME_PATTERN = /^([a-f0-9]{64})\.tar\.gz$/u;
const PACKAGED_BUNDLE_DIRECTORY = "dist/worker-artifacts";
function normalizeProtocolFeatures(features) {
	const normalized = features.map((feature) => feature.trim());
	if (normalized.some((feature) => feature.length === 0)) throw new Error("Worker protocol features must be non-empty strings");
	return [...new Set(normalized)].toSorted(compareWorkerBundlePaths);
}
function resolveBundleCacheDir(cacheDir) {
	return cacheDir ? path.resolve(cacheDir) : path.join(resolveStateDir(), "cache", "worker-bundles");
}
function resolvePackageRoot(packageRoot) {
	if (packageRoot) return path.resolve(packageRoot);
	const resolved = resolveOpenClawPackageRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (!resolved) throw new Error("Unable to locate the running OpenClaw package root for worker bundling");
	return resolved;
}
async function isReleasedPackageInstall(packageRoot) {
	const entries = new Set(await fs$1.readdir(packageRoot));
	return !entries.has(".git") && !entries.has("pnpm-lock.yaml") && !entries.has("bun.lock") && !entries.has("bun.lockb");
}
function parseNpmPackageIdentity(value) {
	if (!isRecord(value)) return;
	const name = normalizeOptionalString(value.name);
	const version = normalizeOptionalString(value.version);
	const integrity = normalizeOptionalString(value.integrity) ?? normalizeOptionalString(value["dist.integrity"]);
	const filename = normalizeOptionalString(value.filename);
	return name && version && integrity ? {
		name,
		version,
		integrity,
		filename
	} : void 0;
}
async function runNpmProofCommand(params) {
	try {
		const result = await params.runCommand(params.argv, {
			cwd: params.cwd,
			timeoutMs: NPM_RELEASE_PROOF_TIMEOUT_MS,
			env: {
				COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
				NPM_CONFIG_IGNORE_SCRIPTS: "true"
			}
		});
		if (result.code !== 0 || result.stdoutTruncatedBytes) throw new Error(params.failureMessage);
		return JSON.parse(result.stdout.trim());
	} catch {
		throw new Error(params.failureMessage);
	}
}
async function hashNpmTarballIntegrity(tarballPath) {
	const hash = createHash("sha512");
	for await (const chunk of createReadStream(tarballPath)) hash.update(chunk);
	return `sha512-${hash.digest("base64")}`;
}
async function verifyPublishedNpmRelease(params) {
	const runCommand = params.runCommand ?? runCommandWithTimeout;
	const temporaryRoot = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-worker-npm-proof-"));
	try {
		const published = parseNpmPackageIdentity(resolveNpmJsonEntries(await runNpmProofCommand({
			argv: [
				"npm",
				"view",
				`openclaw@${params.version}`,
				"name",
				"version",
				"dist.integrity",
				"--json",
				`--registry=${OPENCLAW_NPM_REGISTRY}`
			],
			cwd: temporaryRoot,
			failureMessage: `OpenClaw ${params.version} is not published; use the worker bundle install`,
			runCommand
		}))[0]);
		if (published?.name !== "openclaw" || published.version !== params.version || !NPM_SHA512_INTEGRITY_PATTERN.test(published.integrity)) throw new Error(`Cannot verify exact public npm release openclaw@${params.version}; use the worker bundle install`);
		const packedValue = await runNpmProofCommand({
			argv: [
				"npm",
				"pack",
				`openclaw@${params.version}`,
				"--pack-destination",
				temporaryRoot,
				"--ignore-scripts",
				"--json",
				`--registry=${OPENCLAW_NPM_REGISTRY}`
			],
			cwd: temporaryRoot,
			failureMessage: "Unable to verify the installed OpenClaw package; use the worker bundle install",
			runCommand
		});
		const packed = parseNpmPackageIdentity(resolveNpmJsonEntries(packedValue)[0]);
		if (!packed?.filename || path.basename(packed.filename) !== packed.filename) throw new Error("npm pack returned incomplete worker package metadata");
		const packedTarballPath = path.join(temporaryRoot, packed.filename);
		let packedTarballIntegrity;
		try {
			packedTarballIntegrity = await hashNpmTarballIntegrity(packedTarballPath);
		} catch {
			throw new Error("Unable to verify the installed OpenClaw package; use the worker bundle install");
		}
		if (packed.name !== published.name || packed.version !== published.version || packed.integrity !== published.integrity || packedTarballIntegrity !== published.integrity) throw new Error(`Installed OpenClaw ${params.version} does not match the published package; use the worker bundle install`);
		const extractedRoot = path.join(temporaryRoot, "package");
		await fs$1.mkdir(extractedRoot);
		await tar.extract({
			cwd: extractedRoot,
			file: packedTarballPath,
			preservePaths: false,
			strict: true,
			strip: 1
		});
		if ((await prepareWorkerBundle({
			packageRoot: extractedRoot,
			cacheDir: path.join(temporaryRoot, "bundle-cache"),
			openclawVersion: params.version
		})).bundleHash !== params.bundleHash) throw new Error(`Published OpenClaw ${params.version} does not match the prepared worker bundle; use the worker bundle install`);
		return published.integrity;
	} finally {
		await fs$1.rm(temporaryRoot, {
			recursive: true,
			force: true
		});
	}
}
async function isCachedTarball(filePath) {
	try {
		const stats = await fs$1.lstat(filePath);
		if (stats.isSymbolicLink() || !stats.isFile()) throw new Error(`Unsafe worker bundle cache path: ${filePath}`);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function cachedTarballMatches(tarballPath, manifest) {
	if (!await isCachedTarball(tarballPath)) return false;
	try {
		return hashWorkerBundleManifest(await readWorkerBundleArchiveManifest(tarballPath, DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS)) === hashWorkerBundleManifest(manifest);
	} catch {
		return false;
	}
}
async function writeTarball(params) {
	const temporaryPath = `${params.tarballPath}.${process.pid}.${randomUUID()}.tmp`;
	try {
		await tar.create({
			cwd: params.stagingRoot,
			file: temporaryPath,
			gzip: true,
			noDirRecurse: true,
			noMtime: true,
			portable: true,
			strict: true,
			onWriteEntry: ({ stat }) => {
				if (stat) stat.mode = stat.mode & -512 | 448;
			}
		}, params.entries.map((entry) => entry.path));
		try {
			await fs$1.rename(temporaryPath, params.tarballPath);
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
			if (!await cachedTarballMatches(params.tarballPath, params.entries)) {
				await fs$1.rm(params.tarballPath, { force: true });
				try {
					await fs$1.rename(temporaryPath, params.tarballPath);
				} catch (publishError) {
					if (publishError.code !== "EEXIST" || !await cachedTarballMatches(params.tarballPath, params.entries)) throw publishError;
				}
			}
		}
	} finally {
		await fs$1.rm(temporaryPath, { force: true });
	}
}
async function pruneWorkerBundleCache(params) {
	let entries;
	try {
		entries = await fs$1.readdir(params.cacheDir, { withFileTypes: true });
	} catch (error) {
		if (error.code !== "ENOENT") params.onError?.(error);
		return;
	}
	if (!entries.some((entry) => {
		const bundleHash = BUNDLE_TARBALL_NAME_PATTERN.exec(entry.name)?.[1];
		return bundleHash !== void 0 && bundleHash !== params.currentBundleHash || BUNDLE_STAGING_NAME_PATTERN.test(entry.name) || BUNDLE_TEMP_NAME_PATTERN.test(entry.name);
	})) return;
	const retained = new Set([params.currentBundleHash, ...params.readRetainedBundleHashes()].filter((hash) => /^[a-f0-9]{64}$/u.test(hash)));
	for (const entry of entries.toSorted((left, right) => compareWorkerBundlePaths(left.name, right.name))) {
		const tarball = BUNDLE_TARBALL_NAME_PATTERN.exec(entry.name);
		const removableTarball = tarball && !retained.has(tarball[1]);
		const removableStaging = BUNDLE_STAGING_NAME_PATTERN.test(entry.name);
		const removableTemp = BUNDLE_TEMP_NAME_PATTERN.test(entry.name);
		if (!removableTarball && !removableStaging && !removableTemp) continue;
		const target = path.join(params.cacheDir, entry.name);
		try {
			const stats = await fs$1.lstat(target);
			if (stats.isSymbolicLink()) continue;
			if (removableStaging ? !stats.isDirectory() : !stats.isFile()) continue;
			await fs$1.rm(target, {
				recursive: removableStaging,
				force: true
			});
		} catch (error) {
			if (error.code !== "ENOENT") params.onError?.(error);
		}
	}
}
async function prepareWorkerBundle(options) {
	const packageRoot = resolvePackageRoot(options.packageRoot);
	const openclawVersion = (options.openclawVersion ?? VERSION).trim();
	if (!openclawVersion) throw new Error("Worker bundle requires a non-empty OpenClaw version");
	const protocolFeatures = normalizeProtocolFeatures(options.protocolFeatures ?? []);
	const packaged = await resolvePackagedWorkerBundle({
		packageRoot,
		openclawVersion,
		protocolFeatures
	});
	if (packaged) return packaged;
	const cacheDir = resolveBundleCacheDir(options.cacheDir);
	await fs$1.mkdir(cacheDir, { recursive: true });
	const stagingRoot = await fs$1.mkdtemp(path.join(cacheDir, ".staging-"));
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const manifest = await collectWorkerBundleManifest(packageRoot, stagingRoot);
			const bundleHash = hashWorkerBundleManifest(manifest);
			const tarballPath = path.join(cacheDir, `${bundleHash}.tgz`);
			if (!await cachedTarballMatches(tarballPath, manifest)) await writeTarball({
				stagingRoot,
				entries: manifest,
				tarballPath
			});
			const handle = _usingCtx$1.a(await fs$1.open(tarballPath, "r"));
			return {
				install: "bundle",
				bundleHash,
				openclawVersion,
				protocolFeatures,
				tarballBytes: (await fs$1.stat(tarballPath)).size,
				tarballSha256: (await sha256File(handle)).digest,
				tarballPath
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} finally {
		await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
async function resolvePackagedWorkerBundle(params) {
	try {
		var _usingCtx3 = _usingCtx();
		try {
			await fs$1.access(path.join(params.packageRoot, "dist/worker"));
			return null;
		} catch (error) {
			if (!isRecord(error) || error.code !== "ENOENT") throw error;
		}
		const archiveDirectory = path.join(params.packageRoot, PACKAGED_BUNDLE_DIRECTORY);
		let entries;
		try {
			entries = await fs$1.readdir(archiveDirectory, { withFileTypes: true });
		} catch (error) {
			if (isRecord(error) && error.code === "ENOENT") return null;
			throw error;
		}
		if (entries.length !== 1 || !entries[0].isFile()) throw new Error("Packaged worker bundle must contain exactly one regular archive");
		const match = PACKAGED_BUNDLE_NAME_PATTERN.exec(entries[0].name);
		if (!match) throw new Error("Packaged worker bundle archive name is invalid");
		const tarballPath = path.join(archiveDirectory, entries[0].name);
		const manifest = await readWorkerBundleArchiveManifest(tarballPath, DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS);
		const paths = new Set(manifest.map((entry) => entry.path));
		const requiredPaths = new Set(WORKER_BUNDLE_ARTIFACT_PATHS);
		if (WORKER_BUNDLE_ARTIFACT_PATHS.some((artifactPath) => !paths.has(artifactPath)) || manifest.some((entry) => !requiredPaths.has(entry.path) && !WORKER_BUNDLE_CHUNK_PATH_PATTERN.test(entry.path))) throw new Error("Packaged worker bundle archive does not match the worker artifact contract");
		const bundleHash = hashWorkerBundleManifest(manifest);
		if (bundleHash !== match[1]) throw new Error("Packaged worker bundle archive name does not match its manifest hash");
		const handle = _usingCtx3.a(await fs$1.open(tarballPath, "r"));
		return {
			install: "bundle",
			bundleHash,
			openclawVersion: params.openclawVersion,
			protocolFeatures: params.protocolFeatures,
			tarballBytes: (await handle.stat()).size,
			tarballSha256: (await sha256File(handle)).digest,
			tarballPath
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
/** Creates a process-lifecycle bundle producer that scans the running build at most once. */
function createWorkerBundleProducer(options = {}) {
	let currentArtifact;
	let pruning = Promise.resolve();
	return {
		prepare: createLazyPromise(async () => {
			currentArtifact = await prepareWorkerBundle(options);
			return currentArtifact;
		}),
		async prune(readRetainedBundleHashes) {
			const artifact = currentArtifact;
			if (options.cacheOwnership !== "exclusive" || !artifact) return;
			const operation = pruning.then(async () => {
				await pruneWorkerBundleCache({
					cacheDir: resolveBundleCacheDir(options.cacheDir),
					currentBundleHash: artifact.bundleHash,
					readRetainedBundleHashes,
					onError: options.onCacheCleanupError
				});
			});
			pruning = operation.catch(() => void 0);
			await operation;
		}
	};
}
/**
* Selects the exact npm package only after the public tarball's canonical worker manifest proves
* parity with the running gateway bundle.
*/
async function resolveWorkerNpmInstallationArtifact(params) {
	const version = params.bundle.openclawVersion.trim();
	if (!isExactSemverVersion(version)) throw new Error(`Worker npm install requires the exact published gateway version; expected ${version}`);
	const packageRoot = resolvePackageRoot(params.packageRoot);
	if (!(params.isPackageInstall ? await params.isPackageInstall(packageRoot) : await isReleasedPackageInstall(packageRoot))) throw new Error("Worker npm install requires the gateway to run from a packaged release install");
	const packageIntegrity = await (params.verifyRelease ?? verifyPublishedNpmRelease)({
		bundleHash: params.bundle.bundleHash,
		version
	});
	return {
		install: "npm",
		bundleHash: params.bundle.bundleHash,
		openclawVersion: version,
		packageIntegrity,
		protocolFeatures: params.bundle.protocolFeatures,
		packageSpec: `openclaw@${version}`
	};
}
//#endregion
//#region src/gateway/worker-environments/identity.ts
function requireIdentity(value) {
	if (typeof value === "object" && value !== null && "kind" in value) {
		if (value.kind === "path" && "path" in value && typeof value.path === "string" && value.path.trim()) return {
			kind: "path",
			path: value.path
		};
		if (value.kind === "material" && "contents" in value && typeof value.contents === "string" && value.contents.trim()) return {
			kind: "material",
			contents: value.contents
		};
	}
	throw new Error("Worker SSH identity resolver returned an invalid identity");
}
/** Routes dynamic identities to their provider owner and configured refs to the generic resolver. */
async function resolveWorkerSshIdentity(params) {
	params.assertAuthorized();
	const request = {
		leaseId: params.leaseId,
		profile: params.profile,
		keyRef: params.keyRef,
		assertCurrent: params.assertAuthorized
	};
	const identity = params.provider.resolveSshIdentity ? await params.provider.resolveSshIdentity(request) : await params.resolveGeneric(params.keyRef, params.assertAuthorized);
	params.assertAuthorized();
	return requireIdentity(identity);
}
//#endregion
export { bootstrapWorker, createWorkerBundleProducer, resolveSecretRefString, resolveWorkerNpmInstallationArtifact, resolveWorkerSshIdentity };
