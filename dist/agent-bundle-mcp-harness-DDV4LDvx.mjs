import { a as getAdvertisedScopedMcpCatalog, d as retireSessionMcpRuntime, n as acquireSessionMcpRuntime, t as acquireRequesterScopedMcpRuntime, u as rememberAdvertisedScopedMcpCatalog } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { n as mergeMcpConnectCatalog } from "./agent-bundle-mcp-requester-connect-6RTPH5wa.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode, r as requiresMcpCodexToolApproval, t as formatMcpCodexApprovalRemedy } from "./mcp-codex-tool-approval-u1CcvKx0.mjs";
import { a as setPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { r as materializeBundleMcpToolsForRun, t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-Cvwg99KJ.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DOxCMP7W.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
//#region src/agents/agent-bundle-mcp-harness.ts
function formatConfiguredMcpDiagnosticNotice(messages, runLabel) {
	const bounded = [...new Set(messages)].map((message) => message.replaceAll(/\s+/g, " ").trim().slice(0, 180)).filter(Boolean).slice(0, 4);
	if (bounded.length === 0) return;
	return `Configured MCP is incomplete for ${runLabel}: ${bounded.join("; ")}. Do not claim MCP-backed work succeeded; report this blocker to the operator.`;
}
function applyConfiguredMcpApproval(tools, options) {
	return tools.flatMap((tool) => {
		const mcp = getPluginToolMeta(tool)?.mcp;
		if (mcp?.operation !== "tool" || mcp.oauthConnectBootstrap === true) return [tool];
		const mode = resolveProjectedMcpCodexToolApprovalMode(mcp.serverName, {}, options.projectedMcpServers?.[mcp.serverName], mcp.toolName) ?? mcp.codexApproval?.mode;
		if (!requiresMcpCodexToolApproval({
			...mcp.codexApproval,
			mode,
			fullPermission: options.fullPermission
		})) return [tool];
		const approvalMode = mode === "prompt" ? "prompt" : "auto";
		const requestApproval = options.requestApproval;
		if (!requestApproval) {
			options.onOmitted?.(`${mcp.serverName}/${mcp.toolName}: requires interactive Codex approval (${approvalMode}); ${formatMcpCodexApprovalRemedy(mcp.serverName)}`);
			return [];
		}
		const meta = getPluginToolMeta(tool);
		const execute = tool.execute;
		const guarded = {
			...tool,
			execute: async (toolCallId, params, signal, onUpdate) => {
				let active = true;
				try {
					await requestApproval({
						signal,
						safeToolName: tool.name,
						toolCallId,
						serverName: mcp.serverName,
						toolName: mcp.toolName,
						mode: approvalMode,
						isActive: () => active
					});
					return await execute(toolCallId, params, signal, onUpdate);
				} finally {
					active = false;
				}
			}
		};
		setPluginToolMeta(guarded, meta);
		return [guarded];
	});
}
function notConnectedToolResult(serverName, toolName) {
	const message = `Requester has not connected MCP server "${serverName}" (tool "${toolName}") for this turn.`;
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status: "error",
			error: message,
			mcpServer: serverName,
			mcpTool: toolName
		}
	};
}
function resolveHarnessCapabilityProfile(params) {
	return params.conversationCapabilityProfile ?? (params.policyContext ? resolveConversationCapabilityProfile({
		...params.policyContext,
		runtimeToolAllowlist: params.toolsAllow
	}) : void 0);
}
function applyHarnessToolPolicy(tools, params) {
	if (tools.length === 0) return tools;
	const allowed = applyEmbeddedAttemptToolsAllow(tools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
	const profile = params.conversationCapabilityProfile;
	if (!profile) return allowed;
	return applyFinalEffectiveToolPolicy({
		bundledTools: allowed,
		config: params.policyContext?.config ?? params.cfg,
		conversationCapabilityProfile: profile,
		warn: params.warn ?? (() => void 0),
		onFilter: params.onFilter
	});
}
function buildCatalogTools(catalog, params, requesterConnect) {
	return buildBundleMcpToolsFromCatalog({
		catalog,
		reservedToolNames: params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0,
		createExecute: (tool) => {
			return requesterConnect?.createExecute(tool.serverName) ?? (async () => notConnectedToolResult(tool.serverName, tool.toolName));
		}
	});
}
/**
* Materialize static configured MCP for a Codex harness turn.
* No requester identity is accepted here, so requester resolvers stay unreachable.
*/
async function materializeStaticMcpToolsForHarnessRunCore(params) {
	const conversationCapabilityProfile = resolveHarnessCapabilityProfile(params);
	const acquisition = await acquireSessionMcpRuntime({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides,
		toolDenylist: conversationCapabilityProfile?.policy.explicitToolDenylist
	});
	const retireSnapshotRuntime = params.retireSessionRuntimeAfterDispose ? async () => {
		await retireSessionMcpRuntime({
			sessionId: params.sessionId,
			reason: "scheduled-authority-snapshot-complete"
		});
	} : void 0;
	let liveRuntime;
	try {
		liveRuntime = await materializeBundleMcpToolsForRun({
			...acquisition,
			agentId: params.agentId,
			reservedToolNames: params.reservedToolNames,
			...retireSnapshotRuntime ? { disposeRuntime: retireSnapshotRuntime } : {}
		});
	} catch (error) {
		await retireSnapshotRuntime?.();
		throw error;
	}
	try {
		const omissions = [];
		const policyParams = {
			...params,
			conversationCapabilityProfile,
			onFilter: (event) => {
				const omittedCount = event.before.length - event.after.length;
				if (omittedCount > 0) omissions.push(`${event.step.label}: ${omittedCount} configured MCP tool(s) omitted by policy`);
			}
		};
		const fullPermission = params.autoApproveCodexAppServerApprovals === true;
		const policyTools = applyHarnessToolPolicy(liveRuntime.tools, policyParams);
		const projectedApproval = params.projectedMcpServers ? { projectedMcpServers: params.projectedMcpServers } : {};
		const allowed = applyConfiguredMcpApproval(policyTools, {
			fullPermission,
			...projectedApproval,
			...params.requestInteractiveCodexApproval ? { requestApproval: params.requestInteractiveCodexApproval } : {},
			onOmitted: (message) => omissions.push(message)
		});
		liveRuntime.restrictAppTools?.(applyConfiguredMcpApproval(applyHarnessToolPolicy(liveRuntime.appTools ?? liveRuntime.tools, policyParams), {
			fullPermission,
			...projectedApproval,
			...params.requestInteractiveCodexApproval ? {} : { onOmitted: (message) => omissions.push(message) }
		}));
		const diagnosticNotice = formatConfiguredMcpDiagnosticNotice([...(liveRuntime.diagnostics ?? []).map((diagnostic) => `${diagnostic.serverName}: ${diagnostic.message}`), ...omissions], params.requestInteractiveCodexApproval ? "this run" : "this scheduled run");
		let disposed = false;
		return {
			tools: allowed,
			...diagnosticNotice ? { diagnosticNotice } : {},
			dispose: async () => {
				if (disposed) return;
				disposed = true;
				await liveRuntime.dispose();
			}
		};
	} catch (error) {
		await liveRuntime.dispose();
		throw error;
	}
}
/**
* Materialize requester-scoped MCP tools for a harness run (e.g. Codex dynamic tools).
* Updates the session advertised-catalog cache when a requester resolves a catalog.
* Before any requester resolves in the session, returns undefined (nothing to advertise).
*/
async function materializeRequesterScopedMcpToolsForHarnessRunCore(params) {
	const policyParams = {
		...params,
		conversationCapabilityProfile: resolveHarnessCapabilityProfile(params)
	};
	const scopedRuntimeHandle = await acquireRequesterScopedMcpRuntime({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides,
		requesterSenderId: params.requesterSenderId,
		agentAccountId: params.agentAccountId,
		messageChannel: params.messageChannel,
		toolDenylist: policyParams.conversationCapabilityProfile?.policy.explicitToolDenylist
	});
	const scopedRuntime = scopedRuntimeHandle?.runtime;
	let liveRuntime;
	let liveCatalog;
	try {
		if (scopedRuntime) {
			liveRuntime = await materializeBundleMcpToolsForRun({
				runtime: scopedRuntime,
				releaseLease: scopedRuntimeHandle?.releaseLease,
				agentId: params.agentId,
				reservedToolNames: params.reservedToolNames
			});
			liveCatalog = scopedRuntime.peekCatalog() ?? await scopedRuntime.getCatalog();
			if (liveCatalog.tools.length > 0 && scopedRuntimeHandle) rememberAdvertisedScopedMcpCatalog(scopedRuntimeHandle, liveCatalog);
		}
		const advertisedCatalog = getAdvertisedScopedMcpCatalog(params.sessionId) ?? (liveCatalog ? mergeMcpConnectCatalog(liveCatalog, scopedRuntime?.requesterConnect) : void 0);
		if (!advertisedCatalog || advertisedCatalog.tools.length === 0) {
			await liveRuntime?.dispose();
			return;
		}
		const reservedToolNames = params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0;
		const advertisedTools = buildCatalogTools(advertisedCatalog, {
			...params,
			reservedToolNames
		}, scopedRuntime?.requesterConnect);
		const liveByName = new Map((liveRuntime?.tools ?? []).map((tool) => [tool.name, tool]));
		const filteredTools = applyHarnessToolPolicy(advertisedTools.map((tool) => liveByName.get(tool.name) ?? tool), policyParams);
		const filteredAdvertised = applyHarnessToolPolicy(advertisedTools, policyParams);
		const executableTools = params.requestInteractiveCodexApproval ? applyConfiguredMcpApproval(filteredTools, {
			fullPermission: params.autoApproveCodexAppServerApprovals === true,
			requestApproval: params.requestInteractiveCodexApproval
		}) : filteredTools;
		let disposed = false;
		return {
			tools: executableTools,
			advertisedTools: filteredAdvertised,
			dispose: async () => {
				if (disposed) return;
				disposed = true;
				await liveRuntime?.dispose();
			}
		};
	} catch (error) {
		await liveRuntime?.dispose();
		throw error;
	}
}
//#endregion
export { materializeRequesterScopedMcpToolsForHarnessRunCore, materializeStaticMcpToolsForHarnessRunCore };
