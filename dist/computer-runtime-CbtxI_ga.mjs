import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-B-X-HqBc.mjs";
import { lt as WorkerComputerParamsSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { n as projectEffectiveExecPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { t as createCoreCodingTools } from "./core-coding-tools-B4ma0cx9.mjs";
import { t as createComputerTool } from "./computer-tool-Ca8TCpJq.mjs";
import { execFile } from "node:child_process";
import { Value } from "typebox/value";
//#region src/worker/worker-placement-tools.ts
const WORKER_TOOL_CONFIG = { plugins: { enabled: false } };
/** Gateway definition preparation and placement execution use the same constructors. */
function createWorkerPlacementTools(params) {
	const execUnavailable = params.execAuthority === void 0 || params.execAuthority.host === "sandbox" || params.execAuthority.host === "node";
	const execAuthority = params.execAuthority ?? {
		host: "gateway",
		security: "deny",
		ask: "off"
	};
	const policy = projectEffectiveExecPolicy({
		base: execAuthority,
		overrides: execAuthority,
		permissionPolicy: params.permissionMode ? { mode: params.permissionMode } : void 0
	});
	return createCoreCodingTools({
		...params.policy,
		skillsSnapshot: params.skillsSnapshot,
		codingRoot: params.cwd,
		containmentRoot: params.containmentRoot,
		includeBaseCodingTools: true,
		shellTools: execUnavailable ? "patch-only" : "full",
		execDefaults: {
			...policy,
			safeBins: execAuthority.safeBins ?? [],
			node: execAuthority.host === "node" ? execAuthority.node : void 0,
			nonInteractiveApproval: Boolean(params.permissionMode && params.permissionMode !== "full"),
			approvalFollowupText: params.permissionMode ? `Exec denied (approval_required) in worker ${params.permissionMode} permission mode. Run this command locally for interactive approval, or ask an administrator to clear the session permission mode.` : void 0,
			config: WORKER_TOOL_CONFIG,
			preparedStoreEnvironment: Object.freeze({}),
			...params.github ? { preparedRunEnvironment: params.github } : {},
			commandHighlighting: false,
			agentId: params.agentId,
			allowBackground: true,
			scopeKey: params.sessionKey,
			sessionKey: params.sessionKey,
			runId: params.runId,
			notifySessionKey: params.sessionKey,
			sessionId: params.sessionId,
			eventRouting: { preserveSessionKey: false }
		},
		processDefaults: { scopeKey: params.sessionKey }
	});
}
//#endregion
//#region src/worker/browser-runtime.ts
/** Core-private adapter for the bundled Browser plugin's attached worker runtime. */
const WORKER_BROWSER_LAUNCH_TIMEOUT_MS = 3e4;
const WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES = 65536;
function createWorkerBrowserToolDefinition(descriptor) {
	return loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "runtime-api.js",
		trackedPluginId: "browser"
	}).createBrowserToolDefinition({
		sandboxBridgeUrl: descriptor.cdpUrl,
		allowHostControl: false
	}, () => ({ plugins: { enabled: false } })).metadata;
}
function runWorkerBrowserLauncher(descriptor) {
	return new Promise((resolve, reject) => {
		execFile(descriptor.launcherPath, descriptor.launcherArgs ?? [], {
			timeout: WORKER_BROWSER_LAUNCH_TIMEOUT_MS,
			maxBuffer: WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES,
			windowsHide: true,
			shell: false
		}, (error) => {
			if (error) {
				reject(new Error(`Worker Browser launcher failed: ${error.message}`, { cause: error }));
				return;
			}
			resolve();
		});
	});
}
/** Materialize the exact bundled Browser runtime; no descriptor-controlled plugin path is used. */
async function createWorkerBrowserToolRuntime(params) {
	return await (params.runtime ?? loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "runtime-api.js",
		trackedPluginId: "browser"
	})).createAttachedBrowserToolRuntime({
		cdpUrl: params.descriptor.cdpUrl,
		ensureAttachTarget: () => runWorkerBrowserLauncher(params.descriptor),
		agentSessionKey: params.sessionKey,
		agentDir: params.stateDir,
		workspaceDir: params.workspaceDir
	});
}
//#endregion
//#region src/worker/computer-runtime.ts
function createWorkerComputerTool(params) {
	let closing;
	const close = (request) => closing ??= Promise.resolve().then(() => params.requestComputer(request));
	const transport = {
		computerUse: params.descriptor.computerUse,
		resolveNode: async (query, signal) => {
			signal?.throwIfAborted();
			if (query !== void 0 && query !== params.descriptor.nodeId) throw new Error("Computer input is bound to this session's desktop.");
			return params.descriptor;
		},
		invoke: async ({ nodeId, command, commandParams, timeoutMs, idempotencyKey, signal }) => {
			signal?.throwIfAborted();
			if (nodeId !== params.descriptor.nodeId) throw new Error("Computer input is bound to this session's desktop.");
			const isClose = command === "computer.act" && commandParams.action === "__close_execution";
			if (closing && !isClose) throw new Error("Computer execution is closed.");
			const request = {
				command,
				paramsJson: JSON.stringify(commandParams),
				...timeoutMs === void 0 ? {} : { timeoutMs },
				...idempotencyKey === void 0 ? {} : { idempotencyKey }
			};
			if (!Value.Check(WorkerComputerParamsSchema, request)) throw new Error("Computer request exceeds the worker protocol limits.");
			const abort = () => {
				close({
					command: "computer.act",
					paramsJson: JSON.stringify({
						action: "__close_execution",
						executionId: commandParams.executionId,
						reason: "Worker computer invocation aborted"
					})
				}).catch(() => {});
			};
			signal?.addEventListener("abort", abort, { once: true });
			try {
				const response = await (isClose ? close(request) : params.requestComputer(request).catch((error) => {
					abort();
					throw error;
				}));
				signal?.throwIfAborted();
				if (!response.ok) throw new Error(response.error.message);
				return JSON.parse(response.payload.resultJson);
			} finally {
				signal?.removeEventListener("abort", abort);
			}
		}
	};
	return createComputerTool({
		transport,
		contextEpoch: params.contextEpoch,
		idempotencyScope: params.runId,
		registerRunCleanup: params.registerRunCleanup
	});
}
//#endregion
export { createWorkerPlacementTools as a, WORKER_TOOL_CONFIG as i, createWorkerBrowserToolDefinition as n, createWorkerBrowserToolRuntime as r, createWorkerComputerTool as t };
