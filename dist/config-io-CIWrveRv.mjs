import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { B as resolveNativeSharedAuthStorePath, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { t as readExistingStateRootMode } from "./private-dir-mode-BBICrnrB.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./shared-BVDjoVcf.mjs";
import { o as listAuthProfileSecretTargetEntries } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import "./config-B3oiWDlr.mjs";
import { r as writePrivateTextFileAtomicSync } from "./private-file-store-BFf7SHKy.mjs";
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
/** Iterates credential-bearing auth profiles with normalized field metadata for audit/apply. */
function* iterateAuthProfileCredentials(profiles) {
	for (const [profileId, value] of Object.entries(profiles)) {
		if (!isRecord(value) || !hasNonEmptyString(value.provider)) continue;
		const provider = value.provider;
		if (value.type === "api_key" || value.type === "token") {
			const spec = AUTH_PROFILE_FIELD_SPEC_BY_TYPE[value.type];
			yield {
				kind: value.type,
				profileId,
				provider,
				profile: value,
				valueField: spec.valueField,
				refField: spec.refField,
				value: value[spec.valueField],
				refValue: value[spec.refField]
			};
			continue;
		}
		if (value.type === "oauth") yield {
			kind: "oauth",
			profileId,
			provider,
			profile: value,
			hasAccess: hasNonEmptyString(value.access),
			hasRefresh: hasNonEmptyString(value.refresh)
		};
	}
}
//#endregion
//#region src/secrets/auth-store-paths.ts
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
		path: resolveNativeSharedAuthStorePath(scopedEnv),
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
function writeTextFileAtomic(pathname, value, mode = 384, env = process.env) {
	const stateDir = resolveStateDir(env);
	if (mode !== 384) {
		replaceFileAtomicSync({
			filePath: pathname,
			content: value,
			mode,
			dirMode: readExistingStateRootMode(path.dirname(pathname), stateDir),
			tempPrefix: ".openclaw-secrets"
		});
		return;
	}
	writePrivateTextFileAtomicSync(pathname, value, stateDir);
}
//#endregion
export { iterateAuthProfileCredentials as i, writeTextFileAtomic as n, listAuthProfileStoreTargets as r, createSecretsConfigIO as t };
