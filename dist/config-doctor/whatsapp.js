import { a as defineChannelAliasMigration, b as hasLegacyAccountStreamingAliases, f as normalizeOptionalAccountId, k as asNullableRecord, t as collectChannelAccountScopes } from "./runtime-doctor-migrations-BhouWAUC.js";
import { o as createAccountListHelpers } from "./account-core-bZmYRKLc.js";
import { a as resolveOAuthDir } from "./boundary-file-read-D-7q9BJU.js";
import "node:fs/promises";
import "@openclaw/fs-safe/path";
import path from "node:path";
import fs$1 from "node:fs";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/errors";
import { createHash } from "node:crypto";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/watch";
import { compileFunction } from "node:vm";
//#region extensions/whatsapp/src/account-ids.ts
const { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId: resolveDefaultWhatsAppAccountId } = createAccountListHelpers("whatsapp", { implicitDefaultAccount: { channelKeys: ["authDir"] } });
//#endregion
//#region src/media/staged-inputs.ts
const STAGED_INPUT_DIRECTORY_PREFIX = "media/inbound/openclaw-staged-";
const STAGED_INPUT_GITIGNORE = "# Raw task inputs remain private; copy outputs into the project to publish.\n*\n";
const STAGED_INPUT_GITIGNORE_SHA256 = createHash("sha256").update(STAGED_INPUT_GITIGNORE).digest("hex");
const STAGED_INPUT_PATHS_JS = String.raw`
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
}`;
const { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries } = compileFunction(`${STAGED_INPUT_PATHS_JS}\nreturn { stagedInputPathDirectory, isStagedInputPath, stagedInputDirectoriesFromEntries };`)();
String.raw`
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
    if (before.size > max) throw Error("file exceeds limit of " + max + " bytes");
    if (offset > before.size) throw Error("file changed while being read");
    const expected = Math.min(chunk, before.size - offset), buffer = Buffer.allocUnsafe(expected);
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
//#endregion
//#region extensions/whatsapp/src/creds-files.ts
const BAILEYS_SIGNAL_AUTH_CATEGORIES = {
	"app-state-sync-key": true,
	"app-state-sync-version": true,
	"device-list": true,
	"identity-key": true,
	"lid-mapping": true,
	"pre-key": true,
	"sender-key": true,
	"sender-key-memory": true,
	session: true,
	tctoken: true
};
function isWhatsAppBaileysAuthFileName(name) {
	if (name === "creds.json" || name === "creds.json.bak") return true;
	return name.endsWith(".json") && Object.keys(BAILEYS_SIGNAL_AUTH_CATEGORIES).some((category) => name.startsWith(`${category}-`));
}
//#endregion
//#region extensions/whatsapp/src/doctor.ts
function resolveLegacyAckScope(ack) {
	const direct = ack.direct !== false;
	const group = ack.group ?? "mentions";
	if (direct) return group === "always" ? "all" : group === "never" ? "direct" : void 0;
	return group === "always" ? "group-all" : group === "mentions" ? "group-mentions" : group === "never" ? "off" : void 0;
}
function resolveDefaultAgentEmoji(cfg) {
	const entries = asNullableRecord(asNullableRecord(asNullableRecord(cfg)?.agents)?.entries);
	const agents = entries ? Object.values(entries).flatMap((value) => {
		const entry = asNullableRecord(value);
		return entry ? [entry] : [];
	}) : [];
	const agent = agents.find((entry) => entry.default === true) ?? agents[0];
	const emoji = asNullableRecord(agent?.identity)?.emoji;
	return typeof emoji === "string" ? emoji : void 0;
}
function normalizeCompatibilityConfig$1({ cfg }) {
	const changes = [];
	const sources = [];
	for (const scope of collectChannelAccountScopes({
		cfg,
		channelId: "whatsapp"
	})) {
		const ack = asNullableRecord(scope.account.ackReaction);
		if (!ack) continue;
		sources.push({
			path: `${scope.prefix}.ackReaction`,
			account: scope.account,
			...typeof ack.emoji === "string" ? { emoji: ack.emoji } : {},
			scope: resolveLegacyAckScope(ack),
			unrepresentableScope: ack.direct !== false && (ack.group ?? "mentions") === "mentions"
		});
	}
	if (sources.length === 0) return {
		config: cfg,
		changes
	};
	const messages = cfg.messages ??= {};
	const identityEmoji = resolveDefaultAgentEmoji(cfg) ?? "👀";
	for (const source of sources) {
		messages.ackReaction ??= source.emoji ?? identityEmoji;
		messages.ackReactionScope ??= source.scope;
		delete source.account.ackReaction;
		changes.push(`Moved translatable ${source.path} settings to messages ack settings.`);
	}
	const finalEmoji = messages.ackReaction.trim();
	const finalScope = messages.ackReactionScope ?? "group-mentions";
	const comparableFinalScope = finalScope === "none" ? "off" : finalScope;
	for (const source of sources) {
		const sourceEmoji = source.emoji?.trim();
		if (source.emoji === void 0) changes.push(`${source.path} used a route-dependent agent identity acknowledgement emoji before migration; the final messages.ackReaction is ${JSON.stringify(finalEmoji)}. Review messages.ackReaction.`);
		else if (sourceEmoji !== finalEmoji) changes.push(`${source.path} requested acknowledgement emoji ${JSON.stringify(sourceEmoji)}, but the final messages.ackReaction is ${JSON.stringify(finalEmoji)}. Review messages.ackReaction.`);
		if (source.unrepresentableScope) changes.push(`${source.path} migration cannot preserve both direct-message and mentioned-group acknowledgements; the final messages.ackReactionScope is ${JSON.stringify(finalScope)}. Review messages.ackReactionScope.`);
		else if (source.scope && source.scope !== comparableFinalScope) changes.push(`${source.path} requested acknowledgement scope ${JSON.stringify(source.scope)}, but the final messages.ackReactionScope is ${JSON.stringify(finalScope)}. Review messages.ackReactionScope.`);
	}
	return {
		config: cfg,
		changes
	};
}
//#endregion
//#region extensions/whatsapp/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "whatsapp",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingInheritsDefaultAccount: true
});
const hasAckReaction = (value) => Boolean(asNullableRecord(asNullableRecord(value)?.ackReaction));
const legacyDefaultPolicyKeys = /* @__PURE__ */ new Set([
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom"
]);
function hasPossibleLeftoverDefault(cfg) {
	const channel = asNullableRecord(cfg.channels?.whatsapp);
	const accounts = asNullableRecord(channel?.accounts);
	const fallback = asNullableRecord(accounts?.default);
	if (!channel || !accounts || !fallback || channel.authDir !== void 0 || typeof channel.defaultAccount === "string" && channel.defaultAccount.trim().toLowerCase() === "default" || Object.keys(accounts).length < 2) return false;
	const keys = Object.keys(fallback);
	if (keys.length === 0 || keys.some((key) => !legacyDefaultPolicyKeys.has(key)) || Object.values(accounts).some((account) => !asNullableRecord(account)) || cfg.bindings?.some((binding) => binding.match.channel.trim().toLowerCase() === "whatsapp" && binding.match.accountId?.trim().toLowerCase() === "default")) return false;
	const oauthDir = resolveOAuthDir();
	for (const dir of [oauthDir, path.join(oauthDir, "whatsapp", "default")]) try {
		if (fs$1.readdirSync(dir).some(isWhatsAppBaileysAuthFileName)) return false;
	} catch (error) {
		if (asNullableRecord(error)?.code !== "ENOENT") return false;
	}
	return true;
}
function collectDefaultAccountWarnings(cfg) {
	if (!hasPossibleLeftoverDefault(cfg)) return [];
	const namedAccountId = listAccountIds(cfg).find((id) => id !== "default" && normalizeOptionalAccountId(id) === id);
	if (!namedAccountId) return [];
	const currentAccountId = resolveDefaultWhatsAppAccountId(cfg);
	return [`channels.whatsapp.accounts.default contains only shared policy and has no detected credentials. It may be a leftover of an earlier Doctor migration or an intentional account awaiting login. Unqualified WhatsApp operations currently select "${currentAccountId}". Doctor left all accounts and routing unchanged. To select a named account while keeping all accounts and shared policy, run \`openclaw config set channels.whatsapp.defaultAccount '${JSON.stringify(currentAccountId === "default" ? namedAccountId : currentAccountId)}' --strict-json\`. Only if "default" is unwanted, preserve any shared policy you still need, then run \`openclaw channels remove --channel whatsapp --account default --delete\`.`];
}
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: [
			"channels",
			"whatsapp",
			"ackReaction"
		],
		message: "channels.whatsapp.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasAckReaction)
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const ackReaction = normalizeCompatibilityConfig$1({ cfg });
	const normalized = streamingAliasMigration.normalizeChannelConfig({
		cfg: ackReaction.config,
		changes: ackReaction.changes
	});
	const warnings = collectDefaultAccountWarnings(normalized.config);
	return {
		...normalized,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
