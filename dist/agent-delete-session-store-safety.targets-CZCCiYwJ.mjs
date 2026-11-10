import { i as resolveRequiredHomeDir, o as resolveUserPath, t as expandHomePrefix } from "./home-dir-CtsdYvX3.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as listSqliteTargetCandidatePathsForSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-delete-session-store-safety.targets.ts
function captureCandidates(stores) {
	return [...new Set(stores.flatMap((store) => listSqliteTargetCandidatePathsForSessionStorePath(store)))].toSorted().map((pathname) => ({
		path: pathname,
		identity: readDatabasePathIdentitySync(pathname)
	}));
}
/** Retain lexical families, physical aliases, and absences before discovery yields. */
function prepareAgentSessionStoreDeletionSafety(cfg, agentId, environment) {
	const id = normalizeAgentId(agentId);
	const env = cloneEnvWithPlatformSemantics(environment);
	const config = structuredClone(cfg);
	const store = cfg.session?.store;
	if (store?.trim()) {
		config.agents = {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				sessionStore: { agentId: resolveSessionStoreCompatibilityAgentId(cfg) }
			}
		};
		config.session = {
			...config.session,
			store: path.resolve(resolveUserPath("."), store.startsWith("~") ? expandHomePrefix(store, {
				home: resolveRequiredHomeDir(env),
				env
			}) : store)
		};
	}
	const stores = store?.trim() ? listAgentIds(config).filter((survivor) => normalizeAgentId(survivor) !== id).map((survivor) => resolveSessionStorePathCore(config.session?.store, {
		agentId: survivor,
		env
	})) : [];
	return {
		config,
		agentId: id,
		env,
		targets: {
			stores,
			candidates: captureCandidates(stores)
		}
	};
}
function assertAgentSessionStoreDeletionTargetsCurrent(targets) {
	if (!isDeepStrictEqual(captureCandidates(targets.stores), targets.candidates)) throw new Error("Agent session database changed during deletion planning.");
}
//#endregion
export { prepareAgentSessionStoreDeletionSafety as n, assertAgentSessionStoreDeletionTargetsCurrent as t };
