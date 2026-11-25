import{i as SUPPORTED_NODE_VERSION_RANGE,n as PROCESS_NODE_VERSION_CHECK}from"../../node-version-EaZf6kHy.mjs";import{i as WORKER_BUNDLE_MANIFEST_VERSION,n as WORKER_BUNDLE_CHUNK_PATH_PATTERN,t as WORKER_BUNDLE_ARTIFACT_PATHS}from"../../worker-bundle-hash-C7P5Jf__.mjs";import{i as isExactSemverVersion}from"../../npm-registry-spec-D06XlvdA.mjs";import{It as validateWorkerAdmissionHandshake}from"../../src-4ukgpRDU.mjs";import{n as runCommandWithTimeout}from"../../exec-runner-DpcWIHOp.mjs";import"../../exec-DMFvryVA.mjs";import{n as WORKER_PROTOCOL_MAX_FEATURE_LENGTH,t as WORKER_PROTOCOL_MAX_FEATURES}from"../../worker-protocol-constants-8F9zCimv.mjs";import{i as bundleTransferTimeoutMs,t as DEFAULT_BOOTSTRAP_TIMEOUT_MS}from"../../bootstrap-timeouts-DTWxPvhX.mjs";import{r as normalizeScpRemotePath}from"../../scp-host-CXkWaWwO.mjs";import{a as workerSshCommandOptions,r as runWorkerSshCandidates,s as workerSshOptions,t as prepareWorkerSsh}from"../../ssh-DQQhPbcw.mjs";import{t as resolveSecretRefString}from"../../resolve-DvlOBOi1.mjs";import{i as runSshScript,n as isSuccess,r as matchesCommandFailure,t as commandFailure}from"../../bootstrap-command-BLDSR2G8.mjs";import{r as resolveWorkerNpmInstallationArtifact,t as createWorkerBundleProducer}from"../../bundle-D8PvG1GI.mjs";import{createHash}from"node:crypto";
//!src/gateway/worker-environments/bootstrap.ts
const BOOTSTRAP_ROOT=`.openclaw-worker`;const BOOTSTRAP_RECEIPT=`bootstrap-receipt.json`;const NODE_MISSING_EXIT_CODE=42;const NPM_MISSING_EXIT_CODE=43;const LOCK_TIMEOUT_EXIT_CODE=44;const NODE_UNSUPPORTED_EXIT_CODE=45;const LOCK_MAX_AGE_SECONDS=3600;const NODE_MISSING_MARKER=`OPENCLAW_WORKER_NODE_MISSING`;const NODE_UNSUPPORTED_MARKER=`OPENCLAW_WORKER_NODE_UNSUPPORTED`;const NPM_MISSING_MARKER=`OPENCLAW_WORKER_NPM_MISSING`;const BOOTSTRAP_OUTPUT_TAG=`OPENCLAW_WORKER_BOOTSTRAP_V1`;const BUNDLE_HASH_PATTERN=/^[a-f0-9]{64}$/u;const NPM_INTEGRITY_PATTERN=/^sha512-[A-Za-z0-9+/]{86}==$/u;const NODE_RUNTIME_CHECK_JS=String.raw`const parse = (value) => /^(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number); const atLeast = (version, floor) => version[0] > floor[0] || (version[0] === floor[0] && (version[1] > floor[1] || (version[1] === floor[1] && version[2] >= floor[2])));
function checkRuntime() {
  const nodeSafe = ${PROCESS_NODE_VERSION_CHECK};
  if (!nodeSafe) return 1;
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(":memory:");
  try {
    const sqlite = parse(String(db.prepare("SELECT sqlite_version() AS version").get()?.version ?? ""));
    if (!sqlite) return 1;
    const sqliteSafe = atLeast(sqlite, [3, 51, 3]) || (sqlite[0] === 3 && ((sqlite[1] === 50 && sqlite[2] >= 7) || (sqlite[1] === 44 && sqlite[2] >= 6)));
    return sqliteSafe ? 0 : 1;
  } finally { db.close(); }
}
try { process.exitCode = checkRuntime(); } catch { process.exitCode = 1; }`;const RECEIPT_MATCH_JS=String.raw`const fs = require("node:fs");
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
  process.exitCode =
    shapeMatches &&
      actual.bundleHash === expected.bundleHash &&
      actual.openclawVersion === expected.openclawVersion &&
      featuresMatch
      ? 0
      : 1;
} catch {
  process.exitCode = 1;
}`;const VERIFY_ARCHIVE_JS=String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const npm = process.argv[3] === "npm";
  const actual = (npm ? "sha512-" : "") + crypto.createHash(npm ? "sha512" : "sha256").update(fs.readFileSync(process.argv[1])).digest(npm ? "base64" : "hex");
  process.exitCode = actual === process.argv[2] ? 0 : 1;
} catch {
  process.exitCode = 1;
}`;const READ_NPM_PACK_FILENAME_JS=String.raw`const fs = require("node:fs");
const path = require("node:path");
try {
  const value = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const filename = Array.isArray(value) && value.length === 1 ? value[0]?.filename : undefined;
  if (typeof filename !== "string" || !filename || path.basename(filename) !== filename) {
    throw new Error("invalid npm pack filename");
  }
  process.stdout.write(filename);
} catch {
  process.exitCode = 1;
}`;const WORKER_ARTIFACT_PATHS_JS=`const artifactPaths = ${JSON.stringify(WORKER_BUNDLE_ARTIFACT_PATHS)};
const chunkPathPattern = ${WORKER_BUNDLE_CHUNK_PATH_PATTERN.toString()};`;const SELECT_NPM_WORKER_FILES_JS=String.raw`const fs = require("node:fs");
const expected = "package/dist/worker-artifacts/" + process.argv[2] + ".tar.gz";
const selected = fs.readFileSync(process.argv[1], "utf8").split("\n").filter((entry) => entry === expected);
if (selected.length !== 1) throw new Error("missing or duplicate packaged worker bundle archive");
process.stdout.write(selected.join("\n") + "\n");`;const VERIFY_INSTALL_JS=String.raw`const crypto = require("node:crypto");
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
  process.exitCode = hash.digest("hex") === expected ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}`;const ENSURE_PRIVATE_DIRECTORY_SH=String.raw`ensure_private_directory() {
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
}`;const PREFLIGHT_SCRIPT=String.raw`set -eu
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
`;const INSTALL_SCRIPT=String.raw`set -eu
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
`;function normalizeHandshake(e){const t=e.bundleHash.trim();const n=e.openclawVersion.trim();const r=e.protocolFeatures.map(e=>e.trim());if(!BUNDLE_HASH_PATTERN.test(t))throw new Error(`Worker bundle hash must be a lowercase SHA-256 digest`);if(!n)throw new Error(`Worker OpenClaw version must be non-empty`);if(r.length>64||r.some(e=>!e)||r.some(e=>e.length>128)||new Set(r).size!==r.length)throw new Error(`Worker protocol features must be unique non-empty strings`);if(e.install===`npm`){if(!isExactSemverVersion(n)||e.packageSpec!==`openclaw@${n}`)throw new Error(`Worker npm install must use exact package openclaw@${n}`);if(!NPM_INTEGRITY_PATTERN.test(e.packageIntegrity))throw new Error(`Worker npm install requires a pinned SHA-512 package integrity`)}else if(!BUNDLE_HASH_PATTERN.test(e.tarballSha256))throw new Error(`Worker bundle archive digest must be a lowercase SHA-256 digest`);return{bundleHash:t,openclawVersion:n,protocolFeatures:r}}function parseReceiptJson(e,t){let n;try{n=JSON.parse(e??``)}catch{throw new Error(`Worker bootstrap returned an invalid receipt`)}if(!validateWorkerAdmissionHandshake(n))throw new Error(`Worker bootstrap returned an invalid receipt`);if(n.bundleHash!==t.bundleHash||n.openclawVersion!==t.openclawVersion||n.protocolFeatures.length!==t.protocolFeatures.length||n.protocolFeatures.some((e,n)=>e!==t.protocolFeatures[n]))throw new Error(`Worker bootstrap receipt does not match the requested artifact`);return n}const CLEANUP_UPLOAD_SCRIPT=String.raw`set -eu
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
`;async function cleanupRemoteUpload(e){const t=Math.min(e.timeoutMs,1e4);await runWorkerSshCandidates(e.prepared,t,(t,n)=>{return runSshScript({prepared:e.prepared,runCommand:e.runCommand,script:CLEANUP_UPLOAD_SCRIPT,scriptArgs:[e.bundleHash,e.operationToken],timeoutMs:n,port:t})}).catch(()=>void 0)}function parseTaggedOutput(e){const t=`${BOOTSTRAP_OUTPUT_TAG}\t`;const n=e.split(/\r?\n/u).findLast(e=>e.startsWith(t));if(!n)return;const r=n.indexOf(`	`,t.length);if(r===-1)return;const i=n.slice(t.length,r);const a=n.slice(r+1).trim();return i&&a?{action:i,payload:a}:void 0}function parsePreflight(e,t,n){if(matchesCommandFailure(e,NODE_MISSING_EXIT_CODE,NODE_MISSING_MARKER))throw new Error(`Worker bootstrap requires Node.js on the leased host; install Node in the provider setup phase and retry`);if(matchesCommandFailure(e,NODE_UNSUPPORTED_EXIT_CODE,NODE_UNSUPPORTED_MARKER))throw new Error(`Worker bootstrap requires Node ${SUPPORTED_NODE_VERSION_RANGE.replace(` || `,`, or `)} with WAL-reset-safe SQLite on the leased host; install a supported Node runtime in the provider setup phase and retry`);if(!isSuccess(e))throw commandFailure(`preflight`,e);const r=parseTaggedOutput(e.stdout);if(r?.action===`current`)return{action:`current`,receipt:parseReceiptJson(r.payload,t)};const i=r?.action===`install`?r.payload:void 0;const a=normalizeScpRemotePath(i);const o=`/${BOOTSTRAP_ROOT}/.incoming/${n}`;const s=a?.split(`/`).slice(1).every(e=>e!==``&&e!==`.`&&e!==`..`);if(!a||!s||!a.endsWith(o))throw new Error(`Worker bootstrap preflight returned an invalid upload path`);return{action:`install`,path:a}}async function bootstrapWorker(e,t){const n=e.artifact;const r=t.timeoutMs??6e5;const i=n.install===`bundle`?bundleTransferTimeoutMs(n.tarballBytes,r):r;const a=normalizeHandshake(n);const o=createHash(`sha256`).update(e.operationId).digest(`hex`);const s=`openclaw-upload-${a.bundleHash}.tgz.${o}`;const c=t.runCommand??runCommandWithTimeout;let l=false;const assertCurrent=()=>{t.signal?.throwIfAborted();t.assertCurrent?.()};const runCommand=(e,t)=>{assertCurrent();l=true;return c(e,t)};const u=await prepareWorkerSsh({assertCurrent,ssh:e.ssh,pinnedHostKey:e.pinnedHostKey,resolveIdentity:t.resolveIdentity,temporaryDirectoryPrefix:`openclaw-worker-bootstrap-`});try{const e=await runWorkerSshCandidates(u,r,(e,r)=>runSshScript({prepared:u,runCommand,script:PREFLIGHT_SCRIPT,scriptArgs:[a.bundleHash,JSON.stringify(a),n.install,o],timeoutMs:r,port:e,signal:t.signal}));assertCurrent();const c=parsePreflight(e,a,s);if(c.action===`current`){l=false;return c.receipt}if(n.install===`bundle`){const e=await runWorkerSshCandidates(u,i,(e,r)=>runCommand([`scp`,...workerSshOptions(u,{forwarding:`disabled`}),`-P`,String(e),`--`,n.tarballPath,`${u.scpTarget}:${c.path}`],workerSshCommandOptions({timeoutMs:r,signal:t.signal})));if(!isSuccess(e))throw commandFailure(`bundle transfer`,e)}const d=await runWorkerSshCandidates(u,r,(e,r)=>runSshScript({prepared:u,runCommand,script:INSTALL_SCRIPT,scriptArgs:[n.install,a.bundleHash,n.install===`npm`?n.packageSpec:``,n.install===`npm`?n.packageIntegrity:``,JSON.stringify(a),c.path,n.install===`bundle`?n.tarballSha256:``],timeoutMs:r,port:e,signal:t.signal}));assertCurrent();if(matchesCommandFailure(d,NPM_MISSING_EXIT_CODE,NPM_MISSING_MARKER))throw new Error(`Worker npm bootstrap requires npm on the leased host; use bundle install or provide npm in the provider setup phase`);if(!isSuccess(d))throw commandFailure(`install`,d);const f=parseTaggedOutput(d.stdout);if(f?.action!==`receipt`)throw new Error(`Worker bootstrap install returned an invalid receipt`);return parseReceiptJson(f.payload,a)}finally{if(l)await cleanupRemoteUpload({prepared:u,bundleHash:a.bundleHash,operationToken:o,runCommand:c,timeoutMs:r});await u.dispose()}}
//!src/gateway/worker-environments/identity.ts
function requireIdentity(e){if(typeof e===`object`&&e!==null&&`kind`in e){if(e.kind===`path`&&`path`in e&&typeof e.path===`string`&&e.path.trim())return{kind:`path`,path:e.path};if(e.kind===`material`&&`contents`in e&&typeof e.contents===`string`&&e.contents.trim())return{kind:`material`,contents:e.contents}}throw new Error(`Worker SSH identity resolver returned an invalid identity`)}async function resolveWorkerSshIdentity(e){e.assertAuthorized();const t={leaseId:e.leaseId,profile:e.profile,keyRef:e.keyRef,assertCurrent:e.assertAuthorized};const n=e.provider.resolveSshIdentity?await e.provider.resolveSshIdentity(t):await e.resolveGeneric(e.keyRef,e.assertAuthorized);e.assertAuthorized();return requireIdentity(n)}export{bootstrapWorker,createWorkerBundleProducer,resolveSecretRefString,resolveWorkerNpmInstallationArtifact,resolveWorkerSshIdentity};