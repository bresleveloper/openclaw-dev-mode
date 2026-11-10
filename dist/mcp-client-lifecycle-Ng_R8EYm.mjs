import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { t as getSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-BKlKyGa0.mjs";
import { n as isMcpRequestTimeoutError } from "./mcp-error-C1eeD4DO.mjs";
import { i as OpenClawStreamableHTTPClientTransport, n as McpSseSessionExpiredError, r as OpenClawSSEClientTransport, t as OpenClawStdioClientTransport } from "./mcp-stdio-transport-DLsQzsXq.mjs";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
//#region src/agents/mcp-client-lifecycle.ts
var McpClientConnectTimeoutError = class extends Error {};
/** Matches an expired HTTP session without treating stateless HTTP 404s as expiration. */
function isMcpHttpSessionExpired(session, error) {
	if (session.transportType === "sse") return session.transport instanceof OpenClawSSEClientTransport && error instanceof McpSseSessionExpiredError;
	return session.transportType === "streamable-http" && session.transport instanceof OpenClawStreamableHTTPClientTransport && session.transport.sessionId !== void 0 && error instanceof StreamableHTTPError && error.code === 404;
}
async function connectMcpClient(params) {
	const deadline = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, deadline]) : deadline;
	try {
		await racePromiseWithAbortSignal((async () => {
			const { client } = params;
			const close = client.close;
			client.close = () => {
				const closing = close.call(client);
				closing.catch(() => recordAgentCleanupFailure());
				return closing;
			};
			try {
				await client.connect(params.transport, {
					signal,
					timeout: params.timeoutMs,
					maxTotalTimeout: params.timeoutMs
				});
			} finally {
				client.close = close;
			}
		})(), signal, () => signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("MCP startup aborted"));
	} catch (error) {
		if (deadline.aborted || isMcpRequestTimeoutError(error)) {
			await disposeMcpClient({
				client: params.client,
				transport: params.transport,
				transportType: params.transport instanceof OpenClawStdioClientTransport ? "stdio" : params.transport instanceof OpenClawStreamableHTTPClientTransport ? "streamable-http" : "sse"
			}, Math.min(params.timeoutMs, 1e3));
			throw new McpClientConnectTimeoutError(`MCP server connection timed out after ${params.timeoutMs}ms`, { cause: error });
		}
		throw error;
	}
}
async function disposeMcpClient(session, timeoutMs = 5e3) {
	let failed = false;
	const markFailed = () => {
		failed = true;
		recordAgentCleanupFailure();
	};
	const ignoreCloseFailure = async (close) => {
		try {
			await close();
		} catch (error) {
			const firstFailure = !failed;
			markFailed();
			if (firstFailure) try {
				session.onCleanupError?.(error);
			} catch {}
		}
	};
	try {
		const graceful = (async () => {
			if (session.transportType === "streamable-http") try {
				await session.transport.terminateSession?.();
			} catch {
				logWarn("bundle-mcp: remote session termination was not confirmed; continuing local cleanup");
			}
			await ignoreCloseFailure(() => session.transport.close());
			await ignoreCloseFailure(() => session.client.close());
		})();
		if (await settlesWithin(graceful, timeoutMs)) return failed ? "uncertain" : "closed";
		const { transport } = session;
		const closeTransport = session.transportType === "stdio" && transport instanceof OpenClawStdioClientTransport ? () => transport.forceClose() : () => transport.close();
		if (!await settlesWithin(Promise.all([
			graceful,
			ignoreCloseFailure(closeTransport),
			ignoreCloseFailure(() => session.client.close())
		]), timeoutMs)) markFailed();
		return failed ? "uncertain" : "closed";
	} finally {
		session.detachStderr?.();
	}
}
function createMcpRequestLifecycle(humanInputTimeoutMs) {
	const timeouts = /* @__PURE__ */ new WeakSet();
	return {
		didTimeout: (error) => error !== null && typeof error === "object" && timeouts.has(error),
		run: async ({ requestTimeoutMs: timeoutMs }, request, parentSignal) => {
			const requestSignal = parentSignal ?? getSessionMcpRequestSignal();
			const abortController = new AbortController();
			const onParentAbort = () => abortController.abort(requestSignal?.reason);
			if (requestSignal?.aborted) onParentAbort();
			else requestSignal?.addEventListener("abort", onParentAbort, { once: true });
			const timeoutError = new McpError(ErrorCode.RequestTimeout, "Request timed out", { timeout: timeoutMs });
			const onTimeout = () => {
				timeouts.add(timeoutError);
				abortController.abort(timeoutError);
			};
			let deadline = performance.now() + timeoutMs;
			let humanInputRemainingMs = humanInputTimeoutMs;
			let humanInputStartedAt = 0;
			let humanInputWaits = 0;
			let finished = false;
			let timeout = setTimeout(onTimeout, timeoutMs);
			timeout.unref?.();
			const armTimeout = (expiresAt) => {
				clearTimeout(timeout);
				timeout = setTimeout(onTimeout, Math.max(0, expiresAt - performance.now()));
				timeout.unref?.();
			};
			const holdForHumanInput = () => {
				if (humanInputWaits++ === 0) {
					humanInputStartedAt = performance.now();
					armTimeout(deadline + humanInputRemainingMs);
				}
				return () => {
					if (--humanInputWaits === 0 && !finished && !abortController.signal.aborted) {
						const elapsed = Math.min(performance.now() - humanInputStartedAt, humanInputRemainingMs);
						humanInputRemainingMs -= elapsed;
						deadline += elapsed;
						armTimeout(deadline);
					}
				};
			};
			try {
				const signal = abortController.signal;
				signal.throwIfAborted();
				const result = await request(signal, holdForHumanInput);
				requestSignal?.throwIfAborted();
				return result;
			} catch (error) {
				requestSignal?.throwIfAborted();
				throw error;
			} finally {
				finished = true;
				requestSignal?.removeEventListener("abort", onParentAbort);
				clearTimeout(timeout);
			}
		}
	};
}
//#endregion
export { isMcpHttpSessionExpired as a, disposeMcpClient as i, connectMcpClient as n, createMcpRequestLifecycle as r, McpClientConnectTimeoutError as t };
