import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { C as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DYptB0Cf.mjs";
import { o as capturePluginRegistryLifecycleEpoch, v as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { A as validateBoardWidgetContent, C as validateBoardActionParams, D as validateBoardPromptAuthorizeParams, E as validateBoardGetParams, M as validateBoardWidgetPutParams, O as validateBoardUpdateParams, T as validateBoardEventParams, j as validateBoardWidgetGrantParams, k as validateBoardWidgetAppViewParams, w as validateBoardDataReadParams } from "./src-l2dWvEsN.mjs";
import { d as isGatewaySubordinateWorkAdmissionClosed } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { a as resolveGitHubActionsRequest, r as GITHUB_ACTIONS_GRANT_PREFIX } from "./github-actions-capability-DrbvGLFL.mjs";
import { a as resolveBoardWidgetContentKindResourceUrls, i as resolveBoardWidgetContentKindByPluginKind, l as CORE_BOARD_DATA_BINDING_IDS, r as resolveBoardWidgetContentKind } from "./board-widget-content-kinds-DNQ145aM.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { o as readExecApprovalsPolicyReadOnlyAsync } from "./exec-approvals-store-DGp2moY9.mjs";
import { n as boardWidgetHasGrantedTool, r as normalizeBoardWidgetDeclared } from "./board-capabilities-B68KjLWD.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor.entry-Di4jQk7u.mjs";
import { n as resolveRequestedSessionStoreTarget } from "./session-store-key-Ci099tm9.mjs";
import { n as readCanvasDocumentHtmlSource } from "./documents-CFQyKfP2.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-B7HapOub.mjs";
import { t as buildWidgetDocument } from "./wrap-IO-k8BF1.mjs";
import { a as createBoardViewTicket, c as verifyBoardViewTicket, i as buildBoardWidgetFrameUrl, n as BOARD_VIEW_TICKET_TTL_MS, o as requireBoardViewTicketAuthority, r as BoardGatewayUnavailableError } from "./board-view-ticket-BF8LDpSe.mjs";
import { c as resolveExecAutoReviewDecision } from "./exec-auto-review-BrKPsT7Y.mjs";
import { c as resolveMcpAppAllowedToolNames, d as mintMcpAppViewFromTranscript, o as requireMcpAppInteraction, s as resolveMcpAppActiveView } from "./mcp-app-operations-DaVYytwK.mjs";
import { n as buildBoardWidgetSandboxPath } from "./board-sandbox-Ca0D_WuE.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { r as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as boardStore } from "./board-store-hTVeREF8.mjs";
import { t as withAuthorizedBoardWidgetView } from "./board-widget-view-Ce5ynD7m.mjs";
import { g as sessionObserverScopeKey } from "./session-observer-model-DBd4UseX.mjs";
import { t as agentsHandlers } from "./agents-NHdZ-jJT.mjs";
import { t as cronHandlers } from "./cron-CUHtORcF.mjs";
import { t as healthHandlers } from "./health-BBEcN-tu.mjs";
import { t as sessionReadHandlers } from "./sessions-read-CHvq_7_S.mjs";
import { t as usageHandlers } from "./usage-3ZKgvOB_.mjs";
import { createHash } from "node:crypto";
//#region src/boards/board-notices.ts
const BOARD_EVENT_MAX_BYTES = 8192;
const BOARD_EVENT_DEDUPE_MS = 5e3;
const recentNotices = /* @__PURE__ */ new Map();
var BoardEventPayloadError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "BoardEventPayloadError";
	}
};
function serializePayload(payload) {
	try {
		const serialized = JSON.stringify(payload);
		return serialized === void 0 ? String(payload) : serialized;
	} catch {
		throw new BoardEventPayloadError("board event payload must be JSON serializable");
	}
}
function formatNotice(widget, summary) {
	const prefix = "[dashboard] ";
	const suffix = ` on widget ${widget}`;
	const available = 488 - suffix.length;
	return `${prefix}${summary.length <= available ? summary : `${truncateUtf16Safe(summary, Math.max(0, available - 1))}…`}${suffix}`;
}
function appendBoardEventNotice(params) {
	const summary = serializePayload(params.payload);
	if (Buffer.byteLength(summary, "utf8") > BOARD_EVENT_MAX_BYTES) throw new BoardEventPayloadError(`board event payload exceeds ${BOARD_EVENT_MAX_BYTES} bytes`);
	const now = Date.now();
	const key = `${params.agentId ?? ""}\0${params.sessionKey}\0${params.widget}`;
	const recent = recentNotices.get(key);
	if (recent?.summary === summary && now - recent.at < BOARD_EVENT_DEDUPE_MS) return false;
	recentNotices.set(key, {
		summary,
		at: now
	});
	for (const [candidate, notice] of recentNotices) if (now - notice.at >= BOARD_EVENT_DEDUPE_MS) recentNotices.delete(candidate);
	const options = {
		sessionKey: params.sessionKey,
		contextKey: `dashboard:${params.widget}:${now}`
	};
	return enqueueSystemEvent(formatNotice(params.widget, summary), params.agentId ? withSystemEventOwner(options, params.agentId) : options);
}
//#endregion
//#region src/gateway/board-host-tools.ts
function assertBoardCapabilityParamsSize(params, capability) {
	if (Buffer.byteLength(JSON.stringify(params), "utf8") > 8192) throw new BoardValidationError("invalid_operation", `board widget ${capability} params exceed 8192 UTF-8 bytes`);
}
function boardDataBindingCapability(bindingId, params) {
	return bindingId === "github.actions.runs" ? resolveGitHubActionsRequest(params).capability : bindingId;
}
/** Retained reads/actions own the exact live widget grant, not just its Gateway. */
function captureBoardCapabilityAuthority(store, ticket, invocation, capability) {
	const authority = captureBoardRequestAuthority(invocation);
	const claims = verifyBoardViewTicket(ticket);
	if (!claims) throw new BoardValidationError("invalid_operation", "board widget view ticket is invalid");
	requireBoardViewTicketAuthority(claims, invocation.context);
	const resolveSession = (target) => {
		authority.assertActive();
		const cfg = invocation.context.getRuntimeConfig();
		const selected = resolveRequestedSessionStoreTarget(cfg, target.sessionKey, target.agentId);
		if (!selected.ok || selected.value.sessionKey !== target.sessionKey) throw new BoardValidationError("invalid_operation", "board widget session identity changed; reload the dashboard");
		return selected.value;
	};
	const boardSession = resolveSession(claims);
	return {
		...authority,
		boardSession,
		useCurrent: async (start) => await withAuthorizedBoardWidgetView(store, ticket, (view) => {
			const current = resolveSession(view);
			if (current.agentId !== boardSession.agentId || current.sessionKey !== boardSession.sessionKey) throw new BoardValidationError("invalid_operation", "board widget session identity changed; reload the dashboard");
			if (!boardWidgetHasGrantedTool(view.document.declared, view.document.grantState, capability)) throw new BoardValidationError("invalid_operation", `board widget tool is not granted: ${capability}`);
			return start();
		}, { gatewayContext: invocation.context })
	};
}
function captureBoardRequestAuthority(invocation) {
	const context = invocation.context;
	const resolveGatewayContext = context.resolveGatewayContext;
	if (!resolveGatewayContext) throw new BoardGatewayUnavailableError();
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const pluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
	const pluginRegistryEpoch = pluginRegistry ? capturePluginRegistryLifecycleEpoch(pluginRegistry) : void 0;
	const assertActive = () => {
		try {
			invocation.signal?.throwIfAborted();
			invocation.sessionMutationCommitGuard?.();
			invocation.sessionMutationAuthorization?.assertCurrent();
			if (isGatewaySubordinateWorkAdmissionClosed() || resolveGatewayContext() !== context || context.resolveGatewayContext !== resolveGatewayContext || methodRegistry && context.getGatewayMethodRegistry?.() !== methodRegistry || pluginRegistry && (!pluginRegistryEpoch || !isPluginRegistryLifecycleEpochActive(pluginRegistry, pluginRegistryEpoch))) throw new BoardGatewayUnavailableError();
		} catch (error) {
			if (error instanceof BoardGatewayUnavailableError) throw error;
			throw new BoardGatewayUnavailableError();
		}
	};
	assertActive();
	return {
		assertActive,
		...pluginRegistry ? { pluginRegistry } : {},
		ticketAuthority: {
			gatewayContext: context,
			resolveGatewayContext,
			...pluginRegistry ? { pluginRegistry } : {}
		}
	};
}
function respondBoardError(error, respond) {
	if (error instanceof BoardGatewayUnavailableError) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
		return;
	}
	if (error instanceof BoardValidationError || error instanceof BoardEventPayloadError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
}
const BOARD_DATA_HANDLERS = {
	"sessions.list": sessionReadHandlers["sessions.list"],
	"usage.status": (invocation) => usageHandlers["usage.status"]({
		...invocation,
		client: null
	}),
	"usage.cost": usageHandlers["usage.cost"],
	"cron.list": cronHandlers["cron.list"],
	"cron.status": cronHandlers["cron.status"],
	"agents.list": agentsHandlers["agents.list"],
	health: healthHandlers.health
};
function isBoardDataBindingId(value) {
	return CORE_BOARD_DATA_BINDING_IDS.includes(value);
}
async function invokeGatewayHandler(handler, method, params, invocation, authority, publish) {
	let outcome;
	await authority.useCurrent(async () => {
		try {
			await handler({
				...invocation,
				req: {
					...invocation.req,
					method,
					params
				},
				params,
				respond: (ok, payload, error) => {
					outcome ??= {
						kind: "reply",
						ok,
						payload,
						error
					};
				}
			});
		} catch (error) {
			outcome = {
				kind: "thrown",
				error
			};
		}
	});
	await authority.useCurrent(() => {
		if (!outcome) publish(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `${method} did not return a result`));
		else if (outcome.kind === "thrown") respondBoardError(outcome.error, publish);
		else if (!outcome.ok) publish(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, outcome.error?.message || `${method} failed`));
		else publish(true, outcome.payload);
	});
}
async function readBoardDataBinding(bindingId, params, invocation, authority, publish) {
	if (bindingId === "github.actions.runs") {
		const { readBoardGitHubActions } = await import("./github-actions-read-BYV1oGni.mjs");
		return await readBoardGitHubActions(params, invocation.context, authority, publish);
	}
	if (isBoardDataBindingId(bindingId)) return await invokeGatewayHandler(BOARD_DATA_HANDLERS[bindingId], bindingId, params, invocation, authority, publish);
	const registration = authority.pluginRegistry?.dashboardDataBindings.get(bindingId);
	if (!registration) throw new BoardValidationError("invalid_operation", `board widget data binding is not allowed: ${bindingId}`);
	return await invokeGatewayHandler(registration.handler, registration.method, params, invocation, authority, publish);
}
async function runBoardActionVerb(actionId, params, invocation, authority, publish) {
	const registration = authority.pluginRegistry?.dashboardActionVerbs.get(actionId);
	if (!registration) throw new BoardValidationError("invalid_operation", `board widget action verb is not allowed: ${actionId}`);
	if (registration.paramShape) {
		const validation = validateJsonSchemaValue({
			schema: registration.paramShape,
			cacheKey: `dashboard-action:${registration.pluginId}:${registration.id}`,
			value: params
		});
		if (!validation.ok) throw new BoardValidationError("invalid_operation", `board widget action params do not match ${actionId}: ${validation.errors.map((error) => error.text).join(", ")}`);
	}
	return await invokeGatewayHandler(registration.handler, registration.method, params, invocation, authority, publish);
}
async function triggerBoardCronJob(jobId, invocation, authority, publish) {
	return await invokeGatewayHandler(cronHandlers["cron.run"], "cron.run", {
		id: jobId,
		mode: "force"
	}, invocation, authority, publish);
}
//#endregion
//#region src/gateway/board-widget-approval.ts
/** One bounded assessment cache per Board handler owner, never a cache of grant authority. */
function createBoardWidgetApprovalResolver() {
	const approved = /* @__PURE__ */ new Set();
	let configRevision;
	let policyRevision;
	return async (params) => {
		const { cfg, agentId, sessionKey, name, content, declared } = params;
		const currentConfigRevision = resolveRuntimeConfigCacheKey(cfg);
		const scope = {
			sessionKey,
			agentId
		};
		const incognito = isIncognitoSessionKey(sessionKey);
		const [policy, sessionEntry] = await Promise.all([readExecApprovalsPolicyReadOnlyAsync(), incognito ? loadSessionEntryReadOnly(scope) : readSessionEntriesFromStoreInWorker({
			agentId,
			storePath: resolveSessionStorePathForScope(scope, cfg),
			sessionKeys: [sessionKey]
		}).then((sessions) => sessions.entries.find((entry) => entry.sessionKey === sessionKey)?.entry)]);
		if (configRevision !== currentConfigRevision || policyRevision !== policy.revision) {
			approved.clear();
			configRevision = currentConfigRevision;
			policyRevision = policy.revision;
		}
		const mode = resolveExecDefaults({
			cfg,
			agentId,
			sessionKey,
			sessionEntry,
			execApprovals: policy.file
		}).mode;
		if (mode === "ask") return;
		if (mode !== "auto") return mode === "full" ? "granted" : "rejected";
		const key = !incognito && policy.revision && (content.kind === "html" || content.kind === "registered") ? createHash("sha256").update(JSON.stringify([
			agentId,
			name,
			content,
			declared
		])).digest("hex") : void 0;
		if (key && approved.has(key)) return "granted";
		const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-CrcrQN1p.mjs");
		const review = await resolveExecAutoReviewDecision(createModelExecAutoReviewer({
			cfg,
			agentId,
			reviewer: resolveAgentConfig(cfg, agentId)?.tools?.exec?.reviewer ?? cfg.tools?.exec?.reviewer
		}), {
			kind: "board-widget",
			name,
			declared,
			agent: {
				id: agentId,
				sessionKey
			}
		});
		switch (review.decision) {
			case "allow-once":
				if (review.risk !== "low") return "rejected";
				if (key && configRevision === currentConfigRevision && policyRevision === policy.revision) {
					if (approved.size >= 256) approved.delete(approved.keys().next().value);
					approved.add(key);
				}
				return "granted";
			case "deny":
			case "ask": return "rejected";
			default: throw new Error("Unsupported widget review decision", { cause: review });
		}
	};
}
//#endregion
//#region src/gateway/server-methods/board.ts
function defineBoardMethod(...[method, validate, handler]) {
	return defineValidatedGatewayMethod(method, validate, async (invocation) => {
		try {
			await handler(invocation);
		} catch (error) {
			respondBoardError(error, invocation.respond);
		}
	});
}
function resolveBoardSession(params, context, respond) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionStoreTarget(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) {
		respond(false, void 0, requested.error);
		return;
	}
	return requested.value;
}
function projectBoardSnapshot(snapshot, agentId) {
	return {
		...snapshot,
		sessionKey: sessionObserverScopeKey(snapshot.sessionKey, agentId)
	};
}
function createBoardHandlers(store, readCanvasDocument = readCanvasDocumentHtmlSource, dependencies = {}) {
	const resolveBoardWidgetApproval = createBoardWidgetApprovalResolver();
	const mcpApp = {
		resolveActiveView: dependencies.resolveActiveView ?? resolveMcpAppActiveView,
		resolveAllowedToolNames: dependencies.resolveAllowedToolNames ?? resolveMcpAppAllowedToolNames,
		mintFromTranscript: dependencies.mintFromTranscript ?? mintMcpAppViewFromTranscript
	};
	return {
		"board.get": defineBoardMethod("board.get", validateBoardGetParams, async (invocation) => {
			const { params: boardParams, respond, context, client } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const boardSession = resolveBoardSession(boardParams, context, respond);
			if (!boardSession) return;
			const { snapshot, htmlViewMetadata } = await store.getSnapshotWithHtmlViewMetadata(boardSession);
			authority.assertActive();
			let sandboxPort = context.getMcpAppSandboxPort?.();
			let sandboxOrigin;
			let sandboxOriginResolved = false;
			for (const widget of snapshot.widgets) {
				if (widget.grantState !== "none" && widget.grantState !== "granted") continue;
				const viewMetadata = htmlViewMetadata.get(widget.name);
				if (!viewMetadata || viewMetadata.revision !== widget.revision) continue;
				const registration = widget.pluginKind ? resolveBoardWidgetContentKindByPluginKind(authority.pluginRegistry, widget.pluginKind) : void 0;
				const scopedHostUrl = registration ? client?.pluginSurfaceUrls?.[registration.definition.resources.surface] : void 0;
				const resourceUrls = registration && scopedHostUrl ? resolveBoardWidgetContentKindResourceUrls(registration, scopedHostUrl) : void 0;
				if (widget.contentKind === "plugin" && (!registration || !resourceUrls || !scopedHostUrl)) continue;
				const resourceOrigins = resourceUrls ? [...new Set(Object.values(resourceUrls).map((url) => new URL(url).origin))] : void 0;
				if (sandboxPort === void 0 && context.ensureSandboxHostPort) {
					sandboxPort = await context.ensureSandboxHostPort();
					authority.assertActive();
				}
				authority.assertActive();
				const { ticket } = createBoardViewTicket({
					agentId: boardSession.agentId,
					sessionKey: snapshot.sessionKey,
					name: widget.name,
					revision: widget.revision,
					viewGeneration: viewMetadata.viewGeneration,
					...registration && scopedHostUrl ? { pluginFrame: {
						pluginKind: registration.pluginKind,
						scopedHostUrl
					} } : {},
					authority: authority.ticketAuthority
				});
				if (registration) widget.kindLabel = registration.definition.label;
				widget.frameUrl = buildBoardWidgetFrameUrl({
					sessionKey: sessionObserverScopeKey(snapshot.sessionKey, boardSession.agentId),
					name: widget.name,
					ticket
				});
				widget.viewTicket = ticket;
				widget.viewTicketTtlMs = BOARD_VIEW_TICKET_TTL_MS;
				widget.viewGeneration = viewMetadata.viewGeneration;
				if (sandboxPort !== void 0) {
					widget.sandboxUrl = buildBoardWidgetSandboxPath({
						...viewMetadata,
						...resourceOrigins ? { resourceOrigins } : {}
					});
					widget.sandboxPort = sandboxPort;
					if (!sandboxOriginResolved) {
						const configuredOrigin = context.getRuntimeConfig?.().mcp?.apps?.sandboxOrigin;
						sandboxOrigin = configuredOrigin ? new URL(configuredOrigin).origin : void 0;
						sandboxOriginResolved = true;
					}
					if (sandboxOrigin) widget.sandboxOrigin = sandboxOrigin;
				}
			}
			authority.assertActive();
			respond(true, projectBoardSnapshot(snapshot, boardSession.agentId));
		}),
		"board.update": defineBoardMethod("board.update", validateBoardUpdateParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const boardSession = resolveBoardSession(boardParams, context, respond);
			if (!boardSession) return;
			authority.assertActive();
			const snapshot = projectBoardSnapshot(await store.applyOps(boardSession, boardParams.ops, { assertCurrent: authority.assertActive }), boardSession.agentId);
			authority.assertActive();
			if (boardParams.ops.length > 0) {
				emitSessionsChanged(context, {
					sessionKey: boardSession.sessionKey,
					agentId: boardSession.agentId,
					reason: "board"
				});
				context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision
				}, {
					sessionKeys: [boardSession.sessionKey],
					agentId: boardSession.agentId
				});
			}
			respond(true, snapshot);
		}),
		"board.widget.put": defineBoardMethod("board.widget.put", validateBoardWidgetPutParams, async (invocation) => {
			const { params: requestParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const boardSession = resolveBoardSession(requestParams, context, respond);
			if (!boardSession) return;
			const { declared: requestDeclared, ...requestWithoutDeclared } = requestParams;
			let content;
			let declared = requestDeclared;
			let resolveMcpAppInteraction;
			if (requestParams.content.kind === "canvas-doc") {
				const document = await readCanvasDocument(requestParams.content.docId);
				authority.assertActive();
				if (document.cspSandbox !== "scripts") throw new BoardValidationError("invalid_operation", `canvas document is not script-enabled: ${requestParams.content.docId}`);
				content = {
					kind: "html",
					html: document.html
				};
			} else if (requestParams.content.kind === "mcp-app") {
				const active = await mcpApp.resolveActiveView({
					...boardSession,
					viewId: requestParams.content.viewId,
					cfg: context.getRuntimeConfig()
				});
				authority.assertActive();
				const { view } = active;
				if (!view.toolCallId) throw new BoardValidationError("invalid_operation", "MCP App view is missing its originating tool call");
				resolveMcpAppInteraction = async () => {
					try {
						await requireMcpAppInteraction(view);
						return true;
					} catch {
						return false;
					}
				};
				let interactive = await resolveMcpAppInteraction();
				authority.assertActive();
				const allowedTools = interactive ? await mcpApp.resolveAllowedToolNames(active) : [];
				authority.assertActive();
				if (interactive) {
					interactive = await resolveMcpAppInteraction();
					authority.assertActive();
				}
				content = {
					kind: "mcp-app",
					descriptor: {
						serverName: view.serverName,
						toolName: view.toolName,
						uiResourceUri: view.uiResourceUri,
						toolCallId: view.toolCallId
					},
					interactive
				};
				declared = interactive && allowedTools.length > 0 ? { tools: allowedTools } : void 0;
			} else if (requestParams.content.kind === "registered") {
				const registration = resolveBoardWidgetContentKind(authority.pluginRegistry, requestParams.content.contentKind);
				if (!registration) throw new BoardValidationError("invalid_operation", `widget kind ${JSON.stringify(requestParams.content.contentKind)} is unavailable; enable the plugin that provides it and retry`);
				try {
					registration.definition.validateSource(requestParams.content.source);
				} catch (error) {
					throw new BoardValidationError("invalid_operation", `invalid ${requestParams.content.contentKind} widget source: ${String(error)}`);
				}
				content = {
					...requestParams.content,
					pluginKind: registration.pluginKind
				};
			} else content = requestParams.content;
			const persistedContent = content.kind === "mcp-app" ? {
				kind: content.kind,
				descriptor: content.descriptor
			} : content.kind === "registered" ? {
				kind: content.kind,
				contentKind: content.contentKind,
				source: content.source
			} : content;
			if (!assertValidParams(persistedContent, validateBoardWidgetContent, "board.widget.put content", respond)) return;
			declared = normalizeBoardWidgetDeclared(declared);
			const materializedContent = content.kind === "html" ? {
				kind: "html",
				html: buildWidgetDocument(requestParams.title ?? requestParams.name, content.html, { connectOrigins: declared?.netOrigins })
			} : content;
			const boardParams = {
				...requestWithoutDeclared,
				...boardSession,
				content: materializedContent,
				...declared ? { declared } : {}
			};
			let identity;
			if ((content.kind === "html" || content.kind === "registered") && declared?.tools?.some((tool) => tool.startsWith(GITHUB_ACTIONS_GRANT_PREFIX))) {
				const { prepareBoardGitHubIdentity } = await import("./github-actions-read-BYV1oGni.mjs");
				identity = await prepareBoardGitHubIdentity(context, {
					...authority,
					boardSession
				});
			}
			const putWidget = () => store.putWidget(boardParams, {
				...resolveMcpAppInteraction ? { resolveMcpAppInteraction } : {},
				assertCurrent: () => {
					authority.assertActive();
					identity?.assertSelected();
					const cfg = context.getRuntimeConfig();
					const current = resolveRequestedSessionStoreTarget(cfg, boardSession.sessionKey, boardSession.agentId);
					if (!current.ok || current.value.sessionKey !== boardSession.sessionKey) throw new BoardValidationError("invalid_operation", "board session changed; retry");
				}
			});
			let snapshot = identity ? await identity.start(putWidget) : await putWidget();
			authority.assertActive();
			const widget = snapshot.widgets.find((candidate) => candidate.name === snapshot.resolvedWidgetName);
			if (widget?.grantState === "pending") {
				const decision = await resolveBoardWidgetApproval({
					cfg: context.getRuntimeConfig(),
					...boardSession,
					name: snapshot.resolvedWidgetName,
					content: materializedContent,
					declared: declared ?? {}
				});
				authority.assertActive();
				if (decision) snapshot = {
					...await store.grant(boardSession, snapshot.resolvedWidgetName, decision, widget.revision, widget.instanceId, { assertCurrent: authority.assertActive }),
					resolvedWidgetName: snapshot.resolvedWidgetName
				};
			}
			authority.assertActive();
			snapshot = projectBoardSnapshot(snapshot, boardSession.agentId);
			emitSessionsChanged(context, {
				sessionKey: boardSession.sessionKey,
				agentId: boardSession.agentId,
				reason: "board"
			});
			context.broadcast("board.changed", {
				sessionKey: snapshot.sessionKey,
				revision: snapshot.revision,
				widget: snapshot.resolvedWidgetName
			}, {
				sessionKeys: [boardSession.sessionKey],
				agentId: boardSession.agentId
			});
			respond(true, snapshot);
		}),
		"board.widget.grant": defineBoardMethod("board.widget.grant", validateBoardWidgetGrantParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const boardSession = resolveBoardSession(boardParams, context, respond);
			if (!boardSession) return;
			authority.assertActive();
			const snapshot = projectBoardSnapshot(await store.grant(boardSession, boardParams.name, boardParams.decision, boardParams.revision, boardParams.instanceId, { assertCurrent: authority.assertActive }), boardSession.agentId);
			authority.assertActive();
			context.broadcast("board.changed", {
				sessionKey: snapshot.sessionKey,
				revision: snapshot.revision
			}, {
				sessionKeys: [boardSession.sessionKey],
				agentId: boardSession.agentId
			});
			respond(true, snapshot);
		}),
		"board.widget.appView": defineBoardMethod("board.widget.appView", validateBoardWidgetAppViewParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const boardSession = resolveBoardSession(boardParams, context, respond);
			if (!boardSession) return;
			const widget = (await store.getSnapshot(boardSession)).widgets.find((candidate) => candidate.name === boardParams.name);
			const document = await store.readWidgetMcpApp(boardSession, boardParams.name);
			authority.assertActive();
			if (!widget || widget.contentKind !== "mcp-app" || widget.revision !== boardParams.revision || widget.instanceId !== boardParams.instanceId || !document || document.revision !== boardParams.revision || document.instanceId !== boardParams.instanceId) throw new BoardValidationError("not_found", `board MCP App widget not found: ${boardParams.name}`);
			const interactive = document.interactive && document.grantState === "granted";
			const authorizeAppInteraction = interactive ? async () => {
				const current = await store.readWidgetMcpApp(boardSession, boardParams.name);
				return current?.interactive === true && current.grantState === "granted" && current.revision === boardParams.revision && current.instanceId === boardParams.instanceId;
			} : void 0;
			const minted = await mcpApp.mintFromTranscript({
				cfg: context.getRuntimeConfig(),
				...boardSession,
				descriptor: document.descriptor,
				allowedAppToolNames: new Set(interactive ? document.declaredTools : []),
				...authorizeAppInteraction ? { authorizeAppInteraction } : {},
				readOnly: !interactive
			});
			authority.assertActive();
			if (!minted) throw new Error("Pinned MCP App source is no longer available");
			respond(true, {
				viewId: minted.view.viewId,
				expiresAtMs: minted.view.expiresAtMs
			});
		}),
		"board.event": defineBoardMethod("board.event", validateBoardEventParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			const publish = (identity) => {
				authority.assertActive();
				const appended = appendBoardEventNotice({
					sessionKey: identity.sessionKey,
					agentId: identity.agentId,
					widget: identity.name,
					payload: boardParams.payload
				});
				respond(true, {
					ok: true,
					appended
				});
			};
			if ("ticket" in boardParams) await withAuthorizedBoardWidgetView(store, boardParams.ticket, publish, { gatewayContext: context });
			else {
				const boardSession = resolveBoardSession(boardParams, context, respond);
				if (!boardSession) return;
				await store.useSnapshot(boardSession, (snapshot) => {
					if (!snapshot.widgets.some((candidate) => candidate.name === boardParams.widget)) throw new BoardValidationError("not_found", `board widget not found: ${boardParams.widget}`);
					publish({
						...boardSession,
						name: boardParams.widget
					});
				});
			}
		}),
		"board.prompt.authorize": defineBoardMethod("board.prompt.authorize", validateBoardPromptAuthorizeParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			const authority = captureBoardRequestAuthority(invocation);
			await withAuthorizedBoardWidgetView(store, boardParams.ticket, ({ document }) => {
				authority.assertActive();
				respond(true, { confirmationRequired: !boardWidgetHasGrantedTool(document.declared, document.grantState, "prompt") });
			}, { gatewayContext: context });
		}),
		"board.data.read": defineBoardMethod("board.data.read", validateBoardDataReadParams, async (invocation) => {
			const { params: boardParams, respond } = invocation;
			const bindingParams = boardParams.params ?? {};
			assertBoardCapabilityParamsSize(bindingParams, "data binding");
			const authority = captureBoardCapabilityAuthority(store, boardParams.ticket, invocation, boardDataBindingCapability(boardParams.bindingId, bindingParams));
			await readBoardDataBinding(boardParams.bindingId, bindingParams, invocation, authority, respond);
		}),
		"board.action": defineBoardMethod("board.action", validateBoardActionParams, async (invocation) => {
			const { params: boardParams, respond } = invocation;
			const capability = "jobId" in boardParams ? `cron.trigger:${boardParams.jobId}` : boardParams.action;
			const authority = captureBoardCapabilityAuthority(store, boardParams.ticket, invocation, capability);
			if ("jobId" in boardParams) {
				await triggerBoardCronJob(boardParams.jobId, invocation, authority, respond);
				return;
			}
			const actionParams = boardParams.params ?? {};
			assertBoardCapabilityParamsSize(actionParams, "action");
			await runBoardActionVerb(boardParams.action, actionParams, invocation, authority, respond);
		})
	};
}
const boardHandlers = createBoardHandlers(boardStore);
//#endregion
export { boardHandlers };
