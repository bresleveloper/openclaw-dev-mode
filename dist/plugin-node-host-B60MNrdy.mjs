import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { d as resolveExecModePolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as logDebug } from "./logger-BHMMVs5C.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DzawlQtp.mjs";
import { n as DEFAULT_SECURITY } from "./exec-approvals-config-C7iYNiP7.mjs";
import { T as requiresExecApproval, s as createExecApprovalPolicySnapshot } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { i as loadExecApprovals } from "./exec-approvals-store-CTT-ox-I.mjs";
import { l as recordAllowlistMatchesUse } from "./exec-approvals-BgZlQ2Qp.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-L7B_Bk9D.mjs";
//#region src/node-host/exec-policy.ts
/** Evaluates node-host exec policy from security, approval, and allowlist context. */
/** One config owner for system.run and plugin-hosted execution. */
function resolveNodeExecConfigPolicy(params) {
	const agentExec = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.tools?.exec : void 0;
	const globalExec = params.cfg.tools?.exec;
	const layered = applyExecPolicyLayer(applyExecPolicyLayer({
		security: params.defaultSecurity,
		ask: params.defaultAsk
	}, globalExec), agentExec);
	return {
		agentExec,
		globalExec,
		...resolveExecModePolicy(layered)
	};
}
/** Normalizes raw approval decisions from node-host payloads. */
function resolveExecApprovalDecision(value) {
	if (value === "allow-once" || value === "allow-always") return value;
	return null;
}
function formatSystemRunAllowlistMissMessage(params) {
	if (params?.windowsShellWrapperBlocked) return "SYSTEM_RUN_DENIED: allowlist miss (Windows shell wrappers like cmd.exe /c require approval; approve once/always or run with --ask on-miss|always)";
	return "SYSTEM_RUN_DENIED: allowlist miss";
}
/** Combines exec security, allowlist analysis, and approval state into an allow/deny decision. */
function evaluateSystemRunPolicy(params) {
	const windowsShellWrapperBlocked = params.security === "allowlist" && params.shellWrapperInvocation && params.isWindows && params.cmdInvocation;
	const shellWrapperBlocked = windowsShellWrapperBlocked;
	const analysisOk = shellWrapperBlocked ? false : params.analysisOk;
	const allowlistSatisfied = shellWrapperBlocked ? false : params.allowlistSatisfied;
	const approvedByAsk = params.approvalDecision !== null || params.approved === true;
	const requiresAsk = params.security !== "deny" && requiresExecApproval({
		ask: params.ask,
		security: params.security,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied: params.durableApprovalSatisfied
	});
	const context = {
		analysisOk,
		allowlistSatisfied,
		shellWrapperBlocked,
		windowsShellWrapperBlocked,
		requiresAsk,
		approvalDecision: params.approvalDecision,
		approvedByAsk
	};
	if (params.security === "deny") return {
		allowed: false,
		eventReason: "security=deny",
		errorMessage: "SYSTEM_RUN_DISABLED: security=deny",
		...context
	};
	if (requiresAsk && !approvedByAsk) return {
		allowed: false,
		eventReason: "approval-required",
		errorMessage: "SYSTEM_RUN_DENIED: approval required",
		...context
	};
	if (params.security === "allowlist" && (!analysisOk || !allowlistSatisfied) && !approvedByAsk && !params.durableApprovalSatisfied) return {
		allowed: false,
		eventReason: "allowlist-miss",
		errorMessage: formatSystemRunAllowlistMissMessage({ windowsShellWrapperBlocked }),
		...context
	};
	return {
		allowed: true,
		...context
	};
}
//#endregion
//#region src/node-host/plugin-exec-policy.ts
/** Local policy stays on the executor; Gateway approval never overrides a local deny. */
function preparePluginExecAuthorization(params) {
	params.assertActive();
	const agentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	const resolvePolicy = () => resolveNodeExecConfigPolicy({
		cfg: getRuntimeConfig(),
		agentId,
		defaultSecurity: DEFAULT_SECURITY,
		defaultAsk: "off"
	});
	const policy = resolvePolicy();
	const approvals = loadExecApprovals();
	const policySnapshot = createExecApprovalPolicySnapshot({
		file: approvals,
		agentId
	});
	const assertCurrent = () => {
		params.assertActive();
		const current = resolvePolicy();
		if (current.security === "deny" || current.security !== policy.security || current.ask !== policy.ask || current.autoReview !== policy.autoReview || params.source === "session-full" && (current.security !== "full" || current.ask !== "off")) throw new Error("SYSTEM_RUN_DENIED: node-local exec policy does not authorize this launch");
		recordAllowlistMatchesUse({
			approvals,
			agentId,
			command: params.command,
			matches: [],
			authorization: {
				source: params.source === "human-approved" ? "explicit-approval" : "current-policy",
				security: current.security,
				ask: current.ask,
				allowlistSatisfied: false,
				policySnapshot
			}
		});
		params.assertActive();
	};
	assertCurrent();
	return assertCurrent;
}
//#endregion
//#region src/node-host/plugin-node-host.ts
/** Plugin node-host bridge for loading plugin registry commands and dispatching node capabilities. */
/**
* Plugin node-host command registry bridge.
*
* Node hosts load the active plugin registry, expose registered capabilities
* and commands, and dispatch incoming node-host commands by exact command id.
*/
const loadPluginRegistryLoaderModule = createLazyRuntimeModule(() => import("./plugins/loader.js"));
let nodeHostPluginRegistry;
function resolveNodeHostPluginRegistry() {
	return nodeHostPluginRegistry ?? getActivePluginRegistry() ?? void 0;
}
/** Ensure plugin registry data is loaded before node-host command dispatch. */
async function ensureNodeHostPluginRegistry(params) {
	const registry = (await loadPluginRegistryLoaderModule()).loadPluginRegistryHandle({
		config: params.config,
		activationSourceConfig: params.config,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		logger: params.logger
	});
	await withPluginRuntimeRegistryScope(registry, async () => {
		const prepare = new Set(registry.nodeHostCommands.filter((entry) => !params.commandAllowlist || params.commandAllowlist.has(entry.command.command)).map((entry) => entry.command.prepare));
		await Promise.all([...prepare].map(async (callback) => callback?.({
			config: params.config,
			env: params.env ?? process.env
		})));
	});
	nodeHostPluginRegistry = registry;
}
/** List registered node-host capabilities and command ids in deterministic order. */
function listRegisteredNodeHostCapsAndCommands(context, options = {}) {
	const registry = resolveNodeHostPluginRegistry();
	return withPluginRuntimeRegistryScope(registry, () => {
		const caps = /* @__PURE__ */ new Set();
		const commands = /* @__PURE__ */ new Set();
		let computerUse;
		const nodePluginTools = /* @__PURE__ */ new Map();
		for (const entry of registry?.nodeHostCommands ?? []) {
			if (options.commandAllowlist && !options.commandAllowlist.has(entry.command.command)) continue;
			if (entry.command.duplex === true && options.includeDuplex === false) continue;
			if (entry.command.isAvailable?.(context) === false) continue;
			if (entry.command.cap) caps.add(entry.command.cap);
			commands.add(entry.command.command);
			if (!options.commandAllowlist && entry.command.computerUse) computerUse = parseComputerUseCapabilityDescriptor(entry.command.computerUse(context));
			const agentTool = options.commandAllowlist ? null : buildNodePluginToolDescriptor(entry);
			if (agentTool) nodePluginTools.set(`${agentTool.pluginId}\0${agentTool.name}`, agentTool);
		}
		return {
			caps: [...caps].toSorted((left, right) => left.localeCompare(right)),
			commands: [...commands].toSorted((left, right) => left.localeCompare(right)),
			...computerUse ? { computerUse } : {},
			nodePluginTools: [...nodePluginTools.values()].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.name.localeCompare(right.name))
		};
	});
}
/** Watch plugin-owned availability inputs that can change during this process. */
function watchRegisteredNodeHostCommandAvailability(context, onChange, commandAllowlist) {
	const registry = resolveNodeHostPluginRegistry();
	const cleanups = [];
	withPluginRuntimeRegistryScope(registry, () => {
		for (const entry of registry?.nodeHostCommands ?? []) {
			if (commandAllowlist && !commandAllowlist.has(entry.command.command)) continue;
			const cleanup = entry.command.watchAvailability?.(context, () => withPluginRuntimeRegistryScope(registry, onChange));
			if (cleanup) cleanups.push(cleanup);
		}
	});
	return () => withPluginRuntimeRegistryScope(registry, () => {
		for (const cleanup of cleanups.splice(0)) cleanup();
	});
}
/** Release plugin command state before a reconnected Gateway can invoke it again. */
async function notifyRegisteredNodeHostCommandDisconnect() {
	const registry = resolveNodeHostPluginRegistry();
	const callbacks = new Set((registry?.nodeHostCommands ?? []).map((entry) => entry.command.onDisconnect).filter((callback) => callback !== void 0));
	await withPluginRuntimeRegistryScope(registry, async () => {
		const failures = (await Promise.allSettled([...callbacks].map(async (callback) => await callback()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length === 1) {
			const failure = failures[0];
			throw failure instanceof Error ? failure : new Error("node-host plugin disconnect cleanup failed", { cause: failure });
		}
		if (failures.length > 1) throw new AggregateError(failures, "node-host plugin disconnect cleanup failed");
	});
}
/** Retained command work remains owned even when its capability is unavailable. */
function hasRegisteredNodeHostCommandActiveWork() {
	const registry = resolveNodeHostPluginRegistry();
	return withPluginRuntimeRegistryScope(registry, () => {
		for (const entry of registry?.nodeHostCommands ?? []) try {
			if (entry.command.hasActiveWork?.() !== false) {
				if (!entry.command.hasActiveWork) logDebug(`node-host: ${entry.pluginId}/${entry.command.command} has no idle hook; auto-update deferred`);
				return true;
			}
		} catch (error) {
			logDebug(`node-host: plugin work state unavailable: ${String(error)}`);
			return true;
		}
		return false;
	});
}
function isProviderSafeToolName(value) {
	return /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(value);
}
function buildNodePluginToolDescriptor(entry) {
	const agentTool = entry.command.agentTool;
	if (!agentTool) return null;
	const name = normalizeOptionalString(agentTool.name) ?? "";
	const description = normalizeOptionalString(agentTool.description) ?? "";
	if (!isProviderSafeToolName(name) || !description) return null;
	const mcpServer = normalizeOptionalString(agentTool.mcp?.server) ?? "";
	const mcpTool = normalizeOptionalString(agentTool.mcp?.tool) ?? "";
	return {
		pluginId: entry.pluginId,
		name,
		description,
		parameters: asOptionalRecord(agentTool.parameters) ?? {
			type: "object",
			properties: {},
			additionalProperties: true
		},
		command: entry.command.command,
		...mcpServer && mcpTool ? { mcp: {
			server: mcpServer,
			tool: mcpTool
		} } : {}
	};
}
/** Invoke a registered node-host plugin command, or return null for unknown commands. */
async function invokeRegisteredNodeHostCommand(command, paramsJSON, io, context) {
	const registry = resolveNodeHostPluginRegistry();
	const match = (registry?.nodeHostCommands ?? []).find((entry) => entry.command.command === command);
	if (!match) return null;
	let active = true;
	const registeredCommand = match.command;
	const pluginRecord = registry?.plugins.find((record) => record.id === match.pluginId);
	const assertActive = () => {
		if (!active || match.command !== registeredCommand || io?.signal.aborted || context?.signal?.aborted || resolveNodeHostPluginRegistry() !== registry || !registry?.nodeHostCommands.includes(match) || !pluginRecord || !registry.plugins.includes(pluginRecord) || !pluginRecord.enabled || pluginRecord.status !== "loaded") throw new Error("node plugin invocation authority is closed");
	};
	const invokeContext = context ? {
		...context,
		prepareExecAuthorization: (source) => preparePluginExecAuthorization({
			source,
			command,
			sessionKey: context.sessionKey,
			assertActive
		})
	} : void 0;
	try {
		return await withPluginRuntimeRegistryScope(registry, async () => {
			if (match.command.duplex === true || match.command.duplex === "optional") {
				if (match.command.duplex === true && !io) throw new Error(`node command requires duplex transport: ${command}`);
				return invokeContext ? await match.command.handle(paramsJSON, io, invokeContext) : await match.command.handle(paramsJSON, io);
			}
			return invokeContext ? await match.command.handle(paramsJSON, void 0, invokeContext) : await match.command.handle(paramsJSON);
		});
	} finally {
		active = false;
	}
}
function isRegisteredNodeHostCommandDuplex(command) {
	const duplex = (resolveNodeHostPluginRegistry()?.nodeHostCommands ?? []).find((entry) => entry.command.command === command)?.command.duplex;
	return duplex === true || duplex === "optional";
}
function resetNodeHostPluginRegistry() {
	nodeHostPluginRegistry = void 0;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.nodeHostPluginTestApi")] = {
	getNodeHostPluginRegistry: () => nodeHostPluginRegistry,
	resetNodeHostPluginRegistry
};
//#endregion
export { listRegisteredNodeHostCapsAndCommands as a, evaluateSystemRunPolicy as c, isRegisteredNodeHostCommandDuplex as i, resolveExecApprovalDecision as l, hasRegisteredNodeHostCommandActiveWork as n, notifyRegisteredNodeHostCommandDisconnect as o, invokeRegisteredNodeHostCommand as r, watchRegisteredNodeHostCommandAvailability as s, ensureNodeHostPluginRegistry as t, resolveNodeExecConfigPolicy as u };
