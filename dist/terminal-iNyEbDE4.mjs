import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DGIwWbpu.mjs";
import "./errors-O33D01XW.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { Fm as validateTerminalInputParams, Im as validateTerminalOpenParams, Lm as validateTerminalResizeParams, Nm as validateTerminalAttachParams, Pm as validateTerminalCloseParams, Rm as validateTerminalUploadParams, zm as validateTerminalUploadResult } from "./src-l2dWvEsN.mjs";
import { h as NODE_TERMINAL_UPLOAD_COMMAND, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS } from "./node-commands-BLhGKTZa.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { i as isCanonicalTerminalUploadBase64 } from "./terminal-constants-6rIiJ0m_.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-BH2MRg79.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-BX-eWQU_.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-DgjgVMrc.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as BoundedBuffer } from "./bounded-buffer-R7mwXp10.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-CiD3hHDt.mjs";
import { n as resolveSessionCatalogProvider } from "./session-catalog-N5p2Px6m.mjs";
import { r as resolveTerminalSpawnPlan, t as buildTerminalEnv } from "./launch-BFczhCC2.mjs";
import { n as surrogateSafeTail } from "./output-ring-JEXRz5AY.mjs";
//#region src/gateway/terminal/node-relay.ts
const DATA_INPUT_CHUNK_BYTES = 2048;
const MAX_PENDING_DATA_CHARS = 524288;
function parseExit(result) {
	if (!result.ok) return { error: `${result.error?.code ?? "NODE_INVOKE_FAILED"}: ${result.error?.message ?? "node terminal invoke failed"}` };
	try {
		const raw = result.payloadJSON ?? (result.payload === void 0 ? void 0 : JSON.stringify(result.payload));
		if (!raw) return { exitCode: 0 };
		const value = JSON.parse(raw);
		if (!value || typeof value !== "object" || Array.isArray(value)) return { exitCode: 0 };
		const record = value;
		return {
			...typeof record.exitCode === "number" ? { exitCode: record.exitCode } : {},
			...typeof record.signal === "number" ? { signal: record.signal } : {}
		};
	} catch {
		return { error: "node terminal returned an invalid exit result" };
	}
}
async function createNodeRelayBackend(params) {
	const dispatchReady = createDeferredCore();
	let dataCallback;
	let exitCallback;
	const pendingData = new BoundedBuffer(MAX_PENDING_DATA_CHARS, {
		mode: "drop-oldest",
		fit: surrogateSafeTail
	}, (chunk) => chunk.length);
	let pendingExit;
	const abort = new AbortController();
	const result = params.registry.invoke({
		nodeId: params.nodeId,
		expectedConnId: params.expectedConnId,
		...params.expectedPairingGeneration ? { expectedPairingGeneration: params.expectedPairingGeneration } : {},
		isDispatchAuthorized: params.isDispatchAuthorized,
		command: params.command,
		params: params.params,
		timeoutMs: 0,
		idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
		signal: abort.signal,
		onDispatchReady: dispatchReady.resolve,
		onProgress: (chunk) => {
			if (!chunk) return;
			if (dataCallback) dataCallback(chunk);
			else pendingData.push(chunk);
		}
	}).then(parseExit).catch((error) => ({ error: error instanceof Error ? error.message : String(error) })).then((exit) => {
		if (exitCallback) exitCallback(exit);
		else pendingExit = exit;
		return exit;
	});
	const activeInvokeId = await Promise.race([dispatchReady.promise, result.then((exit) => {
		throw new Error(exit.error ?? "failed to start node terminal invoke");
	})]);
	const send = (payload) => params.registry.sendInvokeInput(activeInvokeId, payload);
	return {
		write(data) {
			for (let offset = 0; offset < data.length;) {
				const head = data.slice(offset, offset + DATA_INPUT_CHUNK_BYTES);
				const chunk = head.slice(0, truncateUtf8Prefix(head, DATA_INPUT_CHUNK_BYTES).length);
				send({
					kind: "data",
					data: chunk
				});
				offset += chunk.length;
			}
		},
		resize(cols, rows) {
			send({
				kind: "resize",
				cols,
				rows
			});
		},
		pause() {},
		resume() {},
		kill() {
			abort.abort();
		},
		onData(callback) {
			dataCallback = callback;
			for (const chunk of pendingData.drain()) callback(chunk);
		},
		onExit(callback) {
			exitCallback = callback;
			if (pendingExit) {
				const exit = pendingExit;
				pendingExit = void 0;
				callback(exit);
			}
		}
	};
}
//#endregion
//#region src/gateway/terminal/open-deadline.ts
const TERMINAL_OPEN_DEADLINE_MS = 3e4;
var TerminalOpenDeadlineError = class extends Error {
	constructor() {
		super("terminal open timed out");
		this.name = "TerminalOpenDeadlineError";
	}
};
function createTerminalOpenDeadline() {
	return {
		expiresAtMs: Date.now() + TERMINAL_OPEN_DEADLINE_MS,
		controller: new AbortController()
	};
}
function expireTerminalOpenDeadline(deadline) {
	if (!deadline.controller.signal.aborted) deadline.controller.abort(new TerminalOpenDeadlineError());
	return toErrorObject(deadline.controller.signal.reason, "Terminal open timed out");
}
async function waitForTerminalOpenDeadline(run, deadline) {
	if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) throw expireTerminalOpenDeadline(deadline);
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			reject(expireTerminalOpenDeadline(deadline));
		};
		const timer = setTimeout(() => expireTerminalOpenDeadline(deadline), Math.max(0, deadline.expiresAtMs - Date.now()));
		deadline.controller.signal.addEventListener("abort", onAbort, { once: true });
		const settle = (complete) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			complete();
		};
		let promise;
		try {
			promise = run();
		} catch (error) {
			settle(() => reject(toErrorObject(error, "Terminal open failed")));
			return;
		}
		promise.then((value) => settle(() => resolve(value)), (error) => settle(() => reject(toErrorObject(error, "Terminal open failed"))));
	});
}
//#endregion
//#region src/gateway/server-methods/terminal-open-plan.ts
function authorizeTerminalNodeCommand(context, nodeId, command) {
	const node = context.nodeRegistry.get(nodeId);
	if (!node) return {
		ok: false,
		message: "terminal node is not connected"
	};
	if (!node.commands.includes(command)) return {
		ok: false,
		message: "terminal node command is not available"
	};
	const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
		...node,
		approvedCommands: node.commands
	});
	const allowed = isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	});
	return allowed.ok ? {
		ok: true,
		node
	} : {
		ok: false,
		message: allowed.reason
	};
}
function resolveTerminalOpenSpawnPlan(launchPlan, catalogPlan) {
	if (!catalogPlan) return resolveTerminalSpawnPlan(launchPlan);
	if (catalogPlan.kind === "local") return resolveTerminalSpawnPlan({
		...launchPlan,
		initialCommand: catalogPlan.argv,
		cwdOverride: catalogPlan.cwd
	});
	return {
		agentId: launchPlan.agentId,
		cwd: catalogPlan.cwd ?? launchPlan.cwd,
		shell: catalogPlan.title ?? catalogPlan.command,
		args: []
	};
}
//#endregion
//#region src/gateway/server-methods/terminal-upload.ts
function invalid$1(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
const terminalUploadHandlers = { "terminal.upload": async (opts) => {
	const { params, respond, context } = opts;
	if (!assertValidParams(params, validateTerminalUploadParams, "terminal.upload", respond)) return;
	const connId = opts.client?.connId;
	if (!connId) {
		invalid$1(respond, "terminal requires an authenticated connection");
		return;
	}
	if (!isCanonicalTerminalUploadBase64(params.contentBase64)) {
		invalid$1(respond, "invalid terminal.upload base64 content");
		return;
	}
	if (!context.terminalSessions || !context.isTerminalEnabled()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
		return;
	}
	try {
		const result = await context.terminalSessions.upload(connId, params.sessionId, {
			name: params.name,
			contentBase64: params.contentBase64,
			assertCommitAllowed: captureGatewayClientUploadCommitGuard({
				method: "terminal.upload",
				requestParams: params,
				client: opts.client,
				context
			})
		});
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${params.sessionId}"`));
			return;
		}
		respond(true, {
			path: result.path,
			size: result.size,
			...result.uploadPathStyle && hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_UPLOAD_PATH_STYLE) ? { uploadPathStyle: result.uploadPathStyle } : {}
		});
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) {
			respond(false, void 0, error.error);
			return;
		}
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "terminal upload failed"));
	}
} };
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
	const connId = opts.client?.connId;
	if (!connId) {
		invalid(opts.respond, "terminal requires an authenticated connection");
		return null;
	}
	return connId;
}
function terminalFailureMessage(message, hint) {
	return hint ? `${message}; ${hint}` : message;
}
function respondTerminalUnavailable(respond, message, hint) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage(message, hint)));
}
async function stageNodeTerminalUpload(context, nodeId, file) {
	file.assertCommitAllowed?.();
	const access = authorizeTerminalNodeCommand(context, nodeId, NODE_TERMINAL_UPLOAD_COMMAND);
	if (!access.ok) throw new Error(access.message);
	const result = await context.nodeRegistry.invoke({
		nodeId,
		expectedConnId: access.node.connId,
		...access.node.pairingGeneration ? { expectedPairingGeneration: access.node.pairingGeneration } : {},
		command: NODE_TERMINAL_UPLOAD_COMMAND,
		params: {
			name: file.name,
			contentBase64: file.contentBase64
		},
		isDispatchAuthorized: () => {
			file.assertCommitAllowed?.();
			return true;
		},
		timeoutMs: 12e4
	});
	if (!result.ok) throw new Error(result.error?.message ?? "terminal node upload failed");
	const payload = result.payloadJSON ? safeParseJson(result.payloadJSON) : result.payload;
	if (!validateTerminalUploadResult(payload)) throw new Error("terminal node returned an invalid upload result");
	return {
		path: payload.path,
		size: payload.size
	};
}
function respondLaunchBlocked(respond, block, hint) {
	if (block.kind === "disabled") {
		respondTerminalUnavailable(respond, "terminal is disabled", hint);
		return;
	}
	invalid(respond, terminalFailureMessage(block.kind === "unknown-agent" ? `unknown agent "${block.agentId}"` : block.kind === "owner-required" ? block.message : `terminal unavailable: agent "${block.agentId}" runs in a sandbox (mode "${block.mode}"); in-sandbox terminals are not supported yet`, hint));
}
const CATALOG_TERMINAL_INITIAL_SIZE = {
	cols: 80,
	rows: 24
};
/** Canonical terminal admission and launch path shared by shell, resume, and start RPCs. */
async function openTerminalSession(opts, request) {
	const { respond, context } = opts;
	const connId = requireConnId(opts);
	if (!connId) return;
	const manager = context.terminalSessions;
	if (!manager) {
		respondTerminalUnavailable(respond, "terminal is not available", request.failureHint);
		return;
	}
	const launch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!launch.ok) {
		respondLaunchBlocked(respond, launch.block, request.failureHint);
		return;
	}
	const deadline = createTerminalOpenDeadline();
	let catalogPlan;
	let title;
	let createBackend;
	let nodeRelay;
	let stageUpload;
	if (request.resolveCatalogPlan) {
		const resolveCatalogPlan = request.resolveCatalogPlan;
		try {
			catalogPlan = await waitForTerminalOpenDeadline(() => resolveCatalogPlan(launch.plan.agentId), deadline);
		} catch (error) {
			if (error instanceof TerminalOpenDeadlineError) {
				respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
				return;
			}
			invalid(respond, terminalFailureMessage(error instanceof Error ? error.message : request.catalogFailureMessage ?? "catalog terminal open failed", request.failureHint));
			return;
		}
		title = catalogPlan.title;
		if (catalogPlan.kind === "local") {
			if (catalogPlan.argv.length === 0) {
				invalid(respond, terminalFailureMessage("catalog terminal plan has no command", request.failureHint));
				return;
			}
		} else {
			const nodeCatalogPlan = catalogPlan;
			if (nodeCatalogPlan.uploadPathStyle !== void 0 && nodeCatalogPlan.uploadPathStyle !== "native") {
				invalid(respond, "catalog terminal plan has an unsupported upload path style");
				return;
			}
			const uploadNodeId = nodeCatalogPlan.nodeId;
			const uploadPathStyle = nodeCatalogPlan.uploadPathStyle;
			const access = authorizeTerminalNodeCommand(context, nodeCatalogPlan.nodeId, nodeCatalogPlan.command);
			if (!access.ok) {
				respondTerminalUnavailable(respond, access.message, request.failureHint);
				return;
			}
			let nodeParams;
			try {
				const parsed = JSON.parse(catalogPlan.paramsJSON);
				if (!isRecord(parsed)) throw new Error("invalid params");
				nodeParams = {
					...parsed,
					cols: request.cols,
					rows: request.rows
				};
			} catch {
				invalid(respond, terminalFailureMessage("catalog terminal plan has invalid params", request.failureHint));
				return;
			}
			nodeRelay = {
				plan: nodeCatalogPlan,
				params: nodeParams,
				connId: access.node.connId,
				pairingGeneration: access.node.pairingGeneration
			};
			let policyResult;
			try {
				policyResult = await waitForTerminalOpenDeadline(() => applyPluginNodeInvokePolicy({
					context,
					client: opts.client,
					nodeSession: access.node,
					command: nodeCatalogPlan.command,
					params: nodeParams
				}), deadline);
			} catch (error) {
				if (error instanceof TerminalOpenDeadlineError) {
					respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
					return;
				}
				throw error;
			}
			if (policyResult && !policyResult.ok) {
				respondTerminalUnavailable(respond, policyResult.message, request.failureHint);
				return;
			}
			stageUpload = async (file) => ({
				...await stageNodeTerminalUpload(context, uploadNodeId, file),
				...uploadPathStyle ? { uploadPathStyle } : {}
			});
		}
	}
	if (context.isConnectionActive?.(connId) === false) {
		respondTerminalUnavailable(respond, "terminal connection closed", request.failureHint);
		return;
	}
	if (request.requireCliAgents && context.getRuntimeConfig().gateway?.cliAgents?.enabled === false) {
		invalid(respond, "CLI agent terminal start is disabled; enable gateway.cliAgents.enabled and retry");
		return;
	}
	if (!context.isTerminalEnabled()) {
		respondTerminalUnavailable(respond, "terminal is disabled", request.failureHint);
		return;
	}
	const refreshedLaunch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!refreshedLaunch.ok) {
		respondLaunchBlocked(respond, refreshedLaunch.block, request.failureHint);
		return;
	}
	let agentOwner;
	if (request.sessionKey) {
		const runtimeConfig = context.getRuntimeConfig();
		const requestedOwner = resolveRequestedSessionAgentId(runtimeConfig, request.sessionKey, refreshedLaunch.plan.agentId);
		if (!requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const agentSessionKey = resolveStoredSessionKeyForAgentStore({
			cfg: runtimeConfig,
			agentId: requestedOwner.agentId,
			sessionKey: request.sessionKey
		});
		const { entry } = loadGatewaySessionEntryReadOnly(agentSessionKey, {
			agentId: requestedOwner.agentId,
			clone: false
		});
		const agentSessionId = entry?.sessionId?.trim();
		if (!agentSessionId) {
			respondTerminalUnavailable(respond, "session is no longer available; refresh and retry", request.failureHint);
			return;
		}
		const readinessError = resolveSessionWorkStartError(agentSessionKey, entry);
		if (readinessError) {
			invalid(respond, terminalFailureMessage(readinessError, request.failureHint));
			return;
		}
		agentOwner = {
			kind: "agent",
			agentSessionKey,
			agentSessionId,
			agentId: requestedOwner.agentId
		};
	}
	if (nodeRelay) {
		const relay = nodeRelay;
		const access = authorizeTerminalNodeCommand(context, relay.plan.nodeId, relay.plan.command);
		if (!access.ok) {
			respondTerminalUnavailable(respond, access.message, request.failureHint);
			return;
		}
		if (access.node.connId !== relay.connId || access.node.pairingGeneration !== relay.pairingGeneration) {
			invalid(respond, "terminal node connection changed; refresh the host and retry");
			return;
		}
		createBackend = async () => await createNodeRelayBackend({
			registry: context.nodeRegistry,
			nodeId: relay.plan.nodeId,
			expectedConnId: access.node.connId,
			expectedPairingGeneration: access.node.pairingGeneration,
			isDispatchAuthorized: () => context.isConnectionActive?.(connId) !== false && context.isTerminalEnabled() && (!request.requireCliAgents || context.getRuntimeConfig().gateway?.cliAgents?.enabled !== false) && context.resolveTerminalLaunchPolicy(refreshedLaunch.plan.agentId).ok && authorizeTerminalNodeCommand(context, relay.plan.nodeId, relay.plan.command).ok && !deadline.controller.signal.aborted && Date.now() < deadline.expiresAtMs,
			command: relay.plan.command,
			params: relay.params
		});
	}
	const spawnPlan = resolveTerminalOpenSpawnPlan(refreshedLaunch.plan, catalogPlan);
	if (request.requiredCwd !== void 0 && spawnPlan.cwd !== request.requiredCwd) {
		invalid(respond, terminalFailureMessage("cwd is no longer available; recreate or choose the worktree and retry", request.failureHint));
		return;
	}
	const terminalEnv = catalogPlan?.kind === "local" ? mergeProcessEnv([
		buildTerminalEnv(process.env),
		catalogPlan.env,
		catalogPlan.pathEnv ? { PATH: catalogPlan.pathEnv } : void 0
	]) : buildTerminalEnv(process.env);
	const closeOpenedSession = (sessionId) => agentOwner ? manager.closeAgent(agentOwner, sessionId) : manager.close(connId, sessionId);
	let openingTerminal;
	let outcome;
	try {
		outcome = await waitForTerminalOpenDeadline(() => {
			openingTerminal = manager.open({
				owner: agentOwner ?? {
					kind: "conn",
					connId
				},
				...agentOwner ? { viewerConnId: connId } : {},
				agentId: spawnPlan.agentId,
				cwd: spawnPlan.cwd,
				shell: spawnPlan.shell,
				...title ? { title } : {},
				args: spawnPlan.args,
				cols: request.cols,
				rows: request.rows,
				env: terminalEnv,
				signal: deadline.controller.signal,
				...createBackend ? { createBackend } : {},
				...stageUpload ? { stageUpload } : {}
			});
			return openingTerminal;
		}, deadline);
	} catch (error) {
		if (error instanceof TerminalOpenDeadlineError) {
			if (openingTerminal) openingTerminal.then((lateOutcome) => {
				if (lateOutcome.ok) closeOpenedSession(lateOutcome.sessionId);
			}, () => void 0);
			respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
			return;
		}
		throw error;
	}
	if (!outcome.ok) {
		const code = outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
		respond(false, void 0, errorShape(code, terminalFailureMessage(outcome.message, request.failureHint)));
		return;
	}
	if (context.isConnectionActive?.(connId) === false) {
		closeOpenedSession(outcome.sessionId);
		respondTerminalUnavailable(respond, "terminal connection closed", request.failureHint);
		return;
	}
	context.logGateway.info(`terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`);
	respond(true, {
		sessionId: outcome.sessionId,
		agentId: outcome.agentId,
		shell: outcome.shell,
		cwd: outcome.cwd,
		confined: false,
		...title ? { title } : {}
	});
}
const terminalHandlers = {
	...terminalUploadHandlers,
	"terminal.open": async (opts) => {
		const { params, respond } = opts;
		if (!assertValidParams(params, validateTerminalOpenParams, "terminal.open", respond)) return;
		let resolveCatalogPlan;
		if (params.catalog) {
			const provider = resolveSessionCatalogProvider(params.catalog.catalogId);
			if (!provider) {
				invalid(respond, `unknown session catalog: ${params.catalog.catalogId}`);
				return;
			}
			if (!provider.openTerminal) {
				invalid(respond, "session catalog cannot open terminals");
				return;
			}
			const openTerminal = provider.openTerminal;
			const catalog = params.catalog;
			resolveCatalogPlan = async (agentId) => await openTerminal.call(provider, {
				allowProcessHomeFallback: allowsProcessHomeSessionScan(),
				agentId,
				hostId: catalog.hostId,
				threadId: catalog.threadId,
				...catalog.sourceHomeId ? { sourceHomeId: catalog.sourceHomeId } : {}
			});
		}
		await openTerminalSession(opts, {
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			cols: params.cols,
			rows: params.rows,
			...resolveCatalogPlan ? { resolveCatalogPlan } : {},
			catalogFailureMessage: "catalog terminal open failed"
		});
	},
	"terminal.input": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalInputParams, "terminal.input", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		if (!context.isTerminalEnabled()) {
			context.terminalSessions?.close(connId, params.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.write(connId, params.sessionId, params.data) ?? false });
	},
	"terminal.resize": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalResizeParams, "terminal.resize", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		if (!context.isTerminalEnabled()) {
			context.terminalSessions?.close(connId, params.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.resize(connId, params.sessionId, params.cols, params.rows) ?? false });
	},
	"terminal.close": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalCloseParams, "terminal.close", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		respond(true, { ok: context.terminalSessions?.close(connId, params.sessionId) ?? false });
	},
	"terminal.attach": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalAttachParams, "terminal.attach", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		if (!context.terminalSessions || !context.isTerminalEnabled()) {
			respondTerminalUnavailable(respond, "terminal is not available");
			return;
		}
		const attached = context.terminalSessions.attach(connId, params.sessionId);
		if (!attached) {
			invalid(respond, `unknown terminal session "${params.sessionId}"`);
			return;
		}
		context.logGateway.info(`terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`);
		const supportsOffsetSeq = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_OFFSET_SEQ);
		const supportsMetadata = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_SESSION_METADATA);
		respond(true, {
			sessionId: attached.sessionId,
			agentId: attached.agentId,
			shell: attached.shell,
			...supportsMetadata ? {
				owner: attached.owner,
				...attached.title ? { title: attached.title } : {}
			} : {},
			cwd: attached.cwd,
			confined: false,
			buffer: attached.buffer,
			...supportsOffsetSeq ? { seq: attached.seq } : {}
		});
	},
	"terminal.list": async (opts) => {
		const { respond, context } = opts;
		if (!requireConnId(opts)) return;
		const supportsMetadata = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_SESSION_METADATA);
		respond(true, { sessions: context.terminalSessions && context.isTerminalEnabled() ? context.terminalSessions.list().map((session) => ({
			sessionId: session.sessionId,
			agentId: session.agentId,
			shell: session.shell,
			title: supportsMetadata ? session.title : void 0,
			cwd: session.cwd,
			confined: false,
			attached: session.attached,
			owner: session.owner,
			createdAtMs: session.createdAtMs
		})) : [] });
	}
};
//#endregion
export { CATALOG_TERMINAL_INITIAL_SIZE, openTerminalSession, terminalHandlers };
