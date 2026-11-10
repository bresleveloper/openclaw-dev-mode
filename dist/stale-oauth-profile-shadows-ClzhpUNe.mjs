import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { o as isSafeToAdoptMainStoreOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CiaJlx_D.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { L as isLegacyOAuthRef } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { i as loadPersistedSharedAuthProfileStore, n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { f as resolveSharedMainAuthAgentDir } from "./path-resolve-21Orzn6B.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { C as updateAuthProfileStoreWithLock } from "./store-runtime-CwqGD12G.mjs";
import { i as resolveLegacyAuthProfilesPath } from "./doctor-auth-legacy-paths-BW9Ya4su.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/commands/doctor/shared/stale-oauth-profile-shadows.ts
async function loadRawAuthProfileStore(authPath) {
	try {
		const raw = JSON.parse(await fs.readFile(authPath, "utf8"));
		if (!isRecord(raw)) throw new Error("Expected an auth profile store object");
		return raw;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw new Error(`Cannot read legacy auth profile store ${shortenHomePath(authPath)}; skipped OAuth shadow cleanup. Inspect or restore the file and rerun doctor.`, { cause: error });
	}
}
function hasLegacyOAuthSidecarRef(raw, profileId) {
	const profile = raw && isRecord(raw.profiles) ? raw.profiles[profileId] : void 0;
	return isRecord(profile) && profile.type === "oauth" && profile.provider === "openai-codex" && isLegacyOAuthRef(profile.oauthRef);
}
async function collectCandidateAgentDirs(cfg, env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) {
		const id = entry.id?.trim();
		if (id) dirs.add(path.resolve(resolveAgentDir(cfg, id, env)));
	}
	const agentsRoot = path.join(resolveStateDir(env), "agents");
	const entries = await fs.readdir(agentsRoot, { withFileTypes: true }).catch(() => []);
	for (const entry of entries) if (entry.isDirectory() || entry.isSymbolicLink()) dirs.add(path.resolve(agentsRoot, entry.name, "agent"));
	return [...dirs].toSorted((left, right) => left.localeCompare(right));
}
function shouldRemoveLocalOAuthShadow(params) {
	const { local, main, now } = params;
	if (!main || isLegacyOAuthRef(local.oauthRef) || local.provider !== main.provider) return false;
	if (!isSafeToAdoptMainStoreOAuthIdentity(local, main)) return false;
	if (areOAuthCredentialsEquivalent(local, main)) return true;
	if (!hasUsableOAuthCredential(main, { now })) return false;
	if (!hasUsableOAuthCredential(local, { now })) return true;
	const localExpires = Number.isFinite(local.expires) ? local.expires : 0;
	return (Number.isFinite(main.expires) ? main.expires : 0) >= localExpires;
}
/** Find local OAuth profiles that safely inherit fresher main-agent credentials instead. */
async function scanStaleOAuthProfileShadows(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now();
	const mainAuthPath = path.resolve(resolveLegacyAuthProfilesPath(resolveSharedMainAuthAgentDir(env)));
	const mainStore = loadPersistedSharedAuthProfileStore(env);
	if (!mainStore) return {
		hits: [],
		warnings: []
	};
	const hits = [];
	const warnings = [];
	for (const agentDir of await collectCandidateAgentDirs(params.cfg, env)) {
		const authPath = path.resolve(resolveLegacyAuthProfilesPath(agentDir));
		if (authPath === mainAuthPath) continue;
		const rawLocalStore = await loadRawAuthProfileStore(authPath).catch((error) => {
			warnings.push(String(error));
		});
		if (rawLocalStore === void 0) continue;
		const localStore = loadPersistedAuthProfileStore(agentDir);
		if (!localStore) continue;
		for (const [profileId, local] of Object.entries(localStore.profiles)) {
			if (local.type !== "oauth" || hasLegacyOAuthSidecarRef(rawLocalStore, profileId)) continue;
			const main = mainStore.profiles[profileId];
			if (shouldRemoveLocalOAuthShadow({
				local,
				main: main?.type === "oauth" ? main : void 0,
				now
			})) hits.push({
				agentDir,
				authPath,
				profileId
			});
		}
	}
	return {
		hits,
		warnings
	};
}
function removeStaleProfilesFromStore(params) {
	const removedProfileIds = [];
	const { profiles, usageStats, lastGood } = params.store;
	for (const profileId of params.profileIds) {
		const local = profiles[profileId];
		const main = params.mainStore.profiles[profileId];
		if (local?.type !== "oauth" || !shouldRemoveLocalOAuthShadow({
			local,
			main: main?.type === "oauth" ? main : void 0,
			now: params.now
		})) continue;
		delete profiles[profileId];
		delete usageStats?.[profileId];
		if (lastGood) {
			for (const [provider, lastGoodProfileId] of Object.entries(lastGood)) if (lastGoodProfileId === profileId) delete lastGood[provider];
		}
		removedProfileIds.push(profileId);
	}
	if (removedProfileIds.length > 0) {
		params.store.usageStats = usageStats && Object.keys(usageStats).length > 0 ? usageStats : void 0;
		params.store.lastGood = lastGood && Object.keys(lastGood).length > 0 ? lastGood : void 0;
	}
	return removedProfileIds;
}
/** Format warnings for stale per-agent OAuth profile shadows. */
function collectStaleOAuthProfileShadowWarnings(params) {
	return params.hits.map((hit) => `- ${shortenHomePath(hit.authPath)} has stale OAuth auth profile ${hit.profileId}; it shadows the fresher main-agent credential. Run "${params.doctorFixCommand}" to remove the local shadow and inherit main auth.`);
}
/** Remove stale per-agent OAuth profile shadows after rechecking each locked store. */
async function repairStaleOAuthProfileShadows(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now();
	const { hits, warnings } = await scanStaleOAuthProfileShadows({
		...params,
		env,
		now
	});
	const changes = [];
	const byAgentDir = /* @__PURE__ */ new Map();
	for (const hit of hits) {
		const profileIds = byAgentDir.get(hit.agentDir) ?? /* @__PURE__ */ new Set();
		profileIds.add(hit.profileId);
		byAgentDir.set(hit.agentDir, profileIds);
	}
	for (const [agentDir, profileIds] of byAgentDir) {
		const mainStore = loadPersistedSharedAuthProfileStore(env);
		if (!mainStore) continue;
		try {
			const rawStore = await loadRawAuthProfileStore(resolveLegacyAuthProfilesPath(agentDir));
			const removableIds = new Set([...profileIds].filter((profileId) => !hasLegacyOAuthSidecarRef(rawStore, profileId)));
			if (removableIds.size === 0 || !loadPersistedAuthProfileStore(agentDir)) continue;
			let removedProfileIds = [];
			await updateAuthProfileStoreWithLock({
				agentDir,
				updater: (store) => {
					removedProfileIds = removeStaleProfilesFromStore({
						store,
						mainStore,
						profileIds: removableIds,
						now
					});
					return removedProfileIds.length > 0;
				}
			});
			if (removedProfileIds.length > 0) changes.push(`Removed stale OAuth auth profile shadow ${removedProfileIds.length === 1 ? removedProfileIds[0] : `${removedProfileIds.length} profiles`} from ${shortenHomePath(resolveLegacyAuthProfilesPath(agentDir))}; this agent now inherits main auth.`);
		} catch (error) {
			warnings.push(`Failed to remove stale OAuth auth profile shadow from ${shortenHomePath(resolveLegacyAuthProfilesPath(agentDir))}: ${String(error)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { repairStaleOAuthProfileShadows as n, scanStaleOAuthProfileShadows as r, collectStaleOAuthProfileShadowWarnings as t };
