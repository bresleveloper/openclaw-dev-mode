import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./.setup/doctor-contract-DcONa6Y4.mjs";
import { t as resolveZalouserDmSessionScope } from "./.setup/session-scope-BjOC6bJs.mjs";
import { f as zalouserCredentialStoreKey, l as resolveLegacyZalouserCredentialsDir, o as normalizeStoredZaloCredentials, r as isZaloCredentialRevocation, s as normalizeZalouserCredentialProfile, t as ZALOUSER_CREDENTIALS_NAMESPACE, u as resolveLegacyZalouserCredentialsPath } from "./.setup/session-state-C2RwsaRK.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fsp from "node:fs/promises";
import path from "node:path";
import { archiveLegacyStateSource } from "openclaw/plugin-sdk/runtime-doctor-migrations";
import { buildAgentSessionKey, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
//#region extensions/zalouser/doctor-contract-api.ts
const LEGACY_ZALOUSER_DM_PREFIX = "zalouser:group:";
async function collectLegacyZalouserCredentialSources(env) {
	const credentialsDir = resolveLegacyZalouserCredentialsDir(env);
	let entries;
	try {
		entries = await fsp.readdir(credentialsDir, { withFileTypes: true });
	} catch {
		return [];
	}
	return entries.filter((entry) => entry.isFile() && (entry.name === "credentials.json" || entry.name.startsWith("credentials-") && entry.name.endsWith(".json"))).flatMap((entry) => {
		let profile = "default";
		if (entry.name !== "credentials.json") try {
			profile = decodeURIComponent(entry.name.slice(12, -5));
		} catch {
			return [];
		}
		const normalizedProfile = normalizeZalouserCredentialProfile(profile);
		const filePath = path.join(credentialsDir, entry.name);
		return resolveLegacyZalouserCredentialsPath(normalizedProfile, env) === filePath ? [{
			filePath,
			profile: normalizedProfile
		}] : [];
	}).toSorted((left, right) => left.profile.localeCompare(right.profile));
}
async function collectLegacyZalouserDmEntries(config, env, options = {}) {
	const { deliveryContextFromSession, listSessionEntries, resolveStorePath } = await import("openclaw/plugin-sdk/session-store-runtime");
	const entries = /* @__PURE__ */ new Map();
	const fallbackAccountId = config.channels?.zalouser?.defaultAccount?.trim() || "default";
	const agentIds = /* @__PURE__ */ new Set(["main", ...(config.agents?.list ?? []).flatMap(({ id }) => id?.trim() ? [id.trim()] : [])]);
	for (const agentId of agentIds) {
		const storePath = resolveStorePath(config.session?.store, {
			agentId,
			env
		});
		const storedEntries = listSessionEntries({
			agentId,
			storePath,
			...options.readOnly ? { readOnly: true } : {}
		});
		const entryByKey = new Map(storedEntries.map(({ sessionKey, entry }) => [sessionKey, entry]));
		for (const { sessionKey, entry } of storedEntries) {
			const parsed = parseAgentSessionKey(sessionKey);
			if (entry.chatType !== "direct" || !parsed?.rest.startsWith(LEGACY_ZALOUSER_DM_PREFIX)) continue;
			const peerId = parsed.rest.slice(15);
			if (!peerId) continue;
			const canonicalKey = buildAgentSessionKey({
				agentId: parsed.agentId,
				channel: "zalouser",
				accountId: deliveryContextFromSession(entry)?.accountId?.trim() || fallbackAccountId,
				peer: {
					kind: "direct",
					id: peerId
				},
				dmScope: resolveZalouserDmSessionScope(config),
				identityLinks: config.session?.identityLinks
			});
			const groupKey = `${storePath}\0${canonicalKey}`;
			const canonicalEntry = entryByKey.get(canonicalKey);
			const pending = entries.get(groupKey) ?? {
				agentId,
				canonicalKey,
				entry: canonicalEntry && canonicalEntry.updatedAt >= entry.updatedAt ? canonicalEntry : entry,
				legacyKeys: [],
				storePath
			};
			pending.legacyKeys.push(sessionKey);
			if (entry.updatedAt > pending.entry.updatedAt) pending.entry = entry;
			entries.set(groupKey, pending);
		}
	}
	return [...entries.values()];
}
const stateMigrations = [{
	id: "zalouser-credentials-json-to-plugin-state",
	label: "Zalo Personal credentials",
	async detectLegacyState(params) {
		const sources = await collectLegacyZalouserCredentialSources(params.env);
		return sources.length > 0 ? { preview: [`- Zalo Personal credentials: ${sources.length} ${sources.length === 1 ? "file" : "files"} -> plugin state (${ZALOUSER_CREDENTIALS_NAMESPACE})`] } : null;
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const store = params.context.openPluginStateKeyedStore({
			namespace: ZALOUSER_CREDENTIALS_NAMESPACE,
			maxEntries: 256,
			overflowPolicy: "reject-new"
		});
		for (const source of await collectLegacyZalouserCredentialSources(params.env)) {
			let credentials = null;
			try {
				const raw = JSON.parse(await fsp.readFile(source.filePath, "utf8"));
				const createdAt = isRecord(raw) && typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (await fsp.stat(source.filePath)).mtime.toISOString();
				credentials = normalizeStoredZaloCredentials(isRecord(raw) ? {
					...raw,
					createdAt
				} : raw, source.profile);
			} catch {}
			if (!credentials) {
				warnings.push(`Left invalid Zalo Personal credential legacy source in place for profile ${source.profile}`);
				continue;
			}
			const key = zalouserCredentialStoreKey(source.profile);
			const stored = await store.lookup(key);
			if (isZaloCredentialRevocation(stored, source.profile)) {
				changes.push(`Archived revoked Zalo Personal credential legacy source for profile ${source.profile}`);
				await archiveLegacyStateSource({
					filePath: source.filePath,
					label: "Zalo Personal credentials",
					changes,
					warnings
				});
				continue;
			}
			const existing = normalizeStoredZaloCredentials(stored, source.profile);
			if (existing && JSON.stringify(existing) !== JSON.stringify(credentials)) {
				warnings.push(`Kept existing Zalo Personal credentials for profile ${source.profile}; left differing legacy source in place`);
				continue;
			}
			if (!existing) try {
				await store.registerIfAbsent(key, credentials);
			} catch (error) {
				warnings.push(`Failed importing Zalo Personal credentials for profile ${source.profile}: ${String(error)}; left legacy source in place`);
				continue;
			}
			const persisted = normalizeStoredZaloCredentials(await store.lookup(key), source.profile);
			if (!persisted || JSON.stringify(persisted) !== JSON.stringify(credentials)) {
				warnings.push(`Failed verifying Zalo Personal credentials for profile ${source.profile}; left legacy source in place`);
				continue;
			}
			changes.push(`Migrated Zalo Personal credentials for profile ${source.profile}`);
			await archiveLegacyStateSource({
				filePath: source.filePath,
				label: "Zalo Personal credentials",
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
}, {
	id: "zalouser-direct-session-keys",
	label: "Zalo Personal direct-message sessions",
	async detectLegacyState({ config, env }) {
		if (config.channels?.zalouser === void 0 && (await collectLegacyZalouserCredentialSources(env)).length === 0) return null;
		const count = (await collectLegacyZalouserDmEntries(config, env, { readOnly: true })).flatMap(({ legacyKeys }) => legacyKeys).length;
		return count > 0 ? { preview: [`- Zalo Personal direct-message session keys: ${count} legacy row(s)`] } : null;
	},
	async migrateLegacyState({ config, env }) {
		const { deleteSessionEntry, upsertSessionEntry } = await import("openclaw/plugin-sdk/session-store-runtime");
		const pending = await collectLegacyZalouserDmEntries(config, env);
		const warnings = [];
		let migrated = 0;
		for (const entry of pending) {
			try {
				await upsertSessionEntry({
					agentId: entry.agentId,
					env,
					storePath: entry.storePath,
					sessionKey: entry.canonicalKey,
					entry: entry.entry
				});
			} catch (error) {
				warnings.push(`Failed writing ${entry.canonicalKey}: ${String(error)}`);
				continue;
			}
			for (const legacyKey of entry.legacyKeys) try {
				await deleteSessionEntry({
					agentId: entry.agentId,
					env,
					storePath: entry.storePath,
					sessionKey: legacyKey
				});
				migrated++;
			} catch (error) {
				warnings.push(`Failed removing ${legacyKey}: ${String(error)}`);
			}
		}
		return {
			changes: migrated > 0 ? [`Migrated ${migrated} Zalo Personal DM session key(s)`] : [],
			warnings
		};
	}
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
