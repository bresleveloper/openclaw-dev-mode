import { n as resolveCopilotProvider, o as tokenFingerprint, r as createCopilotByokProxy } from "./harness-BH2_ctMF.mjs";
import { r as createCopilotIsolatedSessionRestrictions, t as buildCopilotAssistantUsage } from "./usage-bridge-Cpa-ZYwL.mjs";
import { resolve } from "node:path";
//#region extensions/copilot/src/isolated-completion.ts
function startBestEffortCleanup(cleanup) {
	try {
		cleanup().catch(() => void 0);
	} catch {}
}
function resolveReasoningEffort(thinkLevel) {
	return thinkLevel === "low" || thinkLevel === "medium" || thinkLevel === "high" || thinkLevel === "xhigh" ? thinkLevel : void 0;
}
function createAbortError(signal) {
	if (signal.reason instanceof Error) return signal.reason;
	const error = new Error("aborted", signal.reason ? { cause: signal.reason } : void 0);
	error.name = "AbortError";
	return error;
}
function createTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`[copilot] isolated completion timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
async function awaitWithinCompletionBoundary(params) {
	const signal = params.boundary.abortSignal;
	if (signal?.aborted) throw createAbortError(signal);
	const remainingMs = params.boundary.deadlineMs - Date.now();
	if (remainingMs <= 0) throw createTimeoutError(params.boundary.timeoutMs);
	let boundaryError;
	let timer;
	let onAbort;
	const boundary = new Promise((_resolve, reject) => {
		const rejectBoundary = (error) => {
			if (boundaryError) return;
			boundaryError = error;
			params.onBoundary?.();
			reject(error);
		};
		timer = setTimeout(() => rejectBoundary(createTimeoutError(params.boundary.timeoutMs)), remainingMs);
		if (signal) {
			onAbort = () => rejectBoundary(createAbortError(signal));
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		}
	});
	const assertCurrent = () => {
		if (boundaryError) throw boundaryError;
		params.boundary.assertCurrent?.();
	};
	const operation = Promise.resolve().then(() => {
		assertCurrent();
		return params.start(remainingMs);
	}).then((value) => {
		try {
			assertCurrent();
			return value;
		} catch (error) {
			startBestEffortCleanup(async () => await params.cleanupLate?.(value));
			throw error;
		}
	});
	try {
		return await Promise.race([operation, boundary]);
	} catch (error) {
		params.boundary.assertCurrent?.();
		throw error;
	} finally {
		if (timer) clearTimeout(timer);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function sendPrompt(params) {
	return await awaitWithinCompletionBoundary({
		boundary: params.boundary,
		start: async (remainingMs) => await params.session.sendAndWait({
			prompt: params.prompt,
			...params.requestHeaders ? { requestHeaders: params.requestHeaders } : {}
		}, remainingMs),
		onBoundary: () => {
			params.session.abort().catch(() => void 0);
		}
	});
}
async function runCopilotIsolatedCompletion(params, getPool) {
	const reasoningEffort = resolveReasoningEffort(params.thinkLevel);
	if (params.thinkLevel !== void 0 && reasoningEffort === void 0) throw new Error(`[copilot] isolated completion does not support thinking level ${params.thinkLevel}`);
	const boundary = {
		abortSignal: params.abortSignal,
		assertCurrent: params.assertCurrent,
		deadlineMs: Date.now() + params.timeoutMs,
		timeoutMs: params.timeoutMs
	};
	if (params.authorization.owner !== "host") throw new Error("[copilot] isolated completion requires host-prepared authorization");
	const authorization = params.authorization;
	const { auth, model } = authorization;
	const apiKey = auth.apiKey?.trim();
	if (!apiKey) throw new Error("[copilot] isolated completion requires the prepared credential");
	const resolvedProvider = resolveCopilotProvider({
		model: {
			api: model.api,
			id: model.id,
			provider: model.provider,
			baseUrl: model.baseUrl,
			headers: model.headers,
			authHeader: model.authHeader,
			contextTokens: model.contextTokens,
			contextWindow: model.contextWindow,
			maxTokens: params.streamParams?.maxTokens ?? model.maxTokens,
			azureApiVersion: typeof model.params?.azureApiVersion === "string" ? model.params.azureApiVersion : void 0
		},
		resolvedApiKey: apiKey,
		authProfileId: auth.profileId
	});
	const pool = await awaitWithinCompletionBoundary({
		boundary,
		start: getPool
	});
	const byokProxy = await awaitWithinCompletionBoundary({
		boundary,
		start: async () => await createCopilotByokProxy(resolvedProvider),
		cleanupLate: async (proxy) => await proxy?.close()
	});
	const sessionProvider = byokProxy?.provider ?? resolvedProvider;
	const githubAuth = sessionProvider.mode === "github-copilot";
	const copilotHome = resolve(params.agentDir, "copilot");
	const authProfileId = auth.profileId?.trim() || "prepared";
	const authProfileVersion = authorization.sourceAuthFingerprint?.trim() || tokenFingerprint(apiKey);
	let handle;
	let session;
	try {
		const acquiredHandle = await awaitWithinCompletionBoundary({
			boundary,
			start: async () => await pool.acquire({
				agentId: params.agentId,
				authMode: githubAuth ? "gitHubToken" : "byok",
				authProfileId,
				authProfileVersion,
				copilotHome,
				clientMode: "empty"
			}, {
				copilotHome,
				mode: "empty",
				useLoggedInUser: false,
				...githubAuth ? { gitHubToken: apiKey } : {}
			}),
			cleanupLate: async (lateHandle) => await pool.release(lateHandle)
		});
		handle = acquiredHandle;
		const sessionConfig = {
			...createCopilotIsolatedSessionRestrictions(),
			model: model.id,
			...githubAuth ? { gitHubToken: apiKey } : {},
			...sessionProvider.provider ? { provider: sessionProvider.provider } : {},
			...reasoningEffort ? { reasoningEffort } : {},
			systemMessage: {
				mode: "replace",
				content: params.systemPrompt
			},
			workingDirectory: params.workspaceDir
		};
		const createdSession = await awaitWithinCompletionBoundary({
			boundary,
			start: async () => await acquiredHandle.client.createSession(sessionConfig),
			cleanupLate: async (lateSession) => {
				startBestEffortCleanup(async () => await lateSession.abort());
				startBestEffortCleanup(async () => await lateSession.disconnect());
			}
		});
		session = createdSession;
		const event = await sendPrompt({
			boundary,
			prompt: params.prompt,
			requestHeaders: sessionProvider.provider?.headers,
			session: createdSession
		});
		if (event?.type !== "assistant.message" || event.agentId !== void 0) throw new Error("[copilot] isolated completion did not return a root assistant message");
		const content = [];
		if (event.data.reasoningText) content.push({
			type: "thinking",
			thinking: event.data.reasoningText
		});
		if (event.data.content) content.push({
			type: "text",
			text: event.data.content
		});
		for (const toolRequest of event.data.toolRequests ?? []) {
			const toolArguments = toolRequest.arguments;
			content.push({
				type: "toolCall",
				id: toolRequest.toolCallId,
				name: toolRequest.name,
				arguments: toolArguments && typeof toolArguments === "object" && !Array.isArray(toolArguments) ? { ...toolArguments } : {}
			});
		}
		return { assistant: {
			role: "assistant",
			content,
			api: model.api,
			provider: model.provider,
			model: event.data.model ?? model.id,
			stopReason: event.data.toolRequests?.length ? "toolUse" : "stop",
			timestamp: Date.now(),
			usage: buildCopilotAssistantUsage({ fallbackOutputTokens: event.data.outputTokens })
		} };
	} finally {
		if (session) {
			const sessionToClose = session;
			startBestEffortCleanup(async () => await sessionToClose.disconnect());
		}
		if (byokProxy) startBestEffortCleanup(async () => await byokProxy.close());
		if (handle) {
			const handleToRelease = handle;
			startBestEffortCleanup(async () => await pool.release(handleToRelease));
		}
	}
}
//#endregion
export { runCopilotIsolatedCompletion };
