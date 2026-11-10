import { t as expandHomePrefix } from "./home-dir-CtsdYvX3.mjs";
import { f as resolveExecApprovalsSocketPath, u as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-JiuCEgOc.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { a as loadExecApprovalsReadOnlyAsync, n as ensureExecApprovalsSnapshot, t as commitExecAuthorizations } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-allowlist-CzbwiW56.mjs";
import "./exec-approvals-generated-migration-BpLpqlZz.mjs";
import { i as createExecApprovalPolicySnapshot, n as assertCurrentUsageAuthorization, r as buildAllowlistEntryMatchKey } from "./exec-approvals-authorization.kernel-CbW9-kOe.mjs";
//#region src/infra/exec-approvals-authorization.ts
async function recordAllowlistMatchesUse(params, context) {
	const input = structuredClone({
		agentId: params.agentId,
		matches: [...params.matches],
		command: params.command,
		resolvedPath: params.resolvedPath,
		authorization: params.authorization
	});
	return retainedAuthorization(input, await commitExecAuthorizations(input, params.assertCurrent, context));
}
async function commitExecAuthorizationLocked(input) {
	const params = structuredClone(input);
	return retainedAuthorization(params, await commitExecAuthorizations(params));
}
function retainedAuthorization(params, { snapshot, readCurrent }) {
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
async function resolveExecApprovalsLocked(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const file = await loadExecApprovalsReadOnlyAsync();
		const resolved = shapeResolvedExecApprovals({
			file,
			filePath,
			agentId,
			overrides,
			socket: "none"
		});
		if ((resolved.agent.security === "full" || resolved.agent.security === "deny") && resolved.agent.ask === "off" && !file.socket?.token?.trim()) return resolved;
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
