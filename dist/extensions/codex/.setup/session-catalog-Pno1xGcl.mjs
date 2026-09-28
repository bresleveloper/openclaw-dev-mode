import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { d as resolveCodexAppServerHomeDir, f as resolveCodexAppServerLocalHomeDir, p as resolveCodexAppServerUserHomeDir } from "./config-security-BEReZ6go.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-CcB9iPoq.mjs";
import { A as parseCatalogPage, D as filterCatalogPageByTitle, F as readGatewayParams, H as unwrapNodeInvokePayload, I as readPageParams, M as parseTranscriptPage, N as readBoundedOptionalString, O as isInteractiveThreadSource, P as readControlCursor, R as requireOnlyKeys, S as NODE_INVOKE_TIMEOUT_MS, _ as CODEX_LOCAL_SESSION_HOST_ID, g as CODEX_CATALOG_TRANSCRIPT_READ_COMMAND, h as CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND, j as parseJsonParams, m as CODEX_APP_SERVER_THREADS_LIST_COMMAND, p as CODEX_APP_SERVER_THREADS_CAPABILITY, v as CatalogParamsError, w as catalogError, x as MAX_TRANSCRIPT_PAGE_BYTES, y as MAX_CURSOR_LENGTH } from "./session-catalog-native-projection-DowriLid.mjs";
import { n as assertCodexThreadForkParams } from "./protocol-CANUwXJ3.mjs";
import { c as codexCatalogHomeIdFromCanonicalPath, m as hasActiveSharedCodexAppServerWork, o as readCodexSessionMeta, p as getSharedCodexAppServerClientState, t as codexCatalogResidentHomeKey } from "./session-catalog-events-Bj6j94E_.mjs";
import { i as withTimeout, o as CodexAppServerRpcError, s as isCodexThreadReadMissingError } from "./timeout-C910MdAB.mjs";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-CDXOOFdZ.mjs";
import { r as compareCodexCatalogRows } from "./session-catalog-index-order-hcdz07yN.mjs";
import { n as readLegacyCodexHistoryPage, t as readCodexThreadHistoryPage } from "./thread-history-page-DoVpnHim.mjs";
import { i as projectCodexUserItemText } from "./transcript-history-projection-ZZpkFkJ_.mjs";
import { r as codexUpstreamContinueResult } from "./session-upstream-marker-D15C9NHp.mjs";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import { n as findCodexAppServerSpawnError } from "./spawn-error-CL3n6MAa.mjs";
import { a as setCodexCatalogConnectionHomeResolver } from "./binding-connection-ThoatDcb.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { embeddedAgentLog, resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
import { listAgentIds, resolveAgentDir, resolveDefaultAgentId, resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";
import { canonicalPathFromExistingAncestor } from "openclaw/plugin-sdk/file-access-runtime";
import { scheduler } from "node:timers/promises";
import { AsyncLocalStorage } from "node:async_hooks";
import { isMainThread, threadId } from "node:worker_threads";
import { areDiagnosticsEnabledForProcess, createSubsystemLogger } from "openclaw/plugin-sdk/diagnostic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { publishSessionCatalogHost, sessionCatalogPaging } from "openclaw/plugin-sdk/session-catalog-paging";
import { decodeNodePtyResumeParams, decodeNodePtyStartParams, resolveNodeHostExecutable, runNodePtyCommand } from "openclaw/plugin-sdk/node-host";
//#region extensions/codex/src/session-catalog-create.ts
const CODEX_AGENT_RUNTIME_ID = "codex";
const CODEX_CATALOG_DEFAULT_MODEL_REF = "openai/gpt-6-astra";
function resolveCodexCatalogCreateSession(modelConfig, config, requestedAgentId) {
	if (!config) return;
	const agentId = requestedAgentId ?? resolveDefaultAgentId(config);
	const defaultModel = modelConfig.resolveDefaultModelForAgent({
		cfg: config,
		agentId
	});
	const modelRef = defaultModel.provider === "openai" ? `${defaultModel.provider}/${defaultModel.model}` : CODEX_CATALOG_DEFAULT_MODEL_REF;
	const allowed = modelConfig.resolveAllowedModelRef({
		cfg: config,
		catalog: [],
		raw: modelRef,
		defaultProvider: defaultModel.provider,
		defaultModel: defaultModel.model,
		agentId
	});
	return "error" in allowed ? void 0 : {
		model: allowed.key,
		agentRuntime: CODEX_AGENT_RUNTIME_ID
	};
}
//#endregion
//#region extensions/codex/src/app-server/request-observation.ts
const CODEX_REQUEST_WAITER_OUTCOMES = [
	"resolved",
	"native-error",
	"timed-out",
	"aborted",
	"authority-rejected",
	"local-failed",
	"client-closed"
];
const CODEX_REQUEST_WIRE_OUTCOMES = [
	"retained-pending",
	"native-ok",
	"native-error",
	"ingress-rejected",
	"correlation-closed",
	"not-written"
];
//#endregion
//#region extensions/codex/src/session-catalog-diagnostics.ts
const log = createSubsystemLogger("gateway/session-catalog");
const listScope = new AsyncLocalStorage();
let epoch;
let sequence = 0;
let active = 0;
let windowStart = 0;
let emitted = 0;
let omitted = 0;
const WAITER_OUTCOMES = new Set(CODEX_REQUEST_WAITER_OUTCOMES);
const WIRE_OUTCOMES = new Set(CODEX_REQUEST_WIRE_OUTCOMES);
function controlWaiterTuple(controlCallOrdinal, summary) {
	const ordinals = [
		controlCallOrdinal,
		summary.overloadAttemptOrdinal,
		summary.rpcId,
		summary.waiterOrdinal
	];
	const times = [
		summary.attemptCreatedAtMs,
		summary.waiterAttachedAtMs,
		summary.waiterSettledAtMs
	];
	const optionalTimes = [summary.firstPossibleWriteAtMs, summary.wireObservedAtMs];
	const validTime = (value) => Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value));
	if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(summary.clientInstanceId) || !ordinals.every((value) => Number.isSafeInteger(value) && value > 0) || !times.every(validTime) || !optionalTimes.every((value) => value === null || validTime(value)) || summary.disposition !== "new" && summary.disposition !== "joined" || !WAITER_OUTCOMES.has(summary.waiterOutcome) || !WIRE_OUTCOMES.has(summary.wireOutcomeAtWaiterSettlement)) return;
	return [
		controlCallOrdinal,
		summary.overloadAttemptOrdinal,
		summary.clientInstanceId,
		summary.rpcId,
		summary.waiterOrdinal,
		summary.disposition,
		Math.round(summary.attemptCreatedAtMs),
		summary.firstPossibleWriteAtMs === null ? null : Math.round(summary.firstPossibleWriteAtMs),
		Math.round(summary.waiterAttachedAtMs),
		Math.round(summary.waiterSettledAtMs),
		summary.waiterOutcome,
		summary.wireOutcomeAtWaiterSettlement,
		summary.wireObservedAtMs === null ? null : Math.round(summary.wireObservedAtMs)
	];
}
function fitsMetadata(metadata) {
	return Object.keys(metadata).length <= 28 && Buffer.byteLength(JSON.stringify(metadata)) <= 2048;
}
function withControlWaiters(metadata, fields) {
	if (!("origin" in fields) || !fields.controlWaitersV1) return metadata;
	const kept = fields.controlWaitersV1.slice();
	let count = fields.controlWaitersOmitted ?? 0;
	while (true) {
		const complete = {
			...metadata,
			controlWaitersV1: JSON.stringify(kept),
			controlWaitersOmitted: count
		};
		if (fitsMetadata(complete)) return complete;
		if (kept.length === 0) {
			const countOnly = {
				...metadata,
				controlWaitersOmitted: count
			};
			return fitsMetadata(countOnly) ? countOnly : metadata;
		}
		kept.splice(kept.length > 2 ? kept.length - 2 : 0, 1);
		count = Math.min(Number.MAX_SAFE_INTEGER, count + 1);
	}
}
const CONTROL_PHASE_FIELDS = {
	"load-control": "controlLoadMs",
	prepare: "controlPrepareMs",
	"acquire-client": "controlAcquireClientMs",
	"client-request": "controlClientRequestMs",
	"release-client": "controlReleaseClientMs"
};
function enabled() {
	return areDiagnosticsEnabledForProcess() && log.isEnabled("warn");
}
function start(kind, fields) {
	if (!enabled()) return;
	if (active >= 64) {
		omitted = Math.min(Number.MAX_SAFE_INTEGER, omitted + 1);
		return;
	}
	active++;
	epoch ??= randomUUID();
	const started = performance.now();
	const observation = {
		operationId: String(++sequence),
		fields,
		closed: false,
		finish(outcome) {
			if (observation.closed) return;
			observation.closed = true;
			active--;
			const elapsedMs = performance.now() - started;
			try {
				if (elapsedMs < 1e3 || !enabled()) return;
				if (performance.now() - windowStart >= 6e4) {
					windowStart = performance.now();
					emitted = 0;
				}
				if (emitted >= 60) {
					omitted = Math.min(Number.MAX_SAFE_INTEGER, omitted + 1);
					return;
				}
				const metadata = {
					diagnosticEpoch: epoch,
					operationId: observation.operationId,
					pid: process.pid,
					threadId,
					isMainThread,
					elapsedMs: Math.round(elapsedMs),
					outcome,
					omittedObservations: omitted,
					...Object.fromEntries(Object.entries(fields).filter(([key, value]) => value !== void 0 && key !== "controlWaitersV1" && key !== "controlWaitersOmitted").map(([key, value]) => [key, typeof value === "number" ? Math.round(value) : value]))
				};
				if (!fitsMetadata(metadata)) {
					omitted = Math.min(Number.MAX_SAFE_INTEGER, omitted + 1);
					return;
				}
				emitted++;
				log.warn(`slow Codex catalog ${kind}`, withControlWaiters(metadata, fields));
				omitted = 0;
			} catch {}
		}
	};
	return observation;
}
function currentCodexCatalogListDiagnostics() {
	const observation = listScope.getStore();
	return observation?.closed ? void 0 : observation;
}
/** One logical list scope survives admission pauses; finishing drops its captured context. */
function createCodexCatalogListScope() {
	const observation = start("list phases", {
		controlPageCalls: 0,
		exclusionMarkCalls: 0,
		adoptionCalls: 0
	});
	let captured = listScope.run(observation, () => AsyncLocalStorage.snapshot());
	return {
		run(run) {
			if (!captured) throw new Error("Codex catalog diagnostic scope is closed");
			return captured(run);
		},
		finish(outcome) {
			const finishInScope = captured;
			captured = void 0;
			finishInScope?.(() => observation?.finish(outcome));
		}
	};
}
function startCodexCatalogPageDiagnostics(origin) {
	return start("page producer", {
		origin,
		listOperationId: currentCodexCatalogListDiagnostics()?.operationId,
		controlRequestCalls: 0,
		provenanceChecks: 0,
		provenanceCacheHits: 0,
		provenanceReadCalls: 0
	});
}
function startCodexCatalogControlRequestDiagnostics(page) {
	if (!page) return;
	let state = "active";
	const controlCallOrdinal = page.fields.controlRequestCalls;
	let phase = "load-control";
	let phaseStarted = performance.now();
	const finishPhase = () => {
		const now = performance.now();
		const field = CONTROL_PHASE_FIELDS[phase];
		page.fields[field] = (page.fields[field] ?? 0) + (now - phaseStarted);
		phaseStarted = now;
	};
	const observation = {
		attemptWaiterFinished(summary) {
			if (state === "closed" || page.closed) return;
			const kept = page.fields.controlWaitersV1 ??= [];
			page.fields.controlWaitersOmitted ??= 0;
			const tuple = controlWaiterTuple(controlCallOrdinal, summary);
			if (!tuple) {
				page.fields.controlWaitersOmitted = Math.min(Number.MAX_SAFE_INTEGER, page.fields.controlWaitersOmitted + 1);
				return;
			}
			if (kept.length === 4) {
				kept.splice(2, 1);
				page.fields.controlWaitersOmitted = Math.min(Number.MAX_SAFE_INTEGER, page.fields.controlWaitersOmitted + 1);
			}
			kept.push(tuple);
		},
		phase(next) {
			if (state === "active" && !page.closed) {
				finishPhase();
				phase = next;
			}
		},
		failed(failure) {
			if (state === "active" && !page.closed) {
				finishPhase();
				state = "failed";
				page.fields.controlFailurePhase = failure.phase;
				page.fields.controlFailureCategory = failure.category;
			}
		},
		rejected() {
			observation.failed({
				phase,
				category: "other"
			});
		},
		close() {
			if (state === "active" && !page.closed) finishPhase();
			state = "closed";
		}
	};
	return observation;
}
//#endregion
//#region extensions/codex/src/session-catalog-availability.ts
var CodexCatalogLoadingError = class extends Error {
	constructor() {
		super("Codex session catalog is still loading. Retry shortly.");
		this.code = "APP_SERVER_UNAVAILABLE";
	}
};
/** One generation promise wakes cold callers; native pages remain owned by the index. */
var CodexCatalogAvailability = class {
	constructor() {
		this.complete = false;
		this.changed = createDeferred();
	}
	begin() {
		this.failure = void 0;
	}
	publish(frontier, complete = false) {
		if (this.complete) return;
		if (frontier && (!this.frontier || compareCodexCatalogRows(frontier, this.frontier) > 0)) {
			const { threadId, updatedAt, recencyAt, sourceOrder } = frontier;
			this.frontier = {
				threadId,
				updatedAt,
				recencyAt,
				sourceOrder
			};
		}
		this.complete = complete;
		this.notify();
	}
	fail(error) {
		this.failure = { error };
		this.notify();
	}
	notify() {
		const previous = this.changed;
		this.changed = createDeferred();
		previous.resolve();
	}
	async until(promise, deadline) {
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw new CodexCatalogLoadingError();
		return await withTimeout(promise, remaining, "Codex session catalog is still loading", () => new CodexCatalogLoadingError());
	}
	async next(deadline) {
		if (this.failure) throw this.failure.error;
		await this.until(this.changed.promise, deadline);
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-node-snapshot.ts
/** One query-compatible native page per node, owned by the registered catalog provider. */
var CodexCatalogNodeSnapshots = class {
	constructor() {
		this.generation = 0;
		this.inventoryGeneration = 0;
		this.configGeneration = 0;
		this.nodes = /* @__PURE__ */ new Map();
	}
	start(config) {
		if (this.config !== config) {
			this.nodes.clear();
			this.config = config;
			this.configGeneration = this.generation + 1;
			this.inventoryGeneration = this.configGeneration;
		}
		return ++this.generation;
	}
	observe(generation, nodes) {
		if (generation < this.inventoryGeneration) return;
		this.inventoryGeneration = generation;
		const connected = new Map(nodes.filter((node) => node.connected).map((node) => [node.nodeId, node]));
		for (const [nodeId, publication] of this.nodes) {
			const node = connected.get(nodeId);
			if (!node || node.connectedAtMs !== publication.connection) this.nodes.delete(nodeId);
		}
		for (const node of connected.values()) if (!this.nodes.has(node.nodeId)) this.nodes.set(node.nodeId, {
			connection: node.connectedAtMs,
			generation: 0
		});
	}
	forNode(node, generation, key) {
		let publication = this.nodes.get(node.nodeId);
		if (!publication) {
			publication = {
				connection: node.connectedAtMs,
				generation: 0
			};
			if (generation >= this.inventoryGeneration) this.nodes.set(node.nodeId, publication);
		}
		const valid = () => generation >= this.configGeneration && this.nodes.get(node.nodeId) === publication && publication.connection === node.connectedAtMs;
		return {
			read: () => valid() && publication.snapshot?.key === key ? publication.snapshot : void 0,
			publish: (host) => {
				if (!valid() || generation < publication.generation) return false;
				publication.generation = generation;
				publication.snapshot = node.connected && host.connected ? {
					key,
					generation,
					host
				} : void 0;
				return true;
			},
			isCurrent: (snapshot) => valid() && publication.snapshot === snapshot,
			valid
		};
	}
};
function createNodeHostPublication(publication, adopted, sourceKey, onHost, signal, partial, waitUntil) {
	let publishedSnapshot;
	let publishedHost;
	const project = (host) => ({
		...host,
		sessions: host.sessions.map((session) => {
			const entry = session.sourceHomeId ? adopted.get(sourceKey(host.hostId, session.threadId, session.sourceHomeId)) : void 0;
			return entry ? {
				...session,
				sessionKey: entry.key
			} : session;
		})
	});
	const emit = (host) => {
		publishedHost = project(host);
		return onHost?.(publishedHost);
	};
	return {
		project,
		readPublished: () => publishedHost,
		publish: (host) => {
			if (signal?.aborted) return partial ? void 0 : onHost?.(project(host));
			if (!publication.valid()) return;
			if (publication.publish(host)) {
				publishedSnapshot = publication.read();
				return emit(host);
			}
			const latest = publication.read();
			return emit(latest?.host ?? host);
		},
		publishCached: (snapshot) => {
			if (signal?.aborted || snapshot === publishedSnapshot || !publication.isCurrent(snapshot)) return;
			const completion = createDeferred();
			completion.promise.catch(() => void 0);
			try {
				waitUntil?.(completion.promise);
				completion.resolve(emit(snapshot.host));
				publishedSnapshot = snapshot;
			} catch (error) {
				completion.reject(error);
				throw error;
			}
		}
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-node-lookup.ts
async function lookupNodeCodexCatalogRecord(params) {
	const deadline = performance.now() + NODE_INVOKE_TIMEOUT_MS;
	const unverified = () => new CatalogParamsError("Codex session eligibility could not be verified");
	const remaining = () => {
		const timeoutMs = Math.ceil(deadline - performance.now());
		if (timeoutMs <= 0) throw unverified();
		return timeoutMs;
	};
	let cursor;
	let sourceHomeId = params.sourceHomeId;
	let firstPage = true;
	const seenCursors = /* @__PURE__ */ new Set();
	for (;;) {
		const timeoutMs = remaining();
		const raw = await withTimeout(params.runtime.nodes.invoke({
			nodeId: params.nodeId,
			command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
			params: {
				agentId: params.agentId,
				...sourceHomeId ? { sourceHomeId } : {},
				limit: 100,
				...cursor ? { cursor } : {}
			},
			timeoutMs,
			scopes: ["operator.write"]
		}), timeoutMs, "Codex session eligibility could not be verified", unverified);
		remaining();
		const page = parseCatalogPage(unwrapNodeInvokePayload(raw));
		if ((!firstPage || sourceHomeId !== void 0) && page.sourceHomeId !== sourceHomeId) throw new CatalogParamsError("Codex session source home changed; refresh the catalog and retry");
		sourceHomeId = page.sourceHomeId;
		firstPage = false;
		const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
		if (record) return {
			kind: "found",
			record,
			sourceHomeId,
			canContinueCodex: page.canContinueCodex
		};
		const nextCursor = page.nextCursor?.trim();
		if (!nextCursor) break;
		if (seenCursors.has(nextCursor)) return { kind: "cursor-cycle" };
		seenCursors.add(nextCursor);
		if (seenCursors.size > 2e4) {
			const oldest = seenCursors.values().next().value;
			if (oldest !== void 0) seenCursors.delete(oldest);
		}
		cursor = nextCursor;
	}
	return { kind: "missing" };
}
//#endregion
//#region extensions/codex/src/session-catalog-terminal.ts
const CODEX_TERMINAL_RESUME_COMMAND = "codex.terminal.resume.v1";
const CODEX_TERMINAL_START_COMMAND = "codex.terminal.start.v1";
function createCodexTerminalStartNodeHostCommand() {
	return {
		command: CODEX_TERMINAL_START_COMMAND,
		cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
		dangerous: false,
		duplex: true,
		hasActiveWork: () => false,
		isAvailable: ({ env }) => Boolean(resolveNodeHostExecutable("codex", {
			env,
			strategy: "direct"
		})),
		handle: async (paramsJSON, io) => {
			if (!io) throw new Error("Codex terminal command requires duplex transport");
			const params = decodeNodePtyStartParams(paramsJSON);
			const resolution = resolveNodeHostExecutable("codex", { strategy: "direct" });
			if (!resolution) throw new Error("Codex CLI is unavailable; install codex on this node and reconnect");
			return JSON.stringify(await runNodePtyCommand({
				file: resolution.executable,
				args: params.initialMessage !== void 0 ? ["--", params.initialMessage] : [],
				cwd: params.cwd,
				requiredCwd: true,
				cols: params.cols,
				rows: params.rows
			}, io));
		}
	};
}
function resolveCodexCatalogTerminalHome(sources) {
	sources.source?.assertCurrent();
	const runtimeConfig = sources.getRuntimeConfig();
	if (!runtimeConfig) throw new Error("OpenClaw runtime config is unavailable");
	const agentDir = sources.source?.agentDir ?? (sources.agentId ? resolveAgentDir(runtimeConfig, sources.agentId) : resolveDefaultAgentDir(runtimeConfig));
	const startOptions = sources.source?.appServer.start ?? sources.resolveRuntimeOptions({ pluginConfig: sources.getPluginConfig() }).start;
	if (startOptions.transport !== "stdio") throw new CatalogParamsError("Native terminal requires a local Codex source");
	return resolveCodexAppServerLocalHomeDir(startOptions, agentDir);
}
function resolveLocalCodexTerminalExecutable(env = process.env) {
	return resolveLocalCodexTerminalResolution(env)?.executable;
}
function resolveLocalCodexTerminalResolution(env = process.env) {
	return resolveNodeHostExecutable("codex", {
		env,
		pathEnv: env.PATH ?? env.Path ?? "",
		strategy: "fallback"
	});
}
function codexNodeTerminalCapability(node) {
	const commands = node.invocableCommands ?? node.commands;
	return {
		canOpenTerminalCodex: node.connected === true && commands?.includes("codex.terminal.resume.v1") === true,
		canStartTerminal: node.connected === true && node.invocableCommands?.includes("codex.terminal.start.v1") === true
	};
}
function createCodexTerminalNodeHostCommand(bindRequest) {
	return {
		command: CODEX_TERMINAL_RESUME_COMMAND,
		cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
		dangerous: false,
		duplex: true,
		hasActiveWork: () => false,
		isAvailable: ({ config, env }) => (readCodexPluginConfig(config.plugins?.entries?.codex?.config).appServer?.transport ?? "stdio") === "stdio" && Boolean(resolveNodeHostExecutable("codex", {
			env,
			pathEnv: env.PATH ?? env.Path ?? "",
			strategy: "direct"
		})),
		handle: async (paramsJSON, io) => {
			if (!io) throw new Error("Codex terminal command requires duplex transport");
			const request = await bindRequest(paramsJSON);
			if (request.transport !== "stdio") throw new CatalogParamsError("Native terminal requires a local Codex source");
			const resume = decodeNodePtyResumeParams(request.paramsJSON, (value) => {
				if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(value)) throw new CatalogParamsError("threadId must be a UUID");
				return value;
			});
			const record = await request.control.requireEligibleThread(resume.threadId);
			const resolution = resolveNodeHostExecutable("codex", {
				env: process.env,
				pathEnv: process.env.PATH ?? process.env.Path ?? "",
				strategy: "direct"
			});
			if (!resolution) throw new Error("Codex CLI is unavailable");
			request.assertCurrent();
			return JSON.stringify(await runNodePtyCommand({
				file: resolution.executable,
				args: ["resume", resume.threadId],
				assertCurrent: () => request.assertCurrent(),
				...record.cwd ? { cwd: record.cwd } : {},
				env: { CODEX_HOME: request.codexHome },
				cols: resume.cols,
				rows: resume.rows
			}, io));
		}
	};
}
async function openCodexCatalogTerminal(params) {
	const title = `codex resume ${params.threadId.slice(0, 8)}…`;
	if (params.hostId === "gateway:local" || params.hostId.startsWith(`gateway:local:`)) {
		const record = await params.control.requireEligibleThread(params.threadId);
		const resolution = resolveLocalCodexTerminalResolution();
		if (!resolution) throw new CatalogParamsError("Codex CLI is unavailable");
		return {
			kind: "local",
			argv: [
				resolution.executable,
				"resume",
				params.threadId
			],
			...record.cwd ? { cwd: record.cwd } : {},
			env: { CODEX_HOME: resolveCodexCatalogTerminalHome(params) },
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!params.hostId.startsWith("node:")) throw new CatalogParamsError("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	if (!(await params.api.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes("codex.appServer.threads.list.v1") === true && commands.includes("codex.terminal.resume.v1");
	})) throw new CatalogParamsError("paired-node Codex terminal is unavailable");
	const lookup = await lookupNodeCodexCatalogRecord({
		agentId: params.agentId,
		runtime: params.api.runtime,
		nodeId,
		threadId: params.threadId,
		sourceHomeId: params.sourceHomeId
	});
	if (lookup.kind !== "found" || !isInteractiveThreadSource(lookup.record.source)) throw new CatalogParamsError("Codex session is not a non-archived interactive Codex session");
	const record = lookup.record;
	return {
		kind: "node",
		nodeId,
		command: CODEX_TERMINAL_RESUME_COMMAND,
		uploadPathStyle: "native",
		paramsJSON: JSON.stringify({
			agentId: params.agentId,
			threadId: params.threadId,
			...lookup.sourceHomeId ? { sourceHomeId: lookup.sourceHomeId } : {}
		}),
		...record.cwd ? { cwd: record.cwd } : {},
		title
	};
}
async function startCodexCatalogTerminal(params) {
	if (params.nodeId) return {
		kind: "node",
		nodeId: params.nodeId,
		command: CODEX_TERMINAL_START_COMMAND,
		uploadPathStyle: "native",
		paramsJSON: JSON.stringify({
			cwd: params.cwd,
			initialMessage: params.initialMessage
		}),
		cwd: params.cwd,
		title: "codex"
	};
	const resolution = resolveLocalCodexTerminalResolution();
	if (!resolution) throw new CatalogParamsError("Codex CLI is unavailable; install Codex or add codex to PATH, then try again");
	return {
		kind: "local",
		argv: [resolution.executable, ...params.initialMessage !== void 0 ? ["--", params.initialMessage] : []],
		cwd: params.cwd,
		env: { CODEX_HOME: resolveCodexCatalogTerminalHome(params) },
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		title: "codex"
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-list-request.ts
const listRequest = new AsyncLocalStorage();
function currentCodexCatalogListRequest() {
	return listRequest.getStore();
}
/** One foreground request owns its native read budget and source-health outcome. */
var CodexCatalogListRequest = class {
	constructor() {
		this.pages = 0;
		this.closed = false;
		this.attempts = /* @__PURE__ */ new Map();
	}
	get hasPages() {
		return this.pages < 20;
	}
	deadline(timeoutMs) {
		this.assertActive();
		return this.deadlineAt ??= performance.now() + timeoutMs;
	}
	constrainDeadline(absolute) {
		this.assertActive();
		this.deadlineAt = Math.min(this.deadlineAt ?? absolute, absolute);
		return this.deadlineAt;
	}
	remaining(timeoutMs) {
		const remaining = Math.min(timeoutMs, this.deadline(timeoutMs) - performance.now());
		if (remaining <= 0) throw new CodexCatalogLoadingError();
		return remaining;
	}
	assertActive() {
		if (this.closed) throw new DOMException("Codex session catalog request is closed", "AbortError");
		if (this.deadlineAt !== void 0 && this.deadlineAt <= performance.now()) throw new CodexCatalogLoadingError();
	}
	async run(run) {
		this.assertActive();
		const pending = listRequest.run(this, run);
		const remaining = this.deadlineAt === void 0 ? void 0 : this.deadlineAt - performance.now();
		if (remaining !== void 0 && remaining <= 0) {
			pending.catch(() => {});
			throw new CodexCatalogLoadingError();
		}
		const result = remaining === void 0 ? await pending : await withTimeout(pending, remaining, "Codex session catalog is still loading", () => new CodexCatalogLoadingError());
		this.assertActive();
		return result;
	}
	async read(timeoutMs, read) {
		const remaining = this.remaining(timeoutMs);
		if (!this.hasPages) throw new CatalogParamsError("Codex catalog native page budget is exhausted");
		this.pages++;
		try {
			const result = await withTimeout(read(remaining), remaining, "Codex session catalog is still loading", () => new CodexCatalogLoadingError());
			this.assertActive();
			return result;
		} catch (error) {
			if (!this.closed) this.failure ??= { error };
			throw error;
		}
	}
	attempt(owner, key, start) {
		this.assertActive();
		let attempts = this.attempts.get(owner);
		const existing = attempts?.get(key);
		if (existing) return existing;
		const attempt = start();
		if (!attempts) {
			attempts = /* @__PURE__ */ new Map();
			this.attempts.set(owner, attempts);
		}
		attempts.set(key, attempt);
		return attempt;
	}
	resolved() {
		if (this.failure) {
			this.rejected(this.failure.error);
			return;
		}
		this.settle((attempt) => attempt.resolved());
	}
	rejected(error) {
		if (error instanceof Error && error.name === "AbortError") {
			this.close();
			return;
		}
		const reason = this.failure?.error ?? error;
		this.settle((attempt) => attempt.rejected(reason));
	}
	close() {
		this.settle((attempt) => attempt.abandoned());
	}
	settle(settle) {
		if (this.closed) return;
		this.closed = true;
		for (const attempts of this.attempts.values()) for (const attempt of attempts.values()) if (attempt.allowed) settle(attempt);
		this.attempts.clear();
		this.failure = void 0;
	}
};
async function withCodexCatalogListRequest(run) {
	const current = currentCodexCatalogListRequest();
	if (current) {
		current.assertActive();
		return await run(current);
	}
	const scope = new CodexCatalogListRequest();
	try {
		const result = await scope.run(() => run(scope));
		scope.resolved();
		return result;
	} catch (error) {
		scope.rejected(error);
		throw error;
	}
}
//#endregion
//#region extensions/codex/src/session-catalog-visible-page.ts
/** Fill exclusions from bounded resident pages. */
var CodexCatalogVisiblePage = class {
	constructor(params) {
		this.params = params;
		this.sessions = [];
		this.seenCursors = /* @__PURE__ */ new Set();
		this.pages = 0;
		this.complete = false;
		this.request = new CodexCatalogListRequest();
		this.cursor = params.cursor;
	}
	async next() {
		try {
			const step = await this.request.run(() => this.nextPage());
			if (step.done) this.request.resolved();
			return step;
		} catch (error) {
			if (this.params.signal?.aborted) this.request.close();
			else this.request.rejected(error);
			throw error;
		}
	}
	close() {
		this.complete = true;
		this.request.close();
	}
	async nextPage() {
		if (this.complete) throw new Error("Codex catalog page is already complete");
		const params = this.params;
		params.signal?.throwIfAborted();
		const diagnostics = currentCodexCatalogListDiagnostics();
		const started = diagnostics ? performance.now() : 0;
		if (diagnostics) diagnostics.fields.controlPageCalls++;
		let rawPage;
		try {
			rawPage = await params.control.listPage({
				limit: params.limit - this.sessions.length,
				...this.cursor ? { cursor: this.cursor } : {},
				...params.searchTerm ? { searchTerm: params.searchTerm } : {},
				...params.cwd ? { cwd: params.cwd } : {}
			});
		} finally {
			if (diagnostics && !diagnostics.closed) diagnostics.fields.controlWaitSumMs = (diagnostics.fields.controlWaitSumMs ?? 0) + performance.now() - started;
		}
		this.request.assertActive();
		params.signal?.throwIfAborted();
		const page = filterCatalogPageByTitle(parseCatalogPage(rawPage), params.searchTerm);
		if (this.pages++ === 0) this.backwardsCursor = page.backwardsCursor;
		let excludedFromPage = false;
		for (const managed of rawPage.managedThreads ?? []) {
			excludedFromPage = true;
			params.signal?.throwIfAborted();
			await params.onExcludedThread?.(managed);
		}
		for (const session of page.sessions) {
			if (!params.excludedThreadIds?.has(session.threadId)) {
				this.sessions.push(session);
				continue;
			}
			excludedFromPage = true;
			params.signal?.throwIfAborted();
			await params.onExcludedThread?.({ threadId: session.threadId });
		}
		const nextCursor = page.nextCursor;
		if (!nextCursor || this.sessions.length >= params.limit || !excludedFromPage) this.complete = true;
		else {
			if (this.seenCursors.has(nextCursor)) throw new Error("Codex session catalog returned a repeated exclusion cursor");
			this.seenCursors.add(nextCursor);
			this.cursor = nextCursor;
			this.complete = this.pages >= 20 || !this.request.hasPages;
		}
		return this.complete ? {
			done: true,
			page: {
				sessions: this.sessions.slice(0, params.limit),
				...nextCursor ? { nextCursor } : {},
				...this.backwardsCursor ? { backwardsCursor: this.backwardsCursor } : {}
			}
		} : { done: false };
	}
};
/** Node and direct callers finish the same bounded outer algorithm inline. */
async function listVisiblePage(params) {
	const operation = new CodexCatalogVisiblePage(params);
	try {
		for (;;) {
			const step = await operation.next();
			if (step.done) return step.page;
		}
	} finally {
		operation.close();
	}
}
//#endregion
//#region extensions/codex/src/session-catalog-list-operation.ts
async function boundedHost(pending) {
	let timer;
	try {
		return await Promise.race([pending, new Promise((resolve) => {
			timer = setTimeout(() => resolve(void 0), 250);
		})]);
	} finally {
		clearTimeout(timer);
	}
}
function measureNodeHost(host, diagnostics, started) {
	return diagnostics ? host.finally(() => {
		if (!diagnostics.closed) {
			diagnostics.fields.pairedNodeSettled = (diagnostics.fields.pairedNodeSettled ?? 0) + 1;
			diagnostics.fields.nodeWaitSumMs = (diagnostics.fields.nodeWaitSumMs ?? 0) + performance.now() - started;
		}
	}) : host;
}
function hostFailure(source, error) {
	return {
		hostId: source?.hostId ?? "gateway:local",
		label: source?.label ?? "Local Codex",
		kind: "gateway",
		connected: false,
		sessions: [],
		error: error instanceof CodexCatalogLoadingError ? {
			code: error.code,
			message: error.message
		} : catalogError("APP_SERVER_UNAVAILABLE", error)
	};
}
async function projectLocalHost(params, agentId, source, page) {
	params.signal?.throwIfAborted();
	const { listAdoptedSessionEntries } = await import("./session-catalog-adoption-BI6UTDZT.mjs");
	const { sessionCatalogAdoptedSourceKey } = await import("openclaw/plugin-sdk/session-catalog");
	params.signal?.throwIfAborted();
	const diagnostics = currentCodexCatalogListDiagnostics();
	const started = diagnostics ? performance.now() : 0;
	if (diagnostics) diagnostics.fields.adoptionCalls++;
	let adopted;
	try {
		adopted = await listAdoptedSessionEntries({
			agentId,
			bindingStore: params.bindingStore,
			config: params.config,
			runtime: params.runtime,
			sessionEntries: params.sessionEntries
		});
	} finally {
		if (diagnostics && !diagnostics.closed) diagnostics.fields.adoptionSumMs = (diagnostics.fields.adoptionSumMs ?? 0) + performance.now() - started;
	}
	const hostId = source?.hostId ?? "gateway:local";
	const sourceHomeId = source?.sourceHomeId ?? "gateway:local";
	return {
		hostId,
		label: source?.label ?? "Local Codex",
		kind: "gateway",
		connected: true,
		...page,
		sessions: page.sessions.map((session) => {
			const entry = adopted.get(sessionCatalogAdoptedSourceKey(sourceHomeId, session.threadId)) ?? (hostId === "gateway:local" ? adopted.get(sessionCatalogAdoptedSourceKey("gateway:local", session.threadId)) : void 0);
			const sourced = source ? {
				...session,
				sourceHomeId: source.sourceHomeId
			} : session;
			return entry ? {
				...sourced,
				sessionKey: entry.key
			} : sourced;
		})
	};
}
function managedMarker(store, sourceHomeId, managed) {
	return async ({ threadId, rolloutPath }) => {
		if (managed?.has(threadId)) return;
		const diagnostics = currentCodexCatalogListDiagnostics();
		const started = diagnostics ? performance.now() : 0;
		if (diagnostics) diagnostics.fields.exclusionMarkCalls++;
		try {
			await store.mark({
				sourceHomeId,
				threadId,
				...rolloutPath ? { rolloutPath } : {}
			});
		} finally {
			if (diagnostics && !diagnostics.closed) diagnostics.fields.exclusionMarkSumMs = (diagnostics.fields.exclusionMarkSumMs ?? 0) + performance.now() - started;
		}
	};
}
async function finishLocalHost(params, agentId, host) {
	try {
		for (;;) {
			const step = await host.page.next();
			params.signal?.throwIfAborted();
			if (step.done) return await projectLocalHost(params, agentId, host.source, step.page);
		}
	} catch (error) {
		return hostFailure(host.source, error);
	} finally {
		host.page.close();
	}
}
function createNodePublicationTracker(publications, waitUntil) {
	const settled = () => {
		publications.pending--;
	};
	return (completion) => {
		publications.pending++;
		completion.then(settled, settled);
		waitUntil?.(completion);
	};
}
/** Holds only one logical filled list; no native producer is suspended between next calls. */
var CodexCatalogListDriver = class {
	constructor(params) {
		this.locals = [];
		this.nodeActive = false;
		this.nodeResults = [];
		this.nodeDiscoveryFailed = false;
		this.nodePublications = { pending: 0 };
		this.nodesStarted = false;
		this.localFailed = false;
		this.active = 0;
		this.running = false;
		this.complete = false;
		this.params = params;
		this.nodeSnapshots = params.nodeSnapshots ?? new CodexCatalogNodeSnapshots();
		this.nodeGeneration = this.nodeSnapshots.start(params.config);
	}
	request() {
		if (!this.params) throw new Error("Codex catalog list operation is closed");
		return this.params;
	}
	selection() {
		if (!this.prepared) throw new Error("Codex catalog list operation is not initialized");
		return this.prepared;
	}
	async initialize() {
		const params = this.request();
		const agentId = resolveSessionAgentIdsStrict({
			config: params.config ?? {},
			agentId: params.agentId
		}).sessionAgentId;
		const query = readGatewayParams(params.query);
		const requestedHostIds = query.hostIds ? new Set(query.hostIds) : void 0;
		const localSources = params.localHomes?.filter((source) => !requestedHostIds || requestedHostIds.has(source.hostId)) ?? (params.includeLocal !== false && (!requestedHostIds || requestedHostIds.has("gateway:local")) ? [void 0] : []);
		const diagnostics = currentCodexCatalogListDiagnostics();
		if (diagnostics) diagnostics.fields.localHostCount = localSources.length;
		const store = params.bindingStore.managedThreads;
		const started = diagnostics && store ? performance.now() : 0;
		let managed;
		try {
			managed = await store?.snapshot();
		} finally {
			if (diagnostics && !diagnostics.closed && store) diagnostics.fields.managedSnapshotMs = performance.now() - started;
		}
		params.signal?.throwIfAborted();
		const fallback = localSources.some((source) => source === void 0) ? (await params.control.homesForAgent(agentId))[0] : void 0;
		params.signal?.throwIfAborted();
		this.prepared = {
			agentId,
			query,
			requestedHostIds
		};
		if (requestedHostIds && !query.hostIds?.some((host) => host.startsWith("node:"))) this.nodeHosts = [];
		for (const source of localSources) {
			const selected = source ?? fallback;
			const excluded = selected ? managed?.get(selected.sourceHomeId) : void 0;
			const host = {
				source,
				page: new CodexCatalogVisiblePage({
					control: params.control.forRequest(agentId, selected),
					cursor: query.cursors?.[source?.hostId ?? "gateway:local"],
					limit: query.limitPerHost,
					excludedThreadIds: excluded,
					searchTerm: query.search,
					signal: params.signal,
					...selected && store ? { onExcludedThread: managedMarker(store, selected.sourceHomeId, excluded) } : {}
				}),
				completion: createDeferred()
			};
			this.locals.push(host);
			publishSessionCatalogHost(params, host.completion.promise);
		}
	}
	canPause() {
		return !this.localFailed && this.nodeHosts !== void 0 && !this.nodeDiscoveryFailed && !this.nodeActive && this.nodePublications.pending === 0;
	}
	async readHost(host) {
		const params = this.request();
		if (params.allowPartialResults === true && params.onHost && params.waitUntil) {
			host.background = true;
			const completion = finishLocalHost(params, this.selection().agentId, host);
			completion.then(host.completion.resolve, host.completion.reject);
			host.value = await boundedHost(completion) ?? {
				hostId: host.source?.hostId ?? "gateway:local",
				label: host.source?.label ?? "Local Codex",
				kind: "gateway",
				connected: true,
				pending: true,
				sessions: []
			};
			return;
		}
		try {
			const page = await host.page.next();
			params.signal?.throwIfAborted();
			if (page.done) host.value = await projectLocalHost(params, this.selection().agentId, host.source, page.page);
		} catch (error) {
			this.localFailed = true;
			host.value = hostFailure(host.source, error);
		}
		if (host.value) host.completion.resolve(host.value);
	}
	startHost(host) {
		if (host.value || host.active || this.failure) return;
		this.active++;
		host.active = this.readHost(host).then(() => {
			host.active = void 0;
			this.active--;
			if (!host.value && (!this.canPause() || this.active > 0)) this.startHost(host);
			this.checkpoint();
		}, (error) => {
			host.active = void 0;
			this.active--;
			this.failure ??= { error };
			this.checkpoint();
		});
	}
	async readNodes() {
		const params = this.request();
		const { agentId, query, requestedHostIds } = this.selection();
		const diagnostics = currentCodexCatalogListDiagnostics();
		const started = diagnostics ? performance.now() : 0;
		if (diagnostics) diagnostics.fields.nodeRegistryCalls = 1;
		let nodes;
		let inventory;
		try {
			try {
				inventory = (await (params.listNodes?.() ?? params.runtime.nodes.list())).nodes;
				nodes = inventory.filter((node) => node.gatewayLocal !== true && (node.commands?.includes("codex.appServer.threads.list.v1") || codexNodeTerminalCapability(node).canStartTerminal) && (!requestedHostIds || requestedHostIds.has(`node:${node.nodeId}`))).slice(0, 100 - this.locals.length);
			} finally {
				if (diagnostics && !diagnostics.closed) diagnostics.fields.nodeRegistryMs = performance.now() - started;
			}
		} catch (error) {
			this.nodeDiscoveryFailed = true;
			const host = {
				hostId: "node:registry",
				label: "Paired nodes",
				kind: "node",
				connected: false,
				canStartTerminal: false,
				sessions: [],
				error: catalogError("NODE_LIST_FAILED", error)
			};
			params.onHost?.(host);
			return [host];
		}
		params.signal?.throwIfAborted();
		this.nodeSnapshots.observe(this.nodeGeneration, inventory);
		const { listNodeAdoptedSessionEntries, nodeAdoptedSourceKey } = await import("./session-catalog-node-adoption-ITddWx_X.mjs");
		const { compareNodeLabels, listPairedNode, nodeLabel } = await import("./session-catalog-node-continue-6g6qi4A9.mjs");
		params.signal?.throwIfAborted();
		const adopted = listNodeAdoptedSessionEntries({
			agentId,
			config: params.config,
			runtime: params.runtime,
			sessionEntries: params.sessionEntries
		});
		if (diagnostics && !diagnostics.closed) {
			diagnostics.fields.pairedNodeCalls = 0;
			diagnostics.fields.pairedNodeSettled = 0;
		}
		const trackPublication = createNodePublicationTracker(this.nodePublications, params.waitUntil);
		const partial = params.allowPartialResults === true && Boolean(params.onHost && params.waitUntil);
		const pendingHosts = nodes.toSorted(compareNodeLabels).map((node) => {
			const key = JSON.stringify([
				agentId,
				query.limitPerHost,
				query.search,
				query.cursors?.[`node:${node.nodeId}`],
				node.displayName,
				node.remoteIp,
				node.caps,
				node.commands,
				node.invocableCommands
			]);
			const publication = this.nodeSnapshots.forNode(node, this.nodeGeneration, key);
			const { project, publish, publishCached, readPublished } = createNodeHostPublication(publication, adopted, nodeAdoptedSourceKey, params.onHost, params.signal, partial, trackPublication);
			const cached = partial ? publication.read() : void 0;
			let result;
			this.nodeResults.push(() => {
				const latest = partial ? publication.read() : void 0;
				if (latest) {
					publishCached(latest);
					return project(latest.host);
				}
				return !partial ? result : publication.valid() ? readPublished() ?? result : void 0;
			});
			if (cached) publishCached(cached);
			const nodeStarted = diagnostics ? performance.now() : 0;
			if (diagnostics && !diagnostics.closed) diagnostics.fields.pairedNodeCalls = (diagnostics.fields.pairedNodeCalls ?? 0) + 1;
			const completion = measureNodeHost(listPairedNode({
				agentId,
				runtime: params.runtime,
				node,
				query,
				terminalCapabilities: codexNodeTerminalCapability(node),
				waitUntil: trackPublication,
				signal: params.signal,
				onHost: publish
			}), diagnostics, nodeStarted);
			if (cached) {
				completion.catch(() => void 0);
				return Promise.resolve(project(cached.host));
			}
			return (partial ? boundedHost(completion) : completion).then((value) => {
				result = value ? project(value) : {
					hostId: `node:${node.nodeId}`,
					label: nodeLabel(node),
					kind: "node",
					nodeId: node.nodeId,
					connected: true,
					pending: true,
					...codexNodeTerminalCapability(node),
					sessions: []
				};
				return result;
			});
		});
		try {
			return (await Promise.all(pendingHosts)).filter((host) => host !== void 0);
		} catch (error) {
			await Promise.allSettled(pendingHosts);
			throw error;
		}
	}
	startNodes() {
		if (this.nodeHosts !== void 0 || this.nodesStarted) return;
		this.nodesStarted = true;
		this.nodeActive = true;
		this.readNodes().then((hosts) => {
			this.nodeHosts = hosts;
			this.nodeActive = false;
			this.checkpoint();
		}, (error) => {
			this.nodeActive = false;
			this.failure ??= { error };
			this.checkpoint();
		});
	}
	checkpoint() {
		if (this.active > 0 || !this.step) return;
		if (this.failure) {
			if (!this.nodeActive) this.step.reject(this.failure.error);
		} else if (this.nodeHosts && this.locals.every((host) => host.value !== void 0)) try {
			this.complete = true;
			this.step.resolve({
				done: true,
				hosts: [...this.locals.flatMap((host) => host.value ? [host.value] : []), ...this.nodeResults.length ? this.nodeResults.flatMap((read) => {
					const host = read();
					return host ? [host] : [];
				}) : this.nodeHosts]
			});
		} catch (error) {
			this.failure ??= { error };
			this.step.reject(error);
		}
		else if (this.canPause()) this.step.resolve({ done: false });
	}
	async next() {
		const params = this.request();
		if (this.running || this.complete) throw new Error("Codex catalog list operation cannot advance");
		params.signal?.throwIfAborted();
		this.running = true;
		try {
			if (!this.prepared) await this.initialize();
			this.step = createDeferred();
			for (const host of this.locals) this.startHost(host);
			this.startNodes();
			this.checkpoint();
			return await this.step.promise;
		} finally {
			this.running = false;
			this.step = void 0;
		}
	}
	close() {
		if (!this.params) return;
		if (this.running) throw new Error("Cannot close an active Codex catalog list step");
		const reason = this.failure?.error ?? this.params.signal?.reason ?? /* @__PURE__ */ new Error("Codex catalog list operation closed");
		this.params = void 0;
		for (const host of this.locals) {
			if (!host.background) host.page.close();
			if (!host.value) host.completion.reject(reason);
		}
		this.locals = [];
		this.prepared = void 0;
		this.nodeHosts = void 0;
		this.nodeResults = [];
		this.failure = void 0;
	}
};
function createCodexSessionCatalogListOperation(params) {
	const driver = new CodexCatalogListDriver(params);
	return {
		next: () => driver.next(),
		close: () => driver.close()
	};
}
async function runCatalogListInline(operation) {
	try {
		for (;;) {
			const step = await operation.next();
			if (step.done) return step.hosts;
		}
	} finally {
		operation.close();
	}
}
async function listCodexSessionCatalog(params) {
	return { hosts: await runCatalogListInline(createCodexSessionCatalogListOperation(params)) };
}
//#endregion
//#region extensions/codex/src/session-catalog-transcript-item.ts
const CODEX_MESSAGE_TYPES = /* @__PURE__ */ new Map([
	["userMessage", "userMessage"],
	["agentMessage", "agentMessage"],
	["reasoning", "reasoning"]
]);
const CODEX_TOOL_TYPES = /* @__PURE__ */ new Set([
	"commandExecution",
	"fileChange",
	"mcpToolCall",
	"dynamicToolCall",
	"collabAgentToolCall",
	"webSearch",
	"imageView",
	"imageGeneration"
]);
function toGenericTranscriptItem(item) {
	let type = CODEX_MESSAGE_TYPES.get(item.type);
	if (!type && CODEX_TOOL_TYPES.has(item.type)) type = item.result !== void 0 || Boolean(item.aggregatedOutput) ? "toolResult" : "toolCall";
	type ??= "other";
	const fallback = item.title ?? item.name ?? item.tool ?? item.command ?? item.query ?? void 0;
	const resultText = item.aggregatedOutput || (item.result === void 0 ? void 0 : JSON.stringify(item.result, null, 2));
	const changesText = Array.isArray(item.changes) ? item.changes.map((change) => `${change.kind}: ${change.path}`).join("\n") || void 0 : void 0;
	const text = item.type === "userMessage" ? projectCodexUserItemText(item) : item.text || resultText || changesText || fallback;
	return {
		id: item.id,
		type,
		...text ? { text } : {},
		raw: item
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-transcript.ts
const transcriptPageSchema = z.strictObject({
	items: z.array(z.strictObject({
		id: z.string(),
		type: z.enum([
			"userMessage",
			"agentMessage",
			"reasoning",
			"toolCall",
			"toolResult",
			"other"
		]),
		text: z.string().optional(),
		raw: z.record(z.string(), z.json()).optional(),
		truncated: z.boolean().optional()
	})),
	nextCursor: z.string().optional()
});
function parseCodexCatalogTranscriptPage(value) {
	return transcriptPageSchema.parse(value);
}
function projectTranscriptPage(items, limit) {
	const projected = items.map(toGenericTranscriptItem);
	const page = sessionCatalogPaging.boundTranscriptPage(projected.toReversed(), limit, 0).items;
	for (const [index, item] of page.entries()) if (item.text !== projected[index]?.text && projected[index]?.text) item.truncated = true;
	return page;
}
function pageFitsNodeTransport(page) {
	return Buffer.byteLength(JSON.stringify({ payloadJSON: JSON.stringify(page) }), "utf8") <= MAX_TRANSCRIPT_PAGE_BYTES;
}
/** The legacy API can anchor a turn, but cannot continue within that turn. */
async function readLegacyCodexTranscriptPage(readTurns, request) {
	return readLegacyCodexHistoryPage(readTurns, request, {
		project: (entries, limit) => projectTranscriptPage(entries.map(({ item }) => item), limit),
		fits: pageFitsNodeTransport
	});
}
/** Uses the native store's item cursor whenever that store supports item history. */
async function readCodexCatalogTranscriptPage(control, request) {
	const thread = await control.requireEligibleThread(request.threadId);
	return readCodexThreadHistoryPage(control, thread, request, {
		project: (entries, limit) => projectTranscriptPage(entries.map(({ item }) => item), limit),
		fits: pageFitsNodeTransport
	});
}
//#endregion
//#region extensions/codex/src/session-catalog-listing.ts
/** Builds the node-local read-only Codex app-server catalog command. */
function createCodexSessionCatalogNodeHostCommands(controlFactory, bindingStore) {
	const bindRequest = async (paramsJSON) => {
		const parsed = parseJsonParams(paramsJSON);
		if (!isRecord(parsed)) throw new CatalogParamsError("Codex session catalog parameters must be an object");
		const agentId = readBoundedOptionalString(parsed, "agentId", 256);
		const sourceHomeId = readBoundedOptionalString(parsed, "sourceHomeId", 256);
		const source = await controlFactory.forNode(agentId);
		if (sourceHomeId && sourceHomeId !== source.sourceHomeId) throw new CatalogParamsError("Codex catalog source home changed. Reopen the session from the catalog.");
		const request = { ...parsed };
		delete request.agentId;
		delete request.sourceHomeId;
		return {
			...source,
			params: request,
			paramsJSON: JSON.stringify(request)
		};
	};
	const commands = [
		{
			command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
			cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
			dangerous: false,
			hasActiveWork: controlFactory.hasActiveWork,
			onDisconnect: controlFactory.disconnect,
			handle: async (paramsJSON) => {
				const request = await bindRequest(paramsJSON);
				const pageParams = readPageParams(request.params);
				try {
					const managedThreads = await bindingStore?.managedThreads?.snapshot();
					const sourceHomeId = request.sourceHomeId;
					const managedThreadIds = sourceHomeId ? managedThreads?.get(sourceHomeId) : void 0;
					const page = await listVisiblePage({
						control: request.control,
						cursor: pageParams.cursor,
						cwd: pageParams.cwd,
						excludedThreadIds: managedThreadIds,
						limit: pageParams.limit,
						...sourceHomeId && bindingStore?.managedThreads ? { onExcludedThread: async ({ threadId, rolloutPath }) => {
							if (!managedThreadIds?.has(threadId)) await bindingStore.managedThreads?.mark({
								sourceHomeId,
								threadId,
								...rolloutPath ? { rolloutPath } : {}
							});
						} } : {},
						searchTerm: pageParams.searchTerm
					});
					return JSON.stringify({
						...page,
						sourceHomeId: request.sourceHomeId,
						canContinueCodex: request.transport === "stdio"
					});
				} catch {
					throw new Error("Codex app-server catalog is unavailable");
				}
			}
		},
		{
			command: CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
			cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
			dangerous: false,
			hasActiveWork: controlFactory.hasActiveWork,
			onDisconnect: controlFactory.disconnect,
			handle: async (paramsJSON) => {
				const request = await bindRequest(paramsJSON);
				const action = readNodeTranscriptParams(request.params);
				try {
					await request.control.requireEligibleThread(action.threadId);
					const page = parseTranscriptPage(await request.control.listTurnPage({
						threadId: action.threadId,
						limit: action.limit,
						sortDirection: "desc",
						itemsView: "full",
						...action.cursor ? { cursor: action.cursor } : {}
					}));
					return JSON.stringify(page);
				} catch (error) {
					if (error instanceof CatalogParamsError) throw error;
					throw new Error("Codex app-server transcript is unavailable", { cause: error });
				}
			}
		},
		{
			command: CODEX_CATALOG_TRANSCRIPT_READ_COMMAND,
			cap: CODEX_APP_SERVER_THREADS_CAPABILITY,
			dangerous: false,
			hasActiveWork: controlFactory.hasActiveWork,
			onDisconnect: controlFactory.disconnect,
			handle: async (paramsJSON) => {
				const request = await bindRequest(paramsJSON);
				const action = readNodeTranscriptParams(request.params);
				try {
					return JSON.stringify(await readCodexCatalogTranscriptPage(request.control, action));
				} catch (error) {
					if (error instanceof CatalogParamsError) throw error;
					throw new Error("Codex app-server transcript is unavailable", { cause: error });
				}
			}
		},
		createCodexTerminalNodeHostCommand(bindRequest),
		createCodexTerminalStartNodeHostCommand()
	];
	return process.env.OPENCLAW_NODE_EXEC_HOST?.trim().toLowerCase() === "app" ? commands.filter(({ command }) => command !== CODEX_CATALOG_TRANSCRIPT_READ_COMMAND) : commands;
}
function readNodeTranscriptParams(value) {
	if (!isRecord(value)) throw new CatalogParamsError("Codex session read parameters must be an object");
	requireOnlyKeys(value, /* @__PURE__ */ new Set([
		"threadId",
		"cursor",
		"limit"
	]));
	const threadId = readBoundedOptionalString(value, "threadId", 256);
	if (!threadId) throw new CatalogParamsError("threadId is required");
	const cursor = readBoundedOptionalString(value, "cursor", MAX_CURSOR_LENGTH);
	return {
		threadId,
		limit: readBoundedLimit(value.limit, "limit", 20, 50),
		...cursor ? { cursor } : {}
	};
}
function readBoundedLimit(value, key, fallback, max) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || value < 1 || value > max) throw new CatalogParamsError(`${key} must be an integer from 1 to ${max}`);
	return value;
}
/** Reads the persisted transcript for a Gateway-local or paired-node Codex session. */
async function readCodexSessionTranscript(params) {
	const cursor = readControlCursor(params.cursor, "transcript request");
	const limit = readBoundedLimit(params.limit, "limit", 20, 50);
	if (params.source || params.hostId === "gateway:local") {
		const page = await readCodexCatalogTranscriptPage(params.control, {
			threadId: params.threadId,
			limit,
			cursor
		});
		return {
			hostId: params.hostId,
			label: params.source?.label ?? "Local Codex",
			threadId: params.threadId,
			...page
		};
	}
	const nodeId = params.hostId.slice(5);
	const node = (await params.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("codex.appServer.thread.turns.list.v1"));
	if (!node) throw new CatalogParamsError("paired-node Codex session host is offline or unavailable");
	const invoke = async (command, request) => unwrapNodeInvokePayload(await params.runtime.nodes.invoke({
		nodeId,
		command,
		params: {
			agentId: params.agentId,
			threadId: params.threadId,
			...params.sourceHomeId ? { sourceHomeId: params.sourceHomeId } : {},
			...request
		},
		timeoutMs: NODE_INVOKE_TIMEOUT_MS,
		scopes: ["operator.write"]
	}));
	const page = node.commands?.includes("codex.sessionCatalog.transcript.read.v1") ? parseCodexCatalogTranscriptPage(await invoke(CODEX_CATALOG_TRANSCRIPT_READ_COMMAND, {
		cursor,
		limit
	})) : await readLegacyCodexTranscriptPage(async ({ cursor: turnCursor, limit: turnLimit }) => parseTranscriptPage(await invoke(CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND, {
		cursor: turnCursor,
		limit: turnLimit
	})), {
		threadId: params.threadId,
		cursor,
		limit
	});
	const { nodeLabel } = await import("./session-catalog-node-continue-6g6qi4A9.mjs");
	return {
		hostId: params.hostId,
		label: nodeLabel(node),
		threadId: params.threadId,
		...page
	};
}
//#endregion
//#region extensions/codex/src/session-upstream-activity.ts
const CODEX_UPSTREAM_TURN_LIMIT = 100;
function readMarker(probe) {
	if (!isRecord(probe.marker)) return;
	const turnId = probe.marker.turnId;
	if (turnId !== null && typeof turnId !== "string") return;
	const count = probe.marker.userMessageCount;
	if (count !== void 0 && (!Number.isSafeInteger(count) || count < 0)) return;
	return {
		turnId,
		...count === void 0 ? {} : { userMessageCount: count }
	};
}
function upstreamConnectionFingerprint(probe) {
	return isRecord(probe.upstreamRef) && typeof probe.upstreamRef.connectionFingerprint === "string" ? probe.upstreamRef.connectionFingerprint : void 0;
}
function classifyCodexUpstreamTurns(params) {
	const marker = readMarker(params.probe);
	if (!marker) return;
	const newest = params.turns[0];
	if (!newest?.id) return;
	const markerIndex = marker.turnId === null ? -1 : params.turns.findIndex((turn) => turn.id === marker.turnId);
	const candidateTurns = markerIndex < 0 ? params.turns : params.turns.slice(0, markerIndex + 1);
	const newestUserMessageCount = countUserMessages(newest);
	if (!(marker.turnId !== newest.id || marker.userMessageCount === void 0 || newestUserMessageCount > marker.userMessageCount)) return;
	const ownTexts = new Set(params.probe.ownRecentUserTexts);
	let humanTurns = 0;
	let occurredAt;
	for (const turn of candidateTurns) {
		const userMessages = turn.items.filter((item) => item.type === "userMessage");
		const alreadySeen = turn.id === marker.turnId ? marker.userMessageCount ?? userMessages.length : 0;
		for (const item of userMessages.slice(alreadySeen)) {
			const texts = normalizeUserMessageTexts(item);
			if (ownTexts.has(texts.join(" ")) || texts.length > 1 && texts.every((text) => ownTexts.has(text))) continue;
			humanTurns += 1;
			if (occurredAt === void 0) {
				const timestampSeconds = turn.completedAt ?? turn.startedAt;
				occurredAt = typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds) ? timestampSeconds * 1e3 : params.now ?? Date.now();
			}
		}
	}
	const activityId = `${newest.id}:${newestUserMessageCount}`;
	return {
		kind: "activity",
		sessionKey: params.probe.sessionKey,
		humanTurns,
		nextMarker: {
			turnId: newest.id,
			userMessageCount: newestUserMessageCount
		},
		...humanTurns > 0 ? {
			occurredAt: occurredAt ?? params.now ?? Date.now(),
			dedupeId: activityId
		} : {}
	};
}
function countUserMessages(turn) {
	return turn.items.filter((item) => item.type === "userMessage").length;
}
function normalizeUserMessageTexts(item) {
	const typed = item;
	const contentTexts = typed.content?.filter((input) => input.type === "text").map((input) => input.text.trim().replace(/\s+/g, " ")).filter(Boolean);
	return contentTexts?.length ? contentTexts : [(typed.text ?? "").trim().replace(/\s+/g, " ")];
}
async function checkCodexUpstreamActivity(probes, control, resolveThreadId = (probe) => probe.threadId) {
	return await control.withPinnedConnection(async (pinned) => {
		const activities = [];
		for (const probe of probes) {
			const fingerprint = upstreamConnectionFingerprint(probe);
			if (probe.upstreamKind !== "codex-app-server" || !fingerprint || fingerprint !== pinned.connectionFingerprint) continue;
			try {
				const threadId = resolveThreadId(probe);
				const page = await pinned.listTurnPage({
					threadId,
					limit: CODEX_UPSTREAM_TURN_LIMIT,
					sortDirection: "desc",
					itemsView: "full"
				}).catch((error) => {
					if (error instanceof CodexAppServerRpcError && error.code === -32600) return;
					throw error;
				});
				if (!page?.data.length && readMarker(probe)) {
					try {
						await pinned.readThread(threadId, false);
					} catch (error) {
						if (isCodexThreadReadMissingError(error, threadId)) activities.push({
							kind: "missing",
							sessionKey: probe.sessionKey
						});
					}
					continue;
				}
				const activity = page && classifyCodexUpstreamTurns({
					probe,
					turns: page.data
				});
				if (activity) activities.push(activity);
			} catch {}
		}
		return activities;
	});
}
function createChecker(params) {
	const resolveThreadId = (probe) => {
		const config = params.getRuntimeConfig();
		const sessionId = params.api.runtime.agent.session.getSessionEntry({
			agentId: probe.agentId,
			sessionKey: probe.sessionKey,
			readConsistency: "latest"
		})?.sessionId?.trim();
		if (!sessionId) return probe.threadId;
		const binding = params.bindingStore.read(sessionBindingIdentity({
			sessionId,
			sessionKey: probe.sessionKey,
			config
		}));
		return binding?.connectionScope === "supervision" && binding.supervisionSourceThreadId === probe.threadId ? binding.threadId : probe.threadId;
	};
	return async (probes) => {
		const groups = /* @__PURE__ */ new Map();
		for (const probe of probes) {
			const fingerprint = upstreamConnectionFingerprint(probe);
			if (!fingerprint) continue;
			const control = await params.control.forUpstream(probe.agentId, fingerprint);
			if (!control) continue;
			const key = `${probe.agentId}\0${fingerprint}`;
			const group = groups.get(key) ?? {
				control,
				probes: []
			};
			group.probes.push(probe);
			groups.set(key, group);
		}
		return (await Promise.all([...groups.values()].map((group) => checkCodexUpstreamActivity(group.probes, group.control, resolveThreadId)))).flat();
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-eligibility.ts
/** Exact identity and native membership are independent of resident retention. */
async function requireEligibleCodexThread(params) {
	const { requests, threadId } = params;
	const deadline = params.now() + requests.requestTimeoutMs;
	const unverified = () => new CatalogParamsError("Codex session eligibility could not be verified. Refresh the catalog and verify the session in its native Codex home before retrying.");
	const remaining = () => {
		const timeoutMs = Math.ceil(deadline - params.now());
		if (timeoutMs <= 0) throw unverified();
		return timeoutMs;
	};
	const verify = async () => {
		if (params.sourceHomeId && await params.managedThreads?.has(params.sourceHomeId, threadId)) throw unverified();
		remaining();
		const index = await requests.index();
		const root = params.localSessionsRoot;
		if (root && index.get(threadId)?.archived) throw unverified();
		const thread = await requests.readThread(threadId, false, remaining());
		remaining();
		if (thread.id !== threadId || thread.ephemeral === true || !isInteractiveThreadSource(thread.source)) throw unverified();
		if (!root) {
			const { CODEX_CATALOG_NATIVE_PAGE_LIMIT } = await import("./session-catalog-native-projection-DowriLid.mjs").then((n) => n.a);
			const { CODEX_CATALOG_MAX_ROWS } = await import("./session-catalog-native-projection-DowriLid.mjs").then((n) => n.G);
			let cursor;
			const seenCursors = /* @__PURE__ */ new Set();
			for (;;) {
				const page = await requests.listThreads({
					archived: false,
					limit: CODEX_CATALOG_NATIVE_PAGE_LIMIT,
					modelProviders: [],
					sortKey: "recency_at",
					sortDirection: "desc",
					...thread.cwd ? { cwd: thread.cwd } : {},
					...cursor ? { cursor } : {}
				}, remaining());
				remaining();
				const listed = page.data.find((entry) => entry.id === threadId);
				if (listed) {
					if (listed.ephemeral === true || !isInteractiveThreadSource(listed.source)) throw unverified();
					break;
				}
				const nextCursor = readControlCursor(page.nextCursor, "next response");
				if (!nextCursor || seenCursors.has(nextCursor)) throw unverified();
				seenCursors.add(nextCursor);
				if (seenCursors.size > CODEX_CATALOG_MAX_ROWS) {
					const oldest = seenCursors.values().next().value;
					if (oldest !== void 0) seenCursors.delete(oldest);
				}
				cursor = nextCursor;
			}
		}
		if (root) {
			if (!thread.path) throw unverified();
			const metadata = await readCodexSessionMeta(root, thread.path, threadId);
			remaining();
			if (!metadata || !isInteractiveThreadSource(metadata.source) || metadata.originator === "openclaw") throw unverified();
			await index.upsertThread(thread);
			remaining();
		}
		return thread;
	};
	return await withTimeout(verify(), requests.requestTimeoutMs, "Codex session eligibility could not be verified", unverified);
}
//#endregion
//#region extensions/codex/src/session-catalog-control-requests.ts
function createCodexCatalogRequestSnapshot(requestTimeoutMs, request, index, beginList, catalogRead = false) {
	const read = (method, params, timeoutMs, observation) => {
		const scope = catalogRead ? void 0 : currentCodexCatalogListRequest();
		if (!scope) return request(method, params, timeoutMs, void 0, observation);
		return scope.read(timeoutMs ?? requestTimeoutMs, async (remaining) => {
			const attempt = beginList(scope);
			if (!attempt.allowed) throw attempt.error;
			return await request(method, params, remaining, void 0, observation);
		});
	};
	return {
		index,
		beginList,
		get requestTimeoutMs() {
			return catalogRead ? requestTimeoutMs : currentCodexCatalogListRequest()?.remaining(requestTimeoutMs) ?? requestTimeoutMs;
		},
		listThreads: (params, timeoutMs, observation) => read(CODEX_CONTROL_METHODS.listThreads, params, timeoutMs, observation),
		listThreadTurns: (params) => read(CODEX_CONTROL_METHODS.listThreadTurns, params),
		listThreadItems: (params) => read(CODEX_CONTROL_METHODS.listThreadItems, params),
		forkThread: (params, assertCurrent) => request(CODEX_CONTROL_METHODS.forkThread, assertCodexThreadForkParams(params), void 0, assertCurrent),
		readThread: async (threadId, includeTurns, timeoutMs) => (await read(CODEX_CONTROL_METHODS.readThread, {
			threadId,
			includeTurns
		}, timeoutMs)).thread,
		archiveThread: async (threadId, assertCurrent) => {
			await request(CODEX_CONTROL_METHODS.archiveThread, { threadId }, void 0, assertCurrent);
		}
	};
}
function createCodexSessionCatalogControlFromRequests(params) {
	return {
		forkContext: params.forkContext,
		...params.clientId ? { clientId: params.clientId } : {},
		...params.connectionFingerprint ? { connectionFingerprint: params.connectionFingerprint } : {},
		withPinnedConnection: params.withPinnedConnection,
		async initialize() {
			await (await params.createRequestSnapshot().index()).initialize();
		},
		requireEligibleThread: (threadId) => requireEligibleCodexThread({
			threadId,
			requests: params.createRequestSnapshot(),
			localSessionsRoot: params.localSessionsRoot,
			sourceHomeId: params.sourceHomeId,
			managedThreads: params.managedThreads,
			now: params.now
		}),
		retireConnection: params.retireConnection,
		async listPage(pageParams) {
			readControlCursor(pageParams.cursor, "request");
			const query = readPageParams(pageParams);
			return await withCodexCatalogListRequest(async (request) => {
				const requests = params.createRequestSnapshot();
				const timeoutMs = Math.min(requests.requestTimeoutMs, 5e3);
				const deadline = request.constrainDeadline(performance.now() + timeoutMs);
				return await (await withTimeout(requests.index(), request.remaining(timeoutMs), "Codex session catalog is still loading", () => new CodexCatalogLoadingError())).list(query, deadline);
			});
		},
		async listDescendantPage(listParams) {
			const requests = params.createRequestSnapshot();
			return await requests.listThreads(listParams, requests.requestTimeoutMs);
		},
		async readThread(threadId, includeTurns = false) {
			return await params.createRequestSnapshot().readThread(threadId, includeTurns);
		},
		async listTurnPage(listParams) {
			return await params.createRequestSnapshot().listThreadTurns(listParams);
		},
		listItemPage: (listParams) => params.createRequestSnapshot().listThreadItems(listParams),
		async forkThread(forkParams, assertCurrent) {
			const requests = params.createRequestSnapshot();
			const index = forkParams.ephemeral === true ? void 0 : await requests.index();
			const response = await requests.forkThread(forkParams, assertCurrent);
			if (index && !index.get(response.thread.id)) await index.upsertThread(response.thread);
			return response;
		},
		async archiveThread(threadId, assertCurrent) {
			const requests = params.createRequestSnapshot();
			const index = await requests.index();
			await requests.archiveThread(threadId, assertCurrent);
			index.archive(threadId);
		}
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-homes.ts
/** Discovers path facts on demand; runtime projections belong only to their requesting owner. */
function createCodexCatalogHomeResolver(params) {
	const env = params.env ?? process.env;
	const generations = /* @__PURE__ */ new WeakMap();
	let lastConfig = params.config;
	const currentConfig = () => lastConfig = params.getRuntimeConfig() ?? lastConfig;
	const generation = () => {
		const config = currentConfig();
		let current = generations.get(config);
		if (!current) {
			current = {
				config,
				assertCurrent: () => {
					if (currentConfig() !== config) throw new CatalogParamsError("Codex session catalog configuration changed; retry the request");
				},
				pluginConfig: params.getPluginConfig(),
				agentDirs: /* @__PURE__ */ new Map(),
				paths: /* @__PURE__ */ new Map(),
				directories: /* @__PURE__ */ new Set()
			};
			generations.set(config, current);
		}
		return current;
	};
	const agentIds = (snapshot) => snapshot.agentIds ??= listAgentIds(snapshot.config).toSorted((a, b) => a.localeCompare(b));
	const agentDir = (snapshot, agentId) => {
		let directory = snapshot.agentDirs.get(agentId);
		if (!directory) {
			directory = resolveAgentDir(snapshot.config, agentId, env);
			snapshot.agentDirs.set(agentId, directory);
		}
		return directory;
	};
	const homePath = async (snapshot, value) => {
		const cached = snapshot.paths.get(value);
		if (cached !== void 0) return cached;
		const resolved = path.resolve(value);
		const discovery = canonicalPathFromExistingAncestor(resolved).catch(() => resolved).then(async (canonical) => {
			if (await fs.stat(canonical).then((stat) => stat.isDirectory(), () => false)) snapshot.directories.add(value);
			snapshot.paths.set(value, canonical);
			return canonical;
		});
		snapshot.paths.set(value, discovery);
		return discovery;
	};
	const sharedCandidates = (snapshot) => snapshot.candidates ??= (async () => {
		const candidates = [];
		const seen = /* @__PURE__ */ new Set();
		const append = async (value, label) => {
			const codexHome = await homePath(snapshot, value);
			if (!snapshot.directories.has(value) || seen.has(codexHome)) return;
			seen.add(codexHome);
			candidates.push({
				codexHome,
				label: `Local Codex · ${label ?? path.basename(codexHome)}`
			});
		};
		for (const id of agentIds(snapshot)) {
			await scheduler.yield();
			const directory = await homePath(snapshot, agentDir(snapshot, id));
			await append(resolveCodexAppServerHomeDir(directory), id);
			if (candidates.length === 100) return candidates;
		}
		for (const entry of readCodexPluginConfig(snapshot.pluginConfig).sessionCatalog?.homes ?? []) {
			await scheduler.yield();
			const { path: home, label } = typeof entry === "string" ? { path: entry } : entry;
			await append(home, label);
			if (candidates.length === 100) break;
		}
		return candidates;
	})().then((candidates) => snapshot.candidates = candidates, (error) => {
		snapshot.candidates = void 0;
		throw error;
	});
	const prepareAgentHomes = async (snapshot, agentId, fleet) => {
		await scheduler.yield();
		snapshot.assertCurrent();
		if (!agentIds(snapshot).includes(agentId)) return [];
		const ownerAgentDir = await homePath(snapshot, agentDir(snapshot, agentId));
		const base = params.resolveRuntimeOptions({
			config: snapshot.config,
			pluginConfig: snapshot.pluginConfig,
			agentDir: ownerAgentDir,
			env
		});
		const processHomeConfigured = Boolean(env.CODEX_HOME?.trim());
		const candidates = [{
			codexHome: await homePath(snapshot, resolveCodexAppServerLocalHomeDir(base.start, ownerAgentDir, env)),
			label: "Local Codex",
			usesProcessHomeFallback: base.start.transport === "stdio" && base.start.homeScope === "user" && !processHomeConfigured
		}];
		if (fleet && base.start.transport === "stdio") {
			candidates.push({
				codexHome: await homePath(snapshot, resolveCodexAppServerUserHomeDir(env)),
				label: "Local Codex · user",
				usesProcessHomeFallback: !processHomeConfigured
			});
			const ownerHome = resolveCodexAppServerHomeDir(ownerAgentDir);
			const codexHome = await homePath(snapshot, ownerHome);
			if (snapshot.directories.has(ownerHome)) candidates.push({
				codexHome,
				label: `Local Codex · ${agentId}`
			});
			candidates.push(...await sharedCandidates(snapshot));
		}
		snapshot.assertCurrent();
		const homes = [];
		const seen = /* @__PURE__ */ new Set();
		for (const candidate of candidates) {
			if (seen.has(candidate.codexHome)) continue;
			seen.add(candidate.codexHome);
			const sourceHomeId = codexCatalogHomeIdFromCanonicalPath(candidate.codexHome);
			const primary = homes.length === 0;
			homes.push({
				assertCurrent: snapshot.assertCurrent.bind(snapshot),
				sourceHomeId,
				hostId: primary ? CODEX_LOCAL_SESSION_HOST_ID : `${CODEX_LOCAL_SESSION_HOST_ID}:${sourceHomeId}`,
				label: candidate.label,
				agentDir: ownerAgentDir,
				appServer: base.start.transport !== "stdio" ? base : {
					...base,
					start: {
						...base.start,
						codexHome: candidate.codexHome,
						...!primary ? {
							homeScope: "user",
							env: {
								...base.start.env,
								CODEX_HOME: candidate.codexHome
							}
						} : {}
					}
				},
				...base.connectionClass === "remote" ? {} : { localSessionsRoot: path.join(candidate.codexHome, "sessions") },
				usesProcessHomeFallback: candidate.usesProcessHomeFallback ?? false
			});
			if (homes.length === 100) break;
		}
		return homes;
	};
	setCodexCatalogConnectionHomeResolver(async (directory) => {
		const snapshot = generation();
		for (const id of agentIds(snapshot)) {
			await scheduler.yield();
			if (agentDir(snapshot, id) === directory) return prepareAgentHomes(snapshot, id, true);
		}
		snapshot.assertCurrent();
		return [];
	});
	return {
		forAgent: (agentId) => prepareAgentHomes(generation(), agentId, true),
		async forNode(requestedAgentId) {
			const snapshot = generation();
			const configured = readCodexPluginConfig(snapshot.pluginConfig).appServer;
			if (configured?.homeScope === "agent" || configured?.transport && configured.transport !== "stdio") {
				const agentId = resolveSessionAgentIdsStrict({
					config: snapshot.config,
					agentId: requestedAgentId
				}).sessionAgentId;
				const source = (await prepareAgentHomes(snapshot, agentId, false))[0];
				if (!source) throw new CatalogParamsError(`unknown Codex session catalog agent: ${agentId}`);
				return {
					...source,
					agentId,
					codexHome: resolveCodexAppServerLocalHomeDir(source.appServer.start, source.agentDir, env)
				};
			}
			const codexHome = await homePath(snapshot, resolveCodexAppServerUserHomeDir(env));
			snapshot.assertCurrent();
			const appServer = params.resolveRuntimeOptions({
				pluginConfig: snapshot.pluginConfig,
				config: snapshot.config,
				env
			});
			return {
				assertCurrent: snapshot.assertCurrent.bind(snapshot),
				sourceHomeId: codexCatalogHomeIdFromCanonicalPath(codexHome),
				codexHome,
				localSessionsRoot: path.join(codexHome, "sessions"),
				appServer: {
					...appServer,
					start: {
						...appServer.start,
						env: {
							...appServer.start.env,
							CODEX_HOME: codexHome
						}
					}
				}
			};
		}
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-source-backoff.ts
const INITIAL_BACKOFF_MS = 5e3;
const MAX_BACKOFF_MS = 6e4;
/** Source health is separate from query-keyed page sharing and cached page delivery. */
var CodexCatalogSourceBackoff = class {
	constructor(now) {
		this.now = now;
		this.sourcesByConfig = /* @__PURE__ */ new WeakMap();
	}
	begin(config, agentId, sourceHomeId, scope) {
		let sources = this.sourcesByConfig.get(config);
		if (!sources) {
			sources = /* @__PURE__ */ new Map();
			this.sourcesByConfig.set(config, sources);
		}
		const key = JSON.stringify([agentId, sourceHomeId ?? null]);
		if (scope) return scope.attempt(sources, key, () => this.begin(config, agentId, sourceHomeId));
		let state = sources.get(key);
		if (!state) {
			state = {};
			sources.set(key, state);
		}
		const failure = state.failure;
		if (failure && (failure.probing || failure.retryAt > this.now())) return {
			allowed: false,
			error: failure.error
		};
		if (failure) failure.probing = true;
		return {
			allowed: true,
			resolved: () => {
				if (sources.get(key) === state) sources.set(key, {});
			},
			rejected: (error) => {
				if (sources.get(key) !== state) return;
				if (error instanceof CatalogParamsError || error instanceof Error && error.name === "AbortError" || error instanceof CodexAppServerRpcError && (error.code === -32600 || error.code === -32602)) {
					if (failure) failure.probing = false;
					return;
				}
				const delayMs = findCodexAppServerSpawnError(error) ? Infinity : failure ? Math.min(failure.delayMs * 2 || INITIAL_BACKOFF_MS, MAX_BACKOFF_MS) : 0;
				sources.set(key, { failure: {
					error,
					delayMs,
					retryAt: this.now() + delayMs,
					probing: false
				} });
			},
			abandoned: () => {
				if (sources.get(key) === state && failure) failure.probing = false;
			}
		};
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-control.ts
/** Builds the passive catalog over the Codex plugin's canonical shared client. */
function createCodexSessionCatalogControl(params) {
	const now = params.now ?? Date.now;
	const sourceBackoff = new CodexCatalogSourceBackoff(now);
	const noConfig = {};
	const getPluginConfig = () => params.getPluginConfig();
	const resolveRuntimeOptions = (options) => {
		const runtime = params.resolveRuntimeOptions(options);
		return runtime.start.transport === "stdio" && runtime.start.commandSource === "managed" ? {
			...runtime,
			start: {
				...runtime.start,
				managedCommandOrder: "package-only"
			}
		} : runtime;
	};
	const homeResolver = createCodexCatalogHomeResolver({
		config: params.config ?? {},
		getRuntimeConfig: params.getRuntimeConfig,
		getPluginConfig: params.getPluginConfig,
		resolveRuntimeOptions,
		...params.env ? { env: params.env } : {}
	});
	const requestOptionsByConfig = /* @__PURE__ */ new WeakMap();
	const indexes = /* @__PURE__ */ new Map();
	const retiringState = /* @__PURE__ */ new Map();
	const directHomes = /* @__PURE__ */ new Map();
	const residentRequests = /* @__PURE__ */ new Set();
	let generation = params.getRuntimeConfig();
	let residentEpoch = 0;
	let starting = 0;
	let closed = false;
	let runBackground = (run) => run();
	let retiring;
	const retireIndexes = () => {
		residentEpoch++;
		const closing = [];
		for (const [homeId, index] of indexes) {
			const writes = index.retire().finally(() => {
				if (retiringState.get(homeId) === writes) retiringState.delete(homeId);
			});
			retiringState.set(homeId, writes);
			closing.push(writes, index.close());
		}
		indexes.clear();
		directHomes.clear();
		const drain = Promise.allSettled([retiring, ...closing]).then(() => {
			if (retiring === drain) retiring = void 0;
		});
		retiring = drain;
		return drain;
	};
	const resolveResident = async (agentId, source) => {
		if (closed) throw new Error("Codex resident catalog is closed");
		const config = params.getRuntimeConfig();
		if (generation !== config) {
			generation = config;
			retireIndexes();
		}
		const epoch = residentEpoch;
		const runtime = source?.appServer ?? resolveRuntimeOptions({ pluginConfig: getPluginConfig() });
		const requestOptions = resolveRequestOptions(runtime.start, agentId, source);
		const key = source?.sourceHomeId ?? agentId ?? "";
		let home = directHomes.get(key);
		if (!home) {
			home = codexCatalogResidentHomeKey({
				startOptions: requestOptions.startOptions,
				agentDir: requestOptions.agentDir,
				sourceHomeId: source?.sourceHomeId
			});
			directHomes.set(key, home);
		}
		const homeId = await home;
		await retiringState.get(homeId);
		if (closed || generation !== config || residentEpoch !== epoch) throw new Error("Codex catalog configuration changed");
		let index = indexes.get(homeId);
		if (!index) {
			const [{ CodexCatalogIndex }, { canReuseCodexCatalogPreview, projectCodexCatalogDeltaPage, projectCodexCatalogPage }] = await Promise.all([import("./session-catalog-index-B9_VQIUz.mjs"), import("./session-catalog-projection-zK_PUsiE.mjs")]);
			source?.assertCurrent();
			if (closed || generation !== config || residentEpoch !== epoch) throw new Error("Codex catalog configuration changed");
			index = indexes.get(homeId);
			if (index) return index;
			const root = source?.localSessionsRoot ?? (runtime.connectionClass !== "remote" ? path.join(resolveCodexAppServerLocalHomeDir(requestOptions.startOptions, requestOptions.agentDir, params.env), "sessions") : void 0);
			let nativeAttempt;
			const readNativePage = async (query, remainingRows, project, foreground) => {
				const requests = createRequestSnapshot(agentId, source, true, query.useStateDbOnly ? (thread) => {
					const row = index?.get(thread.id);
					return canReuseCodexCatalogPreview(row, thread) ? row?.preview : void 0;
				} : void 0, remainingRows);
				const attempt = foreground ? requests.beginList(foreground) : query.cursor && nativeAttempt ? nativeAttempt : requests.beginList();
				if (!foreground) nativeAttempt = attempt;
				if (!attempt.allowed) throw attempt.error;
				const diagnostics = startCodexCatalogPageDiagnostics("cold");
				if (diagnostics) diagnostics.fields.controlRequestCalls = 1;
				const observation = startCodexCatalogControlRequestDiagnostics(diagnostics);
				let outcome = "rejected";
				try {
					const started = performance.now();
					let response;
					try {
						response = await requests.listThreads(query, foreground?.remaining(requests.requestTimeoutMs) ?? requests.requestTimeoutMs, observation);
					} finally {
						if (diagnostics) {
							const elapsed = performance.now() - started;
							diagnostics.fields.inclusiveControlRequestWaitMs = elapsed;
							diagnostics.fields.inclusiveControlRequestWaitMaxMs = elapsed;
						}
					}
					foreground?.assertActive();
					const page = await project(response, diagnostics);
					foreground?.assertActive();
					outcome = "resolved";
					return page;
				} catch (error) {
					observation?.rejected();
					throw error;
				} finally {
					observation?.close();
					diagnostics?.finish(outcome);
				}
			};
			index = new CodexCatalogIndex({
				homeId,
				requestTimeoutMs: runtime.requestTimeoutMs,
				runBackground: (run) => runBackground(run),
				localSessionsRoot: root,
				state: params.openResidentState?.(homeId),
				runNativeWalk: async (run) => {
					try {
						const result = await run();
						if (nativeAttempt?.allowed) nativeAttempt.resolved();
						return result;
					} catch (error) {
						if (nativeAttempt?.allowed) nativeAttempt.rejected(error);
						throw error;
					} finally {
						nativeAttempt = void 0;
					}
				},
				assertCurrent: () => {
					source?.assertCurrent();
					if (closed || params.getRuntimeConfig() !== config || residentEpoch !== epoch) throw new Error("Codex catalog configuration changed");
				},
				readNative: (query, remainingRows, foreground) => readNativePage(query, Math.min(64, remainingRows), async (response, diagnostics) => {
					const { sanitizeTerminalText } = await import("openclaw/plugin-sdk/text-chunking");
					const bounded = {
						...response,
						data: response.data.slice(0, remainingRows)
					};
					const projection = {
						localSessionsRoot: root,
						sanitize: sanitizeTerminalText,
						diagnostics
					};
					return query.useStateDbOnly ? await projectCodexCatalogDeltaPage(bounded, {
						...projection,
						getRow: (threadId) => index?.get(threadId)
					}) : await projectCodexCatalogPage(bounded, projection);
				}, foreground)
			});
			indexes.set(homeId, index);
		}
		return index;
	};
	const residentFor = (agentId, source) => {
		const request = resolveResident(agentId, source);
		residentRequests.add(request);
		const release = () => residentRequests.delete(request);
		request.then(release, release);
		return request;
	};
	const resolveRequestOptions = (startOptions, agentId, source) => {
		source?.assertCurrent();
		const runtimeConfig = params.getRuntimeConfig();
		const agentDir = source?.agentDir ?? (agentId ? resolveAgentDir(runtimeConfig ?? {}, agentId) : void 0);
		const resolvedStartOptions = source?.appServer.start ?? startOptions;
		if (!runtimeConfig) return {
			agentDir,
			config: void 0,
			startOptions: structuredClone(resolvedStartOptions)
		};
		let byAgent = requestOptionsByConfig.get(runtimeConfig);
		const cacheKey = `${agentId ?? ""}\0${source?.sourceHomeId ?? ""}`;
		const cached = byAgent?.get(cacheKey);
		if (cached) return cached;
		const resolved = {
			agentDir,
			config: structuredClone(runtimeConfig),
			startOptions: structuredClone(resolvedStartOptions)
		};
		if (!byAgent) {
			byAgent = /* @__PURE__ */ new Map();
			requestOptionsByConfig.set(runtimeConfig, byAgent);
		}
		byAgent.set(cacheKey, resolved);
		return resolved;
	};
	const createRequestSnapshot = (agentId, source, catalogPreview, catalogPreviewCache, catalogRows) => {
		const pluginConfig = getPluginConfig();
		const runtime = source?.appServer ?? resolveRuntimeOptions({ pluginConfig });
		const requestOptions = resolveRequestOptions(runtime.start, agentId, source);
		return createCodexCatalogRequestSnapshot(runtime.requestTimeoutMs, async (method, requestParams, timeoutMs, assertCurrent, observation) => {
			const { codexControlRequest } = await import("./command-rpc-DixIj3HW.mjs").then((n) => n.n);
			return await codexControlRequest(pluginConfig, method, requestParams, {
				...requestOptions,
				authProfileId: null,
				assertCurrent,
				...catalogPreview && method === CODEX_CONTROL_METHODS.listThreads ? {
					catalogPreview,
					catalogRows,
					...catalogPreviewCache ? { catalogPreviewCache } : {}
				} : {},
				...observation ? { controlObservation: observation } : {},
				...timeoutMs === void 0 ? {} : { timeoutMs }
			});
		}, () => residentFor(agentId, source), (request) => sourceBackoff.begin(requestOptions.config ?? noConfig, agentId, source?.sourceHomeId, request), catalogPreview === true);
	};
	const forRequest = (agentId, source) => {
		source?.assertCurrent();
		const withPinnedConnection = async (run) => {
			const pluginConfig = getPluginConfig();
			const runtime = source?.appServer ?? resolveRuntimeOptions({ pluginConfig });
			const { agentDir, config: runtimeConfig, startOptions } = resolveRequestOptions(runtime.start, agentId, source);
			let catalogIndex;
			const { getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient, retireSharedCodexAppServerClientIfCurrent } = await import("./shared-client-DA4VR4Eb.mjs").then((n) => n.y);
			const { resolveCodexAppServerClientInstanceId } = await import("./client-Cs08OXVQ.mjs").then((n) => n.n);
			const { requestCodexAppServerClientJson } = await import("./request-D2L0zMrq.mjs").then((n) => n.a);
			const client = await getLeasedSharedCodexAppServerClient({
				agentDir,
				config: runtimeConfig,
				startOptions,
				authProfileId: null,
				timeoutMs: currentCodexCatalogListRequest()?.remaining(runtime.requestTimeoutMs) ?? runtime.requestTimeoutMs
			});
			try {
				const requests = createCodexCatalogRequestSnapshot(runtime.requestTimeoutMs, async (method, requestParams, timeoutMs, assertCurrent, observation) => await requestCodexAppServerClientJson({
					client,
					method,
					requestParams,
					config: runtimeConfig,
					timeoutMs: timeoutMs ?? runtime.requestTimeoutMs,
					assertCurrent,
					...observation ? { controlObservation: observation } : {}
				}), () => catalogIndex ??= residentFor(agentId, source), (request) => sourceBackoff.begin(runtimeConfig ?? noConfig, agentId, source?.sourceHomeId, request));
				const pinnedControl = createCodexSessionCatalogControlFromRequests({
					forkContext: agentDir ? {
						client,
						appServer: runtime,
						pluginConfig,
						agentDir,
						localSessionsRoot: source?.localSessionsRoot
					} : void 0,
					clientId: resolveCodexAppServerClientInstanceId(client),
					retireConnection: () => {
						retireSharedCodexAppServerClientIfCurrent(client);
					},
					connectionFingerprint: buildCodexAppServerConnectionFingerprint(runtime, agentDir),
					createRequestSnapshot: () => requests,
					...source?.localSessionsRoot ? { localSessionsRoot: source.localSessionsRoot } : {},
					sourceHomeId: source?.sourceHomeId,
					managedThreads: params.managedThreads,
					now,
					withPinnedConnection: async (nestedRun) => await nestedRun(pinnedControl)
				});
				return await run(pinnedControl);
			} finally {
				releaseLeasedSharedCodexAppServerClient(client);
			}
		};
		const control = createCodexSessionCatalogControlFromRequests({
			createRequestSnapshot: () => createRequestSnapshot(agentId, source),
			...source?.localSessionsRoot ? { localSessionsRoot: source.localSessionsRoot } : {},
			now,
			withPinnedConnection
		});
		return {
			...control,
			requireEligibleThread: (threadId) => withPinnedConnection((pinned) => pinned.requireEligibleThread(threadId)),
			async listPage(pageParams) {
				source?.assertCurrent();
				return await control.listPage(pageParams);
			}
		};
	};
	const forUpstream = async (agentId, connectionFingerprint) => {
		const source = (await homeResolver.forAgent(agentId)).find((home) => buildCodexAppServerConnectionFingerprint(home.appServer, home.agentDir) === connectionFingerprint);
		return source ? forRequest(agentId, source) : void 0;
	};
	return {
		hasActiveWork: () => starting > 0 || residentRequests.size > 0 || retiring !== void 0 || hasActiveSharedCodexAppServerWork() || [...indexes.values()].some((index) => index.hasActiveWork()),
		async disconnect() {
			await retireIndexes();
			await Promise.allSettled(residentRequests);
			const clients = getSharedCodexAppServerClientState();
			if (clients.liveClients.size > 0 || clients.startup.pending.size > 0) {
				const { clearSharedCodexAppServerClientAndWait } = await import("./shared-client-DA4VR4Eb.mjs").then((n) => n.y);
				await clearSharedCodexAppServerClientAndWait();
			}
		},
		async start() {
			const epoch = residentEpoch;
			starting++;
			try {
				const serviceScope = AsyncLocalStorage.snapshot();
				runBackground = (run) => serviceScope(run);
				for (const agentId of listAgentIds(params.getRuntimeConfig() ?? params.config ?? {})) for (const source of await homeResolver.forAgent(agentId)) {
					if (closed || residentEpoch !== epoch) return;
					if (source.usesProcessHomeFallback) continue;
					forRequest(agentId, source).initialize().catch((error) => {
						if (!findCodexAppServerSpawnError(error)) embeddedAgentLog.warn("Codex catalog hydration failed", { error });
					});
				}
			} finally {
				starting--;
			}
		},
		async stop() {
			closed = true;
			await retireIndexes();
			await Promise.allSettled(residentRequests);
		},
		forRequest,
		forUpstream,
		homesForAgent: homeResolver.forAgent,
		async forNode(agentId) {
			const source = await homeResolver.forNode(agentId);
			return {
				assertCurrent: () => source.assertCurrent(),
				control: forRequest(source.agentId, source),
				sourceHomeId: source.sourceHomeId,
				codexHome: source.codexHome,
				transport: source.appServer.start.transport
			};
		}
	};
}
//#endregion
//#region extensions/codex/src/session-catalog.ts
/** Allows read-only catalog and transcript commands on supported paired-node platforms. */
function createCodexSessionCatalogNodeInvokePolicies() {
	return [{
		commands: [
			CODEX_APP_SERVER_THREADS_LIST_COMMAND,
			CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
			CODEX_CATALOG_TRANSCRIPT_READ_COMMAND,
			CODEX_TERMINAL_RESUME_COMMAND,
			CODEX_TERMINAL_START_COMMAND
		],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (context) => {
			if (context.command === "codex.terminal.start.v1") return context.client?.scopes?.includes("operator.admin") && context.config.gateway?.cliAgents?.enabled === true && context.config.gateway?.terminal?.enabled !== false ? { ok: true } : {
				ok: false,
				message: "Native terminal start requires operator.admin and enabled CLI agents and terminals"
			};
			return context.command === "codex.terminal.resume.v1" ? { ok: true } : context.invokeNode();
		}
	}];
}
function toGenericCatalogHost(host, localTerminalAvailable) {
	const local = isLocalCodexCatalogHost(host.hostId);
	return {
		hostId: host.hostId,
		label: host.label,
		kind: host.kind,
		connected: host.connected,
		...host.pending ? { pending: true } : {},
		...host.nodeId ? { nodeId: host.nodeId } : {},
		sessions: host.sessions.map((session) => {
			const continuableStatus = !session.archived && (session.status === "idle" || session.status === "notLoaded");
			const canContinue = (local || host.canContinueCodex === true) && continuableStatus && isInteractiveThreadSource(session.source);
			const canArchive = local && continuableStatus && isInteractiveThreadSource(session.source);
			const canOpenTerminal = isInteractiveThreadSource(session.source) && (local ? localTerminalAvailable : host.canOpenTerminalCodex === true);
			const name = session.name ?? session.fallbackName;
			return {
				threadId: session.threadId,
				...session.sourceHomeId ? { sourceHomeId: session.sourceHomeId } : {},
				...name ? { name } : {},
				...session.cwd ? { cwd: session.cwd } : {},
				status: session.status,
				...session.createdAt != null ? { createdAt: session.createdAt } : {},
				...session.updatedAt != null ? { updatedAt: session.updatedAt } : {},
				...session.recencyAt != null ? { recencyAt: session.recencyAt } : {},
				...session.source ? { source: session.source } : {},
				...session.modelProvider ? { modelProvider: session.modelProvider } : {},
				...session.cliVersion ? { cliVersion: session.cliVersion } : {},
				...session.gitBranch ? { gitBranch: session.gitBranch } : {},
				archived: session.archived,
				...session.sessionKey ? { sessionKey: session.sessionKey } : {},
				canContinue,
				canArchive,
				canOpenTerminal
			};
		}),
		...host.nextCursor ? { nextCursor: host.nextCursor } : {},
		...host.error ? { error: host.error } : {}
	};
}
function isLocalCodexCatalogHost(hostId) {
	return hostId === "gateway:local" || hostId.startsWith(`gateway:local:`);
}
function resolveLocalCatalogHomeForThread(params) {
	if (params.homes.length === 0) throw new CatalogParamsError("local Codex sessions are unavailable in isolated state");
	const exact = params.sourceHomeId ? params.homes.filter((home) => home.sourceHomeId === params.sourceHomeId) : params.homes.filter((home) => home.hostId === params.hostId);
	if (exact.length === 0 || params.sourceHomeId && exact[0]?.hostId !== params.hostId) throw new CatalogParamsError("Codex session source home is unavailable");
	return exact[0];
}
function withCatalogListScope(initialize) {
	let create = initialize;
	let operation;
	let scope;
	let running = false;
	let closed = false;
	let completed = false;
	return {
		async next() {
			if (closed || running) throw new Error("Codex catalog list operation cannot advance");
			running = true;
			try {
				scope ??= createCodexCatalogListScope();
				return await scope.run(async () => {
					if (create) {
						const initializeOnce = create;
						create = void 0;
						operation = await initializeOnce();
					}
					if (!operation) throw new Error("Codex catalog list operation did not initialize");
					const step = await operation.next();
					completed ||= step.done;
					return step;
				});
			} finally {
				running = false;
			}
		},
		close() {
			if (closed) return;
			if (running) throw new Error("Cannot close an active Codex catalog list step");
			closed = true;
			create = void 0;
			const current = operation;
			operation = void 0;
			const currentScope = scope;
			scope = void 0;
			try {
				if (currentScope) currentScope.run(() => current?.close());
			} finally {
				currentScope?.finish(completed ? "resolved" : "rejected");
			}
		}
	};
}
function catalogHostMapper(localTerminalAvailable, localHomes) {
	return (host) => {
		const diagnostics = currentCodexCatalogListDiagnostics();
		const started = diagnostics ? performance.now() : 0;
		try {
			const localSourceAvailable = localTerminalAvailable && localHomes.some((home) => home.hostId === host.hostId && home.appServer.start.transport === "stdio");
			return {
				...toGenericCatalogHost(host, localSourceAvailable),
				canStartTerminal: host.kind === "gateway" ? localSourceAvailable && host.hostId === "gateway:local" : host.canStartTerminal === true
			};
		} finally {
			if (diagnostics && !diagnostics.closed) diagnostics.fields.mappingMs = (diagnostics.fields.mappingMs ?? 0) + performance.now() - started;
		}
	};
}
function mappedHostPublisher(onHost, mapHost) {
	return (host) => onHost(mapHost(host));
}
function mapCatalogListOperation(operation, mapHost) {
	return {
		async next() {
			const step = await operation.next();
			return step.done ? {
				done: true,
				hosts: step.hosts.map(mapHost)
			} : step;
		},
		close: () => operation.close()
	};
}
function registerCodexSessionCatalog(params) {
	const catalogHomes = async (agentId, allowProcessHomeFallback) => {
		const homes = await params.control.homesForAgent(agentId);
		return allowProcessHomeFallback === false ? homes.filter((home) => !home.usesProcessHomeFallback) : homes;
	};
	const resolveRequestAgentId = (agentId) => resolveSessionAgentIdsStrict({
		config: params.getRuntimeConfig() ?? params.api.config,
		agentId
	}).sessionAgentId;
	const bindRequest = async (request) => {
		const agentId = resolveRequestAgentId(request.agentId);
		const source = isLocalCodexCatalogHost(request.hostId) ? resolveLocalCatalogHomeForThread({
			homes: [...await catalogHomes(agentId, request.allowProcessHomeFallback)],
			hostId: request.hostId,
			...request.sourceHomeId ? { sourceHomeId: request.sourceHomeId } : {}
		}) : void 0;
		return {
			agentId,
			source,
			control: params.control.forRequest(agentId, source)
		};
	};
	const bindLocalRequest = async (request) => {
		const bound = await bindRequest(request);
		if (!bound.source) throw new CatalogParamsError("Codex session catalog hostId is invalid");
		return {
			...bound,
			source: bound.source
		};
	};
	const checkUpstreamActivity = createChecker(params);
	const nodeSnapshots = new CodexCatalogNodeSnapshots();
	const createListOperation = (query) => withCatalogListScope(async () => {
		const { agentId: requestedAgentId, allowProcessHomeFallback, allowPartialResults, listNodes, onHost, waitUntil, signal, sessionEntries, ...gatewayQuery } = query;
		const agentId = resolveRequestAgentId(requestedAgentId);
		const selectedQuery = readGatewayParams(gatewayQuery);
		const localHomes = selectedQuery.hostIds && !selectedQuery.hostIds.some(isLocalCodexCatalogHost) ? [] : [...await catalogHomes(agentId, allowProcessHomeFallback)];
		const mapHost = catalogHostMapper(resolveLocalCodexTerminalExecutable() !== void 0, localHomes);
		return mapCatalogListOperation(createCodexSessionCatalogListOperation({
			agentId,
			bindingStore: params.bindingStore,
			config: params.getRuntimeConfig(),
			runtime: params.api.runtime,
			control: params.control,
			query: selectedQuery,
			listNodes,
			waitUntil,
			signal,
			sessionEntries,
			localHomes,
			allowPartialResults,
			nodeSnapshots,
			...onHost ? { onHost: mappedHostPublisher(onHost, mapHost) } : {}
		}), mapHost);
	});
	const provider = {
		id: "codex",
		label: "Codex",
		supportsProcessHomeIsolation: true,
		resolveCreateSession: ({ agentId }) => resolveCodexCatalogCreateSession(params.api.runtime.modelConfig, params.getRuntimeConfig() ?? params.api.config, agentId),
		list: (query) => runCatalogListInline(createListOperation(query)),
		createListOperation,
		read: async (request) => {
			const { agentId, source, control } = await bindRequest(request);
			return await readCodexSessionTranscript({
				agentId,
				runtime: params.api.runtime,
				control,
				hostId: request.hostId,
				threadId: request.threadId,
				sourceHomeId: request.sourceHomeId,
				cursor: request.cursor,
				limit: request.limit ?? 20,
				...source ? { source } : {}
			});
		},
		continueSession: async (request) => {
			const config = params.getRuntimeConfig();
			if (!config) throw new Error("OpenClaw runtime config is unavailable");
			if (request.hostId.startsWith("node:")) return await continueNodeCodexSession({
				agentId: resolveRequestAgentId(request.agentId),
				api: params.api,
				config,
				hostId: request.hostId,
				threadId: request.threadId,
				sourceHomeId: request.sourceHomeId,
				clientScopes: request.clientScopes
			});
			if (!isLocalCodexCatalogHost(request.hostId)) throw new CatalogParamsError("Codex session catalog hostId is invalid");
			const { agentId, source, control } = await bindLocalRequest(request);
			source.assertCurrent();
			let upstreamBaseline;
			const continued = await continueLocalCodexSession({
				agentId,
				api: params.api,
				bindingStore: params.bindingStore,
				config,
				control,
				threadId: request.threadId,
				hostId: source.hostId,
				sourceHomeId: source.sourceHomeId,
				...source.hostId === "gateway:local" ? { allowLegacy: true } : {},
				onContinued: (baseline) => {
					upstreamBaseline = baseline;
				}
			});
			return codexUpstreamContinueResult(continued.sessionKey, request.threadId, upstreamBaseline);
		},
		checkUpstreamActivity: async (probes, policy) => {
			const filtered = [];
			for (const probe of probes) if (!isLocalCodexCatalogHost(probe.hostId) || policy?.allowProcessHomeFallback !== false || (await catalogHomes(probe.agentId, false)).some((home) => home.hostId === probe.hostId)) filtered.push(probe);
			return checkUpstreamActivity(filtered);
		},
		archive: async (request) => {
			if (request.confirmNoOtherRunner !== true) throw new CatalogParamsError("archive requires confirmation that no other runner is active");
			if (!isLocalCodexCatalogHost(request.hostId)) throw new CatalogParamsError("paired-node Codex sessions are view-only");
			const config = params.getRuntimeConfig();
			if (!config) throw new Error("OpenClaw runtime config is unavailable");
			const { agentId, source, control } = await bindLocalRequest(request);
			source.assertCurrent();
			await archiveLocalCodexSession({
				agentId,
				bindingStore: params.bindingStore,
				config,
				control,
				runtime: params.api.runtime,
				threadId: request.threadId,
				hostId: source.hostId,
				sourceHomeId: source.sourceHomeId,
				...source.hostId === "gateway:local" ? { allowLegacy: true } : {}
			});
			return { ok: true };
		},
		openTerminal: async (request) => {
			const { agentId, source, control } = await bindRequest(request);
			return await openCodexCatalogTerminal({
				api: params.api,
				control,
				getPluginConfig: params.getPluginConfig,
				getRuntimeConfig: params.getRuntimeConfig,
				resolveRuntimeOptions: params.resolveRuntimeOptions,
				...source ? { source } : {},
				...request,
				agentId
			});
		},
		startTerminalSession: async (request) => {
			if (!request.nodeId && request.hostId && request.hostId !== "gateway:local") throw new CatalogParamsError("Codex terminal host is unavailable; select the local machine or a connected node");
			const source = request.nodeId ? void 0 : resolveLocalCatalogHomeForThread({
				homes: [...await catalogHomes(request.agentId, request.allowProcessHomeFallback)],
				hostId: request.hostId ?? "gateway:local"
			});
			if (source && source.appServer.start.transport !== "stdio") throw new CatalogParamsError("Native terminal start requires a local Codex source");
			return await startCodexCatalogTerminal({
				getPluginConfig: params.getPluginConfig,
				getRuntimeConfig: params.getRuntimeConfig,
				resolveRuntimeOptions: params.resolveRuntimeOptions,
				...request,
				source
			});
		}
	};
	params.api.registerSessionCatalog(provider);
}
const codexSessionCatalogRuntime = {
	register: registerCodexSessionCatalog,
	list: listCodexSessionCatalog,
	readTranscript: readCodexSessionTranscript,
	continueLocal: continueLocalCodexSession,
	continueNode: continueNodeCodexSession,
	archiveLocal: archiveLocalCodexSession
};
async function continueLocalCodexSession(...args) {
	const { continueLocalCodexSession: run } = await import("./session-catalog-adoption-BI6UTDZT.mjs");
	return run(...args);
}
async function archiveLocalCodexSession(...args) {
	const { archiveLocalCodexSession: run } = await import("./session-catalog-archive-lHBqzhaO.mjs");
	return run(...args);
}
async function continueNodeCodexSession(...args) {
	const { continueNodeCodexSession: run } = await import("./session-catalog-node-continue-6g6qi4A9.mjs");
	return run(...args);
}
//#endregion
export { withCodexCatalogListRequest as a, createCodexSessionCatalogNodeHostCommands as i, createCodexSessionCatalogNodeInvokePolicies as n, lookupNodeCodexCatalogRecord as o, createCodexSessionCatalogControl as r, CodexCatalogAvailability as s, codexSessionCatalogRuntime as t };
