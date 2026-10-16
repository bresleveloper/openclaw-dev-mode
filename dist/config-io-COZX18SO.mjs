import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as isNonEmptyString } from "./shared-CvirZ99o.mjs";
import { o as listAuthProfileSecretTargetEntries } from "./target-registry-query-f56MMhmb.mjs";
import "./target-registry-1a6D8fYt.mjs";
import "./config-CzeZu5J_.mjs";
import { c as resolveSharedAuthStorePath } from "./path-resolve-CIRhdX6A.mjs";
import { g as resolveAuthProfileDatabasePath } from "./sqlite-CW8wNN4G.mjs";
import { n as privateFileStoreSync } from "./private-file-store-DM0i141q.mjs";
import fs from "node:fs";
import path from "node:path";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/secrets/auth-profiles-scan.ts
/** Scans auth-profile stores for plaintext credentials, SecretRefs, and OAuth tokens. */
function getAuthProfileFieldName(pathPattern) {
	const segments = pathPattern.split(".").filter(Boolean);
	return segments[segments.length - 1] ?? "";
}
const AUTH_PROFILE_FIELD_SPEC_BY_TYPE = (() => {
	const defaults = {
		api_key: {
			valueField: "key",
			refField: "keyRef"
		},
		token: {
			valueField: "token",
			refField: "tokenRef"
		}
	};
	for (const target of listAuthProfileSecretTargetEntries()) {
		if (!target.authProfileType) continue;
		defaults[target.authProfileType] = {
			valueField: getAuthProfileFieldName(target.pathPattern),
			refField: target.refPathPattern !== void 0 ? getAuthProfileFieldName(target.refPathPattern) : defaults[target.authProfileType].refField
		};
	}
	return defaults;
})();
function toSecretCredentialVisit(params) {
	const spec = AUTH_PROFILE_FIELD_SPEC_BY_TYPE[params.kind];
	return {
		kind: params.kind,
		profileId: params.profileId,
		provider: params.provider,
		profile: params.profile,
		valueField: spec.valueField,
		refField: spec.refField,
		value: params.profile[spec.valueField],
		refValue: params.profile[spec.refField]
	};
}
/** Iterates credential-bearing auth profiles with normalized field metadata for audit/apply. */
function* iterateAuthProfileCredentials(profiles) {
	for (const [profileId, value] of Object.entries(profiles)) {
		if (!isRecord(value) || !isNonEmptyString(value.provider)) continue;
		const provider = value.provider;
		if (value.type === "api_key" || value.type === "token") {
			yield toSecretCredentialVisit({
				kind: value.type,
				profileId,
				provider,
				profile: value
			});
			continue;
		}
		if (value.type === "oauth") yield {
			kind: "oauth",
			profileId,
			provider,
			profile: value,
			hasAccess: isNonEmptyString(value.access),
			hasRefresh: isNonEmptyString(value.refresh)
		};
	}
}
//#endregion
//#region src/secrets/auth-store-paths.ts
/** Discovers auth-profile store paths that may contain secret refs. */
/** Lists canonical auth-profile databases that may contain SecretRefs. */
function listAuthProfileStoreTargets(config, stateDir, env = process.env) {
	const targets = /* @__PURE__ */ new Map();
	const scopedEnv = {
		...env,
		OPENCLAW_STATE_DIR: stateDir,
		OPENCLAW_AGENT_DIR: void 0
	};
	const addTarget = (target) => {
		const key = path.resolve(target.path);
		if (targets.get(key)?.kind === "shared") return;
		targets.set(key, target);
	};
	addTarget({
		kind: "shared",
		path: resolveSharedAuthStorePath(scopedEnv),
		env: scopedEnv,
		stateDir
	});
	const agentsRoot = path.join(resolveUserPath(stateDir, scopedEnv), "agents");
	if (fs.existsSync(agentsRoot)) for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const agentDir = path.join(agentsRoot, entry.name, "agent");
		addTarget({
			kind: "agent",
			agentDir,
			path: resolveAuthProfileDatabasePath(agentDir)
		});
	}
	for (const agentId of listAgentIds(config)) {
		const agentDir = resolveUserPath(resolveAgentDir(config, agentId, scopedEnv), scopedEnv);
		addTarget({
			kind: "agent",
			agentDir,
			path: resolveAuthProfileDatabasePath(agentDir)
		});
	}
	return [...targets.values()];
}
//#endregion
//#region src/secrets/config-io.ts
/** Config IO adapter used by secrets apply/configure flows. */
const silentConfigIoLogger = {
	error: () => {},
	warn: () => {}
};
/**
* Creates config I/O for secrets commands with config-loader logging suppressed.
*/
function createSecretsConfigIO(params) {
	return createConfigIO({
		env: params.env,
		logger: silentConfigIoLogger
	});
}
/**
* Atomically writes secret-adjacent text, using the private store for default 0600 files.
*/
function writeTextFileAtomic(pathname, value, mode = 384) {
	if (mode !== 384) {
		replaceFileAtomicSync({
			filePath: pathname,
			content: value,
			mode,
			tempPrefix: ".openclaw-secrets"
		});
		return;
	}
	privateFileStoreSync(path.dirname(pathname)).writeText(path.basename(pathname), value);
}
//#endregion
export { iterateAuthProfileCredentials as i, writeTextFileAtomic as n, listAuthProfileStoreTargets as r, createSecretsConfigIO as t };
