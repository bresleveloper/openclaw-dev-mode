import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { n as defaultRuntime, r as writeRuntimeJson } from "./runtime-B4lgFmsS.js";
import "./agent-scope-CDZXADgT.js";
import { t as DEFAULT_AGENT_ID, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir, t as listAgentEntries } from "./agent-scope-config-C3ijpoNo.js";
import { r as replaceConfigFile } from "./config-A41fTHlt.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-CcqJJIan.js";
import { c as callGateway, g as isGatewayTransportError, m as isGatewayCredentialsRequiredError } from "./call-Du-jF5Kg.js";
import { u as resolveSessionTranscriptsDirForAgent } from "./paths-CHZBIGhF.js";
import "./message-channel-B4LS2Kcc.js";
import { b as shouldRemoveWorkspaceAttestation, v as resolveWorkspaceAttestationPaths } from "./workspace-DP5mE--D.js";
import { t as purgeAgentSessionStoreEntries } from "./sessions-gBZPP61K.js";
import { t as createClackPrompter } from "./clack-prompter-BMCFcrvj.js";
import { r as logConfigUpdated } from "./logging-CFK-HBYM.js";
import { s as moveToTrash } from "./onboard-helpers-CQYnos_0.js";
import { r as requireValidConfigFileSnapshot, t as createQuietRuntime } from "./agents.command-shared-QRcGLACK.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-tI856xRH.js";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-By5w_bgr.js";
//#region src/commands/agents.commands.delete.ts
async function maybeDeleteAgentThroughGateway(params) {
	try {
		return await callGateway({
			method: "agents.delete",
			params: {
				agentId: params.agentId,
				deleteFiles: params.deleteFiles
			},
			mode: GATEWAY_CLIENT_MODES.CLI,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			requiredMethods: ["agents.delete"]
		});
	} catch (error) {
		if (isGatewayTransportError(error) || isGatewayCredentialsRequiredError(error)) return null;
		throw error;
	}
}
/** Delete an agent, pruning config plus workspace/session state when it is safe to do so. */
async function agentsDeleteCommand(opts, runtime = defaultRuntime) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const baseHash = configSnapshot.hash;
	const input = opts.id?.trim();
	if (!input) {
		runtime.error(`Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`);
		runtime.exit(1);
		return;
	}
	const agentId = normalizeAgentId(input);
	if (agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
	if (agentId === "main") {
		runtime.error(`"${DEFAULT_AGENT_ID}" cannot be deleted.`);
		runtime.exit(1);
		return;
	}
	if (findAgentEntryIndex(listAgentEntries(cfg), agentId) < 0) {
		runtime.error(`Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		runtime.exit(1);
		return;
	}
	if (!opts.force) {
		if (!process.stdin.isTTY) {
			runtime.error("Non-interactive session. Re-run with --force.");
			runtime.exit(1);
			return;
		}
		if (!await createClackPrompter().confirm({
			message: `Delete agent "${agentId}" and prune workspace/state?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const agentDir = resolveAgentDir(cfg, agentId);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
	const result = pruneAgentConfig(cfg, agentId);
	const gatewayResult = await maybeDeleteAgentThroughGateway({
		agentId,
		deleteFiles: true
	});
	if (gatewayResult) {
		const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
		const workspaceRetained = workspaceSharedWith.length > 0;
		if (opts.json) writeRuntimeJson(runtime, {
			agentId,
			workspace: workspaceDir,
			workspaceRetained: workspaceRetained || void 0,
			workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
			workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
			agentDir,
			sessionsDir,
			removedBindings: gatewayResult.removedBindings,
			removedAllow: result.removedAllow,
			transport: "gateway"
		});
		else runtime.log(`Deleted agent: ${agentId}`);
		return;
	}
	await replaceConfigFile({
		nextConfig: result.config,
		...baseHash !== void 0 ? { baseHash } : {},
		writeOptions: opts.json ? { skipOutputLogs: true } : void 0
	});
	if (!opts.json) logConfigUpdated(runtime);
	await purgeAgentSessionStoreEntries(cfg, agentId);
	const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
	const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
	const workspaceRetained = workspaceSharedWith.length > 0;
	if (workspaceRetained) quietRuntime.log(`Skipped workspace removal (shared with other agents: ${workspaceSharedWith.join(", ")}): ${workspaceDir}`);
	else {
		await moveToTrash(workspaceDir, quietRuntime);
		for (const [index, attestationPath] of resolveWorkspaceAttestationPaths(workspaceDir).entries()) if (await shouldRemoveWorkspaceAttestation(attestationPath, { trustUnknown: index === 0 })) await moveToTrash(attestationPath, quietRuntime);
	}
	await moveToTrash(agentDir, quietRuntime);
	await moveToTrash(sessionsDir, quietRuntime);
	if (opts.json) writeRuntimeJson(runtime, {
		agentId,
		workspace: workspaceDir,
		workspaceRetained: workspaceRetained || void 0,
		workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
		workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
		agentDir,
		sessionsDir,
		removedBindings: result.removedBindings,
		removedAllow: result.removedAllow
	});
	else runtime.log(`Deleted agent: ${agentId}`);
}
//#endregion
export { agentsDeleteCommand };
