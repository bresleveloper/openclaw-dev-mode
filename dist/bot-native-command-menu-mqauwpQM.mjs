import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { t as getOptionalTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { n as resolveTelegramBotUserIdFromToken, t as fingerprintTelegramBotToken } from "./token-fingerprint-Ct5hUe3A.mjs";
import { r as normalizeTelegramCommandName, t as TELEGRAM_COMMAND_NAME_PATTERN } from "./command-config-2phBVF-a.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-menu-state.ts
const TELEGRAM_MENU_LOCALE_LEDGER_VERSION = 1;
const TELEGRAM_MENU_LOCALE_LEDGER_NAMESPACE = "telegram.command-menu-locales";
const TELEGRAM_MENU_LOCALE_LEDGER_MAX_ENTRIES = 1e3;
const TELEGRAM_MENU_LEDGER_DIAGNOSTIC_MAX_CODES = 8;
const TELEGRAM_MENU_LEDGER_DIAGNOSTIC_CODE_MAX_LENGTH = 32;
const TELEGRAM_MENU_LANGUAGE_CODES = new Set(Object.keys({
	ab: true,
	aa: true,
	af: true,
	ak: true,
	sq: true,
	am: true,
	ar: true,
	an: true,
	hy: true,
	as: true,
	av: true,
	ae: true,
	ay: true,
	az: true,
	bm: true,
	ba: true,
	eu: true,
	be: true,
	bn: true,
	bi: true,
	bs: true,
	br: true,
	bg: true,
	my: true,
	ca: true,
	ch: true,
	ce: true,
	ny: true,
	zh: true,
	cu: true,
	cv: true,
	kw: true,
	co: true,
	cr: true,
	hr: true,
	cs: true,
	da: true,
	dv: true,
	nl: true,
	dz: true,
	en: true,
	eo: true,
	et: true,
	ee: true,
	fo: true,
	fj: true,
	fi: true,
	fr: true,
	fy: true,
	ff: true,
	gd: true,
	gl: true,
	lg: true,
	ka: true,
	de: true,
	el: true,
	kl: true,
	gn: true,
	gu: true,
	ht: true,
	ha: true,
	he: true,
	hz: true,
	hi: true,
	ho: true,
	hu: true,
	is: true,
	io: true,
	ig: true,
	id: true,
	ia: true,
	ie: true,
	iu: true,
	ik: true,
	ga: true,
	it: true,
	ja: true,
	jv: true,
	kn: true,
	kr: true,
	ks: true,
	kk: true,
	km: true,
	ki: true,
	rw: true,
	ky: true,
	kv: true,
	kg: true,
	ko: true,
	kj: true,
	ku: true,
	lo: true,
	la: true,
	lv: true,
	li: true,
	ln: true,
	lt: true,
	lu: true,
	lb: true,
	mk: true,
	mg: true,
	ms: true,
	ml: true,
	mt: true,
	gv: true,
	mi: true,
	mr: true,
	mh: true,
	mn: true,
	na: true,
	nv: true,
	nd: true,
	nr: true,
	ng: true,
	ne: true,
	no: true,
	nb: true,
	nn: true,
	ii: true,
	oc: true,
	oj: true,
	or: true,
	om: true,
	os: true,
	pi: true,
	ps: true,
	fa: true,
	pl: true,
	pt: true,
	pa: true,
	qu: true,
	ro: true,
	rm: true,
	rn: true,
	ru: true,
	se: true,
	sm: true,
	sg: true,
	sa: true,
	sc: true,
	sr: true,
	sn: true,
	sd: true,
	si: true,
	sk: true,
	sl: true,
	so: true,
	st: true,
	es: true,
	su: true,
	sw: true,
	ss: true,
	sv: true,
	tl: true,
	ty: true,
	tg: true,
	ta: true,
	tt: true,
	te: true,
	th: true,
	bo: true,
	ti: true,
	to: true,
	ts: true,
	tn: true,
	tr: true,
	tk: true,
	tw: true,
	ug: true,
	uk: true,
	ur: true,
	uz: true,
	ve: true,
	vi: true,
	vo: true,
	wa: true,
	cy: true,
	wo: true,
	xh: true,
	yi: true,
	yo: true,
	za: true,
	zu: true
}));
const syncTails = /* @__PURE__ */ new Map();
const syncedCommandHashes = /* @__PURE__ */ new Map();
const knownLanguageCodes = /* @__PURE__ */ new Map();
function resolveTelegramMenuRemoteOwner(params) {
	const token = params.botToken?.trim();
	const tokenBotId = resolveTelegramBotUserIdFromToken(token);
	const botId = params.botId ?? tokenBotId;
	const tokenFingerprint = token ? fingerprintTelegramBotToken(token) : void 0;
	const fallbackKey = `${params.accountId ?? "default"}:${tokenFingerprint ?? "unknown"}`;
	const queueKey = botId === void 0 ? `fallback:${fallbackKey}` : `bot:${botId}`;
	return {
		queueKey,
		hashKey: `${queueKey}:${tokenFingerprint ?? ""}`,
		...botId === void 0 ? {} : { botId: String(botId) }
	};
}
function enqueueTelegramMenuSync(params) {
	const next = (syncTails.get(params.ownerKey) ?? Promise.resolve()).then(params.sync).catch((error) => {
		try {
			params.onError(error);
		} catch {}
	});
	syncTails.set(params.ownerKey, next);
	next.then(() => {
		if (syncTails.get(params.ownerKey) === next) syncTails.delete(params.ownerKey);
	});
}
function readTelegramMenuCommandHash(key) {
	return syncedCommandHashes.get(key) ?? null;
}
function writeTelegramMenuCommandHash(key, hash) {
	syncedCommandHashes.set(key, hash);
}
function getProcessKnownTelegramMenuLocales(ownerKey) {
	let locales = knownLanguageCodes.get(ownerKey);
	if (!locales) {
		locales = /* @__PURE__ */ new Set();
		knownLanguageCodes.set(ownerKey, locales);
	}
	return locales;
}
function isTelegramMenuLanguageCode(languageCode) {
	return TELEGRAM_MENU_LANGUAGE_CODES.has(languageCode);
}
function normalizeTelegramMenuLanguageCode(languageCode) {
	const normalized = languageCode.trim().toLowerCase();
	return isTelegramMenuLanguageCode(normalized) ? normalized : null;
}
function formatTelegramMenuLedgerUnsupportedCode(languageCode) {
	const readable = languageCode.trim().replace(/\s+/g, " ") || "(empty)";
	if (readable.length <= TELEGRAM_MENU_LEDGER_DIAGNOSTIC_CODE_MAX_LENGTH) return readable;
	return `${readable.slice(0, 29)}...`;
}
function normalizeTelegramMenuLocaleLedger(stored) {
	const candidate = isRecord(stored) ? stored : void 0;
	const rawLanguageCodes = Array.isArray(candidate?.languageCodes) ? candidate.languageCodes : [];
	const languageCodes = /* @__PURE__ */ new Set();
	const unsupportedLanguageCodes = /* @__PURE__ */ new Set();
	let malformedEntryCount = 0;
	for (const rawLanguageCode of rawLanguageCodes) {
		if (typeof rawLanguageCode !== "string") {
			malformedEntryCount += 1;
			continue;
		}
		const languageCode = normalizeTelegramMenuLanguageCode(rawLanguageCode);
		if (languageCode) languageCodes.add(languageCode);
		else unsupportedLanguageCodes.add(formatTelegramMenuLedgerUnsupportedCode(rawLanguageCode));
	}
	if (!candidate || candidate.version !== TELEGRAM_MENU_LOCALE_LEDGER_VERSION) malformedEntryCount += 1;
	if (!Array.isArray(candidate?.languageCodes)) malformedEntryCount += 1;
	if (candidate && Object.keys(candidate).toSorted().join(",") !== "languageCodes,version") malformedEntryCount += 1;
	const canonicalLanguageCodes = [...languageCodes].toSorted();
	const isCanonical = canonicalLanguageCodes.length > 0 && malformedEntryCount === 0 && unsupportedLanguageCodes.size === 0 && rawLanguageCodes.length === canonicalLanguageCodes.length && rawLanguageCodes.every((languageCode, index) => languageCode === canonicalLanguageCodes[index]);
	return {
		...canonicalLanguageCodes.length > 0 ? { value: {
			version: TELEGRAM_MENU_LOCALE_LEDGER_VERSION,
			languageCodes: canonicalLanguageCodes
		} } : {},
		isCanonical,
		unsupportedLanguageCodes: [...unsupportedLanguageCodes].toSorted(),
		malformedEntryCount
	};
}
function formatTelegramMenuLocaleLedgerRepairDiagnostic(params) {
	const action = params.normalization.value ? "repaired" : "reset";
	const details = [];
	const unsupportedCodes = params.normalization.unsupportedLanguageCodes;
	if (unsupportedCodes.length > 0) {
		const visibleCodes = unsupportedCodes.slice(0, TELEGRAM_MENU_LEDGER_DIAGNOSTIC_MAX_CODES);
		const hiddenCount = unsupportedCodes.length - visibleCodes.length;
		details.push(`discarded unsupported language codes: ${visibleCodes.join(", ")}${hiddenCount > 0 ? ` (+${hiddenCount} more)` : ""}`);
	}
	if (params.normalization.malformedEntryCount > 0) details.push(`discarded ${params.normalization.malformedEntryCount} malformed ledger field(s) or entry(ies)`);
	const detail = details.length > 0 ? ` (${details.join("; ")})` : "";
	return `Telegram command menu locale ledger for bot ${params.botId} was ${action}; the unshipped ledger contained non-canonical data${detail}.`;
}
async function readTelegramMenuLocaleLedger(params) {
	const telegramRuntime = getOptionalTelegramRuntime();
	if (!telegramRuntime) {
		params.runtime.error?.(`Telegram command menu locale ledger unavailable for bot ${params.botId}: runtime not initialized`);
		return null;
	}
	try {
		const store = telegramRuntime.state.openKeyedStore({
			namespace: TELEGRAM_MENU_LOCALE_LEDGER_NAMESPACE,
			maxEntries: TELEGRAM_MENU_LOCALE_LEDGER_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		});
		const stored = await store.lookup(params.botId);
		if (stored === void 0) return { store };
		const storedVersion = (isRecord(stored) ? stored : void 0)?.version;
		if (typeof storedVersion === "number" && Number.isInteger(storedVersion) && storedVersion > TELEGRAM_MENU_LOCALE_LEDGER_VERSION) {
			params.runtime.error?.(`Telegram command menu locale ledger for bot ${params.botId} uses unsupported future version ${storedVersion}; preserving it unchanged.`);
			return null;
		}
		const normalization = normalizeTelegramMenuLocaleLedger(stored);
		if (normalization.isCanonical) return {
			store,
			value: normalization.value
		};
		try {
			if (normalization.value) await store.register(params.botId, normalization.value);
			else await store.delete(params.botId);
		} catch (error) {
			params.runtime.error?.(`Telegram command menu locale ledger repair failed for bot ${params.botId}: ${String(error)}`);
			return null;
		}
		params.runtime.error?.(formatTelegramMenuLocaleLedgerRepairDiagnostic({
			botId: params.botId,
			normalization
		}));
		return {
			store,
			...normalization.value ? { value: normalization.value } : {}
		};
	} catch (error) {
		params.runtime.error?.(`Telegram command menu locale ledger unavailable for bot ${params.botId}: ${String(error)}`);
		return null;
	}
}
async function persistTelegramMenuLocaleLedger(params) {
	const current = params.read.value?.languageCodes ?? [];
	if (current.length === params.languageCodes.length && current.every((languageCode, index) => languageCode === params.languageCodes[index])) return;
	if (params.languageCodes.length === 0) {
		await params.read.store.delete(params.botId);
		return;
	}
	await params.read.store.register(params.botId, {
		version: TELEGRAM_MENU_LOCALE_LEDGER_VERSION,
		languageCodes: params.languageCodes
	});
}
//#endregion
//#region extensions/telegram/src/bot-native-command-menu.ts
const TELEGRAM_MAX_COMMANDS = 100;
const TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET = 5700;
const TELEGRAM_COMMAND_RETRY_RATIO = .8;
const TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH = 1;
const TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH = 256;
const TELEGRAM_MENU_RESULT_CACHE_MAX = 128;
const TELEGRAM_COMMAND_MENU_SCOPES = [{ label: "default" }, {
	label: "all_group_chats",
	options: { scope: { type: "all_group_chats" } }
}];
const cappedTelegramMenuCache = /* @__PURE__ */ new Map();
function countTelegramCommandText(value) {
	let count = 0;
	for (let index = 0; index < value.length;) {
		const codePoint = value.codePointAt(index);
		index += codePoint && codePoint > 65535 ? 2 : 1;
		count += 1;
	}
	return count;
}
function truncateTelegramCommandText(value, maxLength) {
	if (maxLength <= 0) return "";
	const suffix = maxLength > 1 ? "…" : "";
	const prefixLimit = maxLength - countTelegramCommandText(suffix);
	let count = 0;
	let prefixEnd = 0;
	for (const char of value) {
		count += 1;
		if (count <= prefixLimit) prefixEnd += char.length;
		if (count > maxLength) return `${value.slice(0, prefixEnd)}${suffix}`;
	}
	return value;
}
function fitTelegramCommandsWithinTextBudget(commands, maxTotalChars) {
	let candidateCommands = [...commands];
	while (candidateCommands.length > 0) {
		const descriptionBudget = maxTotalChars - candidateCommands.reduce((total, command) => total + countTelegramCommandText(command.command), 0);
		if (descriptionBudget < candidateCommands.length * TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH) {
			candidateCommands = candidateCommands.slice(0, -1);
			continue;
		}
		const descriptionCap = Math.max(TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH, Math.floor(descriptionBudget / candidateCommands.length));
		let descriptionTrimmed = false;
		const fittedCommands = candidateCommands.map((command) => {
			const description = truncateTelegramCommandText(command.description, Math.min(descriptionCap, TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH));
			if (description !== command.description) {
				descriptionTrimmed = true;
				return Object.assign({}, command, { description });
			}
			return command;
		});
		return {
			commands: fittedCommands,
			descriptionTrimmed,
			textBudgetDropCount: commands.length - fittedCommands.length
		};
	}
	return {
		commands: [],
		descriptionTrimmed: false,
		textBudgetDropCount: commands.length
	};
}
function readErrorTextField(value, key) {
	if (!value || typeof value !== "object" || !(key in value)) return;
	return readStringValue(value[key]);
}
function isBotCommandsTooMuchError(err) {
	if (!err) return false;
	const pattern = /\bBOT_COMMANDS_TOO_MUCH\b/i;
	if (typeof err === "string") return pattern.test(err);
	if (err instanceof Error) {
		if (pattern.test(err.message)) return true;
	}
	const description = readErrorTextField(err, "description");
	if (description && pattern.test(description)) return true;
	const message = readErrorTextField(err, "message");
	if (message && pattern.test(message)) return true;
	return false;
}
function formatTelegramCommandRetrySuccessLog(params) {
	const omittedCount = Math.max(0, params.initialCount - params.acceptedCount);
	return `Telegram accepted ${params.acceptedCount} commands after BOT_COMMANDS_TOO_MUCH (started with ${params.initialCount}; omitted ${omittedCount}). Reduce plugin/skill/custom commands to expose more menu entries.`;
}
function buildPluginTelegramMenuCommands(params) {
	const { specs, existingCommands } = params;
	const commands = [];
	const selectedCommands = [];
	const issues = [];
	const pluginCommandNames = /* @__PURE__ */ new Set();
	const sortedSpecs = specs.map((spec) => {
		const rawName = typeof spec.name === "string" ? spec.name : "";
		return {
			spec,
			rawName,
			normalized: normalizeTelegramCommandName(rawName)
		};
	}).toSorted((a, b) => {
		if (a.normalized !== b.normalized) return a.normalized < b.normalized ? -1 : 1;
		const aExact = a.rawName.trim().toLowerCase() === a.normalized;
		if (aExact !== (b.rawName.trim().toLowerCase() === b.normalized)) return aExact ? -1 : 1;
		return a.rawName < b.rawName ? -1 : a.rawName > b.rawName ? 1 : 0;
	});
	for (const { spec, rawName, normalized } of sortedSpecs) {
		if (!normalized || !TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
			const invalidName = rawName.trim() ? rawName : "<unknown>";
			issues.push(`Plugin command "/${invalidName}" is invalid for Telegram (use a-z, 0-9, underscore; max 32 chars).`);
			continue;
		}
		const description = normalizeOptionalString(spec.description) ?? "";
		if (!description) {
			issues.push(`Plugin command "/${normalized}" is missing a description.`);
			continue;
		}
		if (existingCommands.has(normalized)) {
			if (pluginCommandNames.has(normalized)) issues.push(`Plugin command "/${normalized}" is duplicated.`);
			else issues.push(`Plugin command "/${normalized}" conflicts with an existing Telegram command.`);
			continue;
		}
		pluginCommandNames.add(normalized);
		existingCommands.add(normalized);
		const menuCommand = {
			command: normalized,
			description,
			spec
		};
		if (spec.descriptionLocalizations) menuCommand.descriptionLocalizations = spec.descriptionLocalizations;
		const { spec: _spec, ...displayCommand } = menuCommand;
		commands.push(displayCommand);
		selectedCommands.push(menuCommand);
	}
	return {
		commands,
		selectedCommands,
		issues
	};
}
function buildCappedTelegramMenuCommands(params) {
	const maxCommands = params.maxCommands ?? TELEGRAM_MAX_COMMANDS;
	const maxTotalChars = params.maxTotalChars ?? TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET;
	const cacheKey = buildTelegramMenuResultCacheKey({
		allCommands: params.allCommands,
		maxCommands,
		maxTotalChars
	});
	const cached = cappedTelegramMenuCache.get(cacheKey);
	if (cached) return cached;
	const result = buildUncachedCappedTelegramMenuCommands({
		allCommands: params.allCommands,
		maxCommands,
		maxTotalChars
	});
	rememberCappedTelegramMenuResult(cacheKey, result);
	return result;
}
function buildDirectSkillFallbackCommands(commands) {
	const fallback = commands.find((command) => command.command === "skill" && !command.isSkill);
	const remaining = commands.filter((command) => !command.isSkill && command !== fallback);
	return fallback ? [fallback, ...remaining] : remaining;
}
function buildUncachedCappedTelegramMenuCommands(params) {
	const { allCommands, maxCommands, maxTotalChars } = params;
	const fitCommands = (commands) => {
		const cappedCommands = commands.slice(0, maxCommands);
		return cappedCommands.some((command) => countTelegramCommandText(command.description) > TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH) || cappedCommands.reduce((total, { command, description }) => total + countTelegramCommandText(command) + countTelegramCommandText(description), 0) > maxTotalChars ? fitTelegramCommandsWithinTextBudget(cappedCommands, maxTotalChars) : {
			commands: cappedCommands,
			descriptionTrimmed: false,
			textBudgetDropCount: 0
		};
	};
	let effectiveCommands = allCommands;
	let fitted = fitCommands(allCommands);
	const skillCommandCount = allCommands.filter((command) => command.isSkill).length;
	const skillCommandsOmitted = skillCommandCount > 0 && fitted.commands.filter((command) => command.isSkill).length < skillCommandCount;
	if (skillCommandsOmitted) {
		effectiveCommands = buildDirectSkillFallbackCommands(allCommands);
		fitted = fitCommands(effectiveCommands);
	}
	const totalCommands = effectiveCommands.length;
	const overflowCount = Math.max(0, totalCommands - maxCommands);
	return {
		commandsToRegister: fitted.commands,
		totalCommands,
		maxCommands,
		overflowCount,
		maxTotalChars,
		descriptionTrimmed: fitted.descriptionTrimmed,
		textBudgetDropCount: fitted.textBudgetDropCount,
		skillCommandsOmitted
	};
}
function buildTelegramMenuResultCacheKey(params) {
	const digest = createHash("sha256");
	updateTelegramCommandDigestField(digest, String(params.maxCommands));
	updateTelegramCommandDigestField(digest, String(params.maxTotalChars));
	for (const command of params.allCommands) {
		updateTelegramCommandDigestField(digest, command.command);
		updateTelegramCommandDigestField(digest, command.description);
		updateTelegramCommandDigestField(digest, command.isAlias ? "1" : "0");
		updateTelegramCommandDigestField(digest, command.isSkill ? "1" : "0");
		updateTelegramCommandLocalizationDigest(digest, command.descriptionLocalizations);
	}
	return digest.digest("hex").slice(0, 16);
}
function updateTelegramCommandDigestField(digest, value) {
	digest.update(String(value.length));
	digest.update(":");
	digest.update(value);
}
function updateTelegramCommandLocalizationDigest(digest, localizations) {
	const entries = buildEffectiveTelegramCommandLocalizations(localizations);
	updateTelegramCommandDigestField(digest, String(entries.length));
	for (const [locale, description] of entries) {
		updateTelegramCommandDigestField(digest, locale);
		updateTelegramCommandDigestField(digest, description);
	}
}
function rememberCappedTelegramMenuResult(key, result) {
	cappedTelegramMenuCache.set(key, result);
	if (cappedTelegramMenuCache.size <= TELEGRAM_MENU_RESULT_CACHE_MAX) return;
	const oldestKey = cappedTelegramMenuCache.keys().next().value;
	if (oldestKey) cappedTelegramMenuCache.delete(oldestKey);
}
function hashCommandList(commands) {
	const digest = createHash("sha256");
	updateTelegramCommandDigestField(digest, String(commands.length));
	for (const command of commands) {
		updateTelegramCommandDigestField(digest, command.command);
		updateTelegramCommandDigestField(digest, command.description);
		updateTelegramCommandLocalizationDigest(digest, command.descriptionLocalizations);
	}
	return digest.digest("hex").slice(0, 16);
}
function reduceTelegramMenuCommands(commands, maxCommands) {
	const reduced = commands.slice(0, maxCommands);
	const skillCommandCount = commands.filter((command) => command.isSkill).length;
	return reduced.filter((command) => command.isSkill).length < skillCommandCount ? buildDirectSkillFallbackCommands(commands).slice(0, maxCommands) : reduced;
}
function buildEffectiveTelegramCommandLocalizations(localizations) {
	const effective = /* @__PURE__ */ new Map();
	for (const [rawLanguageCode, rawDescription] of Object.entries(localizations ?? {})) {
		const languageCode = normalizeTelegramMenuLanguageCode(rawLanguageCode);
		const description = normalizeOptionalString(rawDescription);
		if (languageCode && description && !effective.has(languageCode)) effective.set(languageCode, description);
	}
	return [...effective.entries()].toSorted(([a], [b]) => a.localeCompare(b));
}
function readLocalizedDescription(localizations, languageCode) {
	return localizations.find(([effectiveLanguageCode]) => effectiveLanguageCode === languageCode)?.[1];
}
function toTelegramBotCommands(commands) {
	return commands.map((command) => ({
		command: command.command,
		description: command.description
	}));
}
function buildLocalizedCommandVariants(commands) {
	const locales = /* @__PURE__ */ new Set();
	const unsupportedLanguageCodes = /* @__PURE__ */ new Set();
	const commandsWithLocalizations = commands.map((command) => ({
		command,
		localizations: buildEffectiveTelegramCommandLocalizations(command.descriptionLocalizations)
	}));
	for (const { command, localizations } of commandsWithLocalizations) {
		for (const [languageCode] of localizations) locales.add(languageCode);
		for (const [rawLanguageCode, rawDescription] of Object.entries(command.descriptionLocalizations ?? {})) if (!normalizeTelegramMenuLanguageCode(rawLanguageCode) && normalizeOptionalString(rawDescription)) unsupportedLanguageCodes.add(rawLanguageCode);
	}
	return {
		variants: [...locales].toSorted().map((languageCode) => {
			return {
				languageCode,
				commands: buildCappedTelegramMenuCommands({ allCommands: commandsWithLocalizations.map(({ command, localizations }) => Object.assign({}, command, { description: readLocalizedDescription(localizations, languageCode) ?? command.description })) }).commandsToRegister
			};
		}),
		unsupportedLanguageCodes: [...unsupportedLanguageCodes].toSorted()
	};
}
function formatTelegramCommandScopeOperation(operation, scope, languageCode) {
	const base = scope.label === "default" ? operation : `${operation}(${scope.label})`;
	return languageCode ? `${base}(${languageCode})` : base;
}
function buildTelegramCommandScopeOptions(scope, languageCode) {
	return scope.options || languageCode ? {
		...scope.options,
		...languageCode ? { language_code: languageCode } : {}
	} : void 0;
}
async function clearTelegramMenuCommandsForScopes(params) {
	const { bot, runtime, languageCode } = params;
	let allCleared = true;
	for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) {
		const options = buildTelegramCommandScopeOptions(scope, languageCode);
		const operation = typeof bot.api.deleteMyCommands === "function" ? "deleteMyCommands" : "setMyCommands";
		const cleared = await withTelegramApiErrorLogging({
			operation: formatTelegramCommandScopeOperation(operation, scope, languageCode),
			runtime,
			fn: () => {
				if (typeof bot.api.deleteMyCommands === "function") return options ? bot.api.deleteMyCommands(options) : bot.api.deleteMyCommands();
				return options ? bot.api.setMyCommands([], options) : bot.api.setMyCommands([]);
			}
		}).then(() => true).catch(() => false);
		allCleared &&= cleared;
	}
	return allCleared;
}
async function setTelegramMenuCommandsForScopes(params) {
	const { bot, runtime, commands, languageCode, shouldLog } = params;
	const botCommands = toTelegramBotCommands(commands);
	for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) await withTelegramApiErrorLogging({
		operation: formatTelegramCommandScopeOperation("setMyCommands", scope, languageCode),
		runtime,
		shouldLog,
		fn: () => {
			const opts = buildTelegramCommandScopeOptions(scope, languageCode);
			return opts ? bot.api.setMyCommands(botCommands, opts) : bot.api.setMyCommands(botCommands);
		}
	});
}
function syncTelegramMenuCommands(params) {
	const { bot, runtime, commandsToRegister } = params;
	const owner = resolveTelegramMenuRemoteOwner(params);
	const sync = async () => {
		const currentHash = hashCommandList(commandsToRegister);
		if (readTelegramMenuCommandHash(owner.hashKey) === currentHash) {
			logVerbose("telegram: command menu unchanged; skipping sync");
			return;
		}
		const processLocales = getProcessKnownTelegramMenuLocales(owner.queueKey);
		const ledgerRead = owner.botId ? await readTelegramMenuLocaleLedger({
			botId: owner.botId,
			runtime
		}) : null;
		if (owner.botId && !ledgerRead) return;
		const trackedLocales = /* @__PURE__ */ new Set([...processLocales, ...ledgerRead?.value?.languageCodes ?? []]);
		const neutralCleared = await clearTelegramMenuCommandsForScopes({
			bot,
			runtime
		});
		const unclearedLocales = /* @__PURE__ */ new Set();
		for (const languageCode of [...trackedLocales].toSorted()) if (!await clearTelegramMenuCommandsForScopes({
			bot,
			runtime,
			languageCode
		})) unclearedLocales.add(languageCode);
		processLocales.clear();
		for (const languageCode of unclearedLocales) processLocales.add(languageCode);
		const persistLocales = async (desiredLocales) => {
			const knownLocales = [.../* @__PURE__ */ new Set([...unclearedLocales, ...desiredLocales])].toSorted();
			processLocales.clear();
			for (const languageCode of knownLocales) processLocales.add(languageCode);
			if (!owner.botId) return true;
			if (!ledgerRead) return false;
			try {
				await persistTelegramMenuLocaleLedger({
					botId: owner.botId,
					read: ledgerRead,
					languageCodes: knownLocales
				});
				return true;
			} catch (error) {
				runtime.error?.(`Telegram command menu locale ledger write failed for bot ${owner.botId}: ${String(error)}`);
				return false;
			}
		};
		if (commandsToRegister.length === 0) {
			const ledgerComplete = await persistLocales([]);
			if (neutralCleared && unclearedLocales.size === 0 && ledgerComplete) writeTelegramMenuCommandHash(owner.hashKey, currentHash);
			else runtime.log?.("telegram: command menu cleanup incomplete; skipping success hash cache write");
			return;
		}
		let retryCommands = commandsToRegister;
		let acceptedCommands = null;
		const initialCommandCount = commandsToRegister.length;
		while (retryCommands.length > 0) try {
			await setTelegramMenuCommandsForScopes({
				bot,
				runtime,
				commands: retryCommands,
				shouldLog: (err) => !isBotCommandsTooMuchError(err)
			});
			if (retryCommands.length < initialCommandCount) runtime.log?.(formatTelegramCommandRetrySuccessLog({
				initialCount: initialCommandCount,
				acceptedCount: retryCommands.length
			}));
			acceptedCommands = retryCommands;
			break;
		} catch (err) {
			if (!isBotCommandsTooMuchError(err)) throw err;
			const nextCount = Math.floor(retryCommands.length * TELEGRAM_COMMAND_RETRY_RATIO);
			const reducedCount = nextCount < retryCommands.length ? nextCount : retryCommands.length - 1;
			const nextCommands = reduceTelegramMenuCommands(commandsToRegister, reducedCount);
			if (reducedCount <= 0 || nextCommands.length === 0) {
				runtime.error?.("Telegram rejected native command registration (BOT_COMMANDS_TOO_MUCH); leaving menu empty. Reduce commands or disable channels.telegram.commands.native.");
				return;
			}
			runtime.log?.(`Telegram rejected ${retryCommands.length} commands (BOT_COMMANDS_TOO_MUCH); retrying with ${nextCommands.length}.`);
			retryCommands = nextCommands;
		}
		if (!acceptedCommands) return;
		const { variants, unsupportedLanguageCodes } = buildLocalizedCommandVariants(acceptedCommands);
		if (unsupportedLanguageCodes.length > 0) runtime.log?.(`Telegram command menu ignored unsupported description localization codes: ${unsupportedLanguageCodes.join(", ")}.`);
		if (!await persistLocales(variants.map((variant) => variant.languageCode))) {
			runtime.log?.("telegram: localized command menu skipped because locale intent was not durably recorded");
			return;
		}
		for (const variant of variants) await setTelegramMenuCommandsForScopes({
			bot,
			runtime,
			commands: variant.commands,
			languageCode: variant.languageCode
		});
		if (neutralCleared && unclearedLocales.size === 0) writeTelegramMenuCommandHash(owner.hashKey, currentHash);
		else runtime.log?.("telegram: command menu cleanup incomplete; skipping success hash cache write");
	};
	enqueueTelegramMenuSync({
		ownerKey: owner.queueKey,
		sync,
		onError: (error) => {
			runtime.error?.(`Telegram command sync failed: ${String(error)}`);
		}
	});
}
//#endregion
export { buildPluginTelegramMenuCommands as n, syncTelegramMenuCommands as r, buildCappedTelegramMenuCommands as t };
