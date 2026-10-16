import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{d as t,l as n,n as r,o as i,t as a,u as o}from"./worker-chunk-D6wFHLsG.mjs";import{i as s,n as c}from"./worker-chunk-DoVH2ZtP.mjs";import{n as l,u}from"./worker-chunk-Beu5zrK3.mjs";import{a as d,n as f}from"./worker-chunk-C9wC4bov.mjs";import{a as ee,v as te}from"./worker-chunk-CFKOiz5W.mjs";import{c as ne,l as p}from"./worker-chunk-D-pM6VZQ.mjs";import{A as re,o as ie}from"./worker-chunk-2YU_cJ4H.mjs";import{c as ae,t as oe}from"./worker-chunk-cJL0YIWU.mjs";import{n as se,r as ce}from"./worker-chunk-O3z06M-B.mjs";import"./worker-chunk-CRRC7jFT.mjs";import{a as m,n as le}from"./worker-chunk-BLTrvFP2.mjs";import{o as h}from"./worker-chunk-DuUytNfU.mjs";import{n as g}from"./worker-chunk-CUSFQFQE.mjs";import{i as ue,t as de}from"./worker-chunk-D7ww9rMn.mjs";import{n as fe,t as pe}from"./worker-chunk-Dpfm-ucS.mjs";import{f as me,i as he,r as ge}from"./worker-chunk-CXuwPL8B.mjs";import{Cs as _e,t as ve}from"./worker-chunk-DwT8ulJv.mjs";import{o as ye,t as be}from"./worker-chunk-D9mUvWOb.mjs";import{n as xe,t as Se}from"./worker-chunk-C5ocVuP7.mjs";import{c as Ce,f as _,n as we,s as Te}from"./worker-chunk-CJ6HCfkS.mjs";import{a as Ee,i as De}from"./worker-chunk-ChwBRLXp.mjs";import{r as Oe,t as ke}from"./worker-chunk-B3dfBiM5.mjs";import{a as v,i as y,n as Ae,o as b,s as je,t as x}from"./worker-chunk-HKuvux1v.mjs";import{r as Me,t as S}from"./worker-chunk-C8phByjR.mjs";import{createReadStream as C}from"node:fs";import w from"node:path";import{createHash as T,randomUUID as Ne}from"node:crypto";import E from"node:fs/promises";import{pipeline as Pe}from"node:stream/promises";function commandFailure(e,t){let n=s(te(t.stderr.trim()||t.stdout.trim(),{mode:`tools`}).replace(/\s+/gu,` `),512),r=t.termination===`exit`?`exit ${t.code??`unknown`}`:t.termination;return/* @__PURE__ */ Error(`Worker bootstrap ${e} failed (${r})${n?`: ${n}`:``}`)}function isSuccess(e){return e.termination===`exit`&&e.code===0}function matchesCommandFailure(e,t,n){return e.code===t||e.stderr.includes(n)||e.stdout.includes(n)}async function runSshScript(e){return await e.runCommand([`ssh`,...b(e.prepared,{forwarding:`disabled`}),`-a`,`-x`,`-T`,`-p`,String(e.port??e.prepared.port),`--`,e.prepared.sshTarget,je([`sh`,`-s`,`--`,...e.scriptArgs])],v({input:e.script,timeoutMs:e.timeoutMs,signal:e.signal}))}var Fe=e((()=>{c(),ee(),x()}));function normalizeHandshake(e){let t=e.bundleHash.trim(),n=e.openclawVersion.trim(),r=e.protocolFeatures.map(e=>e.trim());if(!R.test(t))throw Error(`Worker bundle hash must be a lowercase SHA-256 digest`);if(!n)throw Error(`Worker OpenClaw version must be non-empty`);if(r.length>64||r.some(e=>!e)||r.some(e=>e.length>128)||new Set(r).size!==r.length)throw Error(`Worker protocol features must be unique non-empty strings`);if(e.install===`npm`){if(!he(n)||e.packageSpec!==`openclaw@${n}`)throw Error(`Worker npm install must use exact package openclaw@${n}`);if(!z.test(e.packageIntegrity))throw Error(`Worker npm install requires a pinned SHA-512 package integrity`)}else if(!R.test(e.tarballSha256))throw Error(`Worker bundle archive digest must be a lowercase SHA-256 digest`);return{bundleHash:t,openclawVersion:n,protocolFeatures:r}}function parseReceiptJson(e,t){let n;try{n=JSON.parse(e??``)}catch{throw Error(`Worker bootstrap returned an invalid receipt`)}if(!_e(n))throw Error(`Worker bootstrap returned an invalid receipt`);if(n.bundleHash!==t.bundleHash||n.openclawVersion!==t.openclawVersion||n.protocolFeatures.length!==t.protocolFeatures.length||n.protocolFeatures.some((e,n)=>e!==t.protocolFeatures[n]))throw Error(`Worker bootstrap receipt does not match the requested artifact`);return n}async function cleanupRemoteUpload(e){let t=Math.min(e.timeoutMs,1e4);await y(e.prepared,t,(t,n)=>runSshScript({prepared:e.prepared,runCommand:e.runCommand,script:Le,scriptArgs:[e.bundleHash,e.operationToken],timeoutMs:n,port:t})).catch(()=>void 0)}function parseTaggedOutput(e){let t=`${L}\t`,n=e.split(/\r?\n/u).findLast(e=>e.startsWith(t));if(!n)return;let r=n.indexOf(`	`,t.length);if(r===-1)return;let i=n.slice(t.length,r),a=n.slice(r+1).trim();return i&&a?{action:i,payload:a}:void 0}function parsePreflight(e,t,n){if(matchesCommandFailure(e,k,P))throw Error(`Worker bootstrap requires Node.js on the leased host; install Node in the provider setup phase and retry`);if(matchesCommandFailure(e,M,F))throw Error(`Worker bootstrap requires Node 24.16.0+ or 26.1.0+ with WAL-reset-safe SQLite on the leased host; install a supported Node runtime in the provider setup phase and retry`);if(!isSuccess(e))throw commandFailure(`preflight`,e);let r=parseTaggedOutput(e.stdout);if(r?.action===`current`)return{action:`current`,receipt:parseReceiptJson(r.payload,t)};let i=r?.action===`install`?r.payload:void 0,a=Oe(i),o=`/${D}/.incoming/${n}`,s=a?.split(`/`).slice(1).every(e=>e!==``&&e!==`.`&&e!==`..`);if(!a||!s||!a.endsWith(o))throw Error(`Worker bootstrap preflight returned an invalid upload path`);return{action:`install`,path:a}}async function bootstrapWorker(e,t){let n=e.artifact,r=t.timeoutMs??6e5,i=n.install===`bundle`?De(n.tarballBytes,r):r,a=normalizeHandshake(n),o=T(`sha256`).update(e.operationId).digest(`hex`),s=`openclaw-upload-${a.bundleHash}.tgz.${o}`,c=t.runCommand??ye,l=!1,assertCurrent=()=>{t.signal?.throwIfAborted(),t.assertCurrent?.()},runCommand=(e,t)=>(assertCurrent(),l=!0,c(e,t)),u=await Ae({assertCurrent,ssh:e.ssh,pinnedHostKey:e.pinnedHostKey,resolveIdentity:t.resolveIdentity,temporaryDirectoryPrefix:`openclaw-worker-bootstrap-`});try{let e=await y(u,r,(e,r)=>runSshScript({prepared:u,runCommand,script:J,scriptArgs:[a.bundleHash,JSON.stringify(a),n.install,o],timeoutMs:r,port:e,signal:t.signal}));assertCurrent();let c=parsePreflight(e,a,s);if(c.action===`current`)return l=!1,c.receipt;if(n.install===`bundle`){let e=await y(u,i,(e,r)=>runCommand([`scp`,...b(u,{forwarding:`disabled`}),`-P`,String(e),`--`,n.tarballPath,`${u.scpTarget}:${c.path}`],v({timeoutMs:r,signal:t.signal})));if(!isSuccess(e))throw commandFailure(`bundle transfer`,e)}let d=await y(u,r,(e,r)=>runSshScript({prepared:u,runCommand,script:Ie,scriptArgs:[n.install,a.bundleHash,n.install===`npm`?n.packageSpec:``,n.install===`npm`?n.packageIntegrity:``,JSON.stringify(a),c.path,n.install===`bundle`?n.tarballSha256:``],timeoutMs:r,port:e,signal:t.signal}));if(assertCurrent(),matchesCommandFailure(d,A,I))throw Error(`Worker npm bootstrap requires npm on the leased host; use bundle install or provide npm in the provider setup phase`);if(!isSuccess(d))throw commandFailure(`install`,d);let f=parseTaggedOutput(d.stdout);if(f?.action!==`receipt`)throw Error(`Worker bootstrap install returned an invalid receipt`);return parseReceiptJson(f.payload,a)}finally{l&&await cleanupRemoteUpload({prepared:u,bundleHash:a.bundleHash,operationToken:o,runCommand:c,timeoutMs:r}),await u.dispose()}}var D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Ie,Le,Re=e((()=>{ae(),ve(),ge(),ke(),be(),t(),Fe(),Ee(),x(),D=`.openclaw-worker`,O=`bootstrap-receipt.json`,k=42,A=43,j=44,M=45,N=3600,P=`OPENCLAW_WORKER_NODE_MISSING`,F=`OPENCLAW_WORKER_NODE_UNSUPPORTED`,I=`OPENCLAW_WORKER_NPM_MISSING`,L=`OPENCLAW_WORKER_BOOTSTRAP_V1`,R=/^[a-f0-9]{64}$/u,z=/^sha512-[A-Za-z0-9+/]{86}==$/u,B=String.raw`const parse = (value) => /^(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number); const atLeast = (version, floor) => version[0] > floor[0] || (version[0] === floor[0] && (version[1] > floor[1] || (version[1] === floor[1] && version[2] >= floor[2])));
const nodeSafe = ${oe};
if (!nodeSafe) process.exit(1);
try { const { DatabaseSync } = require("node:sqlite"); const db = new DatabaseSync(":memory:");
  const sqlite = parse(String(db.prepare("SELECT sqlite_version() AS version").get()?.version ?? ""));
  db.close(); if (!sqlite) process.exit(1);
  const sqliteSafe = atLeast(sqlite, [3, 51, 3]) || (sqlite[0] === 3 && ((sqlite[1] === 50 && sqlite[2] >= 7) || (sqlite[1] === 44 && sqlite[2] >= 6)));
  process.exit(sqliteSafe ? 0 : 1); } catch { process.exit(1); }`,V=String.raw`const fs = require("node:fs");
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
}`,H=String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const npm = process.argv[3] === "npm";
  const actual = (npm ? "sha512-" : "") + crypto.createHash(npm ? "sha512" : "sha256").update(fs.readFileSync(process.argv[1])).digest(npm ? "base64" : "hex");
  process.exit(actual === process.argv[2] ? 0 : 1);
} catch {
  process.exit(1);
}`,U=String.raw`const fs = require("node:fs");
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
}`,W=`const artifactPaths = ${JSON.stringify(a)};
const chunkPathPattern = ${r.toString()};`,G=String.raw`const fs = require("node:fs");
const expected = "package/dist/worker-artifacts/" + process.argv[2] + ".tar.gz";
const selected = fs.readFileSync(process.argv[1], "utf8").split("\n").filter((entry) => entry === expected);
if (selected.length !== 1) throw new Error("missing or duplicate packaged worker bundle archive");
process.stdout.write(selected.join("\n") + "\n");`,K=String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[1];
const expected = process.argv[2];
const install = process.argv[3];
${W}
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
  hash.update("${i}" + separator);
  for (const entry of entries) {
    hash.update(entry.path + separator + entry.mode.toString(8) + separator + entry.size + separator + entry.sha256 + separator);
  }
  process.exit(hash.digest("hex") === expected ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}`,q=String.raw`ensure_private_directory() {
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
}`,J=String.raw`set -eu
umask 077
hash=$1
expected_receipt=$2
install=$3
operation_token=$4
root=$HOME/${D}
install_dir=$root/$hash
receipt=$install_dir/${O}

case "$operation_token" in
  *[!a-f0-9]*|'') printf '%s\n' 'invalid worker bootstrap operation token' >&2; exit 2 ;;
esac
if [ "${"${"}#operation_token}" -ne 64 ]; then
  printf '%s\n' 'invalid worker bootstrap operation token' >&2
  exit 2
fi

${q}

ensure_private_directory "$root"

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' '${P}' >&2
  exit ${k}
fi

if ! node -e '${B}'; then
  printf '%s: ' '${F}' >&2
  node --version >&2 || true
  exit ${M}
fi

incoming=$root/.incoming
ensure_private_directory "$incoming"
incoming=$(cd "$incoming" && pwd -P)
find "$incoming" -type f -name 'openclaw-upload-*.tgz.*' -mmin +60 -exec rm -f -- {} + 2>/dev/null || true
upload=$incoming/openclaw-upload-$hash.tgz.$operation_token

if [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
  node -e '${V}' "$receipt" "$expected_receipt" &&
  node -e '${K}' "$install_dir" "$hash" "$install"; then
  rm -f -- "$upload"
  printf '%s\t%s\t' '${L}' current
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
printf '%s\t%s\t%s\n' '${L}' install "$upload"
`,Ie=String.raw`set -eu
umask 077
install=$1
hash=$2
package_spec=$3
package_integrity=$4
receipt_json=$5
upload=$6
archive_sha256=$7
root=$HOME/${D}
install_dir=$root/$hash
receipt=$install_dir/${O}
staging=$root/.staging-$hash-$$
lock_root=$root/.locks
lock=$lock_root/$hash
locked=0
lock_identity="$$:$(date +%s)"

${q}

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
    node -e '${V}' "$receipt" "$receipt_json" &&
    node -e '${K}' "$install_dir" "$hash" "$install"
}

finish_with_receipt() {
  # A durable receipt makes retries independent of this operation's upload.
  rm -f -- "$upload"
  printf '%s\t%s\t' '${L}' receipt
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
              if [ "$owner_started" -le "$now" ] && [ $((now - owner_started)) -le ${N} ]; then
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
      exit ${j}
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
    if ! node -e '${H}' "$upload" "$archive_sha256" "$install"; then
      printf '%s\n' 'worker bundle archive digest mismatch' >&2
      exit 2
    fi
    tar -xzf "$upload" -C "$staging"
    ;;
  npm)
    if ! command -v npm >/dev/null 2>&1; then
      printf '%s\n' '${I}' >&2
      exit ${A}
    fi
    npm_pack_json=$staging/npm-pack.json
    npm pack "$package_spec" --pack-destination "$staging" --ignore-scripts --json --registry=https://registry.npmjs.org/ > "$npm_pack_json"
    package_archive=$(node -e '${U}' "$npm_pack_json")
    package_archive=$staging/$package_archive
    if ! node -e '${H}' "$package_archive" "$package_integrity" "$install"; then
      printf '%s\n' 'worker npm package integrity mismatch' >&2
      exit 2
    fi
    tar -tzf "$package_archive" > "$staging/npm-members.txt"
    node -e '${G}' "$staging/npm-members.txt" "$hash" > "$staging/npm-worker-files.txt"
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

if ! node -e '${K}' "$staging" "$hash" "$install"; then
  printf '%s\n' 'worker install content does not match the expected bundle hash' >&2
  exit 2
fi
printf '%s\n' "$receipt_json" > "$staging/${O}"
chmod 600 "$staging/${O}"
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
root=$HOME/${D}
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
`}));function requireArchivePath(e){if(!e||e.length>ze||e.includes(`\\`)||e.includes(`\0`)||e.startsWith(`/`)||w.posix.normalize(e)!==e||e===`..`||e.startsWith(`../`))throw Error(`Invalid worker bundle archive path: ${e}`);return e}async function readWorkerBundleArchiveManifest(e,t){let r=[],i=/* @__PURE__ */ new Set,a=0,o=we({strict:!0,maxDepth:Be,maxDecompressionRatio:Ve,onReadEntry(e){try{let n=requireArchivePath(e.path);if(i.has(n))throw Error(`Duplicate worker bundle archive path: ${n}`);if(i.add(n),i.size>t.maxEntries)throw Error(`Worker bundle archive exceeds its entry limit`);if(!Number.isSafeInteger(e.size)||e.size<0)throw Error(`Invalid worker bundle archive size: ${n}`);if(a+=e.size,!Number.isSafeInteger(a)||a>t.maxExpandedBytes)throw Error(`Worker bundle archive exceeds its expanded byte limit`);let o=T(`sha256`),s={path:n,mode:e.mode,headerSize:e.size,actualSize:0,type:e.type};r.push(s),e.on(`data`,e=>{s.actualSize+=e.byteLength,o.update(e)}),e.on(`end`,()=>{s.sha256=o.digest(`hex`)}),e.on(`error`,e=>{s.error=e instanceof Error?e:Error(String(e))})}catch(e){o.abort(e instanceof Error?e:Error(String(e)))}}});try{await Pe(C(e,{highWaterMark:16777216}),o)}catch(e){throw o.abort(e instanceof Error?e:Error(String(e))),e}return r.map(e=>{if(e.error)throw e.error;if(e.type!==`File`||e.mode===void 0||e.actualSize!==e.headerSize||e.sha256===void 0)throw Error(`Invalid worker bundle tar entry: ${e.path}`);return{path:e.path,mode:process.platform===`win32`?448:e.mode,size:e.actualSize,sha256:e.sha256}}).toSorted((e,t)=>n(e.path,t.path))}var ze,Be,Ve,He=e((()=>{_(),t(),Me(),ze=1024,Be=64,Ve=64}));async function stageWorkerDeployArtifact(e){let t=`dist/worker/${e.artifactPath}`,n=w.join(e.sourceRoot,t),r;try{r=await E.realpath(n)}catch(t){throw Error(`OpenClaw worker deploy artifact is missing; build the running package at ${e.sourceRoot}`,{cause:t})}let i=w.resolve(e.sourceRoot,t);if(r!==i)throw Error(`Unsafe worker deploy artifact: ${t}`);let a=await E.lstat(n);if(a.isSymbolicLink()||!a.isFile())throw Error(`Unsafe worker deploy artifact: ${t}`);await e.staging.copyIn(e.artifactPath,{root:e.source,relativePath:n},{overwrite:!1,sourceHardlinks:`allow`,mode:448,maxBytes:1/0,durable:!1,clone:`never`});let o=await e.staging.open(e.artifactPath);try{let{bytes:n,digest:r}=await h(o.handle,{maxBytes:o.stat.size});if(n!==o.stat.size)throw Error(`Worker deploy artifact changed while packaging: ${t}`);return{path:e.artifactPath,mode:448,size:n,sha256:r}}finally{await o.handle.close()}}async function collectWorkerBundleManifest(e,t){let[i,o]=await Promise.all([m(e,{maxBytes:1/0}),E.readdir(w.join(e,`dist/worker`))]).catch(t=>{throw Error(`OpenClaw worker deploy artifact is missing; build the running package at ${e}`,{cause:t})}),s=await m(t,{maxBytes:1/0}),c=[],l=o.filter(e=>r.test(e));for(let t of[...a,...l])c.push(await stageWorkerDeployArtifact({sourceRoot:e,source:i,staging:s,artifactPath:t}));return c.toSorted((e,t)=>n(e.path,t.path))}var Ue=e((()=>{g(),le(),t()}));function normalizeProtocolFeatures(e){let t=e.map(e=>e.trim());if(t.some(e=>e.length===0))throw Error(`Worker protocol features must be non-empty strings`);return[...new Set(t)].toSorted(n)}function resolveBundleCacheDir(e){return e?w.resolve(e):w.join(re(),`cache`,`worker-bundles`)}function resolvePackageRoot(e){if(e)return w.resolve(e);let t=ue({moduleUrl:import.meta.url,argv1:process.argv[1],cwd:process.cwd()});if(!t)throw Error(`Unable to locate the running OpenClaw package root for worker bundling`);return t}async function isReleasedPackageInstall(e){let t=new Set(await E.readdir(e));return!t.has(`.git`)&&!t.has(`pnpm-lock.yaml`)&&!t.has(`bun.lock`)&&!t.has(`bun.lockb`)}function parseNpmPackageIdentity(e){if(!p(e))return;let t=u(e.name),n=u(e.version),r=u(e.integrity)??u(e[`dist.integrity`]),i=u(e.filename);return t&&n&&r?{name:t,version:n,integrity:r,filename:i}:void 0}async function runNpmProofCommand(e){try{let t=await e.runCommand(e.argv,{cwd:e.cwd,timeoutMs:We,env:{COREPACK_ENABLE_DOWNLOAD_PROMPT:`0`,NPM_CONFIG_IGNORE_SCRIPTS:`true`}});if(t.code!==0||t.stdoutTruncatedBytes)throw Error(e.failureMessage);return JSON.parse(t.stdout.trim())}catch{throw Error(e.failureMessage)}}async function hashNpmTarballIntegrity(e){let t=T(`sha512`);for await(let n of C(e))t.update(n);return`sha512-${t.digest(`base64`)}`}async function verifyPublishedNpmRelease(e){let t=e.runCommand??ye,n=await E.mkdtemp(w.join(ce(),`openclaw-worker-npm-proof-`));try{let r=parseNpmPackageIdentity(me(await runNpmProofCommand({argv:[`npm`,`view`,`openclaw@${e.version}`,`name`,`version`,`dist.integrity`,`--json`,`--registry=${Y}`],cwd:n,failureMessage:`OpenClaw ${e.version} is not published; use the worker bundle install`,runCommand:t}))[0]);if(r?.name!==`openclaw`||r.version!==e.version||!Ge.test(r.integrity))throw Error(`Cannot verify exact public npm release openclaw@${e.version}; use the worker bundle install`);let i=await runNpmProofCommand({argv:[`npm`,`pack`,`openclaw@${e.version}`,`--pack-destination`,n,`--ignore-scripts`,`--json`,`--registry=${Y}`],cwd:n,failureMessage:`Unable to verify the installed OpenClaw package; use the worker bundle install`,runCommand:t}),a=parseNpmPackageIdentity(me(i)[0]);if(!a?.filename||w.basename(a.filename)!==a.filename)throw Error(`npm pack returned incomplete worker package metadata`);let o=w.join(n,a.filename),s;try{s=await hashNpmTarballIntegrity(o)}catch{throw Error(`Unable to verify the installed OpenClaw package; use the worker bundle install`)}if(a.name!==r.name||a.version!==r.version||a.integrity!==r.integrity||s!==r.integrity)throw Error(`Installed OpenClaw ${e.version} does not match the published package; use the worker bundle install`);let c=w.join(n,`package`);if(await E.mkdir(c),await Ce({cwd:c,file:o,preservePaths:!1,strict:!0,strip:1}),(await prepareWorkerBundle({packageRoot:c,cacheDir:w.join(n,`bundle-cache`),openclawVersion:e.version})).bundleHash!==e.bundleHash)throw Error(`Published OpenClaw ${e.version} does not match the prepared worker bundle; use the worker bundle install`);return r.integrity}finally{await E.rm(n,{recursive:!0,force:!0})}}async function isCachedTarball(e){try{let t=await E.lstat(e);if(t.isSymbolicLink()||!t.isFile())throw Error(`Unsafe worker bundle cache path: ${e}`);return!0}catch(e){if(e.code===`ENOENT`)return!1;throw e}}async function cachedTarballMatches(e,t){if(!await isCachedTarball(e))return!1;try{return o(await readWorkerBundleArchiveManifest(e,S))===o(t)}catch{return!1}}async function writeTarball(e){let t=`${e.tarballPath}.${process.pid}.${Ne()}.tmp`;try{await Te({cwd:e.stagingRoot,file:t,gzip:!0,noDirRecurse:!0,noMtime:!0,portable:!0,strict:!0,onWriteEntry:({stat:e})=>{e&&(e.mode=e.mode&-512|448)}},e.entries.map(e=>e.path));try{await E.rename(t,e.tarballPath)}catch(n){if(n.code!==`EEXIST`)throw n;if(!await cachedTarballMatches(e.tarballPath,e.entries)){await E.rm(e.tarballPath,{force:!0});try{await E.rename(t,e.tarballPath)}catch(t){if(t.code!==`EEXIST`||!await cachedTarballMatches(e.tarballPath,e.entries))throw t}}}}finally{await E.rm(t,{force:!0})}}async function pruneWorkerBundleCache(e){let t;try{t=await E.readdir(e.cacheDir,{withFileTypes:!0})}catch(t){t.code!==`ENOENT`&&e.onError?.(t);return}if(!t.some(t=>{let n=X.exec(t.name)?.[1];return n!==void 0&&n!==e.currentBundleHash||Z.test(t.name)||Q.test(t.name)}))return;let r=new Set([e.currentBundleHash,...e.readRetainedBundleHashes()].filter(e=>/^[a-f0-9]{64}$/u.test(e)));for(let i of t.toSorted((e,t)=>n(e.name,t.name))){let t=X.exec(i.name),n=t&&!r.has(t[1]),a=Z.test(i.name),o=Q.test(i.name);if(!n&&!a&&!o)continue;let s=w.join(e.cacheDir,i.name);try{let e=await E.lstat(s);if(e.isSymbolicLink()||(a?!e.isDirectory():!e.isFile()))continue;await E.rm(s,{recursive:a,force:!0})}catch(t){t.code!==`ENOENT`&&e.onError?.(t)}}}async function prepareWorkerBundle(e){let t=resolvePackageRoot(e.packageRoot),n=(e.openclawVersion??pe).trim();if(!n)throw Error(`Worker bundle requires a non-empty OpenClaw version`);let r=normalizeProtocolFeatures(e.protocolFeatures??[]),i=await resolvePackagedWorkerBundle({packageRoot:t,openclawVersion:n,protocolFeatures:r});if(i)return i;let a=resolveBundleCacheDir(e.cacheDir);await E.mkdir(a,{recursive:!0});let s=await E.mkdtemp(w.join(a,`.staging-`));try{let e=await collectWorkerBundleManifest(t,s),i=o(e),c=w.join(a,`${i}.tgz`);await cachedTarballMatches(c,e)||await writeTarball({stagingRoot:s,entries:e,tarballPath:c});await using l=await E.open(c,`r`);return{install:`bundle`,bundleHash:i,openclawVersion:n,protocolFeatures:r,tarballBytes:(await E.stat(c)).size,tarballSha256:(await h(l)).digest,tarballPath:c}}finally{await E.rm(s,{recursive:!0,force:!0})}}async function resolvePackagedWorkerBundle(e){try{return await E.access(w.join(e.packageRoot,`dist/worker`)),null}catch(e){if(!p(e)||e.code!==`ENOENT`)throw e}let t=w.join(e.packageRoot,$),n;try{n=await E.readdir(t,{withFileTypes:!0})}catch(e){if(p(e)&&e.code===`ENOENT`)return null;throw e}if(n.length!==1||!n[0].isFile())throw Error(`Packaged worker bundle must contain exactly one regular archive`);let i=Ke.exec(n[0].name);if(!i)throw Error(`Packaged worker bundle archive name is invalid`);let s=w.join(t,n[0].name),c=await readWorkerBundleArchiveManifest(s,S),l=new Set(c.map(e=>e.path)),u=new Set(a);if(a.some(e=>!l.has(e))||c.some(e=>!u.has(e.path)&&!r.test(e.path)))throw Error(`Packaged worker bundle archive does not match the worker artifact contract`);let d=o(c);if(d!==i[1])throw Error(`Packaged worker bundle archive name does not match its manifest hash`);await using f=await E.open(s,`r`);return{install:`bundle`,bundleHash:d,openclawVersion:e.openclawVersion,protocolFeatures:e.protocolFeatures,tarballBytes:(await f.stat()).size,tarballSha256:(await h(f)).digest,tarballPath:s}}function createWorkerBundleProducer(e={}){let t,n=Promise.resolve();return{prepare:f(async()=>(t=await prepareWorkerBundle(e),t)),async prune(r){let i=t;if(e.cacheOwnership!==`exclusive`||!i)return;let a=n.then(async()=>{await pruneWorkerBundleCache({cacheDir:resolveBundleCacheDir(e.cacheDir),currentBundleHash:i.bundleHash,readRetainedBundleHashes:r,onError:e.onCacheCleanupError})});n=a.catch(()=>void 0),await a}}}async function resolveWorkerNpmInstallationArtifact(e){let t=e.bundle.openclawVersion.trim();if(!he(t))throw Error(`Worker npm install requires the exact published gateway version; expected ${t}`);let n=resolvePackageRoot(e.packageRoot);if(!(e.isPackageInstall?await e.isPackageInstall(n):await isReleasedPackageInstall(n)))throw Error(`Worker npm install requires the gateway to run from a packaged release install`);let r=await(e.verifyRelease??verifyPublishedNpmRelease)({bundleHash:e.bundle.bundleHash,version:t});return{install:`npm`,bundleHash:e.bundle.bundleHash,openclawVersion:t,packageIntegrity:r,protocolFeatures:e.bundle.protocolFeatures,packageSpec:`openclaw@${t}`}}var Y,We,Ge,X,Z,Q,Ke,$,qe=e((()=>{ne(),l(),_(),ie(),g(),ge(),de(),se(),be(),d(),He(),t(),fe(),Ue(),Y=`https://registry.npmjs.org/`,We=6e4,Ge=/^sha512-[A-Za-z0-9+/]{86}==$/u,X=/^([a-f0-9]{64})\.tgz$/u,Z=/^\.staging-[A-Za-z0-9_-]+$/u,Q=/^[a-f0-9]{64}\.tgz\.[0-9]+\.[0-9a-f-]{36}\.tmp$/u,Ke=/^([a-f0-9]{64})\.tar\.gz$/u,$=`dist/worker-artifacts`}));function requireIdentity(e){if(typeof e==`object`&&e&&`kind`in e){if(e.kind===`path`&&`path`in e&&typeof e.path==`string`&&e.path.trim())return{kind:`path`,path:e.path};if(e.kind===`material`&&`contents`in e&&typeof e.contents==`string`&&e.contents.trim())return{kind:`material`,contents:e.contents}}throw Error(`Worker SSH identity resolver returned an invalid identity`)}async function resolveWorkerSshIdentity(e){e.assertAuthorized();let t={leaseId:e.leaseId,profile:e.profile,keyRef:e.keyRef,assertCurrent:e.assertAuthorized},n=e.provider.resolveSshIdentity?await e.provider.resolveSshIdentity(t):await e.resolveGeneric(e.keyRef,e.assertAuthorized);return e.assertAuthorized(),requireIdentity(n)}var Je=e((()=>{}));e((()=>{Se(),Re(),qe(),Je()}))();export{bootstrapWorker,createWorkerBundleProducer,xe as resolveSecretRefString,resolveWorkerNpmInstallationArtifact,resolveWorkerSshIdentity};