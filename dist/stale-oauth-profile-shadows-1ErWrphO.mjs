import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-CIRhdX6A.mjs";
import { a as loadPersistedSharedAuthProfileStore, r as loadPersistedAuthProfileStore } from "./persisted-BVyWmvfF.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-WXO5HScp.mjs";
import { o as isSafeToAdoptMainStoreOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CFtD6sCU.mjs";
import { n as isLegacyOAuthRef } from "./legacy-oauth-ref-B5rOFWjL.mjs";
import { p as updateAuthProfileStoreWithLock } from "./store-runtime-CzCCJ_Oe.mjs";
import { i as resolveLegacyAuthProfilesPath } from "./doctor-auth-legacy-paths-CYXKyNhX.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
async function collectStateAgentDirs(env) {
	const agentsRoot = path.join(resolveStateDir(env), "agents");
	return (await fs.readdir(agentsRoot, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(agentsRoot, entry.name, "agent"));
}
async function collectCandidateAgentDirs(cfg, env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) {
		const id = entry.id?.trim();
		if (id) dirs.add(path.resolve(resolveAgentDir(cfg, id, env)));
	}
	for (const agentDir of await collectStateAgentDirs(env)) dirs.add(path.resolve(agentDir));
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
		if (usageStats) delete usageStats[profileId];
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
function formatProfileList(profileIds) {
	return profileIds.length === 1 ? expectDefined(profileIds[0], "profile ids entry at 0") : `${profileIds.length} profiles`;
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
		const existing = byAgentDir.get(hit.agentDir) ?? [];
		existing.push(hit);
		byAgentDir.set(hit.agentDir, existing);
	}
	for (const [agentDir, agentHits] of byAgentDir) {
		const mainStore = loadPersistedSharedAuthProfileStore(env);
		if (!mainStore) continue;
		const profileIds = new Set(agentHits.map((hit) => hit.profileId));
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
			if (removedProfileIds.length > 0) changes.push(`Removed stale OAuth auth profile shadow ${formatProfileList(removedProfileIds.toSorted())} from ${shortenHomePath(resolveLegacyAuthProfilesPath(agentDir))}; this agent now inherits main auth.`);
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
