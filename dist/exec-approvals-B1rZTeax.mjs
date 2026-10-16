import { t as expandHomePrefix } from "./home-dir-Dc6nN6HB.mjs";
import { h as resolveExecApprovalsSocketPath, p as resolveExecApprovalsDisplayPath } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { a as createExecApprovalPolicySnapshot, b as resolveExecApprovalsFromFileInternal, i as buildAllowlistEntryMatchKey, n as applyRecordedAllowlistUse, r as assertCurrentUsageAuthorization } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import { c as replaceExecApprovalsSnapshot, d as updateExecApprovalsSync, n as ensureExecApprovalsSnapshot, r as loadExecApprovals, t as commitExecAuthorizations } from "./exec-approvals-store-DGp2moY9.mjs";
import "./exec-approvals-allowlist-CU7bs0k0.mjs";
import "./exec-approvals-generated-migration-CnSZXIu2.mjs";
//#region src/infra/exec-approvals-authorization.ts
function recordAllowlistMatchesUse(params) {
	if (params.matches.length === 0 && !params.authorization) return;
	const snapshot = updateExecApprovalsSync({ update: (file) => applyRecordedAllowlistUse({
		...params,
		file
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
async function commitExecAuthorizationLocked(input) {
	const params = structuredClone(input);
	const { snapshot, readCurrent } = await commitExecAuthorizations(params);
	const matchKeys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	const authorization = {
		...params.authorization,
		policySnapshot: createExecApprovalPolicySnapshot({
			file: snapshot.file,
			agentId: params.agentId
		})
	};
	return () => assertCurrentUsageAuthorization({
		file: readCurrent(),
		agentId: params.agentId,
		command: params.command,
		matchKeys,
		authorization
	});
}
//#endregion
//#region src/infra/exec-approvals.ts
function redactExecApprovals(snapshot) {
	const { raw: _raw, ...rest } = snapshot;
	const socketPath = snapshot.file.socket?.path?.trim();
	return {
		...rest,
		file: {
			...snapshot.file,
			socket: socketPath ? { path: socketPath } : void 0
		}
	};
}
function shapeResolvedExecApprovals(params) {
	const defaultSocketPath = resolveExecApprovalsSocketPath();
	return resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId,
		overrides: params.overrides,
		path: params.filePath,
		socketPath: params.socket === "persisted" ? expandHomePrefix(params.file.socket?.path ?? defaultSocketPath) : defaultSocketPath,
		token: params.socket === "persisted" ? params.file.socket?.token ?? "" : ""
	});
}
function resolveExecApprovalsWithoutSocket(params) {
	const resolved = shapeResolvedExecApprovals({
		...params,
		socket: "none"
	});
	return (resolved.agent.security === "full" || resolved.agent.security === "deny") && resolved.agent.ask === "off" && !params.file.socket?.token?.trim() ? resolved : null;
}
async function resolveExecApprovalsLocked(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: (await ensureExecApprovalsSnapshot()).file,
		filePath: resolveExecApprovalsDisplayPath(),
		agentId,
		overrides,
		socket: "persisted"
	});
}
//#endregion
export { recordAllowlistMatchesUse as i, resolveExecApprovalsLocked as n, commitExecAuthorizationLocked as r, redactExecApprovals as t };
