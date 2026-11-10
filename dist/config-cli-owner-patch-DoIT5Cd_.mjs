import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { n as formatConfigPatchPath, t as collectBaseArrayPaths } from "./patch-replace-paths-smD0Mrey.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-BN3WkKzC.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/config-cli-owner-patch.ts
const MAX_REPLACE_PATHS = 256;
function collectReplacePaths(patch, base, parentPath) {
	if (!isPlainObject(patch)) return [];
	return Object.entries(patch).flatMap(([key, value]) => {
		const path = formatConfigPatchPath(parentPath, key);
		const baseValue = isPlainObject(base) ? base[key] : void 0;
		if (isPlainObject(value)) return collectReplacePaths(value, baseValue, path);
		const removed = collectBaseArrayPaths(baseValue, path);
		return Array.isArray(value) && !removed.includes(path) ? [path].concat(removed) : removed;
	});
}
function createOwnerMergePatch(previous, next) {
	const patch = createMergePatch(previous, next);
	const replacePaths = collectReplacePaths(patch, previous);
	const apply = (base) => {
		return applyMergePatch(base, patch, {
			mergeObjectArraysById: true,
			replaceArrayPaths: new Set(replacePaths)
		});
	};
	return {
		patch,
		replacePaths,
		apply
	};
}
/**
* Prepare the authored config the local writer would save for this change, including the
* ownership it derives from the command's explicit and unset paths. config.patch carries no
* such paths, so the Gateway's writer derives ownership and `${VAR}` references from the
* merged result alone; a change whose result would differ there is refused, not approximated.
*/
async function prepareConfigOwnerChange(params) {
	const { previous, explicitSetPaths, unsetPaths, ...read } = params;
	const local = await prepareConfigWriteTopology({
		...read,
		nextConfig: params.next,
		options: { explicitSetPaths },
		unsetPaths
	});
	const refusal = (cause) => new Error("The running Gateway would save a different result for this change: it cannot see which paths this command set, so it would recompute environment references or agent, auth or session-store ownership differently. Nothing was sent and no settings were saved. Split the change into separate commands (for example set an owner path after the roster or store change), or stop the Gateway through its service owner, wait for ownership to release, then rerun this exact command.", cause === void 0 ? void 0 : { cause });
	const owner = await prepareConfigWriteTopology({
		...read,
		nextConfig: createOwnerMergePatch(previous, local.authoredConfig).apply(params.snapshot.sourceConfig),
		options: {},
		unsetPaths: []
	}).catch((error) => {
		throw refusal(error);
	});
	if (!isDeepStrictEqual(owner.authoredConfig, local.authoredConfig)) throw refusal();
	return {
		previous,
		next: local.authoredConfig,
		clearedSessionStoreOwner: local.clearedSessionStoreOwner
	};
}
/**
* Express a prepared CLI change as one Gateway config.patch request against `baseHash`. Arrays replace or
* delete exactly, as the local writer would; a change the Gateway's merge cannot reproduce
* (for example an authored null) is refused instead of being approximated.
*/
function buildConfigOwnerPatch(change, baseHash) {
	const { patch, replacePaths, apply } = createOwnerMergePatch(change.previous, change.next);
	if (replacePaths.length > MAX_REPLACE_PATHS || !isDeepStrictEqual(apply(change.previous), change.next)) throw new Error("This change cannot be expressed as a Gateway config patch, so it was not sent to the running Gateway. No settings were saved. To apply it, stop the Gateway through its service owner, wait for ownership to release, then rerun this exact command.");
	return {
		raw: JSON.stringify(patch),
		...typeof baseHash === "string" ? { baseHash } : {},
		...replacePaths.length > 0 ? { replacePaths } : {}
	};
}
/**
* Bind a routed config change to the file the running Gateway writes. The change is prepared
* from this command's own read; the returned commit sends it as one config.patch against the
* owner's revision and returns the restart hint, if any.
*/
async function bindConfigOwner(requestOwner, env) {
	const current = await requestOwner("config.get", {});
	const selected = resolveConfigPath(env);
	if (typeof current.path !== "string" || resolveIdentityPathViaExistingAncestorSync(current.path) !== resolveIdentityPathViaExistingAncestorSync(selected)) throw new Error(`The running Gateway owns this state directory but uses config file ${typeof current.path === "string" ? shortenHomePath(current.path) : "<unknown>"}, not ${shortenHomePath(selected)}. Nothing was sent and no settings were saved. Rerun with the Gateway's config path, or stop the Gateway through its service owner and rerun this exact command.`);
	return async (change) => {
		const result = await requestOwner("config.patch", buildConfigOwnerPatch(change, current.hash));
		return result.restart || result.restartPending ? "The Gateway is restarting to apply it." : void 0;
	};
}
//#endregion
export { bindConfigOwner, prepareConfigOwnerChange };
