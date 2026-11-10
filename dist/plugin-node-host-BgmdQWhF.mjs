import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as resolveExecModePolicy } from "./exec-approvals-core-7oJu_fRe.mjs";
import { a as requiresExecApproval } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-CTi1mi_7.mjs";
import "./config-B3oiWDlr.mjs";
import { g as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DZGyt5jE.mjs";
import { t as logDebug } from "./logger-DHVmYOKs.mjs";
import { n as DEFAULT_SECURITY } from "./exec-approvals-config-JiuCEgOc.mjs";
import { o as prepareExecApprovalsCurrentRead } from "./exec-approvals-store-BhzM_h1C.mjs";
import { i as createExecApprovalPolicySnapshot, n as assertCurrentUsageAuthorization } from "./exec-approvals-authorization.kernel-CbW9-kOe.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { t as throwNodeHostCleanupErrors } from "./cleanup-errors-eP-PTE_D.mjs";
//#region src/node-host/exec-policy.ts
/** One config owner for system.run and plugin-hosted execution. */
function resolveNodeExecConfigPolicy(params) {
	const agentExec = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.tools?.exec : void 0;
	const globalExec = params.cfg.tools?.exec;
	const layered = applyExecPolicyLayer(applyExecPolicyLayer({
		security: DEFAULT_SECURITY,
		ask: "off"
	}, globalExec), agentExec);
	return {
		agentExec,
		globalExec,
		...resolveExecModePolicy(layered)
	};
}
function resolveExecApprovalDecision(value) {
	if (value === "allow-once" || value === "allow-always") return value;
	return null;
}
function evaluateSystemRunPolicy(params) {
	const shellWrapperBlocked = params.security === "allowlist" && params.shellWrapperInvocation && params.isWindows && params.cmdInvocation;
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
		errorMessage: shellWrapperBlocked ? "SYSTEM_RUN_DENIED: allowlist miss (Windows shell wrappers like cmd.exe /c require approval; approve once/always or run with --ask on-miss|always)" : "SYSTEM_RUN_DENIED: allowlist miss",
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
		cfg: readRuntimeConfig(),
		agentId
	});
	const policy = resolvePolicy();
	const readCurrent = params.readCurrent;
	const approvals = readCurrent();
	const policySnapshot = createExecApprovalPolicySnapshot({
		file: approvals,
		agentId
	});
	const assertCurrent = () => {
		params.assertActive();
		const current = resolvePolicy();
		if (current.security === "deny" || current.security !== policy.security || current.ask !== policy.ask || current.autoReview !== policy.autoReview || params.source === "session-full" && (current.security !== "full" || current.ask !== "off")) throw new Error("SYSTEM_RUN_DENIED: node-local exec policy does not authorize this launch");
		assertCurrentUsageAuthorization({
			file: readCurrent(),
			agentId,
			command: params.command,
			matchKeys: /* @__PURE__ */ new Set(),
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
	let cleanups = [];
	let stopped = false;
	let stopping;
	withPluginRuntimeRegistryScope(registry, () => {
		for (const entry of registry?.nodeHostCommands ?? []) {
			if (commandAllowlist && !commandAllowlist.has(entry.command.command)) continue;
			const cleanup = entry.command.watchAvailability?.(context, () => {
				if (!stopped) withPluginRuntimeRegistryScope(registry, onChange);
			});
			if (cleanup) cleanups.push(cleanup);
		}
	});
	return () => {
		stopped = true;
		return stopping ??= Promise.resolve().then(async () => {
			const results = await Promise.allSettled(cleanups.map(async (cleanup) => withPluginRuntimeRegistryScope(registry, () => cleanup())));
			cleanups = cleanups.filter((_cleanup, index) => results[index]?.status === "rejected");
			const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			throwNodeHostCleanupErrors(failures, "node-host watcher cleanup failed");
		}).catch((error) => {
			stopping = void 0;
			throw error;
		});
	};
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
function buildNodePluginToolDescriptor(entry) {
	const agentTool = entry.command.agentTool;
	if (!agentTool) return null;
	const name = normalizeOptionalString(agentTool.name) ?? "";
	const description = normalizeOptionalString(agentTool.description) ?? "";
	if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(name) || !description) return null;
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
	try {
		const readCurrent = context ? await prepareExecApprovalsCurrentRead(captureOpenClawStateWorkerContext()).catch((error) => () => {
			throw error;
		}) : void 0;
		const invokeContext = context && readCurrent ? {
			...context,
			prepareExecAuthorization: (source) => preparePluginExecAuthorization({
				source,
				command,
				sessionKey: context.sessionKey,
				assertActive,
				readCurrent
			})
		} : void 0;
		return await withPluginRuntimeRegistryScope(registry, async () => {
			if (context) assertActive();
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
