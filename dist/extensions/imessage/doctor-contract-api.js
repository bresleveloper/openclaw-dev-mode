import { n as __reExport, t as __exportAll } from "./.setup/rolldown-runtime-BBjsoOtd.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord$1(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or null. */
function asNullableRecord$1(value) {
	return isRecord$1(value) ? value : null;
}
//#endregion
//#region src/config/channel-config-normalization.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord$1(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord$1(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord$1(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
//#endregion
//#region src/plugin-sdk/legacy-webhook-listener-migration.ts
/** Preserve explicitly configured webhook listeners while moving ingress onto Gateway routes. */
function createLegacyWebhookListenerDoctorContract(params) {
	const portKey = params.portKey ?? "webhookPort";
	const hostKey = params.hostKey === void 0 ? "webhookHost" : params.hostKey;
	const source = (entry) => params.webhookKey ? asNullableRecord$1(entry[params.webhookKey]) : entry;
	const hasLegacy = (value) => {
		const entry = asNullableRecord$1(value);
		const listener = entry && source(entry);
		return Boolean(listener && (Object.hasOwn(listener, portKey) || hostKey && Object.hasOwn(listener, hostKey)));
	};
	const prefix = `channels.${params.channelKey}`;
	return {
		historicalWebhookListener: {
			channelId: params.channelKey,
			port: params.defaultPort,
			preserveAuthoredActivation: params.preserveAuthoredActivation,
			...params.defaultHost === void 0 ? {} : { host: params.defaultHost }
		},
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${prefix} webhook listeners moved to Gateway routes. Run "openclaw doctor --fix" to preserve explicitly configured listener settings as legacyWebhook.`,
			match: (value) => {
				const accounts = asNullableRecord$1(asNullableRecord$1(value)?.accounts);
				return hasLegacy(value) || Object.values(accounts ?? {}).some(hasLegacy);
			}
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			const root = asNullableRecord$1(asNullableRecord$1(cfg.channels)?.[params.channelKey]);
			const inherited = root && source(root);
			const canonicalRoot = asNullableRecord$1(root?.legacyWebhook);
			return normalizeChannelConfigEntries({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: ({ entry, accountId, pathPrefix, changes }) => {
					const listener = source(entry);
					if (!listener || !hasLegacy(entry)) return {
						entry,
						changed: false
					};
					const next = { ...entry };
					const port = Object.hasOwn(listener, portKey) ? listener[portKey] : (accountId ? canonicalRoot?.port ?? inherited?.[portKey] : void 0) ?? params.defaultPort;
					const inheritedHost = accountId ? canonicalRoot ? canonicalRoot.host : (hostKey ? inherited?.[hostKey] : void 0) ?? params.defaultHost : params.defaultHost;
					const host = hostKey ? listener[hostKey] ?? inheritedHost : inheritedHost;
					const legacyPath = [pathPrefix, params.webhookKey].filter(Boolean).join(".");
					if (Object.hasOwn(entry, "legacyWebhook")) changes.push(`Removed ${legacyPath} legacy listener keys; ${pathPrefix}.legacyWebhook is already configured.`);
					else if (accountId && root?.legacyWebhook === false) changes.push(`Removed ${legacyPath} legacy listener keys; ${prefix}.legacyWebhook: false keeps this account's inherited listener disabled.`);
					else {
						next.legacyWebhook = {
							port,
							...host !== void 0 ? { host } : {}
						};
						changes.push(`Moved ${legacyPath} listener settings to ${pathPrefix}.legacyWebhook. Point the external callback or reverse proxy at the Gateway port and webhook path, verify delivery, then set legacyWebhook: false to disable legacy forwarding.`);
					}
					const updated = params.webhookKey ? { ...listener } : next;
					delete updated[portKey];
					if (hostKey) delete updated[hostKey];
					if (params.webhookKey) {
						if (Object.keys(updated).length) next[params.webhookKey] = updated;
						else delete next[params.webhookKey];
					}
					return {
						entry: next,
						changed: true
					};
				}
			});
		}
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/runtime-doctor-migrations
var runtime_doctor_migrations_exports = /* @__PURE__ */ __exportAll({ createLegacyWebhookListenerDoctorContract: () => createLegacyWebhookListenerDoctorContract });
import * as import_openclaw_plugin_sdk_runtime_doctor_migrations from "openclaw/plugin-sdk/runtime-doctor-migrations";
__reExport(runtime_doctor_migrations_exports, import_openclaw_plugin_sdk_runtime_doctor_migrations);
//#endregion
//#region extensions/imessage/config-doctor-api.ts
function isEnabledCatchup(value) {
	return isRecord(value) && value.enabled === true;
}
function imessageEntryHasRetiredCatchup(entry) {
	if (!isRecord(entry)) return false;
	if (Object.hasOwn(entry, "catchup") && !isEnabledCatchup(entry.catchup)) return true;
	const accounts = entry.accounts;
	if (!isRecord(accounts)) return false;
	return Object.values(accounts).some((account) => isRecord(account) && Object.hasOwn(account, "catchup") && !isEnabledCatchup(account.catchup));
}
const streamingAliasMigration = (0, runtime_doctor_migrations_exports.defineChannelAliasMigration)({
	channelId: "imessage",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	}
});
const legacyConfigRules = [{
	path: ["channels", "imessage"],
	message: "disabled channels.imessage.catchup config is retired; iMessage now recovers via always-on inbound dedupe and a stale-backlog age fence. Run \"openclaw doctor --fix\" to remove disabled catchup blocks.",
	match: (value) => imessageEntryHasRetiredCatchup(value)
}, ...streamingAliasMigration.legacyConfigRules];
function normalizeCompatibilityConfig({ cfg }) {
	const channels = cfg.channels;
	const imessage = channels?.imessage;
	if (!isRecord(imessage)) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	let nextImessage = imessage;
	if (imessageEntryHasRetiredCatchup(nextImessage)) {
		nextImessage = { ...nextImessage };
		if (Object.hasOwn(nextImessage, "catchup") && !isEnabledCatchup(nextImessage.catchup)) {
			delete nextImessage.catchup;
			changes.push("Removed disabled retired channels.imessage.catchup.");
		}
		if (isRecord(nextImessage.accounts)) {
			let accountsChanged = false;
			const nextAccounts = { ...nextImessage.accounts };
			for (const [id, account] of Object.entries(nextImessage.accounts)) if (isRecord(account) && Object.hasOwn(account, "catchup") && !isEnabledCatchup(account.catchup)) {
				const nextAccount = { ...account };
				delete nextAccount.catchup;
				nextAccounts[id] = nextAccount;
				accountsChanged = true;
				changes.push(`Removed disabled retired channels.imessage.accounts.${id}.catchup.`);
			}
			if (accountsChanged) nextImessage.accounts = nextAccounts;
		}
	}
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg: nextImessage === imessage ? cfg : {
			...cfg,
			channels: {
				...channels,
				imessage: nextImessage
			}
		},
		changes
	});
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: aliases.config,
		changes
	};
}
//#endregion
//#region extensions/imessage/doctor-contract-api.ts
const stateMigrations = [(0, runtime_doctor_migrations_exports.defineRetiredPluginStateMigration)({
	id: "imessage-retired-state",
	label: "iMessage retired monitor state",
	intermediateVersion: "2026.9.5",
	findSources: ({ stateDir }) => [
		path.join(stateDir, "imessage", "reply-cache.jsonl"),
		path.join(stateDir, "imessage", "sent-echoes.jsonl"),
		{
			directory: path.join(stateDir, "imessage", "catchup"),
			suffix: ".json"
		}
	]
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
