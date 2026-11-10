import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{l as t}from"./worker-chunk-BhGVY1Gh.mjs";import{d as n,f as r,n as i,p as a,s as o,t as s}from"./worker-chunk-Dgs2T4kl.mjs";import{n as c,u as l}from"./worker-chunk-Beu5zrK3.mjs";import{o as u}from"./worker-chunk-Cp0IHMVk.mjs";import{i as d}from"./worker-chunk-GpXIZijZ.mjs";import{c as f,l as p}from"./worker-chunk-D-pM6VZQ.mjs";import{i as ee,n as te,u as ne}from"./worker-chunk-Bocl21Et.mjs";import{n as re,r as ie}from"./worker-chunk-O3z06M-B.mjs";import"./worker-chunk-rwx3liFc.mjs";import{i as ae,t as oe}from"./worker-chunk-DOewRsrF.mjs";import{a as se,n as ce}from"./worker-chunk-DtA3s48u.mjs";import{a as le,n as ue}from"./worker-chunk-C9wC4bov.mjs";import{a as m}from"./worker-chunk-CNgSmAKj.mjs";import{n as de}from"./worker-chunk-BiUp0xOu.mjs";import{n as fe,t as pe}from"./worker-chunk-Af7r65nx.mjs";import{f as h,i as g,r as _}from"./worker-chunk-CtFzsM1Q.mjs";import{Cs as me,t as he}from"./worker-chunk-B3ZDM02K.mjs";import{n as ge,t as _e}from"./worker-chunk-DkRcUDvy.mjs";import{o as v,t as y}from"./worker-chunk-BjT7d01v.mjs";import{n as ve,t as ye}from"./worker-chunk-CPJvwX7r.mjs";import{c as be,f as b,n as xe,s as Se}from"./worker-chunk-BSccRIbD.mjs";import{a as Ce,i as we}from"./worker-chunk-ChwBRLXp.mjs";import{r as Te,t as Ee}from"./worker-chunk-CwWosWj-.mjs";import{c as De,i as x,n as Oe,o as ke,t as Ae}from"./worker-chunk-6A5PdfkN.mjs";import{r as je,t as S}from"./worker-chunk-C8phByjR.mjs";import{a as C,i as w,n as Me,r as T,t as E}from"./worker-chunk-CEyf3OIf.mjs";import{createReadStream as D}from"node:fs";import O from"node:path";import{createHash as k,randomUUID as Ne}from"node:crypto";import A from"node:fs/promises";import{pipeline as Pe}from"node:stream/promises";function normalizeHandshake(e){let t=e.bundleHash.trim(),n=e.openclawVersion.trim(),r=e.protocolFeatures.map(e=>e.trim());if(!V.test(t))throw Error(`Worker bundle hash must be a lowercase SHA-256 digest`);if(!n)throw Error(`Worker OpenClaw version must be non-empty`);if(r.length>64||r.some(e=>!e)||r.some(e=>e.length>128)||new Set(r).size!==r.length)throw Error(`Worker protocol features must be unique non-empty strings`);if(e.install===`npm`){if(!g(n)||e.packageSpec!==`openclaw@${n}`)throw Error(`Worker npm install must use exact package openclaw@${n}`);if(!H.test(e.packageIntegrity))throw Error(`Worker npm install requires a pinned SHA-512 package integrity`)}else if(!V.test(e.tarballSha256))throw Error(`Worker bundle archive digest must be a lowercase SHA-256 digest`);return{bundleHash:t,openclawVersion:n,protocolFeatures:r}}function parseReceiptJson(e,t){let n;try{n=JSON.parse(e??``)}catch{throw Error(`Worker bootstrap returned an invalid receipt`)}if(!me(n))throw Error(`Worker bootstrap returned an invalid receipt`);if(n.bundleHash!==t.bundleHash||n.openclawVersion!==t.openclawVersion||n.protocolFeatures.length!==t.protocolFeatures.length||n.protocolFeatures.some((e,n)=>e!==t.protocolFeatures[n]))throw Error(`Worker bootstrap receipt does not match the requested artifact`);return n}async function cleanupRemoteUpload(e){let t=Math.min(e.timeoutMs,1e4);await x(e.prepared,t,(t,n)=>C({prepared:e.prepared,runCommand:e.runCommand,script:Le,scriptArgs:[e.bundleHash,e.operationToken],timeoutMs:n,port:t})).catch(()=>void 0)}function parseTaggedOutput(e){let t=`${B}\t`,n=e.split(/\r?\n/u).findLast(e=>e.startsWith(t));if(!n)return;let r=n.indexOf(`	`,t.length);if(r===-1)return;let i=n.slice(t.length,r),a=n.slice(r+1).trim();return i&&a?{action:i,payload:a}:void 0}function parsePreflight(e,t,n){if(w(e,N,L))throw Error(`Worker bootstrap requires Node.js on the leased host; install Node in the provider setup phase and retry`);if(w(e,F,R))throw Error(`Worker bootstrap requires Node ${ee.replace(` || `,`, or `)} with WAL-reset-safe SQLite on the leased host; install a supported Node runtime in the provider setup phase and retry`);if(!T(e))throw E(`preflight`,e);let r=parseTaggedOutput(e.stdout);if(r?.action===`current`)return{action:`current`,receipt:parseReceiptJson(r.payload,t)};let i=r?.action===`install`?r.payload:void 0,a=Te(i),o=`/${j}/.incoming/${n}`,s=a?.split(`/`).slice(1).every(e=>e!==``&&e!==`.`&&e!==`..`);if(!a||!s||!a.endsWith(o))throw Error(`Worker bootstrap preflight returned an invalid upload path`);return{action:`install`,path:a}}async function bootstrapWorker(e,t){let n=e.artifact,r=t.timeoutMs??6e5,i=n.install===`bundle`?we(n.tarballBytes,r):r,a=normalizeHandshake(n),o=k(`sha256`).update(e.operationId).digest(`hex`),s=`openclaw-upload-${a.bundleHash}.tgz.${o}`,c=t.runCommand??v,l=!1,assertCurrent=()=>{t.signal?.throwIfAborted(),t.assertCurrent?.()},runCommand=(e,t)=>(assertCurrent(),l=!0,c(e,t)),u=await Oe({assertCurrent,ssh:e.ssh,pinnedHostKey:e.pinnedHostKey,resolveIdentity:t.resolveIdentity,temporaryDirectoryPrefix:`openclaw-worker-bootstrap-`});try{let e=await x(u,r,(e,r)=>C({prepared:u,runCommand,script:Z,scriptArgs:[a.bundleHash,JSON.stringify(a),n.install,o],timeoutMs:r,port:e,signal:t.signal}));assertCurrent();let c=parsePreflight(e,a,s);if(c.action===`current`)return l=!1,c.receipt;if(n.install===`bundle`){let e=await x(u,i,(e,r)=>runCommand([`scp`,...De(u,{forwarding:`disabled`}),`-P`,String(e),`--`,n.tarballPath,`${u.scpTarget}:${c.path}`],ke({timeoutMs:r,signal:t.signal})));if(!T(e))throw E(`bundle transfer`,e)}let d=await x(u,r,(e,r)=>C({prepared:u,runCommand,script:Ie,scriptArgs:[n.install,a.bundleHash,n.install===`npm`?n.packageSpec:``,n.install===`npm`?n.packageIntegrity:``,JSON.stringify(a),c.path,n.install===`bundle`?n.tarballSha256:``],timeoutMs:r,port:e,signal:t.signal}));if(assertCurrent(),w(d,P,z))throw Error(`Worker npm bootstrap requires npm on the leased host; use bundle install or provide npm in the provider setup phase`);if(!T(d))throw E(`install`,d);let f=parseTaggedOutput(d.stdout);if(f?.action!==`receipt`)throw Error(`Worker bootstrap install returned an invalid receipt`);return parseReceiptJson(f.payload,a)}finally{l&&await cleanupRemoteUpload({prepared:u,bundleHash:a.bundleHash,operationToken:o,runCommand:c,timeoutMs:r}),await u.dispose()}}var j,M,N,P,Fe,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Ie,Le,Re=e((()=>{ne(),he(),_(),Ee(),y(),a(),Me(),Ce(),Ae(),j=`.openclaw-worker`,M=`bootstrap-receipt.json`,N=42,P=43,Fe=44,F=45,I=3600,L=`OPENCLAW_WORKER_NODE_MISSING`,R=`OPENCLAW_WORKER_NODE_UNSUPPORTED`,z=`OPENCLAW_WORKER_NPM_MISSING`,B=`OPENCLAW_WORKER_BOOTSTRAP_V1`,V=/^[a-f0-9]{64}$/u,H=/^sha512-[A-Za-z0-9+/]{86}==$/u,U=String.raw`const parse = (value) => /^(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number); const atLeast = (version, floor) => version[0] > floor[0] || (version[0] === floor[0] && (version[1] > floor[1] || (version[1] === floor[1] && version[2] >= floor[2])));
function checkRuntime() {
  const nodeSafe = ${te};
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
try { process.exitCode = checkRuntime(); } catch { process.exitCode = 1; }`,W=String.raw`const fs = require("node:fs");
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
}`,G=String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const npm = process.argv[3] === "npm";
  const actual = (npm ? "sha512-" : "") + crypto.createHash(npm ? "sha512" : "sha256").update(fs.readFileSync(process.argv[1])).digest(npm ? "base64" : "hex");
  process.exitCode = actual === process.argv[2] ? 0 : 1;
} catch {
  process.exitCode = 1;
}`,K=String.raw`const fs = require("node:fs");
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
}`,q=`const artifactPaths = ${JSON.stringify(s)};
const chunkPathPattern = ${i.toString()};`,J=String.raw`const fs = require("node:fs");
const expected = "package/dist/worker-artifacts/" + process.argv[2] + ".tar.gz";
const selected = fs.readFileSync(process.argv[1], "utf8").split("\n").filter((entry) => entry === expected);
if (selected.length !== 1) throw new Error("missing or duplicate packaged worker bundle archive");
process.stdout.write(selected.join("\n") + "\n");`,Y=String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[1];
const expected = process.argv[2];
const install = process.argv[3];
${q}
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
  hash.update("${o}" + separator);
  for (const entry of entries) {
    hash.update(entry.path + separator + entry.mode.toString(8) + separator + entry.size + separator + entry.sha256 + separator);
  }
  process.exitCode = hash.digest("hex") === expected ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}`,X=String.raw`ensure_private_directory() {
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
}`,Z=String.raw`set -eu
umask 077
hash=$1
expected_receipt=$2
install=$3
operation_token=$4
root=$HOME/${j}
install_dir=$root/$hash
receipt=$install_dir/${M}

case "$operation_token" in
  *[!a-f0-9]*|'') printf '%s\n' 'invalid worker bootstrap operation token' >&2; exit 2 ;;
esac
if [ "${"${"}#operation_token}" -ne 64 ]; then
  printf '%s\n' 'invalid worker bootstrap operation token' >&2
  exit 2
fi

${X}

ensure_private_directory "$root"

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' '${L}' >&2
  exit ${N}
fi

if ! node -e '${U}'; then
  printf '%s: ' '${R}' >&2
  node --version >&2 || true
  exit ${F}
fi

incoming=$root/.incoming
ensure_private_directory "$incoming"
incoming=$(cd "$incoming" && pwd -P)
find "$incoming" -type f -name 'openclaw-upload-*.tgz.*' -mmin +60 -exec rm -f -- {} + 2>/dev/null || true
upload=$incoming/openclaw-upload-$hash.tgz.$operation_token

if [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
  node -e '${W}' "$receipt" "$expected_receipt" &&
  node -e '${Y}' "$install_dir" "$hash" "$install"; then
  rm -f -- "$upload"
  printf '%s\t%s\t' '${B}' current
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
printf '%s\t%s\t%s\n' '${B}' install "$upload"
`,Ie=String.raw`set -eu
umask 077
install=$1
hash=$2
package_spec=$3
package_integrity=$4
receipt_json=$5
upload=$6
archive_sha256=$7
root=$HOME/${j}
install_dir=$root/$hash
receipt=$install_dir/${M}
staging=$root/.staging-$hash-$$
lock_root=$root/.locks
lock=$lock_root/$hash
locked=0
lock_identity="$$:$(date +%s)"

${X}

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
    node -e '${W}' "$receipt" "$receipt_json" &&
    node -e '${Y}' "$install_dir" "$hash" "$install"
}

finish_with_receipt() {
  # A durable receipt makes retries independent of this operation's upload.
  rm -f -- "$upload"
  printf '%s\t%s\t' '${B}' receipt
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
              if [ "$owner_started" -le "$now" ] && [ $((now - owner_started)) -le ${I} ]; then
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
      exit ${Fe}
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
    if ! node -e '${G}' "$upload" "$archive_sha256" "$install"; then
      printf '%s\n' 'worker bundle archive digest mismatch' >&2
      exit 2
    fi
    tar -xzf "$upload" -C "$staging"
    ;;
  npm)
    if ! command -v npm >/dev/null 2>&1; then
      printf '%s\n' '${z}' >&2
      exit ${P}
    fi
    npm_pack_json=$staging/npm-pack.json
    npm pack "$package_spec" --pack-destination "$staging" --ignore-scripts --json --registry=https://registry.npmjs.org/ > "$npm_pack_json"
    package_archive=$(node -e '${K}' "$npm_pack_json")
    package_archive=$staging/$package_archive
    if ! node -e '${G}' "$package_archive" "$package_integrity" "$install"; then
      printf '%s\n' 'worker npm package integrity mismatch' >&2
      exit 2
    fi
    tar -tzf "$package_archive" > "$staging/npm-members.txt"
    node -e '${J}' "$staging/npm-members.txt" "$hash" > "$staging/npm-worker-files.txt"
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

if ! node -e '${Y}' "$staging" "$hash" "$install"; then
  printf '%s\n' 'worker install content does not match the expected bundle hash' >&2
  exit 2
fi
printf '%s\n' "$receipt_json" > "$staging/${M}"
chmod 600 "$staging/${M}"
rm -rf "$install_dir"
mv "$staging" "$install_dir"
finish_with_receipt
`,Le=String.raw`set -eu
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
root=$HOME/${j}
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
`}));function requireArchivePath(e){if(!e||e.length>ze||e.includes(`\\`)||e.includes(`\0`)||e.startsWith(`/`)||O.posix.normalize(e)!==e||e===`..`||e.startsWith(`../`))throw Error(`Invalid worker bundle archive path: ${e}`);return e}async function readWorkerBundleArchiveManifest(e,t){let r=[],i=/* @__PURE__ */ new Set,a=0,o=xe({strict:!0,maxDepth:Q,maxDecompressionRatio:Be,onReadEntry(e){try{let n=requireArchivePath(e.path);if(i.has(n))throw Error(`Duplicate worker bundle archive path: ${n}`);if(i.add(n),i.size>t.maxEntries)throw Error(`Worker bundle archive exceeds its entry limit`);if(!Number.isSafeInteger(e.size)||e.size<0)throw Error(`Invalid worker bundle archive size: ${n}`);if(a+=e.size,!Number.isSafeInteger(a)||a>t.maxExpandedBytes)throw Error(`Worker bundle archive exceeds its expanded byte limit`);let o=k(`sha256`),s={path:n,mode:e.mode,headerSize:e.size,actualSize:0,type:e.type};r.push(s),e.on(`data`,e=>{s.actualSize+=e.byteLength,o.update(e)}),e.on(`end`,()=>{s.sha256=o.digest(`hex`)}),e.on(`error`,e=>{s.error=e instanceof Error?e:Error(String(e))})}catch(e){o.abort(e instanceof Error?e:Error(String(e)))}}});try{await Pe(D(e,{highWaterMark:16777216}),o)}catch(e){throw o.abort(e instanceof Error?e:Error(String(e))),e}return r.map(e=>{if(e.error)throw e.error;if(e.type!==`File`||e.mode===void 0||e.actualSize!==e.headerSize||e.sha256===void 0)throw Error(`Invalid worker bundle tar entry: ${e.path}`);return{path:e.path,mode:process.platform===`win32`?448:e.mode,size:e.actualSize,sha256:e.sha256}}).toSorted((e,t)=>n(e.path,t.path))}var ze,Q,Be,Ve=e((()=>{b(),a(),je(),ze=1024,Q=64,Be=64}));async function stageWorkerDeployArtifact(e){let n=`dist/worker/${e.artifactPath}`,{buffer:r}=await e.source.read(n,{symlinks:`reject`,hardlinks:`allow`}).catch(r=>{throw r instanceof t&&r.category===`policy`?Error(`Unsafe worker deploy artifact: ${n}`,{cause:r}):Error(`OpenClaw worker deploy artifact is missing; build the running package at ${e.sourceRoot}`,{cause:r})});return await A.writeFile(O.join(e.stagingRoot,e.artifactPath),r,{flag:`wx`,mode:448}),{path:e.artifactPath,mode:448,size:r.byteLength,sha256:k(`sha256`).update(r).digest(`hex`)}}async function collectWorkerBundleManifest(e,t){let[r,a]=await Promise.all([se(e,{maxBytes:1/0}),A.readdir(O.join(e,`dist/worker`))]).catch(t=>{throw Error(`OpenClaw worker deploy artifact is missing; build the running package at ${e}`,{cause:t})}),o=a.filter(e=>i.test(e)),{results:c,hasError:l,firstError:u}=await ge({tasks:[...s,...o].map(n=>()=>stageWorkerDeployArtifact({sourceRoot:e,source:r,stagingRoot:t,artifactPath:n})),limit:He,errorMode:`stop`});if(l)throw u;return c.toSorted((e,t)=>n(e.path,t.path))}var He,Ue=e((()=>{ce(),a(),_e(),He=16}));function normalizeProtocolFeatures(e){let t=e.map(e=>e.trim());if(t.some(e=>e.length===0))throw Error(`Worker protocol features must be non-empty strings`);return[...new Set(t)].toSorted(n)}function resolveBundleCacheDir(e){return e?O.resolve(e):O.join(d(),`cache`,`worker-bundles`)}function resolvePackageRoot(e){if(e)return O.resolve(e);let t=ae({moduleUrl:import.meta.url,argv1:process.argv[1],cwd:process.cwd()});if(!t)throw Error(`Unable to locate the running OpenClaw package root for worker bundling`);return t}async function isReleasedPackageInstall(e){let t=new Set(await A.readdir(e));return!t.has(`.git`)&&!t.has(`pnpm-lock.yaml`)&&!t.has(`bun.lock`)&&!t.has(`bun.lockb`)}function parseNpmPackageIdentity(e){if(!p(e))return;let t=l(e.name),n=l(e.version),r=l(e.integrity)??l(e[`dist.integrity`]),i=l(e.filename);return t&&n&&r?{name:t,version:n,integrity:r,filename:i}:void 0}async function runNpmProofCommand(e){try{let t=await v(e.argv,{cwd:e.cwd,timeoutMs:We,env:{COREPACK_ENABLE_DOWNLOAD_PROMPT:`0`,NPM_CONFIG_IGNORE_SCRIPTS:`true`}});if(t.code!==0||t.stdoutTruncatedBytes)throw Error(e.failureMessage);return JSON.parse(t.stdout.trim())}catch{throw Error(e.failureMessage)}}async function hashNpmTarballIntegrity(e){let t=k(`sha512`);for await(let n of D(e))t.update(n);return`sha512-${t.digest(`base64`)}`}async function verifyPublishedNpmRelease(e){let t=await A.mkdtemp(O.join(ie(),`openclaw-worker-npm-proof-`));try{let n=parseNpmPackageIdentity(h(await runNpmProofCommand({argv:[`npm`,`view`,`openclaw@${e.version}`,`name`,`version`,`dist.integrity`,`--json`,`--registry=${$}`],cwd:t,failureMessage:`OpenClaw ${e.version} is not published; use the worker bundle install`}))[0]);if(n?.name!==`openclaw`||n.version!==e.version||!Ge.test(n.integrity))throw Error(`Cannot verify exact public npm release openclaw@${e.version}; use the worker bundle install`);let r=await runNpmProofCommand({argv:[`npm`,`pack`,`openclaw@${e.version}`,`--pack-destination`,t,`--ignore-scripts`,`--json`,`--registry=${$}`],cwd:t,failureMessage:`Unable to verify the installed OpenClaw package; use the worker bundle install`}),i=parseNpmPackageIdentity(h(r)[0]);if(!i?.filename||O.basename(i.filename)!==i.filename)throw Error(`npm pack returned incomplete worker package metadata`);let a=O.join(t,i.filename),o;try{o=await hashNpmTarballIntegrity(a)}catch{throw Error(`Unable to verify the installed OpenClaw package; use the worker bundle install`)}if(i.name!==n.name||i.version!==n.version||i.integrity!==n.integrity||o!==n.integrity)throw Error(`Installed OpenClaw ${e.version} does not match the published package; use the worker bundle install`);let s=O.join(t,`package`);if(await A.mkdir(s),await be({cwd:s,file:a,preservePaths:!1,strict:!0,strip:1}),(await prepareWorkerBundle({packageRoot:s,cacheDir:O.join(t,`bundle-cache`),openclawVersion:e.version})).bundleHash!==e.bundleHash)throw Error(`Published OpenClaw ${e.version} does not match the prepared worker bundle; use the worker bundle install`);return n.integrity}finally{await A.rm(t,{recursive:!0,force:!0})}}async function isCachedTarball(e){try{let t=await A.lstat(e);if(t.isSymbolicLink()||!t.isFile())throw Error(`Unsafe worker bundle cache path: ${e}`);return!0}catch(e){if(e.code===`ENOENT`)return!1;throw e}}async function cachedTarballMatches(e,t){if(!await isCachedTarball(e))return!1;try{return r(await readWorkerBundleArchiveManifest(e,S))===r(t)}catch{return!1}}async function writeTarball(e){let t=`${e.tarballPath}.${process.pid}.${Ne()}.tmp`;try{await Se({cwd:e.stagingRoot,file:t,gzip:!0,noDirRecurse:!0,noMtime:!0,portable:!0,strict:!0,onWriteEntry:({stat:e})=>{e&&(e.mode=e.mode&-512|448)}},e.entries.map(e=>e.path));try{await A.rename(t,e.tarballPath)}catch(n){if(n.code!==`EEXIST`)throw n;if(!await cachedTarballMatches(e.tarballPath,e.entries)){await A.rm(e.tarballPath,{force:!0});try{await A.rename(t,e.tarballPath)}catch(t){if(t.code!==`EEXIST`||!await cachedTarballMatches(e.tarballPath,e.entries))throw t}}}}finally{await A.rm(t,{force:!0})}}async function pruneWorkerBundleCache(e){let t;try{t=await A.readdir(e.cacheDir,{withFileTypes:!0})}catch(t){t.code!==`ENOENT`&&e.onError?.(t);return}let r=t.map(({name:e})=>({name:e,bundleHash:Ke.exec(e)?.[1],staging:qe.test(e)})).filter(({name:t,bundleHash:n,staging:r})=>n!==void 0&&n!==e.currentBundleHash||r||Je.test(t));if(r.length===0)return;let i=new Set([e.currentBundleHash,...await e.readRetainedBundleHashes()].filter(e=>/^[a-f0-9]{64}$/u.test(e)));for(let t of r.toSorted((e,t)=>n(e.name,t.name))){if(t.bundleHash!==void 0&&i.has(t.bundleHash))continue;let n=O.join(e.cacheDir,t.name);try{let e=await A.lstat(n);if(e.isSymbolicLink()||(t.staging?!e.isDirectory():!e.isFile()))continue;await A.rm(n,{recursive:t.staging,force:!0})}catch(t){t.code!==`ENOENT`&&e.onError?.(t)}}}async function prepareWorkerBundle(e){let t=resolvePackageRoot(e.packageRoot),n=(e.openclawVersion??pe).trim();if(!n)throw Error(`Worker bundle requires a non-empty OpenClaw version`);let i=normalizeProtocolFeatures(e.protocolFeatures??[]),a=await resolvePackagedWorkerBundle({packageRoot:t,openclawVersion:n,protocolFeatures:i});if(a)return a;let o=resolveBundleCacheDir(e.cacheDir);await A.mkdir(o,{recursive:!0});let s=await A.mkdtemp(O.join(o,`.staging-`));try{let e=await collectWorkerBundleManifest(t,s),a=r(e),c=O.join(o,`${a}.tgz`);await cachedTarballMatches(c,e)||await writeTarball({stagingRoot:s,entries:e,tarballPath:c});await using l=await A.open(c,`r`);return{install:`bundle`,bundleHash:a,openclawVersion:n,protocolFeatures:i,tarballBytes:(await A.stat(c)).size,tarballSha256:(await m(l)).digest,tarballPath:c}}finally{await A.rm(s,{recursive:!0,force:!0})}}async function resolvePackagedWorkerBundle(e){try{return await A.access(O.join(e.packageRoot,`dist/worker`)),null}catch(e){if(!p(e)||e.code!==`ENOENT`)throw e}let t=O.join(e.packageRoot,Xe),n;try{n=await A.readdir(t,{withFileTypes:!0})}catch(e){if(p(e)&&e.code===`ENOENT`)return null;throw e}if(n.length!==1||!n[0].isFile())throw Error(`Packaged worker bundle must contain exactly one regular archive`);let a=Ye.exec(n[0].name);if(!a)throw Error(`Packaged worker bundle archive name is invalid`);let o=O.join(t,n[0].name),c=await readWorkerBundleArchiveManifest(o,S),l=new Set(c.map(e=>e.path)),u=new Set(s);if(s.some(e=>!l.has(e))||c.some(e=>!u.has(e.path)&&!i.test(e.path)))throw Error(`Packaged worker bundle archive does not match the worker artifact contract`);let d=r(c);if(d!==a[1])throw Error(`Packaged worker bundle archive name does not match its manifest hash`);await using f=await A.open(o,`r`);return{install:`bundle`,bundleHash:d,openclawVersion:e.openclawVersion,protocolFeatures:e.protocolFeatures,tarballBytes:(await f.stat()).size,tarballSha256:(await m(f)).digest,tarballPath:o}}function createWorkerBundleProducer(e={}){let t,n=Promise.resolve();return{prepare:ue(async()=>(t=await prepareWorkerBundle(e),t)),async prune(r){let i=t;if(e.cacheOwnership!==`exclusive`||!i)return;let a=n.then(async()=>{await pruneWorkerBundleCache({cacheDir:resolveBundleCacheDir(e.cacheDir),currentBundleHash:i.bundleHash,readRetainedBundleHashes:r,onError:e.onCacheCleanupError})});n=a.catch(()=>void 0),await a}}}async function resolveWorkerNpmInstallationArtifact(e){let t=e.bundle.openclawVersion.trim();if(!g(t))throw Error(`Worker npm install requires the exact published gateway version; expected ${t}`);let n=resolvePackageRoot(e.packageRoot);if(!(e.isPackageInstall?await e.isPackageInstall(n):await isReleasedPackageInstall(n)))throw Error(`Worker npm install requires the gateway to run from a packaged release install`);let r=await(e.verifyRelease??verifyPublishedNpmRelease)({bundleHash:e.bundle.bundleHash,version:t});return{install:`npm`,bundleHash:e.bundle.bundleHash,openclawVersion:t,packageIntegrity:r,protocolFeatures:e.bundle.protocolFeatures,packageSpec:`openclaw@${t}`}}var $,We,Ge,Ke,qe,Je,Ye,Xe,Ze=e((()=>{f(),c(),b(),u(),de(),_(),oe(),re(),y(),le(),Ve(),a(),fe(),Ue(),$=`https://registry.npmjs.org/`,We=6e4,Ge=/^sha512-[A-Za-z0-9+/]{86}==$/u,Ke=/^([a-f0-9]{64})\.tgz$/u,qe=/^\.staging-[A-Za-z0-9_-]+$/u,Je=/^[a-f0-9]{64}\.tgz\.[0-9]+\.[0-9a-f-]{36}\.tmp$/u,Ye=/^([a-f0-9]{64})\.tar\.gz$/u,Xe=`dist/worker-artifacts`}));function requireIdentity(e){if(typeof e==`object`&&e&&`kind`in e){if(e.kind===`path`&&`path`in e&&typeof e.path==`string`&&e.path.trim())return{kind:`path`,path:e.path};if(e.kind===`material`&&`contents`in e&&typeof e.contents==`string`&&e.contents.trim())return{kind:`material`,contents:e.contents}}throw Error(`Worker SSH identity resolver returned an invalid identity`)}async function resolveWorkerSshIdentity(e){e.assertAuthorized();let t={leaseId:e.leaseId,profile:e.profile,keyRef:e.keyRef,assertCurrent:e.assertAuthorized},n=e.provider.resolveSshIdentity?await e.provider.resolveSshIdentity(t):await e.resolveGeneric(e.keyRef,e.assertAuthorized);return e.assertAuthorized(),requireIdentity(n)}var Qe=e((()=>{}));e((()=>{ye(),Re(),Ze(),Qe()}))();export{bootstrapWorker,createWorkerBundleProducer,ve as resolveSecretRefString,resolveWorkerNpmInstallationArtifact,resolveWorkerSshIdentity};