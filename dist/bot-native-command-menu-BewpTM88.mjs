import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { c as isRecord, i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { n as fingerprintTelegramBotToken, r as resolveTelegramBotUserIdFromToken } from "./token-fingerprint-JUmcbHLp.mjs";
import { t as getOptionalTelegramRuntime } from "./runtime-DafGL1dY.mjs";
import { r as normalizeTelegramCommandName, t as TELEGRAM_COMMAND_NAME_PATTERN } from "./command-config-DxRRTtvn.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-menu-state.ts
const TELEGRAM_MENU_LOCALE_LEDGER_VERSION = 1;
const TELEGRAM_MENU_LOCALE_LEDGER_NAMESPACE = "telegram.command-menu-locales";
const TELEGRAM_MENU_LOCALE_LEDGER_MAX_ENTRIES = 1e3;
const TELEGRAM_MENU_LANGUAGE_CODE_RECORD = {
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
};
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
function getProcessKnownTelegramMenuLocales(ownerKey) {
	let locales = knownLanguageCodes.get(ownerKey);
	if (!locales) {
		locales = /* @__PURE__ */ new Set();
		knownLanguageCodes.set(ownerKey, locales);
	}
	return locales;
}
function isTelegramMenuLanguageCode(languageCode) {
	return Object.hasOwn(TELEGRAM_MENU_LANGUAGE_CODE_RECORD, languageCode);
}
function normalizeTelegramMenuLanguageCode(languageCode) {
	const normalized = languageCode.trim().toLowerCase();
	return isTelegramMenuLanguageCode(normalized) ? normalized : null;
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
		const storedRecord = isRecord(stored) ? stored : void 0;
		const storedVersion = storedRecord?.version;
		if (typeof storedVersion === "number" && Number.isInteger(storedVersion) && storedVersion > TELEGRAM_MENU_LOCALE_LEDGER_VERSION) {
			params.runtime.error?.(`Telegram command menu locale ledger for bot ${params.botId} uses unsupported future version ${storedVersion}; preserving it unchanged.`);
			return null;
		}
		const rawCodes = Array.isArray(storedRecord?.languageCodes) ? storedRecord.languageCodes : [];
		const languageCodes = [...new Set(rawCodes.flatMap((rawCode) => {
			const code = typeof rawCode === "string" ? normalizeTelegramMenuLanguageCode(rawCode) : null;
			return code ? [code] : [];
		}))].toSorted();
		return {
			store,
			value: {
				version: TELEGRAM_MENU_LOCALE_LEDGER_VERSION,
				languageCodes
			}
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
const TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH = 256;
const TELEGRAM_MENU_RESULT_CACHE_MAX = 128;
const TELEGRAM_COMMAND_MENU_SCOPES = [void 0, "all_group_chats"];
const syncedCommandHashes = /* @__PURE__ */ new Map();
const cappedTelegramMenuCache = /* @__PURE__ */ new Map();
function countTelegramCommandText(value) {
	return Array.from(value).length;
}
function truncateTelegramCommandText(value, maxLength) {
	const prefix = truncateCodePoints(value, maxLength);
	if (prefix === value) return prefix;
	return maxLength > 1 ? `${truncateCodePoints(prefix, maxLength - 1)}…` : prefix;
}
function fitTelegramCommandsWithinTextBudget(commands) {
	let commandCount = 0;
	let commandNameChars = 0;
	for (const { command } of commands) {
		const nameChars = countTelegramCommandText(command);
		if (commandNameChars + nameChars + commandCount + 1 > TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET) break;
		commandNameChars += nameChars;
		commandCount += 1;
	}
	const descriptionCap = Math.min(TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH, Math.floor((TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET - commandNameChars) / commandCount));
	let descriptionTrimmed = false;
	const fittedCommands = commands.slice(0, commandCount).map((command) => {
		const description = truncateTelegramCommandText(command.description, descriptionCap);
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
function isBotCommandsTooMuchError(err) {
	const pattern = /\bBOT_COMMANDS_TOO_MUCH\b/i;
	if (typeof err === "string") return pattern.test(err);
	const record = asOptionalObjectRecord(err);
	return ["description", "message"].some((key) => {
		const text = record && key in record ? readStringField(record, key) : void 0;
		return text !== void 0 && pattern.test(text);
	});
}
function buildPluginTelegramMenuCommands(params) {
	const { specs, existingCommands } = params;
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
		selectedCommands.push(menuCommand);
	}
	return {
		commands: selectedCommands.map(({ spec: _spec, ...command }) => command),
		selectedCommands,
		issues
	};
}
function buildCappedTelegramMenuCommands(allCommands) {
	const cacheKey = hashCommandList(allCommands, true);
	const cached = cappedTelegramMenuCache.get(cacheKey);
	if (cached) return cached;
	const result = buildUncachedCappedTelegramMenuCommands(allCommands);
	cappedTelegramMenuCache.set(cacheKey, result);
	pruneMapToMaxSize(cappedTelegramMenuCache, TELEGRAM_MENU_RESULT_CACHE_MAX);
	return result;
}
function buildDirectSkillFallbackCommands(commands) {
	const fallback = commands.find((command) => command.command === "skill" && !command.isSkill);
	const remaining = commands.filter((command) => !command.isSkill && command !== fallback);
	return fallback ? [fallback, ...remaining] : remaining;
}
function buildUncachedCappedTelegramMenuCommands(allCommands) {
	const maxCommands = TELEGRAM_MAX_COMMANDS;
	const maxTotalChars = TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET;
	const fitCommands = (commands) => {
		const cappedCommands = commands.slice(0, maxCommands);
		return cappedCommands.some((command) => countTelegramCommandText(command.description) > TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH) || cappedCommands.reduce((total, { command, description }) => total + countTelegramCommandText(command) + countTelegramCommandText(description), 0) > maxTotalChars ? fitTelegramCommandsWithinTextBudget(cappedCommands) : {
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
	return {
		commandsToRegister: fitted.commands,
		totalCommands,
		maxCommands,
		overflowCount: Math.max(0, totalCommands - maxCommands),
		maxTotalChars,
		descriptionTrimmed: fitted.descriptionTrimmed,
		textBudgetDropCount: fitted.textBudgetDropCount,
		skillCommandsOmitted
	};
}
function hashCommandList(commands, capped = false) {
	const digest = createHash("sha256");
	const addField = (value) => {
		digest.update(String(value.length));
		digest.update(":");
		digest.update(value);
	};
	const header = capped ? [TELEGRAM_MAX_COMMANDS, TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET] : [commands.length];
	for (const value of header) addField(String(value));
	for (const command of commands) {
		addField(command.command);
		addField(command.description);
		if (capped) {
			addField(command.isAlias ? "1" : "0");
			addField(command.isSkill ? "1" : "0");
		}
		const localizations = buildEffectiveTelegramCommandLocalizations(command.descriptionLocalizations);
		addField(String(localizations.length));
		for (const [locale, description] of localizations) {
			addField(locale);
			addField(description);
		}
	}
	return digest.digest("hex").slice(0, 16);
}
function reduceTelegramMenuCommands(commands, maxCommands) {
	const reduced = commands.slice(0, maxCommands);
	const skillCommandCount = commands.filter((command) => command.isSkill).length;
	return reduced.filter((command) => command.isSkill).length < skillCommandCount ? buildDirectSkillFallbackCommands(commands).slice(0, maxCommands) : reduced;
}
function buildEffectiveTelegramCommandLocalizations(localizations, unsupportedLanguageCodes) {
	const effective = /* @__PURE__ */ new Map();
	for (const [rawLanguageCode, rawDescription] of Object.entries(localizations ?? {})) {
		const languageCode = normalizeTelegramMenuLanguageCode(rawLanguageCode);
		const description = normalizeOptionalString(rawDescription);
		if (!description) continue;
		if (!languageCode) unsupportedLanguageCodes?.add(rawLanguageCode);
		else if (!effective.has(languageCode)) effective.set(languageCode, description);
	}
	return [...effective.entries()].toSorted(([a], [b]) => a.localeCompare(b));
}
function buildLocalizedCommandVariants(commands) {
	const locales = /* @__PURE__ */ new Set();
	const unsupportedLanguageCodes = /* @__PURE__ */ new Set();
	const commandsWithLocalizations = commands.map((command) => {
		const localizations = new Map(buildEffectiveTelegramCommandLocalizations(command.descriptionLocalizations, unsupportedLanguageCodes));
		for (const languageCode of localizations.keys()) locales.add(languageCode);
		return {
			command,
			localizations
		};
	});
	return {
		variants: [...locales].toSorted().map((languageCode) => {
			return {
				languageCode,
				commands: buildCappedTelegramMenuCommands(commandsWithLocalizations.map(({ command, localizations }) => Object.assign({}, command, { description: localizations.get(languageCode) ?? command.description }))).commandsToRegister
			};
		}),
		unsupportedLanguageCodes: [...unsupportedLanguageCodes].toSorted()
	};
}
async function applyTelegramMenuCommandsForScopes(params) {
	const { bot, runtime, languageCode, shouldLog } = params;
	const commands = params.commands?.map(({ command, description }) => ({
		command,
		description
	}));
	const operation = commands ? "setMyCommands" : "deleteMyCommands";
	let allCleared = true;
	for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) {
		const options = scope || languageCode ? {
			...scope ? { scope: { type: scope } } : {},
			...languageCode ? { language_code: languageCode } : {}
		} : void 0;
		const scopedOperation = scope ? `${operation}(${scope})` : operation;
		const task = withTelegramApiErrorLogging({
			operation: languageCode ? `${scopedOperation}(${languageCode})` : scopedOperation,
			runtime,
			shouldLog,
			fn: () => {
				if (commands) return options ? bot.api.setMyCommands(commands, options) : bot.api.setMyCommands(commands);
				return options ? bot.api.deleteMyCommands(options) : bot.api.deleteMyCommands();
			}
		});
		if (commands) await task;
		else {
			const cleared = await task.then(() => true).catch(() => false);
			allCleared &&= cleared;
		}
	}
	return allCleared;
}
async function syncTelegramMenuCommands(params) {
	const { bot, runtime, commandsToRegister } = params;
	const owner = resolveTelegramMenuRemoteOwner(params);
	try {
		const currentHash = hashCommandList(commandsToRegister);
		if (syncedCommandHashes.get(owner.hashKey) === currentHash) {
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
		const neutralCleared = await applyTelegramMenuCommandsForScopes({
			bot,
			runtime
		});
		const unclearedLocales = /* @__PURE__ */ new Set();
		for (const languageCode of [...trackedLocales].toSorted()) if (!await applyTelegramMenuCommandsForScopes({
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
			if (!owner.botId || !ledgerRead) return true;
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
		const recordSuccess = (ledgerComplete) => {
			if (neutralCleared && unclearedLocales.size === 0 && ledgerComplete) syncedCommandHashes.set(owner.hashKey, currentHash);
			else runtime.log?.("telegram: command menu cleanup incomplete; skipping success hash cache write");
		};
		if (commandsToRegister.length === 0) {
			recordSuccess(await persistLocales([]));
			return;
		}
		let retryCommands = commandsToRegister;
		const initialCommandCount = commandsToRegister.length;
		while (true) try {
			await applyTelegramMenuCommandsForScopes({
				bot,
				runtime,
				commands: retryCommands,
				shouldLog: (err) => !isBotCommandsTooMuchError(err)
			});
			if (retryCommands.length < initialCommandCount) runtime.log?.(`Telegram accepted ${retryCommands.length} commands after BOT_COMMANDS_TOO_MUCH (started with ${initialCommandCount}; omitted ${initialCommandCount - retryCommands.length}). Reduce plugin/skill/custom commands to expose more menu entries.`);
			break;
		} catch (err) {
			if (!isBotCommandsTooMuchError(err)) throw err;
			const reducedCount = Math.floor(retryCommands.length * TELEGRAM_COMMAND_RETRY_RATIO);
			const nextCommands = reduceTelegramMenuCommands(commandsToRegister, reducedCount);
			if (reducedCount <= 0 || nextCommands.length === 0) {
				runtime.error?.("Telegram rejected native command registration (BOT_COMMANDS_TOO_MUCH); leaving menu empty. Reduce commands or disable channels.telegram.commands.native.");
				return;
			}
			runtime.log?.(`Telegram rejected ${retryCommands.length} commands (BOT_COMMANDS_TOO_MUCH); retrying with ${nextCommands.length}.`);
			retryCommands = nextCommands;
		}
		const { variants, unsupportedLanguageCodes } = buildLocalizedCommandVariants(retryCommands);
		if (unsupportedLanguageCodes.length > 0) runtime.log?.(`Telegram command menu ignored unsupported description localization codes: ${unsupportedLanguageCodes.join(", ")}.`);
		const ledgerComplete = await persistLocales(variants.map((variant) => variant.languageCode));
		if (!ledgerComplete) {
			runtime.log?.("telegram: localized command menu skipped because locale intent was not durably recorded");
			return;
		}
		for (const variant of variants) await applyTelegramMenuCommandsForScopes({
			bot,
			runtime,
			commands: variant.commands,
			languageCode: variant.languageCode
		});
		recordSuccess(ledgerComplete);
	} catch (error) {
		runtime.error?.(`Telegram command sync failed: ${String(error)}`);
	}
}
//#endregion
export { buildPluginTelegramMenuCommands as n, syncTelegramMenuCommands as r, buildCappedTelegramMenuCommands as t };
