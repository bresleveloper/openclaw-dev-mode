import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Set()
}));
/** CLI cleanup can skip loading native database owners when no Worker was admitted. */
function hasOpenClawAgentDatabaseAsyncResources() {
	return resources.active.size > 0 || resources.closing.size > 0;
}
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
function matchesAgentDatabaseClose(selection, resource) {
	return (selection.path === void 0 || selection.path === resource.path || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.path)) && (selection.rootPath === void 0 || isPathInside(selection.rootPath, resource.path) || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.rootPath)) && (selection.agentId === void 0 || resource.ownership === "unresolved" || selection.agentId === resource.agentId);
}
/** Register before admitting a Worker; revocation is synchronous, native drainage is joined. */
function registerOpenClawAgentDatabaseAsyncResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId)
	});
}
/** Native readers close synchronously, so successful retirement leaves no asynchronous barrier. */
function registerOpenClawAgentDatabaseSyncResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId),
		close: async () => resource.close(),
		closeSync: resource.close
	});
}
/** Retain discovery until the known owner is registered, then release this candidate. */
function registerOpenClawAgentDatabaseReadCandidateResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "unresolved"
	});
}
function registerAgentDatabaseResource(resource) {
	const owned = {
		...resource,
		path: path.resolve(resource.path)
	};
	if ([...resources.selections].some((selection) => matchesAgentDatabaseClose(selection, owned)) || [...resources.closing.keys()].some((closing) => (closing.path === owned.path || closing.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(closing, owned.path) || owned.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(owned, closing.path)) && (closing.ownership === "unresolved" || owned.ownership === "unresolved" || closing.agentId === owned.agentId))) throw new Error(`Agent database resources are closing: ${owned.path}`);
	const unregister = () => resources.active.delete(owned);
	getOpenClawDatabaseMaintenanceScope()?.own(unregister, "agent-resources", () => closeAgentDatabaseResource(owned));
	resources.active.add(owned);
	return unregister;
}
function closeAgentDatabaseResource(resource, onCloseError) {
	if (resource.ownership === "known" && resource.closeSync) {
		resources.closing.set(resource, void 0);
		try {
			resource.revoke();
			resource.closeSync();
			resources.active.delete(resource);
			resources.closing.delete(resource);
			return Promise.resolve();
		} catch (error) {
			if (onCloseError) onCloseError(resource.path, error);
			const failed = Promise.reject(toErrorObject(error, "Agent database cleanup failed"));
			failed.catch(() => {});
			return failed;
		}
	}
	let operation = resources.closing.get(resource);
	if (!operation) {
		operation = Promise.resolve().then(() => resource.close());
		resources.closing.set(resource, operation);
		operation.then(() => {
			resources.active.delete(resource);
			resources.closing.delete(resource);
		}, () => {
			resources.closing.set(resource, void 0);
		}).catch(() => {});
	}
	if (onCloseError) operation.catch((error) => onCloseError(resource.path, error)).catch(() => {});
	resource.revoke();
	return operation;
}
function revokeAgentDatabaseResources(selection, onCloseError) {
	const closing = /* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()]);
	const pending = [];
	for (const resource of closing) {
		if (!matchesAgentDatabaseClose(selection, resource)) continue;
		pending.push(closeAgentDatabaseResource(resource, onCloseError));
	}
	return pending;
}
async function drainAgentDatabaseResources(selection, closeNative) {
	resources.selections.add(selection);
	try {
		const errors = (await Promise.allSettled(revokeAgentDatabaseResources(selection))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length > 0) throw new AggregateError(errors, "Agent database resource drainage failed");
		return await closeNative();
	} finally {
		resources.selections.delete(selection);
	}
}
//#endregion
export { registerOpenClawAgentDatabaseAsyncResource as a, revokeAgentDatabaseResources as c, matchesAgentDatabaseReadCandidatePath as i, hasOpenClawAgentDatabaseAsyncResources as n, registerOpenClawAgentDatabaseReadCandidateResource as o, matchesAgentDatabaseClose as r, registerOpenClawAgentDatabaseSyncResource as s, drainAgentDatabaseResources as t };
