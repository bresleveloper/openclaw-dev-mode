import { i as resolveSignalAccount } from "./accounts-BV6tDOTc.mjs";
import { n as normalizeSignalMessagingTarget, t as looksLikeSignalTargetId } from "./normalize-l_b99hap.mjs";
import { l as looksLikeUuid } from "./identity-YXPmgFMu.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/signal/src/aliases.ts
function normalizeAliasKey(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const withoutSignal = /^signal:/i.test(trimmed) ? trimmed.slice(7).trim() : trimmed;
	return normalizeLowercaseStringOrEmpty(withoutSignal) || void 0;
}
function resolveAliasMap(params) {
	const account = resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const aliases = /* @__PURE__ */ new Map();
	for (const [rawKey, rawValue] of Object.entries(account.config.aliases ?? {})) {
		const key = normalizeAliasKey(rawKey);
		if (!key) continue;
		aliases.set(key, rawValue);
	}
	return aliases;
}
function resolveTargetKind(target) {
	return normalizeLowercaseStringOrEmpty(target).startsWith("group:") ? "group" : "user";
}
function resolveRawSignalTarget(input) {
	const normalized = normalizeSignalMessagingTarget(input);
	if (!normalized || !looksLikeSignalTargetId(input, normalized)) return null;
	return {
		to: normalized,
		kind: resolveTargetKind(normalized)
	};
}
function resolveSignalAliasTargetFromMap(params) {
	const initialAlias = normalizeAliasKey(params.input);
	if (!initialAlias || !params.aliases.has(initialAlias)) return null;
	const visited = /* @__PURE__ */ new Set();
	let alias = initialAlias;
	for (;;) {
		if (visited.has(alias)) throw new Error(`Signal alias "${initialAlias}" resolves recursively through "${alias}".`);
		visited.add(alias);
		const rawValue = params.aliases.get(alias);
		if (typeof rawValue !== "string" || !rawValue.trim()) throw new Error(`Signal alias "${alias}" must point to a non-empty Signal target.`);
		const rawTarget = resolveRawSignalTarget(rawValue);
		if (rawTarget) return {
			...rawTarget,
			alias: initialAlias
		};
		const nextAlias = normalizeAliasKey(rawValue);
		if (nextAlias && params.aliases.has(nextAlias)) {
			alias = nextAlias;
			continue;
		}
		throw new Error(`Signal alias "${initialAlias}" must point to an E.164 number, uuid:<id>, username:<name>, or group:<id>.`);
	}
}
function resolveSignalAliasTarget(params) {
	return resolveSignalAliasTargetFromMap({
		aliases: resolveAliasMap(params),
		input: params.input
	});
}
function resolveSignalTarget(params) {
	const rawTarget = resolveRawSignalTarget(params.input);
	if (rawTarget) return {
		...rawTarget,
		source: "raw"
	};
	const aliasTarget = resolveSignalAliasTarget(params);
	if (aliasTarget) return {
		...aliasTarget,
		source: "alias"
	};
	return null;
}
function resolveSignalDeliveredConversationKey(params) {
	try {
		return resolveSignalTarget({
			cfg: params.cfg,
			accountId: params.accountId,
			input: params.to
		})?.to ?? normalizeSignalMessagingTarget(params.to) ?? null;
	} catch {
		return normalizeSignalMessagingTarget(params.to) ?? null;
	}
}
function listSignalAliasDirectoryEntries(params) {
	const aliases = resolveAliasMap(params);
	const query = normalizeLowercaseStringOrEmpty(params.query);
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : void 0;
	const exactAlias = params.query ? normalizeAliasKey(params.query) : void 0;
	if (exactAlias && aliases.has(exactAlias)) {
		const target = resolveSignalAliasTargetFromMap({
			aliases,
			input: exactAlias
		});
		if (target?.kind === params.kind) return [{
			kind: params.kind,
			id: target.to,
			name: target.alias
		}];
		if (target) return [];
	}
	const entries = [];
	for (const alias of aliases.keys()) {
		let target;
		try {
			target = resolveSignalAliasTargetFromMap({
				aliases,
				input: alias
			});
		} catch {
			continue;
		}
		if (!target) continue;
		if (target.kind !== params.kind) continue;
		if (query && !alias.includes(query) && !normalizeLowercaseStringOrEmpty(target.to).includes(query)) continue;
		entries.push({
			kind: params.kind,
			id: target.to,
			name: alias
		});
		if (typeof limit === "number" && entries.length >= limit) break;
	}
	return entries;
}
//#endregion
//#region extensions/signal/src/approval-auth.ts
function normalizeSignalApproverId(value) {
	const normalized = normalizeSignalMessagingTarget(String(value));
	if (!normalized || normalized.startsWith("group:") || normalized.startsWith("username:")) return;
	if (looksLikeUuid(normalized)) return `uuid:${normalized}`;
	const e164 = normalizeE164(normalized);
	return e164.length > 1 ? e164 : void 0;
}
const signalApproval = createChannelApprovalAuth({
	channelLabel: "Signal",
	resolveInputs: ({ cfg, accountId }) => {
		const account = resolveSignalAccount({
			cfg,
			accountId
		}).config;
		let defaultTo = account.defaultTo;
		if (typeof account.defaultTo === "string") try {
			defaultTo = resolveSignalTarget({
				cfg,
				accountId,
				input: account.defaultTo
			})?.to ?? account.defaultTo;
		} catch {
			defaultTo = account.defaultTo;
		}
		return {
			allowFrom: account.allowFrom,
			defaultTo
		};
	},
	normalizeApprover: normalizeSignalApproverId
});
const getSignalApprovalApprovers = signalApproval.resolveApprovers;
const signalApprovalAuth = signalApproval.approvalAuth;
//#endregion
export { resolveSignalTarget as a, resolveSignalDeliveredConversationKey as i, signalApprovalAuth as n, listSignalAliasDirectoryEntries as r, getSignalApprovalApprovers as t };
