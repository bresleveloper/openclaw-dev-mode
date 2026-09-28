import { t as IrcChannelConfigSchema } from "./config-schema-Cy9tItsu.mjs";
import { t as getIrcRuntime } from "./runtime-xy-FcjJC.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-D_DC3YWj.mjs";
import { createAccountListHelpers, describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { formatNormalizedAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin, parseOptionalDelimitedEntries } from "openclaw/plugin-sdk/channel-core";
import { defineStableChannelIngressIdentity, identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { buildMutableAllowEntryDetector, collectStandardAllowlistLists, createAllowlistProviderOpenWarningCollector, createConditionalWarningCollector, createDangerousNameMatchingMutableAllowlistWarningCollector, resolveScopeKeyCaseInsensitive, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { createChannelDirectoryAdapter, createResolvedDirectoryEntriesLister } from "openclaw/plugin-sdk/directory-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildBaseChannelStatusSummary, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { resolveAccountWithDefaultFallback } from "openclaw/plugin-sdk/account-core";
import { DEFAULT_ACCOUNT_ID, DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { isTruthyEnvValue } from "openclaw/plugin-sdk/runtime-env";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, normalizeStringifiedOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAccountStatusSink, createMessageReceiptFromOutboundResults, createReplyToFanout, defineChannelMessageAdapter, runPassiveAccountLifecycle, sanitizeForPlainText } from "openclaw/plugin-sdk/channel-outbound";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { chunkTextForOutbound, convertMarkdownTables, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import net from "node:net";
import tls from "node:tls";
import { withTimeout } from "openclaw/plugin-sdk/security-runtime";
import { randomUUID } from "node:crypto";
import { assertSecretOwnerAvailable } from "openclaw/plugin-sdk/channel-secret-owner-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/routing";
import { applyAccountNameToChannelSection, createAllowFromSection, createPromptParsedAllowFromForAccount, createSetupInputPresenceValidator, createSetupTranslator, createStandardChannelSetupStatus, createTopLevelChannelAllowFromSetter, createTopLevelChannelDmPolicySetter, formatDocsLink, patchScopedAccountConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
//#region extensions/irc/src/accounts.ts
function parseIntEnv(value) {
	if (!value?.trim()) return;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 || parsed > 65535) return;
	return parsed;
}
const { listAccountIds: listIrcAccountIds, resolveDefaultAccountId: resolveDefaultIrcAccountId, resolveAccountConfig: mergeIrcAccountConfig } = createAccountListHelpers("irc", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["nickserv"],
	hasImplicitDefaultAccount: (cfg) => Boolean((cfg.channels?.irc?.host?.trim() || process.env.IRC_HOST?.trim()) && (cfg.channels?.irc?.nick?.trim() || process.env.IRC_NICK?.trim()))
});
function resolvePassword(accountId, merged) {
	const configPassword = resolveSecretInputString({
		value: merged.password,
		path: `channels.irc.accounts.${accountId}.password`,
		mode: "inspect"
	});
	if (configPassword.status === "configured_unavailable") return {
		password: "",
		source: "config",
		unavailable: true
	};
	if (accountId === DEFAULT_ACCOUNT_ID) {
		const envPassword = process.env.IRC_PASSWORD?.trim();
		if (envPassword) return {
			password: envPassword,
			source: "env"
		};
	}
	if (merged.passwordFile?.trim()) {
		let diagnostic;
		const password = tryReadSecretFileSync(merged.passwordFile, "IRC password file", {
			rejectSymlink: true,
			credentialDiagnostic: {
				configPath: `channels.irc.accounts.${accountId}.passwordFile`,
				report: (value) => {
					diagnostic = value;
				}
			}
		});
		if (password) return {
			password,
			source: "passwordFile"
		};
		return {
			password: "",
			source: "passwordFile",
			diagnostic
		};
	}
	if (configPassword.status === "available") return {
		password: configPassword.value,
		source: "config"
	};
	return {
		password: "",
		source: "none"
	};
}
function resolveNickServConfig(accountId, nickserv) {
	const base = nickserv ?? {};
	const configPassword = resolveSecretInputString({
		value: base.password,
		path: `channels.irc.accounts.${accountId}.nickserv.password`,
		mode: "inspect"
	});
	const unavailable = Boolean(configPassword.ref);
	const envPassword = accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_NICKSERV_PASSWORD?.trim() : void 0;
	const envRegisterEmail = accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_NICKSERV_REGISTER_EMAIL?.trim() : void 0;
	const passwordFile = base.passwordFile?.trim();
	let resolvedPassword;
	let diagnostic;
	if (!unavailable) {
		resolvedPassword = configPassword.value || envPassword;
		if (!resolvedPassword && passwordFile) resolvedPassword = tryReadSecretFileSync(passwordFile, "IRC NickServ password file", {
			rejectSymlink: true,
			credentialDiagnostic: {
				configPath: `channels.irc.accounts.${accountId}.nickserv.passwordFile`,
				report: (value) => {
					diagnostic = value;
				}
			}
		});
	}
	return {
		config: {
			...base,
			service: normalizeOptionalString(base.service),
			passwordFile: passwordFile || void 0,
			password: resolvedPassword || void 0,
			registerEmail: base.registerEmail?.trim() || envRegisterEmail || void 0
		},
		diagnostic,
		unavailable: base.enabled !== false && unavailable
	};
}
function resolveIrcAccount(params) {
	const baseEnabled = params.cfg.channels?.irc?.enabled !== false;
	const resolve = (accountId) => {
		const merged = mergeIrcAccountConfig(params.cfg, accountId);
		const accountEnabled = merged.enabled !== false;
		const enabled = baseEnabled && accountEnabled;
		const tls = typeof merged.tls === "boolean" ? merged.tls : accountId === DEFAULT_ACCOUNT_ID && process.env.IRC_TLS ? isTruthyEnvValue(process.env.IRC_TLS) : true;
		const envPort = accountId === DEFAULT_ACCOUNT_ID ? parseIntEnv(process.env.IRC_PORT) : void 0;
		const port = merged.port ?? envPort ?? (tls ? 6697 : 6667);
		const envChannels = accountId === DEFAULT_ACCOUNT_ID ? parseOptionalDelimitedEntries(process.env.IRC_CHANNELS) : void 0;
		const host = (merged.host?.trim() || (accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_HOST?.trim() : "") || "").trim();
		const nick = (merged.nick?.trim() || (accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_NICK?.trim() : "") || "").trim();
		const username = (merged.username?.trim() || (accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_USERNAME?.trim() : "") || nick || "openclaw").trim();
		const realname = (merged.realname?.trim() || (accountId === DEFAULT_ACCOUNT_ID ? process.env.IRC_REALNAME?.trim() : "") || "OpenClaw").trim();
		const passwordResolution = resolvePassword(accountId, merged);
		const nickservResolution = resolveNickServConfig(accountId, merged.nickserv);
		const diagnostics = [passwordResolution.diagnostic, nickservResolution.diagnostic].filter((diagnostic) => Boolean(diagnostic));
		const config = {
			...merged,
			channels: merged.channels ?? envChannels,
			tls,
			port,
			host,
			nick,
			username,
			realname,
			nickserv: nickservResolution.config
		};
		return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			configured: Boolean(host && nick),
			host,
			port,
			tls,
			nick,
			username,
			realname,
			password: passwordResolution.password,
			passwordSource: passwordResolution.source,
			tokenStatus: diagnostics.length > 0 || passwordResolution.unavailable || nickservResolution.unavailable ? "configured_unavailable" : passwordResolution.password || nickservResolution.config.password ? "available" : "missing",
			...diagnostics.length > 0 ? { credentialDiagnostics: diagnostics } : {},
			config
		};
	};
	return resolveAccountWithDefaultFallback({
		accountId: params.accountId,
		normalizeAccountId,
		resolvePrimary: resolve,
		hasCredential: (account) => account.configured,
		resolveDefaultAccountId: () => resolveDefaultIrcAccountId(params.cfg)
	});
}
function listEnabledIrcAccounts(cfg) {
	return listIrcAccountIds(cfg).map((accountId) => resolveIrcAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
//#region extensions/irc/src/doctor.ts
const isIrcMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:(?:irc|user):)*[^@]*@/i });
const collectIrcMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "irc",
	detector: isIrcMutableAllowEntry,
	collectLists: (scope) => collectStandardAllowlistLists(scope, {
		includeGroups: true,
		groupField: "allowFrom"
	})
});
//#endregion
//#region extensions/irc/src/gateway.ts
const loadIrcChannelRuntime$1 = createLazyRuntimeModule(() => import("./channel-runtime-2EUgbrxg.mjs"));
async function startIrcGatewayAccount(ctx) {
	const account = ctx.account;
	const statusSink = createAccountStatusSink({
		accountId: ctx.accountId,
		setStatus: ctx.setStatus
	});
	if (!account.configured) throw new Error(`IRC is not configured for account "${account.accountId}" (need host and nick in channels.irc).`);
	ctx.log?.info?.(`[${account.accountId}] starting IRC provider (${account.host}:${account.port}${account.tls ? " tls" : ""})`);
	const { monitorIrcProvider } = await loadIrcChannelRuntime$1();
	await runPassiveAccountLifecycle({
		abortSignal: ctx.abortSignal,
		start: async () => await monitorIrcProvider({
			accountId: account.accountId,
			config: ctx.cfg,
			runtime: ctx.runtime,
			abortSignal: ctx.abortSignal,
			statusSink
		}),
		stop: async (monitor) => {
			await monitor.stop();
		}
	});
}
//#endregion
//#region extensions/irc/src/control-chars.ts
function isIrcControlChar(charCode) {
	return charCode <= 31 || charCode === 127;
}
function hasIrcControlChars(value) {
	for (const char of value) if (isIrcControlChar(char.charCodeAt(0))) return true;
	return false;
}
function stripIrcControlChars(value) {
	let out = "";
	for (const char of value) if (!isIrcControlChar(char.charCodeAt(0))) out += char;
	return out;
}
//#endregion
//#region extensions/irc/src/normalize.ts
const IRC_TARGET_PATTERN$1 = /^[^\s:]+$/u;
function isChannelTarget(target) {
	return target.startsWith("#") || target.startsWith("&");
}
function normalizeIrcMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	let target = trimmed;
	if (normalizeLowercaseStringOrEmpty(target).startsWith("irc:")) target = target.slice(4).trim();
	if (normalizeLowercaseStringOrEmpty(target).startsWith("channel:")) {
		target = target.slice(8).trim();
		if (!target.startsWith("#") && !target.startsWith("&")) target = `#${target}`;
	}
	if (normalizeLowercaseStringOrEmpty(target).startsWith("user:")) target = target.slice(5).trim();
	if (!target || !looksLikeIrcTargetId(target)) return;
	return target;
}
function resolveIrcOutboundSessionRoute(params) {
	const target = normalizeIrcMessagingTarget(params.target);
	if (!target) return null;
	const chatType = isChannelTarget(target) ? "group" : "direct";
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "irc",
		accountId: params.accountId,
		recipientSessionExact: chatType === "direct" ? "direct-alias" : false,
		peer: {
			kind: chatType,
			id: target
		},
		chatType,
		from: `irc:${target}`,
		to: target
	});
}
function looksLikeIrcTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (hasIrcControlChars(trimmed)) return false;
	return IRC_TARGET_PATTERN$1.test(trimmed);
}
function normalizeIrcAllowEntry(raw) {
	let value = normalizeLowercaseStringOrEmpty(raw);
	if (!value) return "";
	if (value.startsWith("irc:")) value = value.slice(4);
	if (value.startsWith("user:")) value = value.slice(5);
	return value.trim();
}
function buildIrcAllowlistCandidates(message, params) {
	const nick = normalizeLowercaseStringOrEmpty(message.senderNick);
	const user = normalizeOptionalLowercaseString(message.senderUser);
	const host = normalizeOptionalLowercaseString(message.senderHost);
	const candidates = /* @__PURE__ */ new Set();
	if (nick && params?.allowNameMatching === true) candidates.add(nick);
	if (nick && user) candidates.add(`${nick}!${user}`);
	if (nick && host) candidates.add(`${nick}@${host}`);
	if (nick && user && host) candidates.add(`${nick}!${user}@${host}`);
	return [...candidates];
}
const ircIngressIdentity = defineStableChannelIngressIdentity({
	key: "irc-id",
	authentication: "asserted",
	normalizeEntry: normalizeIrcStableEntry,
	normalizeSubject: normalizeLowercaseStringOrEmpty,
	sensitivity: "pii",
	aliases: [
		{
			key: "irc-id-nick-user",
			kind: "stable-id",
			normalizeEntry: normalizeIrcNickUserEntry,
			normalizeSubject: normalizeLowercaseStringOrEmpty,
			authentication: "mutable",
			sensitivity: "pii"
		},
		{
			key: "irc-id-nick-host",
			kind: "stable-id",
			authentication: "asserted",
			normalizeEntry: normalizeIrcNickHostEntry,
			normalizeSubject: normalizeLowercaseStringOrEmpty,
			sensitivity: "pii"
		},
		{
			key: "irc-nick",
			kind: "plugin:irc-nick",
			normalizeEntry: normalizeIrcNickEntry,
			normalizeSubject: normalizeLowercaseStringOrEmpty,
			authentication: "mutable",
			sensitivity: "pii"
		}
	],
	isWildcardEntry: (entry) => normalizeIrcAllowEntry(entry) === "*",
	resolveEntryId: ({ entryIndex, fieldKey }) => `irc-entry-${entryIndex + 1}:${fieldKey === "irc-nick" ? "nick" : "id"}`
});
function isBareNick(value) {
	return !value.includes("!") && !value.includes("@");
}
function hasVerifiedHost(value) {
	return value.includes("@");
}
function isHostlessNickUser(value) {
	return value.includes("!") && !value.includes("@");
}
function normalizeIrcStableEntry(value) {
	const normalized = normalizeIrcAllowEntry(value);
	if (!normalized.includes("!") || !hasVerifiedHost(normalized)) return null;
	return normalized;
}
function normalizeIrcNickHostEntry(value) {
	const normalized = normalizeIrcAllowEntry(value);
	return !normalized.includes("!") && hasVerifiedHost(normalized) ? normalized : null;
}
function normalizeIrcNickUserEntry(value) {
	const normalized = normalizeIrcAllowEntry(value);
	if (!normalized || normalized === "*" || !isHostlessNickUser(normalized)) return null;
	return normalized;
}
function normalizeIrcNickEntry(value) {
	const normalized = normalizeIrcAllowEntry(value);
	if (!normalized || normalized === "*" || !isBareNick(normalized)) return null;
	return normalized;
}
function createIrcIngressSubject(message) {
	const candidates = buildIrcAllowlistCandidates(message, { allowNameMatching: true });
	const stableCandidates = candidates.filter((candidate) => hasVerifiedHost(candidate));
	const nick = normalizeLowercaseStringOrEmpty(message.senderNick);
	return {
		stableId: stableCandidates[stableCandidates.length - 1] ?? nick,
		aliases: {
			"irc-id-nick-user": candidates.find((candidate) => isHostlessNickUser(candidate)),
			"irc-id-nick-host": stableCandidates.find((candidate) => !candidate.includes("!") && candidate.includes("@")),
			"irc-nick": nick
		}
	};
}
//#endregion
//#region extensions/irc/src/outbound-base.ts
function sanitizeIrcAssistantText(text) {
	return sanitizeForPlainText(sanitizeAssistantVisibleText(text));
}
const ircOutboundBaseAdapter = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 350,
	sanitizeText: ({ text }) => sanitizeIrcAssistantText(text)
};
//#endregion
//#region extensions/irc/src/protocol.ts
const IRC_TARGET_PATTERN = /^[^\s:]+$/u;
function parseIrcLine(line) {
	const raw = line.replace(/[\r\n]+/g, "").trim();
	if (!raw) return null;
	let cursor = raw;
	let prefix;
	if (cursor.startsWith(":")) {
		const idx = cursor.indexOf(" ");
		if (idx <= 1) return null;
		prefix = cursor.slice(1, idx);
		cursor = cursor.slice(idx + 1).trimStart();
	}
	if (!cursor) return null;
	const firstSpace = cursor.indexOf(" ");
	const command = (firstSpace === -1 ? cursor : cursor.slice(0, firstSpace)).trim();
	if (!command) return null;
	cursor = firstSpace === -1 ? "" : cursor.slice(firstSpace + 1);
	const params = [];
	let trailing;
	while (cursor.length > 0) {
		cursor = cursor.trimStart();
		if (!cursor) break;
		if (cursor.startsWith(":")) {
			trailing = cursor.slice(1);
			break;
		}
		const spaceIdx = cursor.indexOf(" ");
		if (spaceIdx === -1) {
			params.push(cursor);
			break;
		}
		params.push(cursor.slice(0, spaceIdx));
		cursor = cursor.slice(spaceIdx + 1);
	}
	return {
		raw,
		prefix,
		command: command.toUpperCase(),
		params,
		trailing
	};
}
function parseIrcPrefix(prefix) {
	if (!prefix) return {};
	const nickPart = prefix.match(/^([^!@]+)!([^@]+)@(.+)$/);
	if (nickPart) return {
		nick: nickPart[1],
		user: nickPart[2],
		host: nickPart[3]
	};
	const nickHostPart = prefix.match(/^([^@]+)@(.+)$/);
	if (nickHostPart) return {
		nick: nickHostPart[1],
		host: nickHostPart[2]
	};
	if (prefix.includes("!")) {
		const [nick, user] = prefix.split("!", 2);
		return {
			nick,
			user
		};
	}
	if (prefix.includes(".")) return { server: prefix };
	return { nick: prefix };
}
function decodeLiteralEscapes(input) {
	return input.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\0/g, "\0").replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16))).replace(/\\u([dD][89abAB][0-9a-fA-F]{2})\\u([dD][c-fC-F][0-9a-fA-F]{2})/g, (_match, h, l) => String.fromCodePoint(65536 + (Number.parseInt(h, 16) - 55296 << 10) + (Number.parseInt(l, 16) - 56320))).replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
		const codePoint = Number.parseInt(hex, 16);
		return codePoint >= 55296 && codePoint <= 57343 ? match : String.fromCharCode(codePoint);
	});
}
function sanitizeIrcOutboundText(text) {
	return stripIrcControlChars(decodeLiteralEscapes(text).replace(/\r?\n/g, " ")).trim();
}
function sanitizeIrcTarget(raw) {
	const decoded = decodeLiteralEscapes(raw);
	if (!decoded) throw new Error("IRC target is required");
	if (decoded !== decoded.trim()) throw new Error(`Invalid IRC target: ${raw}`);
	if (hasIrcControlChars(decoded)) throw new Error(`Invalid IRC target: ${raw}`);
	if (!IRC_TARGET_PATTERN.test(decoded)) throw new Error(`Invalid IRC target: ${raw}`);
	return decoded;
}
function makeIrcMessageId() {
	return randomUUID();
}
//#endregion
//#region extensions/irc/src/client.ts
const IRC_ERROR_CODES = /* @__PURE__ */ new Set([
	"432",
	"464",
	"465"
]);
const IRC_NICK_COLLISION_CODES = /* @__PURE__ */ new Set(["433", "436"]);
const IRC_MAX_LINE_BYTES = 512;
function takeIrcPrivmsgChunk(text, maxChars, maxBytes) {
	let end = 0;
	let bytes = 0;
	for (const codePoint of text) {
		const codePointBytes = Buffer.byteLength(codePoint, "utf8");
		if (end > 0 && end + codePoint.length > maxChars || bytes + codePointBytes > maxBytes) break;
		end += codePoint.length;
		bytes += codePointBytes;
	}
	if (end === 0) throw new Error("IRC target leaves no room for message text within the 512-byte line limit");
	if (end === text.length) return text;
	const fitted = text.slice(0, end);
	if (text[end] === " ") return fitted;
	const splitAt = fitted.lastIndexOf(" ");
	if (splitAt >= Math.floor(fitted.length / 2)) return fitted.slice(0, splitAt);
	return fitted;
}
function toIrcError(err) {
	if (err instanceof Error) return err;
	return new Error(typeof err === "string" ? err : JSON.stringify(err));
}
let nickCollisionFallbackSeq = 0;
function buildFallbackNick(nick) {
	const base = nick.replace(/\s+/g, "").replace(/[^A-Za-z0-9_\-[\]\\`^{}|]/g, "") || "openclaw";
	const seq = ++nickCollisionFallbackSeq;
	const suffix = seq === 1 ? "_" : `_${seq}`;
	const maxNickLen = 30;
	if (base.length >= maxNickLen) return `${base.slice(0, maxNickLen - suffix.length)}${suffix}`;
	return `${base}${suffix}`;
}
function normalizeIrcNick(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function buildIrcNickServCommands(options) {
	if (!options || options.enabled === false) return [];
	const password = sanitizeIrcOutboundText(options.password ?? "");
	if (!password) return [];
	const service = sanitizeIrcTarget(options.service?.trim() || "NickServ");
	const commands = [`PRIVMSG ${service} :IDENTIFY ${password}`];
	if (options.register) {
		const registerEmail = sanitizeIrcOutboundText(options.registerEmail ?? "");
		if (!registerEmail) throw new Error("IRC NickServ register requires registerEmail");
		commands.push(`PRIVMSG ${service} :REGISTER ${password} ${registerEmail}`);
	}
	return commands;
}
async function connectIrcClient(options) {
	const timeoutMs = options.connectTimeoutMs != null ? options.connectTimeoutMs : 15e3;
	const messageChunkMaxChars = Math.max(1, Math.floor(options.messageChunkMaxChars ?? 350));
	if (!options.host.trim()) throw new Error("IRC host is required");
	if (!options.nick.trim()) throw new Error("IRC nick is required");
	const desiredNick = options.nick.trim();
	let currentNick = desiredNick;
	let ready = false;
	let closed = false;
	let nickServRecoverAttempted = false;
	let fallbackNickAttempted = false;
	let removeAbortListener = null;
	const socket = options.tls ? tls.connect({
		host: options.host,
		port: options.port,
		servername: options.host
	}) : net.connect({
		host: options.host,
		port: options.port
	});
	socket.setEncoding("utf8");
	let resolveReady = null;
	let rejectReady = null;
	const readyPromise = new Promise((resolve, reject) => {
		resolveReady = resolve;
		rejectReady = reject;
	});
	const fail = (err) => {
		const error = toIrcError(err);
		if (options.onError) options.onError(error);
		if (!ready && rejectReady) {
			rejectReady(error);
			rejectReady = null;
			resolveReady = null;
		}
	};
	const failAndClose = (err) => {
		fail(err);
		close();
	};
	const sendRaw = (line) => {
		const cleaned = line.replace(/[\r\n]+/g, "").trim();
		if (!cleaned) throw new Error("IRC command cannot be empty");
		socket.write(`${cleaned}\r\n`);
	};
	const tryRecoverNickCollision = () => {
		const nickServEnabled = options.nickserv?.enabled !== false;
		const nickservPassword = sanitizeIrcOutboundText(options.nickserv?.password ?? "");
		if (nickServEnabled && !nickServRecoverAttempted && nickservPassword) {
			nickServRecoverAttempted = true;
			try {
				const service = sanitizeIrcTarget(options.nickserv?.service?.trim() || "NickServ");
				sendRaw(`PRIVMSG ${service} :GHOST ${desiredNick} ${nickservPassword}`);
				sendRaw(`NICK ${desiredNick}`);
				return true;
			} catch (err) {
				fail(err);
			}
		}
		if (!fallbackNickAttempted) {
			fallbackNickAttempted = true;
			const fallbackNick = buildFallbackNick(desiredNick);
			if (normalizeIrcNick(fallbackNick) !== normalizeIrcNick(currentNick)) try {
				sendRaw(`NICK ${fallbackNick}`);
				currentNick = fallbackNick;
				return true;
			} catch (err) {
				fail(err);
			}
		}
		return false;
	};
	const join = (channel) => {
		const target = sanitizeIrcTarget(channel);
		if (!target.startsWith("#") && !target.startsWith("&")) throw new Error(`IRC JOIN target must be a channel: ${channel}`);
		sendRaw(`JOIN ${target}`);
	};
	const sendPrivmsg = (target, text, replyTo) => {
		const normalizedTarget = sanitizeIrcTarget(target);
		const cleaned = sanitizeIrcOutboundText(text);
		if (!cleaned) throw new Error("Message must be non-empty for IRC sends");
		const lineOverheadBytes = Buffer.byteLength(`PRIVMSG ${normalizedTarget} :\r\n`, "utf8");
		const maxChunkBytes = IRC_MAX_LINE_BYTES - lineOverheadBytes;
		let remaining = replyTo ? sanitizeIrcOutboundText(`${text}\n\n[reply:${replyTo}]`) : cleaned;
		while (remaining.length > 0) {
			const chunk = takeIrcPrivmsgChunk(remaining, messageChunkMaxChars, maxChunkBytes).trim();
			sendRaw(`PRIVMSG ${normalizedTarget} :${chunk}`);
			remaining = remaining.slice(chunk.length).trimStart();
		}
	};
	const quit = (reason) => {
		if (closed) return;
		closed = true;
		removeAbortListener?.();
		removeAbortListener = null;
		const safeReason = sanitizeIrcOutboundText(reason != null ? reason : "bye");
		try {
			if (safeReason) sendRaw(`QUIT :${safeReason}`);
			else sendRaw("QUIT");
		} catch {}
		socket.end();
	};
	const close = () => {
		if (closed) return;
		closed = true;
		removeAbortListener?.();
		removeAbortListener = null;
		socket.destroy();
	};
	let buffer = "";
	socket.on("data", (chunk) => {
		buffer += chunk;
		let idx = buffer.indexOf("\n");
		while (idx !== -1) {
			const rawLine = buffer.slice(0, idx).replace(/\r$/, "");
			buffer = buffer.slice(idx + 1);
			idx = buffer.indexOf("\n");
			if (!rawLine) continue;
			if (options.onLine) options.onLine(rawLine);
			const line = parseIrcLine(rawLine);
			if (!line) continue;
			if (line.command === "PING") {
				const payload = line.trailing != null ? line.trailing : line.params[0] != null ? line.params[0] : "";
				sendRaw(`PONG :${payload}`);
				continue;
			}
			if (line.command === "NICK") {
				const prefix = parseIrcPrefix(line.prefix);
				if (prefix.nick && normalizeIrcNick(prefix.nick) === normalizeIrcNick(currentNick)) currentNick = (line.trailing != null ? line.trailing : line.params[0] != null ? line.params[0] : currentNick).trim();
				continue;
			}
			if (!ready && IRC_NICK_COLLISION_CODES.has(line.command)) {
				if (tryRecoverNickCollision()) continue;
				const detail = line.trailing != null ? line.trailing : line.params.join(" ") || "nickname in use";
				fail(/* @__PURE__ */ new Error(`IRC login failed (${line.command}): ${detail}`));
				close();
				return;
			}
			if (!ready && IRC_ERROR_CODES.has(line.command)) {
				const detail = line.trailing != null ? line.trailing : line.params.join(" ") || "login rejected";
				fail(/* @__PURE__ */ new Error(`IRC login failed (${line.command}): ${detail}`));
				close();
				return;
			}
			if (line.command === "001") {
				ready = true;
				const nickParam = line.params[0];
				if (nickParam && nickParam.trim()) currentNick = nickParam.trim();
				try {
					const nickServCommands = buildIrcNickServCommands(options.nickserv);
					for (const command of nickServCommands) sendRaw(command);
				} catch (err) {
					fail(err);
				}
				for (const channel of options.channels || []) {
					const trimmed = channel.trim();
					if (!trimmed) continue;
					try {
						join(trimmed);
					} catch (err) {
						fail(err);
					}
				}
				if (resolveReady) resolveReady();
				resolveReady = null;
				rejectReady = null;
				continue;
			}
			if (line.command === "NOTICE") {
				if (options.onNotice) options.onNotice(line.trailing != null ? line.trailing : "", line.params[0]);
				continue;
			}
			if (line.command === "PRIVMSG") {
				const targetParam = line.params[0];
				const target = targetParam ? targetParam.trim() : "";
				const text = line.trailing ?? line.params[1] ?? "";
				const prefix = parseIrcPrefix(line.prefix);
				const senderNick = prefix.nick ? prefix.nick.trim() : "";
				if (!target || !senderNick || !text.trim()) continue;
				if (options.onPrivmsg) Promise.resolve(options.onPrivmsg({
					senderNick,
					senderUser: prefix.user ? prefix.user.trim() : void 0,
					senderHost: prefix.host ? prefix.host.trim() : void 0,
					connectedNick: currentNick,
					target,
					text,
					rawLine
				})).catch((error) => {
					fail(error);
				});
			}
		}
	});
	socket.once("connect", () => {
		try {
			if (options.password && options.password.trim()) sendRaw(`PASS ${options.password.trim()}`);
			sendRaw(`NICK ${options.nick.trim()}`);
			sendRaw(`USER ${options.username.trim()} 0 * :${sanitizeIrcOutboundText(options.realname)}`);
		} catch (err) {
			fail(err);
			close();
		}
	});
	socket.once("error", (err) => {
		fail(err);
	});
	socket.once("close", () => {
		if (!closed) {
			closed = true;
			removeAbortListener?.();
			removeAbortListener = null;
			if (!ready) fail(/* @__PURE__ */ new Error("IRC connection closed before ready"));
			else options.onDisconnect?.();
		}
	});
	if (options.abortSignal) {
		const abort = () => {
			if (!ready) {
				failAndClose(/* @__PURE__ */ new Error("IRC connect aborted"));
				return;
			}
			quit("shutdown");
		};
		if (options.abortSignal.aborted) abort();
		else {
			options.abortSignal.addEventListener("abort", abort, { once: true });
			removeAbortListener = () => options.abortSignal?.removeEventListener("abort", abort);
		}
	}
	try {
		await withTimeout(readyPromise, timeoutMs, "IRC connect");
	} catch (error) {
		close();
		throw error;
	}
	return {
		get nick() {
			return currentNick;
		},
		isReady: () => ready && !closed,
		sendRaw,
		join,
		sendPrivmsg,
		quit,
		close
	};
}
//#endregion
//#region extensions/irc/src/connect-options.ts
function buildIrcConnectOptions(account, overrides = {}) {
	assertSecretOwnerAvailable("account", `irc:${account.accountId}`);
	if (account.tokenStatus === "configured_unavailable") throw new Error(`IRC credentials for account "${account.accountId}" are configured but unavailable.`);
	return {
		host: account.host,
		port: account.port,
		tls: account.tls,
		nick: account.nick,
		username: account.username,
		realname: account.realname,
		password: account.password,
		nickserv: {
			enabled: account.config.nickserv?.enabled,
			service: account.config.nickserv?.service,
			password: account.config.nickserv?.password,
			register: account.config.nickserv?.register,
			registerEmail: account.config.nickserv?.registerEmail
		},
		...overrides
	};
}
//#endregion
//#region extensions/irc/src/send.ts
function recordIrcOutboundActivity(accountId) {
	try {
		getIrcRuntime().channel.activity.record({
			channel: "irc",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "IRC runtime not initialized") throw error;
	}
}
async function sendIrcMessages(to, text, opts, planMessages = (preparedText) => [{
	text: preparedText,
	replyTo: opts.replyTo
}], onDeliveryResult) {
	const cfg = requireRuntimeConfig(opts.cfg, "IRC send");
	const account = resolveIrcAccount({
		cfg,
		accountId: opts.accountId
	});
	if (!account.configured) throw new Error(`IRC is not configured for account "${account.accountId}" (need host and nick in channels.irc).`);
	const target = normalizeIrcMessagingTarget(to);
	if (!target) throw new Error(`Invalid IRC target: ${to}`);
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "irc",
		accountId: account.accountId
	});
	if (!text) return [];
	const prepared = stripMarkdown(convertMarkdownTables(text.trim(), tableMode));
	if (!prepared.trim()) throw new Error("Message must be non-empty for IRC sends");
	const messages = planMessages(prepared);
	opts.abortSignal?.throwIfAborted();
	let transient;
	const client = opts.client?.isReady() ? opts.client : transient = await connectIrcClient(buildIrcConnectOptions(account, {
		connectTimeoutMs: 12e3,
		abortSignal: opts.abortSignal
	}));
	const results = [];
	try {
		opts.abortSignal?.throwIfAborted();
		if (transient && (target.startsWith("#") || target.startsWith("&"))) client.join(target);
		for (const message of messages) {
			opts.abortSignal?.throwIfAborted();
			if (!client.isReady()) throw new Error("IRC connection closed before send");
			await opts.onPlatformSendDispatch?.();
			opts.abortSignal?.throwIfAborted();
			if (!client.isReady()) throw new Error("IRC connection closed before send");
			client.sendPrivmsg(target, message.text, message.replyTo);
			recordIrcOutboundActivity(account.accountId);
			const messageId = makeIrcMessageId();
			const result = {
				messageId,
				target,
				receipt: createMessageReceiptFromOutboundResults({
					results: [{
						channel: "irc",
						messageId,
						conversationId: target
					}],
					kind: "text",
					...message.replyTo ? { replyToId: message.replyTo } : {}
				})
			};
			results.push(result);
			await onDeliveryResult?.(result);
		}
		return results;
	} finally {
		transient?.quit("sent");
	}
}
async function sendMessageIrc(to, text, opts) {
	const result = (await sendIrcMessages(to, text, opts))[0];
	if (!result) throw new Error("Message must be non-empty for IRC sends");
	return result;
}
//#endregion
//#region extensions/irc/src/message-adapter.ts
function toIrcMessageResult({ target, ...result }) {
	return {
		...result,
		target: {
			kind: "conversation",
			id: target
		}
	};
}
async function sendIrcMessage(ctx, text = ctx.text) {
	return toIrcMessageResult(await sendMessageIrc(ctx.to, text, {
		cfg: ctx.cfg,
		accountId: ctx.accountId ?? void 0,
		replyTo: ctx.replyToId ?? void 0,
		abortSignal: ctx.signal,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch
	}));
}
const sendFormattedIrcText = async (ctx) => {
	const { chunkTextWithMode, resolveChunkMode, resolveTextChunkLimit } = await import("openclaw/plugin-sdk/reply-chunking");
	const accountId = ctx.accountId ?? void 0;
	const textLimit = ctx.formatting?.textLimit ?? resolveTextChunkLimit(ctx.cfg, "irc", accountId, { fallbackLimit: ircOutboundBaseAdapter.textChunkLimit });
	const chunkMode = ctx.formatting?.chunkMode ?? resolveChunkMode(ctx.cfg, "irc", accountId);
	const nextReplyToId = createReplyToFanout(ctx);
	return (await sendIrcMessages(ctx.to, ctx.text, {
		cfg: ctx.cfg,
		accountId,
		abortSignal: ctx.abortSignal,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch
	}, (preparedText) => chunkTextWithMode(preparedText, textLimit, chunkMode).map((text) => ({
		text,
		replyTo: nextReplyToId()
	})), async (result) => {
		await ctx.onDeliveryResult?.(attachChannelToResult("irc", toIrcMessageResult(result)));
	})).map((result) => attachChannelToResult("irc", toIrcMessageResult(result)));
};
const ircMessageAdapter = defineChannelMessageAdapter({
	id: "irc",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		replyTo: true
	} },
	send: {
		text: sendIrcMessage,
		media: (ctx) => sendIrcMessage(ctx, ctx.mediaUrl ? `${ctx.text}\n\nAttachment: ${ctx.mediaUrl}` : ctx.text)
	}
});
//#endregion
//#region extensions/irc/src/policy.ts
function resolveIrcGroupScope(params) {
	const { "*": wildcard, ...groups } = params.groups ?? {};
	const project = (entry) => ({
		requireMention: entry.requireMention,
		tools: entry.tools
	});
	const tree = {
		defaults: wildcard ? project(wildcard) : void 0,
		scopes: Object.fromEntries(Object.entries(groups).map(([key, entry]) => [key, project(entry)]))
	};
	const key = resolveScopeKeyCaseInsensitive(tree, params.target);
	return {
		tree,
		path: key ? [key] : []
	};
}
function resolveIrcGroupMatch(params) {
	const { path } = resolveIrcGroupScope(params);
	const key = path[0];
	const groupConfig = key ? params.groups?.[key] : void 0;
	const wildcardConfig = params.groups?.["*"];
	return {
		allowed: Boolean(groupConfig ?? wildcardConfig),
		groupConfig,
		wildcardConfig,
		hasConfiguredGroups: Object.keys(params.groups ?? {}).length > 0
	};
}
function resolveIrcGroupRequireMention(params) {
	const { tree, path } = resolveIrcGroupScope(params);
	return resolveScopeRequireMention({
		tree,
		path
	});
}
function resolveIrcGroupToolPolicy(params) {
	const { tree, path } = resolveIrcGroupScope(params);
	return resolveScopeToolsPolicy({
		tree,
		path
	});
}
//#endregion
//#region extensions/irc/src/probe.ts
function formatError(err) {
	if (err instanceof Error) return err.message;
	return typeof err === "string" ? err : JSON.stringify(err);
}
async function probeIrc(cfg, opts) {
	const account = resolveIrcAccount({
		cfg,
		accountId: opts?.accountId
	});
	const base = {
		ok: false,
		host: account.host,
		port: account.port,
		tls: account.tls,
		nick: account.nick
	};
	if (!account.configured) return {
		...base,
		error: "missing host or nick"
	};
	const started = Date.now();
	try {
		const client = await connectIrcClient(buildIrcConnectOptions(account, { connectTimeoutMs: opts?.timeoutMs ?? 8e3 }));
		const elapsed = Date.now() - started;
		client.quit("probe");
		return {
			...base,
			ok: true,
			latencyMs: elapsed
		};
	} catch (err) {
		return {
			...base,
			error: formatError(err)
		};
	}
}
//#endregion
//#region extensions/irc/src/setup-core.ts
const channel$1 = "irc";
const setIrcTopLevelDmPolicy = createTopLevelChannelDmPolicySetter({ channel: channel$1 });
const setIrcTopLevelAllowFrom = createTopLevelChannelAllowFromSetter({ channel: channel$1 });
const validateIrcRequiredSetupInput = createSetupInputPresenceValidator({ whenNotUseEnv: [{
	someOf: ["host"],
	message: "IRC requires host."
}, {
	someOf: ["nick"],
	message: "IRC requires nick."
}] });
function parsePort(raw, fallback) {
	const trimmed = raw.trim();
	if (!trimmed) return fallback;
	const parsed = parseStrictPositiveInteger(trimmed);
	if (parsed === void 0 || parsed > 65535) return fallback;
	return parsed;
}
function validateIrcPortInput(input) {
	const raw = input.port;
	if (raw === void 0 || raw === null || raw === "") return null;
	const parsed = parseStrictPositiveInteger(String(raw));
	return parsed !== void 0 && parsed <= 65535 ? null : "IRC port must be between 1 and 65535.";
}
function updateIrcAccountConfig(cfg, accountId, patch) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel$1,
		accountId,
		patch,
		ensureChannelEnabled: false,
		ensureAccountEnabled: false
	});
}
function setIrcDmPolicy(cfg, dmPolicy) {
	return setIrcTopLevelDmPolicy(cfg, dmPolicy);
}
function setIrcAllowFrom(cfg, allowFrom) {
	return setIrcTopLevelAllowFrom(cfg, allowFrom);
}
function setIrcNickServ(cfg, accountId, nickserv) {
	return updateIrcAccountConfig(cfg, accountId, { nickserv });
}
function setIrcGroupAccess(cfg, accountId, policy, entries, normalizeGroupEntry) {
	if (policy !== "allowlist") return updateIrcAccountConfig(cfg, accountId, {
		enabled: true,
		groupPolicy: policy
	});
	const normalizedEntries = [...new Set(entries.flatMap((entry) => normalizeGroupEntry(entry) ?? []))];
	return updateIrcAccountConfig(cfg, accountId, {
		enabled: true,
		groupPolicy: "allowlist",
		groups: Object.fromEntries(normalizedEntries.map((entry) => [entry, {}]))
	});
}
const ircSetupAdapter = {
	singleAccountKeysToMove: ["password"],
	resolveAccountId: ({ accountId }) => normalizeAccountId$1(accountId),
	applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: (params) => validateIrcRequiredSetupInput(params) ?? validateIrcPortInput(params.input),
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const namedConfig = applyAccountNameToChannelSection({
			cfg,
			channelKey: channel$1,
			accountId,
			name: setupInput.name
		});
		const portInput = typeof setupInput.port === "number" ? String(setupInput.port) : setupInput.port ?? "";
		const patch = {
			enabled: true,
			host: setupInput.host?.trim(),
			port: portInput ? parsePort(portInput, setupInput.tls === false ? 6667 : 6697) : void 0,
			tls: setupInput.tls,
			nick: setupInput.nick?.trim(),
			username: setupInput.username?.trim(),
			realname: setupInput.realname?.trim(),
			password: setupInput.password?.trim(),
			channels: setupInput.channels
		};
		return patchScopedAccountConfig({
			cfg: namedConfig,
			channelKey: channel$1,
			accountId,
			patch
		});
	}
};
const ircSetupContract = defineChannelSetupContract({
	fields: {
		host: {
			kind: "string",
			cli: {
				flags: "--host <host>",
				description: "IRC server host"
			}
		},
		port: {
			kind: "string",
			cli: {
				flags: "--port <port>",
				description: "IRC server port"
			}
		},
		tls: {
			kind: "boolean",
			cli: {
				flags: "--tls",
				description: "Use TLS for IRC"
			}
		},
		nick: {
			kind: "string",
			cli: {
				flags: "--nick <nick>",
				description: "IRC nickname"
			}
		},
		username: {
			kind: "string",
			cli: {
				flags: "--username <name>",
				description: "IRC username"
			}
		},
		realname: {
			kind: "string",
			cli: {
				flags: "--realname <name>",
				description: "IRC real name"
			}
		},
		channels: {
			kind: "string-list",
			cli: {
				flags: "--channels <names>",
				description: "IRC channels"
			}
		},
		password: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--password <password>",
				description: "IRC server password"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use IRC environment configuration"
			},
			envVars: ["IRC_HOST", "IRC_NICK"]
		}
	},
	legacyAdapter: ircSetupAdapter
});
//#endregion
//#region extensions/irc/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "irc";
const USE_ENV_FLAG = "__ircUseEnv";
const TLS_FLAG = "__ircTls";
function parseListInput(raw) {
	return normalizeStringEntries(raw.split(/[\n,;]+/g));
}
function normalizeGroupEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	const normalized = normalizeIrcMessagingTarget(trimmed) ?? trimmed;
	if (isChannelTarget(normalized)) return normalized;
	return `#${normalized.replace(/^#+/, "")}`;
}
const promptIrcAllowFrom = createPromptParsedAllowFromForAccount({
	defaultAccountId: (cfg) => resolveDefaultIrcAccountId(cfg),
	noteTitle: t("wizard.irc.allowlistTitle"),
	noteLines: [
		t("wizard.irc.allowlistIntro"),
		t("wizard.irc.examples"),
		"- alice",
		"- alice!ident@example.org",
		t("wizard.irc.multipleEntries")
	],
	message: t("wizard.irc.allowFromPrompt"),
	placeholder: "alice, bob!ident@example.org",
	parseEntries: (raw) => ({ entries: normalizeStringEntries(parseListInput(raw).map((entry) => normalizeIrcAllowEntry(entry))) }),
	getExistingAllowFrom: ({ cfg }) => cfg.channels?.irc?.allowFrom ?? [],
	applyAllowFrom: ({ cfg, allowFrom }) => setIrcAllowFrom(cfg, allowFrom)
});
async function promptIrcNickServConfig(params) {
	const existing = resolveIrcAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.nickserv;
	const hasExisting = Boolean(existing?.password || existing?.passwordFile);
	if (!await params.prompter.confirm({
		message: hasExisting ? t("wizard.irc.nickServUpdatePrompt") : t("wizard.irc.nickServConfigurePrompt"),
		initialValue: hasExisting
	})) return params.cfg;
	const service = (await params.prompter.text({
		message: t("wizard.irc.nickServServicePrompt"),
		initialValue: existing?.service || "NickServ",
		validate: (value) => normalizeStringifiedOptionalString(value) ? void 0 : "Required"
	})).trim();
	const useEnvPassword = params.accountId === DEFAULT_ACCOUNT_ID$1 && Boolean(process.env.IRC_NICKSERV_PASSWORD?.trim()) && !(existing?.password || existing?.passwordFile) ? await params.prompter.confirm({
		message: t("wizard.irc.nickServPasswordEnvPrompt"),
		initialValue: true
	}) : false;
	const password = useEnvPassword ? void 0 : (await params.prompter.text({
		message: t("wizard.irc.nickServPasswordPrompt"),
		validate: () => void 0
	})).trim();
	if (!password && !useEnvPassword) return setIrcNickServ(params.cfg, params.accountId, {
		enabled: false,
		service
	});
	const register = await params.prompter.confirm({
		message: t("wizard.irc.nickServRegisterPrompt"),
		initialValue: existing?.register ?? false
	});
	const registerEmail = register ? (await params.prompter.text({
		message: t("wizard.irc.nickServRegisterEmailPrompt"),
		initialValue: existing?.registerEmail || (params.accountId === DEFAULT_ACCOUNT_ID$1 ? process.env.IRC_NICKSERV_REGISTER_EMAIL : void 0),
		validate: (value) => normalizeStringifiedOptionalString(value) ? void 0 : "Required"
	})).trim() : void 0;
	return setIrcNickServ(params.cfg, params.accountId, {
		enabled: true,
		service,
		...password ? { password } : {},
		register,
		...registerEmail ? { registerEmail } : {}
	});
}
const ircDmPolicy = {
	label: "IRC",
	channel,
	policyKey: "channels.irc.dmPolicy",
	allowFromKey: "channels.irc.allowFrom",
	getCurrent: (cfg) => cfg.channels?.irc?.dmPolicy ?? "pairing",
	setPolicy: (cfg, policy) => setIrcDmPolicy(cfg, policy),
	promptAllowFrom: async ({ cfg, prompter, accountId }) => await promptIrcAllowFrom({
		cfg,
		prompter,
		accountId
	})
};
const ircSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "IRC",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsHostNick"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsHostNick"),
		configuredScore: 1,
		unconfiguredScore: 0,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => resolveIrcAccount({
			cfg,
			accountId
		}).configured
	}),
	introNote: {
		title: t("wizard.irc.setupTitle"),
		lines: [
			t("wizard.irc.helpNeedsHostNick"),
			t("wizard.irc.helpRecommendedTls"),
			t("wizard.irc.helpNickServOptional"),
			t("wizard.irc.helpGroupControl"),
			t("wizard.irc.helpMentionGate"),
			t("wizard.irc.helpEnvVars"),
			`Docs: ${formatDocsLink("/channels/irc", "channels/irc")}`
		],
		shouldShow: ({ cfg, accountId }) => !resolveIrcAccount({
			cfg,
			accountId
		}).configured
	},
	prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
		const resolved = resolveIrcAccount({
			cfg,
			accountId
		});
		const isDefaultAccount = accountId === DEFAULT_ACCOUNT_ID$1;
		const envHost = isDefaultAccount ? normalizeOptionalString(process.env.IRC_HOST) ?? "" : "";
		const envNick = isDefaultAccount ? normalizeOptionalString(process.env.IRC_NICK) ?? "" : "";
		if (Boolean(envHost && envNick && !resolved.config.host && !resolved.config.nick)) {
			if (await prompter.confirm({
				message: t("wizard.irc.envPrompt"),
				initialValue: true
			})) return {
				cfg: updateIrcAccountConfig(cfg, accountId, { enabled: true }),
				credentialValues: {
					...credentialValues,
					[USE_ENV_FLAG]: "1"
				}
			};
		}
		const tls = await prompter.confirm({
			message: t("wizard.irc.tlsPrompt"),
			initialValue: resolved.config.tls ?? true
		});
		return {
			cfg: updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				tls
			}),
			credentialValues: {
				...credentialValues,
				[USE_ENV_FLAG]: "0",
				[TLS_FLAG]: tls ? "1" : "0"
			}
		};
	},
	credentials: [],
	textInputs: [
		{
			inputKey: "httpHost",
			message: t("wizard.irc.serverHostPrompt"),
			currentValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.host || void 0,
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
			normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
			applySet: async ({ cfg, accountId, value }) => updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				host: value
			})
		},
		{
			inputKey: "httpPort",
			message: t("wizard.irc.serverPortPrompt"),
			currentValue: ({ cfg, accountId }) => String(resolveIrcAccount({
				cfg,
				accountId
			}).config.port ?? ""),
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			initialValue: ({ cfg, accountId, credentialValues }) => {
				const resolved = resolveIrcAccount({
					cfg,
					accountId
				});
				const tls = credentialValues[TLS_FLAG] !== "0";
				const defaultPort = resolved.config.port ?? (tls ? 6697 : 6667);
				return String(defaultPort);
			},
			validate: ({ value }) => {
				const raw = normalizeStringifiedOptionalString(value) ?? "";
				const parsed = parseStrictPositiveInteger(raw);
				return parsed !== void 0 && parsed <= 65535 ? void 0 : "Use a port between 1 and 65535";
			},
			normalizeValue: ({ value }) => String(parsePort(value, 6697)),
			applySet: async ({ cfg, accountId, value }) => updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				port: parsePort(value, 6697)
			})
		},
		{
			inputKey: "token",
			message: t("wizard.irc.nickPrompt"),
			currentValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.nick || void 0,
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
			normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
			applySet: async ({ cfg, accountId, value }) => updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				nick: value
			})
		},
		{
			inputKey: "userId",
			message: t("wizard.irc.usernamePrompt"),
			currentValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.username || void 0,
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			initialValue: ({ cfg, accountId, credentialValues }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.username || credentialValues.token || "openclaw",
			validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
			normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
			applySet: async ({ cfg, accountId, value }) => updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				username: value
			})
		},
		{
			inputKey: "deviceName",
			message: t("wizard.irc.realNamePrompt"),
			currentValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.realname || void 0,
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			initialValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.realname || "OpenClaw",
			validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
			normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
			applySet: async ({ cfg, accountId, value }) => updateIrcAccountConfig(cfg, accountId, {
				enabled: true,
				realname: value
			})
		},
		{
			inputKey: "groupChannels",
			message: t("wizard.irc.autoJoinPrompt"),
			placeholder: "#openclaw, #ops",
			required: false,
			applyEmptyValue: true,
			currentValue: ({ cfg, accountId }) => resolveIrcAccount({
				cfg,
				accountId
			}).config.channels?.join(", "),
			shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1",
			normalizeValue: ({ value }) => parseListInput(value).map((entry) => normalizeGroupEntry(entry)).filter((entry) => Boolean(entry && entry !== "*")).filter((entry) => isChannelTarget(entry)).join(", "),
			applySet: async ({ cfg, accountId, value }) => {
				const channels = parseListInput(value).map((entry) => normalizeGroupEntry(entry)).filter((entry) => Boolean(entry && entry !== "*")).filter((entry) => isChannelTarget(entry));
				return updateIrcAccountConfig(cfg, accountId, {
					enabled: true,
					channels: channels.length > 0 ? channels : void 0
				});
			}
		}
	],
	groupAccess: {
		label: "IRC channels",
		placeholder: "#openclaw, #ops, *",
		currentPolicy: ({ cfg, accountId }) => resolveIrcAccount({
			cfg,
			accountId
		}).config.groupPolicy ?? "allowlist",
		currentEntries: ({ cfg, accountId }) => Object.keys(resolveIrcAccount({
			cfg,
			accountId
		}).config.groups ?? {}),
		updatePrompt: ({ cfg, accountId }) => Boolean(resolveIrcAccount({
			cfg,
			accountId
		}).config.groups),
		setPolicy: ({ cfg, accountId, policy }) => setIrcGroupAccess(cfg, accountId, policy, [], normalizeGroupEntry),
		resolveAllowlist: async ({ entries }) => uniqueStrings(entries.map((entry) => normalizeGroupEntry(entry)).filter((entry) => Boolean(entry))),
		applyAllowlist: ({ cfg, accountId, resolved }) => setIrcGroupAccess(cfg, accountId, "allowlist", resolved, normalizeGroupEntry)
	},
	allowFrom: createAllowFromSection({
		helpTitle: t("wizard.irc.allowlistTitle"),
		helpLines: [
			t("wizard.irc.allowlistIntro"),
			t("wizard.irc.examples"),
			"- alice",
			"- alice!ident@example.org",
			t("wizard.irc.multipleEntries")
		],
		message: t("wizard.irc.allowFromPrompt"),
		placeholder: "alice, bob!ident@example.org",
		invalidWithoutCredentialNote: t("wizard.irc.allowFromInvalid"),
		parseId: (raw) => {
			return normalizeIrcAllowEntry(raw) || null;
		},
		apply: async ({ cfg, allowFrom }) => setIrcAllowFrom(cfg, allowFrom)
	}),
	finalize: async ({ cfg, accountId, prompter }) => {
		let next = cfg;
		const resolvedAfterGroups = resolveIrcAccount({
			cfg: next,
			accountId
		});
		if (resolvedAfterGroups.config.groupPolicy === "allowlist") {
			if (Object.keys(resolvedAfterGroups.config.groups ?? {}).length > 0) {
				if (!await prompter.confirm({
					message: t("wizard.irc.requireMentionPrompt"),
					initialValue: true
				})) {
					const groups = resolvedAfterGroups.config.groups ?? {};
					const patched = Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, {
						...value,
						requireMention: false
					}]));
					next = updateIrcAccountConfig(next, accountId, { groups: patched });
				}
			}
		}
		next = await promptIrcNickServConfig({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: next };
	},
	completionNote: {
		title: t("wizard.irc.nextStepsTitle"),
		lines: [
			t("wizard.irc.nextRestartGateway"),
			t("wizard.irc.nextStatusCommand"),
			`Docs: ${formatDocsLink("/channels/irc", "channels/irc")}`
		]
	},
	dmPolicy: ircDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/irc/src/channel.ts
