import{b as asNullableRecord,i as resolveGlobalSingleton}from"./global-singleton-CTnqrmaI.js";import{C as hasLegacyAccountStreamingAliases,m as normalizeOptionalAccountId,s as defineChannelAliasMigration,t as collectChannelAccountScopes}from"./runtime-doctor-migrations-D8alsOFs.js";import{b as createAccountListHelpers}from"./account-core-BghrsbiR.js";import"./fs-safe-BnA-Wq_f.js";import"./src-DtNToPzY.js";import"./string-coerce-runtime-DtNToPzY.js";import{u as resolveOAuthDir}from"./boundary-file-read-Bl5IXojU.js";import"./file-descriptor-C8OEaEgp.js";import fsPromises,{realpath}from"node:fs/promises";import"@openclaw/fs-safe/path";import path from"node:path";import fs from"node:fs";import{root}from"@openclaw/fs-safe/root";import"@openclaw/fs-safe/advanced";import{FsSafeError}from"@openclaw/fs-safe/errors";import{createHash}from"node:crypto";import os from"node:os";import{AsyncLocalStorage}from"node:async_hooks";import"@openclaw/fs-safe/permissions";import"@openclaw/fs-safe/watch";import{compileFunction}from"node:vm";
//!src/plugins/install-root-context.ts
const pluginInstallRootContext=resolveGlobalSingleton(Symbol.for(`openclaw.pluginInstallRootContext`),()=>new AsyncLocalStorage);
//!extensions/whatsapp/src/account-ids.ts
const{listConfiguredAccountIds,listAccountIds,resolveDefaultAccountId:resolveDefaultWhatsAppAccountId}=createAccountListHelpers(`whatsapp`,{implicitDefaultAccount:{channelKeys:[`authDir`]}});
//!src/media/staged-inputs.ts
const STAGED_INPUT_DIRECTORY_PREFIX=`media/inbound/openclaw-staged-`;const STAGED_INPUT_GITIGNORE=`# Raw task inputs remain private; copy outputs into the project to publish.
*
`;const STAGED_INPUT_GITIGNORE_SHA256=createHash(`sha256`).update(STAGED_INPUT_GITIGNORE).digest(`hex`);const STAGED_INPUT_PATHS_JS=String.raw`
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(STAGED_INPUT_DIRECTORY_PREFIX)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(STAGED_INPUT_GITIGNORE)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(STAGED_INPUT_GITIGNORE_SHA256)};
// A producer-shaped name is only a candidate; the marker establishes ownership.
function stagedInputPathDirectory(relativePath) {
  if (!relativePath.startsWith(STAGED_INPUT_DIRECTORY_PREFIX)) {
    return undefined;
  }
  const identity = relativePath.slice(STAGED_INPUT_DIRECTORY_PREFIX.length).split("/")[0];
  const match =
    /^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/u.exec(
      identity,
    );
  return match?.[0] === identity ? STAGED_INPUT_DIRECTORY_PREFIX + identity : undefined;
}

function isStagedInputPath(relativePath, directories) {
  const directory = stagedInputPathDirectory(relativePath);
  return directory !== undefined && directories.has(directory);
}

// Complete manifests bind the regular marker's exact bytes through their file digest.
function stagedInputDirectoriesFromEntries(entries) {
  const directories = new Set();
  for (const entry of entries) {
    const directory = stagedInputPathDirectory(entry.path);
    if (
      directory &&
      entry.path === directory + "/.gitignore" &&
      entry.type === "file" &&
      entry.size === STAGED_INPUT_GITIGNORE.length &&
      entry.sha256 === STAGED_INPUT_GITIGNORE_SHA256
    ) {
      directories.add(directory);
    }
  }
  return directories;
}`;const{stagedInputPathDirectory,isStagedInputPath,stagedInputDirectoriesFromEntries}=compileFunction(`${STAGED_INPUT_PATHS_JS}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)();
//!src/media/remote-workspace-file.ts
const REMOTE_FILE_READER=String.raw`
try {
  const fs = require("node:fs"), path = require("node:path");
  const [file, maxText, offsetText, chunkText, workspace] = process.argv.slice(1);
  const max = Number(maxText), offset = Number(offsetText), chunk = Number(chunkText);
  if (!Number.isSafeInteger(max) || max < 0) throw Error("invalid media byte limit");
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(chunk) || chunk <= 0) throw Error("invalid media chunk");
  if (fs.lstatSync(file).isSymbolicLink()) throw Error("symbolic links are not allowed");
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
  try {
    const before = fs.fstatSync(fd);
    if (!before.isFile()) throw Error("not a regular file");
    if (workspace) {
      const descriptor = process.platform === "linux" ? fs.realpathSync("/proc/self/fd/" + fd) : fs.realpathSync(file);
      const relative = path.relative(fs.realpathSync(workspace), descriptor);
      if (!relative || relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) throw Error("file escapes remote workspace");
      const verified = fs.statSync(descriptor);
      if (verified.dev !== before.dev || verified.ino !== before.ino) throw Error("file changed while being opened");
    }
    if (offset > before.size) throw Error("file changed while being read");
    // Return metadata alone for oversized sources; the host owns the typed refusal.
    const expected = before.size > max ? 0 : Math.min(chunk, before.size - offset), buffer = Buffer.allocUnsafe(expected);
    let total = 0;
    while (total < buffer.length) {
      const count = fs.readSync(fd, buffer, total, buffer.length - total, offset + total);
      if (count === 0) break;
      total += count;
    }
    if (total !== expected) throw Error("file changed while being read");
    const after = fs.fstatSync(fd);
    const revision = stat => [stat.dev, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs].join(":");
    if (!after.isFile() || revision(after) !== revision(before)) throw Error("file changed while being read");
    process.stdout.write(JSON.stringify({ dataBase64: buffer.toString("base64"), size: before.size, revision: revision(before) }));
  } finally { fs.closeSync(fd); }
} catch (error) { process.stderr.write(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
`;
//!extensions/whatsapp/src/creds-files.ts
const BAILEYS_SIGNAL_AUTH_CATEGORIES={"app-state-sync-key":true,"app-state-sync-version":true,"device-list":true,"identity-key":true,"lid-mapping":true,"pre-key":true,"sender-key":true,"sender-key-memory":true,session:true,tctoken:true};function isWhatsAppBaileysAuthFileName(e){if(e===`creds.json`||e===`creds.json.bak`)return true;return e.endsWith(`.json`)&&Object.keys(BAILEYS_SIGNAL_AUTH_CATEGORIES).some(t=>e.startsWith(`${t}-`))}
//!extensions/whatsapp/src/doctor.ts
function resolveLegacyAckScope(e){const t=e.direct!==false;const n=e.group??`mentions`;if(t)return n===`always`?`all`:n===`never`?`direct`:void 0;return n===`always`?`group-all`:n===`mentions`?`group-mentions`:n===`never`?`off`:void 0}function resolveDefaultAgentEmoji(e){const t=asNullableRecord(asNullableRecord(asNullableRecord(e)?.agents)?.entries);const n=t?Object.values(t).flatMap(e=>{const t=asNullableRecord(e);return t?[t]:[]}):[];const r=n.find(e=>e.default===true)??n[0];const i=asNullableRecord(r?.identity)?.emoji;return typeof i===`string`?i:void 0}function normalizeCompatibilityConfig$1({cfg:e}){const t=[];const n=[];for(const t of collectChannelAccountScopes({cfg:e,channelId:`whatsapp`})){const e=asNullableRecord(t.account.ackReaction);if(!e)continue;n.push({path:`${t.prefix}.ackReaction`,account:t.account,...typeof e.emoji===`string`?{emoji:e.emoji}:{},scope:resolveLegacyAckScope(e),unrepresentableScope:e.direct!==false&&(e.group??`mentions`)===`mentions`})}if(n.length===0)return{config:e,changes:t};const r=e.messages??={};const i=resolveDefaultAgentEmoji(e)??`👀`;for(const e of n){r.ackReaction??=e.emoji??i;r.ackReactionScope??=e.scope;delete e.account.ackReaction;t.push(`Moved translatable ${e.path} settings to messages ack settings.`)}const a=r.ackReaction.trim();const o=r.ackReactionScope??`group-mentions`;const s=o===`none`?`off`:o;for(const e of n){const n=e.emoji?.trim();if(e.emoji===void 0)t.push(`${e.path} used a route-dependent agent identity acknowledgement emoji before migration; the final messages.ackReaction is ${JSON.stringify(a)}. Review messages.ackReaction.`);else if(n!==a)t.push(`${e.path} requested acknowledgement emoji ${JSON.stringify(n)}, but the final messages.ackReaction is ${JSON.stringify(a)}. Review messages.ackReaction.`);if(e.unrepresentableScope)t.push(`${e.path} migration cannot preserve both direct-message and mentioned-group acknowledgements; the final messages.ackReactionScope is ${JSON.stringify(o)}. Review messages.ackReactionScope.`);else if(e.scope&&e.scope!==s)t.push(`${e.path} requested acknowledgement scope ${JSON.stringify(e.scope)}, but the final messages.ackReactionScope is ${JSON.stringify(o)}. Review messages.ackReactionScope.`)}return{config:e,changes:t}}
//!extensions/whatsapp/src/doctor-contract.ts
const streamingAliasMigration=defineChannelAliasMigration({channelId:`whatsapp`,streaming:{defaultMode:`partial`,deliveryOnly:true},accountStreamingInheritsDefaultAccount:true});const hasAckReaction=e=>Boolean(asNullableRecord(asNullableRecord(e)?.ackReaction));const legacyDefaultPolicyKeys=/* @__PURE__ */ new Set([`dmPolicy`,`allowFrom`,`groupPolicy`,`groupAllowFrom`]);function hasPossibleLeftoverDefault(e){const t=asNullableRecord(e.channels?.whatsapp);const n=asNullableRecord(t?.accounts);const r=asNullableRecord(n?.default);if(!t||!n||!r||t.authDir!==void 0||typeof t.defaultAccount===`string`&&t.defaultAccount.trim().toLowerCase()==="default"||Object.keys(n).length<2)return false;const i=Object.keys(r);if(i.length===0||i.some(e=>!legacyDefaultPolicyKeys.has(e))||Object.values(n).some(e=>!asNullableRecord(e))||e.bindings?.some(e=>e.match.channel.trim().toLowerCase()===`whatsapp`&&e.match.accountId?.trim().toLowerCase()==="default"))return false;const a=resolveOAuthDir();for(const e of[a,path.join(a,`whatsapp`,`default`)])try{if(fs.readdirSync(e).some(isWhatsAppBaileysAuthFileName))return false}catch(e){if(asNullableRecord(e)?.code!==`ENOENT`)return false}return true}function collectDefaultAccountWarnings(e){if(!hasPossibleLeftoverDefault(e))return[];const t=listAccountIds(e).find(e=>e!=="default"&&normalizeOptionalAccountId(e)===e);if(!t)return[];const n=resolveDefaultWhatsAppAccountId(e);return[`channels.whatsapp.accounts.default contains only shared policy and has no detected credentials. It may be a leftover of an earlier Doctor migration or an intentional account awaiting login. Unqualified WhatsApp operations currently select "${n}". Doctor left all accounts and routing unchanged. To select a named account while keeping all accounts and shared policy, run \`openclaw config set channels.whatsapp.defaultAccount '${JSON.stringify(n==="default"?t:n)}' --strict-json\`. Only if "default" is unwanted, preserve any shared policy you still need, then run \`openclaw channels remove --channel whatsapp --account default --delete\`.`]}const legacyConfigRules=[...streamingAliasMigration.legacyConfigRules,{path:[`channels`,`whatsapp`,`ackReaction`],message:`channels.whatsapp.ackReaction moved to global message acknowledgement settings. Run "openclaw doctor --fix".`},{path:[`channels`,`whatsapp`,`accounts`],message:`channels.whatsapp.accounts.<id>.ackReaction moved to global message acknowledgement settings. Run "openclaw doctor --fix".`,match:e=>hasLegacyAccountStreamingAliases(e,hasAckReaction)}];function normalizeCompatibilityConfig({cfg:e}){const t=normalizeCompatibilityConfig$1({cfg:e});const n=streamingAliasMigration.normalizeChannelConfig({cfg:t.config,changes:t.changes});const r=collectDefaultAccountWarnings(n.config);return{...n,...r.length?{warnings:r}:{}}}export{legacyConfigRules,normalizeCompatibilityConfig};