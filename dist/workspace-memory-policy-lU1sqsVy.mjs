import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as evaluateFilePolicy, o as snapshotNodeFileReadPolicy } from "./policy-B2xaSft-.mjs";
import { r as readWorkspaceMemoryRequest, t as readWorkspaceSkillsRequest } from "./workspace-skills-request-DFW433dn.mjs";
import path from "node:path";
//#region extensions/file-transfer/src/shared/workspace-memory-policy.ts
function createWorkspaceWorkerPolicy(kind) {
	return {
		commands: [`workspace.${kind}`],
		dangerous: true,
		async handle(ctx) {
			let maxReplyBytes;
			let resourceReadPolicy;
			try {
				const request = kind === "memory" ? readWorkspaceMemoryRequest(ctx.params) : readWorkspaceSkillsRequest(ctx.params);
				const workspaces = asOptionalRecord(ctx.pluginConfig?.workspaces) ?? {};
				if (!Object.values(workspaces).some((value) => {
					const binding = asOptionalRecord(value);
					return binding?.nodeId === ctx.nodeId && typeof binding.remoteRoot === "string" && path.posix.isAbsolute(binding.remoteRoot) && !binding.remoteRoot.includes("\0") && path.posix.resolve(binding.remoteRoot) === request.workspaceDir;
				})) throw new Error("Node workspace is not configured");
				if (kind === "skills" && ["readResources", "discovery"].includes(String(asOptionalRecord(ctx.params)?.operation))) resourceReadPolicy = snapshotNodeFileReadPolicy({
					nodeId: ctx.nodeId,
					nodeDisplayName: ctx.node?.displayName,
					pluginConfig: ctx.pluginConfig
				});
				for (const access of request.paths) {
					const decision = evaluateFilePolicy({
						...access,
						nodeId: ctx.nodeId,
						nodeDisplayName: ctx.node?.displayName,
						pluginConfig: ctx.pluginConfig
					});
					if (!decision.ok || decision.reason === "ask-always") throw new Error("Workspace worker requires an existing file grant");
					if (decision.maxBytes !== void 0) maxReplyBytes = Math.min(maxReplyBytes ?? Infinity, decision.maxBytes);
				}
			} catch (error) {
				return {
					ok: false,
					code: "POLICY_DENIED",
					message: String(error)
				};
			}
			return await ctx.invokeNode({ params: {
				...asOptionalRecord(ctx.params),
				maxReplyBytes,
				resourceReadPolicy
			} });
		}
	};
}
//#endregion
export { createWorkspaceWorkerPolicy };