const meta = {
	id: "irc",
	label: "IRC",
	selectionLabel: "IRC (Server + Nick)",
	docsPath: "/channels/irc",
	docsLabel: "irc",
	blurb: "classic IRC networks; host, nick, channels.",
	order: 80,
	detailLabel: "IRC",
	systemImage: "number",
	markdownCapable: true
};
const loadIrcChannelRuntime = createLazyRuntimeModule(() => import("./channel-runtime-2EUgbrxg.mjs"));
function normalizePairingTarget(raw) {
	const normalized = normalizeIrcAllowEntry(raw);
	if (!normalized) return "";
	return normalized.split(/[!@]/, 1)[0]?.trim() ?? "";
}
const listIrcDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: adaptScopedAccountAccessor(resolveIrcAccount),
	resolveSources: (account) => [
		account.config.allowFrom ?? [],
		account.config.groupAllowFrom ?? [],
		...Object.values(account.config.groups ?? {}).map((group) => group.allowFrom ?? [])
	],
	normalizeId: (entry) => normalizePairingTarget(entry) || null
});
const listIrcDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: adaptScopedAccountAccessor(resolveIrcAccount),
	resolveSources: (account) => [account.config.channels ?? [], Object.keys(account.config.groups ?? {})],
	normalizeId: (entry) => {
		const normalized = normalizeIrcMessagingTarget(entry);
		return normalized && isChannelTarget(normalized) ? normalized : null;
	}
});
const ircConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "irc",
	listAccountIds: listIrcAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveIrcAccount),
	defaultAccountId: resolveDefaultIrcAccountId,
	clearBaseFields: [
		"name",
		"host",
		"port",
		"tls",
		"nick",
		"username",
		"realname",
		"password",
		"passwordFile",
		"channels"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: normalizeIrcAllowEntry
	}),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const resolveIrcDmPolicy = createScopedDmSecurityResolver({
	channelKey: "irc",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	classifyEntryAuthentication: identityEntryAuthenticationClassifier(ircIngressIdentity),
	normalizeEntry: (raw) => normalizeIrcAllowEntry(raw)
});
const collectIrcGroupPolicyWarnings = createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.irc !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "IRC channels",
		openBehavior: "allows all channels and senders (mention-gated)",
		remediation: "Prefer channels.irc.groupPolicy=\"allowlist\" with channels.irc.groups"
	}
});
const collectIrcOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectIrcGroupPolicyWarnings,
	checkId: "channels.irc.groups.open",
	severity: "warn",
	title: "IRC security warning"
});
const collectIrcSecurityWarnings = (params) => [
	...collectIrcOpenGroupFindings(params),
	...!params.account.config.tls ? ["- IRC TLS is disabled (channels.irc.tls=false); traffic and credentials are plaintext."] : [],
	...params.account.config.nickserv?.register ? ["- IRC NickServ registration is enabled (channels.irc.nickserv.register=true); this sends \"REGISTER\" on every connect. Disable after first successful registration."] : [],
	...params.account.config.nickserv?.register && !params.account.config.nickserv.password?.trim() ? ["- IRC NickServ registration is enabled but no NickServ password is resolved; set channels.irc.nickserv.password, channels.irc.nickserv.passwordFile, or IRC_NICKSERV_PASSWORD."] : []
];
const ircPlugin = createChatChannelPlugin({
	base: {
		id: "irc",
		meta: {
			...meta,
			quickstartAllowFrom: true
		},
		setupContract: ircSetupContract,
		setupWizard: ircSetupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			blockStreaming: true
		},
		reload: {
			configPrefixes: ["channels.irc"],
			accountScopedRestart: true
		},
		configSchema: IrcChannelConfigSchema,
		config: {
			...ircConfigAdapter,
			hasConfiguredState: ({ env }) => typeof env?.IRC_HOST === "string" && env.IRC_HOST.trim().length > 0 && typeof env?.IRC_NICK === "string" && env.IRC_NICK.trim().length > 0,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: {
					host: account.host,
					port: account.port,
					tls: account.tls,
					nick: account.nick,
					passwordSource: account.passwordSource,
					tokenStatus: account.tokenStatus
				}
			})
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		doctor: {
			groupAllowFromFallbackToAllowFrom: false,
			collectMutableAllowlistWarnings: collectIrcMutableAllowlistWarnings
		},
		groups: {
			resolveRequireMention: ({ cfg, accountId, groupId }) => {
				const account = resolveIrcAccount({
					cfg,
					accountId
				});
				if (!groupId) return true;
				return resolveIrcGroupRequireMention({
					groups: account.config.groups,
					target: groupId
				});
			},
			resolveToolPolicy: ({ cfg, accountId, groupId }) => {
				const account = resolveIrcAccount({
					cfg,
					accountId
				});
				if (!groupId) return;
				return resolveIrcGroupToolPolicy({
					groups: account.config.groups,
					target: groupId
				});
			}
		},
		messaging: {
			targetPrefixes: ["irc"],
			normalizeTarget: normalizeIrcMessagingTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeIrcMessagingTarget(to);
				return target ? isChannelTarget(target) ? "group" : "direct" : void 0;
			},
			resolveOutboundSessionRoute: (params) => resolveIrcOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeIrcTargetId,
				hint: "<#channel|nick>"
			}
		},
		message: ircMessageAdapter,
		resolver: { resolveTargets: async ({ inputs, kind }) => {
			return inputs.map((input) => {
				const normalized = normalizeIrcMessagingTarget(input);
				if (!normalized) return {
					input,
					resolved: false,
					note: "invalid IRC target"
				};
				if (kind === "group") {
					const groupId = isChannelTarget(normalized) ? normalized : `#${normalized}`;
					return {
						input,
						resolved: true,
						id: groupId,
						name: groupId
					};
				}
				if (isChannelTarget(normalized)) return {
					input,
					resolved: false,
					note: "expected user target"
				};
				return {
					input,
					resolved: true,
					id: normalized,
					name: normalized
				};
			});
		} },
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => listIrcDirectoryPeersFromConfig(params),
			listGroups: async (params) => {
				return (await listIrcDirectoryGroupsFromConfig(params)).map((entry) => Object.assign({}, entry, { name: entry.id }));
			}
		}),
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$2),
			buildChannelSummary: ({ account, snapshot }) => ({
				...buildBaseChannelStatusSummary(snapshot),
				host: account.host,
				port: snapshot.port,
				tls: account.tls,
				nick: account.nick,
				probe: snapshot.probe,
				lastProbeAt: snapshot.lastProbeAt ?? null
			}),
			probeAccount: async ({ cfg, account, timeoutMs }) => probeIrc(cfg, {
				accountId: account.accountId,
				timeoutMs
			}),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					host: account.host,
					port: account.port,
					tls: account.tls,
					nick: account.nick,
					passwordSource: account.passwordSource,
					tokenStatus: account.tokenStatus
				}
			})
		}),
		gateway: { startAccount: async (ctx) => await startIrcGatewayAccount({
			...ctx,
			cfg: ctx.cfg
		}) }
	},
	pairing: { text: {
		idLabel: "ircUser",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: (entry) => normalizeIrcAllowEntry(entry),
		notify: async ({ cfg, id, message, accountId }) => {
			const target = normalizePairingTarget(id);
			if (!target) throw new Error(`invalid IRC pairing id: ${id}`);
			const { sendMessageIrc } = await loadIrcChannelRuntime();
			await sendMessageIrc(target, message, {
				cfg,
				accountId
			});
		}
	} },
	security: {
		resolveDmPolicy: resolveIrcDmPolicy,
		collectWarnings: collectIrcSecurityWarnings
	},
	outbound: {
		base: {
			...ircOutboundBaseAdapter,
			sendFormattedText: sendFormattedIrcText
		},
		attachedResults: {
			channel: "irc",
			sendText: ({ onDeliveryResult: _onDeliveryResult, ...ctx }) => ircMessageAdapter.send.text(ctx),
			sendMedia: ({ onDeliveryResult: _onDeliveryResult, mediaUrl, ...ctx }) => ircMessageAdapter.send.media({
				...ctx,
				mediaUrl: mediaUrl ?? ""
			})
		}
	}
});
//#endregion
export { listIrcAccountIds as _, resolveIrcGroupRequireMention as a, connectIrcClient as c, sanitizeIrcAssistantText as d, createIrcIngressSubject as f, listEnabledIrcAccounts as g, normalizeIrcAllowEntry as h, resolveIrcGroupMatch as i, parseIrcLine as l, isChannelTarget as m, ircSetupWizard as n, sendMessageIrc as o, ircIngressIdentity as p, ircSetupAdapter as r, buildIrcConnectOptions as s, ircPlugin as t, parseIrcPrefix as u, resolveDefaultIrcAccountId as v, resolveIrcAccount as y };
