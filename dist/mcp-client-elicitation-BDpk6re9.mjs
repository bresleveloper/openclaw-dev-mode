import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { Fn as object, Jn as string, Un as record, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as getSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-SqXfuSsz.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/mcp-client-elicitation.ts
const MCP_ELICITATION_TIMEOUT_MS = 6e5;
const handlers = resolveGlobalSingleton(Symbol.for("openclaw.mcpElicitationHandler"), () => new AsyncLocalStorage());
function runWithMcpElicitationHandler(handler, run) {
	return handlers.run(handler, run);
}
/** Capture the current tool caller for harness-native, out-of-band requests. */
function captureMcpClientElicitation() {
	const handler = handlers.getStore();
	if (!handler) return;
	const restore = AsyncLocalStorage.snapshot();
	return {
		signal: getSessionMcpRequestSignal(),
		handle: (request) => restore(handler, request)
	};
}
/** The SDK transport callback does not inherit the calling tool's async scope. */
function bindMcpClientElicitation(client) {
	const active = /* @__PURE__ */ new Set();
	for (const method of ["elicitation/create", "openai/elicitation/create"]) {
		const schema = object({
			method: literal(method),
			params: record(string(), unknown())
		});
		client.setRequestHandler(schema, async (request, extra) => {
			const call = active.size === 1 ? active.values().next().value : void 0;
			if (!call?.handler) throw new McpError(ErrorCode.InvalidRequest, "MCP elicitation has no unambiguous active requester");
			const signal = AbortSignal.any([call.signal, extra.signal]);
			signal.throwIfAborted();
			const release = call.holdForHumanInput?.();
			try {
				const result = await call.handler({
					method,
					requestId: extra.requestId,
					params: request.params,
					signal
				});
				signal.throwIfAborted();
				if (!active.has(call)) throw new McpError(ErrorCode.InvalidRequest, "MCP elicitation requester expired");
				return result;
			} finally {
				release?.();
			}
		});
	}
	return async (signal, run, holdForHumanInput) => {
		const handler = handlers.getStore();
		const restoreCaller = AsyncLocalStorage.snapshot();
		const call = {
			handler: handler ? (request) => restoreCaller(handler, request) : void 0,
			signal,
			holdForHumanInput
		};
		active.add(call);
		try {
			return await run();
		} finally {
			active.delete(call);
		}
	};
}
/** Transport adapter only: the shared structured-input compiler owns form semantics. */
function createMcpClientElicitationHandler(params) {
	return async (request) => {
		params.assertCurrent();
		const [{ compileStructuredInputForm, compileStructuredInputUrl, snapshotStructuredInput, isStructuredInputRecord }, { runStructuredInput }] = await Promise.all([import("./structured-input-CoOIuwts.mjs"), import("./structured-input-execution-YPYq5HI4.mjs")]);
		params.assertCurrent();
		const rich = request.method === "openai/elicitation/create";
		const value = snapshotStructuredInput(request.params, { richForm: rich });
		if (!isStructuredInputRecord(value)) throw new McpError(ErrorCode.InvalidParams, "Malformed MCP elicitation request");
		const resource = rich && params.prepareResourceContext && value.mode !== "url" ? await params.prepareResourceContext({
			requestId: request.requestId ?? randomUUID(),
			snapshot: value,
			signal: request.signal
		}) : void 0;
		try {
			const input = value.mode === "url" ? compileStructuredInputUrl({
				url: value.url,
				elicitationId: value.elicitationId,
				message: value.message,
				fallbackMessage: "MCP server needs input",
				protocolName: "MCP"
			}) : compileStructuredInputForm({
				schema: value.requestedSchema,
				message: typeof value.message === "string" ? value.message : void 0,
				fallbackMessage: "MCP server needs input",
				options: {
					protocolName: rich ? "OpenAI" : "MCP",
					allowRichForms: rich,
					...resource ? { resourceContext: resource.context } : {},
					allowEmptyForm: true,
					minimumChoiceCount: 1,
					allowEnumNames: true,
					metadata: { secretPath: ["isSecret"] }
				}
			});
			if (input.kind === "unsupported") throw new McpError(ErrorCode.InvalidParams, input.message);
			const result = await runStructuredInput({
				input,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				timeoutMs: MCP_ELICITATION_TIMEOUT_MS,
				delivery: {},
				gatewayCall: params.gatewayCall,
				signal: request.signal,
				isActive: () => {
					try {
						params.assertCurrent();
						return true;
					} catch {
						return false;
					}
				}
			});
			params.assertCurrent();
			return result.status === "answered" ? {
				action: "accept",
				content: result.content
			} : { action: result.status === "declined" || result.status === "unsupported" ? "decline" : "cancel" };
		} finally {
			await resource?.dispose();
		}
	};
}
//#endregion
export { runWithMcpElicitationHandler as a, createMcpClientElicitationHandler as i, bindMcpClientElicitation as n, captureMcpClientElicitation as r, MCP_ELICITATION_TIMEOUT_MS as t };
