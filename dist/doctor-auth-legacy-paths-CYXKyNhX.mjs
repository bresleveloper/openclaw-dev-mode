import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { T as resolveOAuthDir } from "./paths-DGIwWbpu.mjs";
import { a as createConfigRuntimeEnv, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as readConfigFileIfPresent, t as coerceConfig } from "./io.read-helpers-Bvdjf9tk.mjs";
import { l as createConfigIoContext, r as inspectConfigJsonRootSuffixWithContext } from "./io.factory-DWrU5KGJ.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-CIRhdX6A.mjs";
import { n as isLegacyOAuthRef } from "./legacy-oauth-ref-B5rOFWjL.mjs";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-BbcRkdUC.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { n as assertNoRetiredStateFiles, r as createRetiredStateInspectionError } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-auth-legacy-paths.ts
function resolveLegacyAuthAgentDir(agentDir) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir();
}
function listExistingAgentDirsFromState(env, onUnavailable) {
	const root = path.join(resolveStateDir(env), "agents");
	let entries;
	try {
		entries = fs.readdirSync(root, { withFileTypes: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) onUnavailable?.(root);
		return [];
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(root, entry.name, "agent")).filter((agentDir) => {
		try {
			const directory = fs.statSync(agentDir).isDirectory();
			if (!directory) onUnavailable?.(agentDir);
			return directory;
		} catch (error) {
			if (!onUnavailable) return false;
			if (!hasErrnoCode(error, "ENOENT")) {
				onUnavailable?.(agentDir);
				return false;
			}
			try {
				fs.lstatSync(agentDir);
				onUnavailable?.(agentDir);
			} catch (missing) {
				if (!hasErrnoCode(missing, "ENOENT")) onUnavailable?.(agentDir);
				else try {
					fs.statSync(path.dirname(agentDir));
				} catch {
					onUnavailable?.(agentDir);
				}
			}
			return false;
		}
	});
}
function listAuthProfileStoreCandidates(cfg, env, onUnavailable) {
	const candidates = /* @__PURE__ */ new Map();
	const addCandidate = (agentDir) => {
		const resolvedAgentDir = agentDir ? resolveUserPath(agentDir, env) : void 0;
		const authPath = resolveLegacyAuthProfilesPath(resolvedAgentDir ?? resolveSharedMainAuthAgentDir(env));
		if (!candidates.get(authPath) || agentDir === void 0) candidates.set(authPath, {
			agentDir: resolvedAgentDir,
			authPath
		});
	};
	addCandidate(void 0);
	addCandidate(resolveLegacyInheritedAuthAgentDir(cfg, env));
	const envAgentDir = readNonBlankString(env.OPENCLAW_AGENT_DIR) ?? readNonBlankString(env.PI_CODING_AGENT_DIR);
	if (envAgentDir) addCandidate(envAgentDir);
	for (const agentId of listAgentIds(cfg)) addCandidate(resolveAgentDir(cfg, agentId, env));
	for (const agentDir of listExistingAgentDirsFromState(env, onUnavailable)) addCandidate(agentDir);
	return [...candidates.values()];
}
/** Keep auth import and repair on the same physical owners. */
function listAuthProfileRepairCandidates(cfg, env, onUnavailable) {
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => listAgentIds(cfg).map((agentId) => ({
		agentId,
		path: resolveAgentDir(cfg, agentId, env)
	})), {
		kind: "agent-directory",
		readDatabasePaths: () => resolveConfiguredAgentDatabaseCandidatePaths(cfg, { env })
	});
	return listAuthProfileStoreCandidates(cfg, env, onUnavailable).filter(({ authPath }) => !isRetained(path.dirname(authPath)));
}
function resolveLegacyAuthProfilesPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-profiles.json");
}
function resolveLegacyAuthStatePath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-state.json");
}
function resolveLegacyFlatAuthPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth.json");
}
/**
* Lists retired OAuth sidecars that a legacy auth-profiles.json still references.
*
* The 2026.9.7 Doctor imports only referenced sidecars and deliberately keeps unreferenced
* ones, so those stay in place without blocking: no supported step can clear them, and
* every later auth import repeats this check against the directories it sees then. The scan
* reads no database, so it also runs before schema preparation and counts retained agents.
*/
function listReferencedLegacyOAuthSidecarPaths(env, cfg, stateDir) {
	const runtimeEnv = cfg ? createConfigRuntimeEnv(cfg, env) : env;
	const directory = path.join(resolveOAuthDir(runtimeEnv, stateDir), "auth-profiles");
	let names;
	try {
		names = fs.readdirSync(directory).filter((name) => /^[a-f0-9]{32}\.json$/.test(name));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) try {
			fs.lstatSync(directory);
		} catch (inspectionError) {
			if (hasErrnoCode(inspectionError, "ENOENT")) return [];
			throw createRetiredStateInspectionError(directory, inspectionError);
		}
		throw createRetiredStateInspectionError(directory, error);
	}
	if (names.length === 0) return [];
	const referencedIds = /* @__PURE__ */ new Set();
	const authPaths = new Set([env, runtimeEnv].flatMap((selectionEnv) => listAuthProfileStoreCandidates(cfg ?? {}, stateDir ? {
		...selectionEnv,
		OPENCLAW_STATE_DIR: stateDir
	} : selectionEnv).map(({ authPath }) => authPath)));
	for (const authPath of authPaths) {
		let raw;
		try {
			raw = JSON.parse(fs.readFileSync(authPath, "utf8"));
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT") || error instanceof SyntaxError) continue;
			throw createRetiredStateInspectionError(authPath, error);
		}
		const profiles = isRecord(raw) && isRecord(raw.profiles) ? Object.values(raw.profiles) : [];
		for (const profile of profiles) if (isRecord(profile) && isLegacyOAuthRef(profile.oauthRef)) referencedIds.add(profile.oauthRef.id);
	}
	return names.filter((name) => referencedIds.has(name.slice(0, -5))).map((name) => path.join(directory, name));
}
function assertNoRetiredOAuthSidecarsBeforeConfigRecovery(params) {
	const context = createConfigIoContext({
		configPath: params.configPath,
		env: cloneEnvWithPlatformSemantics(params.env),
		observe: false,
		shellEnvFallback: "defer"
	});
	const raw = readConfigFileIfPresent(context.deps, context.configPath);
	if (raw !== void 0) inspectConfigJsonRootSuffixWithContext(context, raw, (candidate) => {
		assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(context.deps.env, coerceConfig(candidate), params.stateDir));
	});
}
//#endregion
export { resolveLegacyAuthStatePath as a, resolveLegacyAuthProfilesPath as i, listAuthProfileRepairCandidates as n, resolveLegacyFlatAuthPath as o, listReferencedLegacyOAuthSidecarPaths as r, assertNoRetiredOAuthSidecarsBeforeConfigRecovery as t };
