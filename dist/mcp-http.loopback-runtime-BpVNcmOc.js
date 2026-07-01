//#region src/gateway/mcp-http.loopback-runtime.ts
let activeRuntime;
let nextToolCallCaptureGeneration = 0;
const toolCallCaptures = /* @__PURE__ */ new Map();
function deleteMcpLoopbackToolCallCapture(captureKey) {
	const capture = toolCallCaptures.get(captureKey);
	if (!capture) return;
	toolCallCaptures.delete(captureKey);
	for (const resolve of capture.activityWaiters) resolve();
	capture.activityWaiters.clear();
}
function notifyMcpLoopbackToolCallCaptureActivity(capture) {
	capture.activityVersion += 1;
	for (const resolve of capture.activityWaiters) resolve();
	capture.activityWaiters.clear();
}
/** Start loopback tool-call result capture for one serialized CLI invocation. */
function beginMcpLoopbackToolCallCapture(params) {
	const captureKey = params.captureKey.trim();
	if (!captureKey) return;
	nextToolCallCaptureGeneration += 1;
	toolCallCaptures.set(captureKey, {
		generation: nextToolCallCaptureGeneration,
		onYield: params.onYield,
		onRequestStart: params.onRequestStart,
		onRequestClassified: params.onRequestClassified,
		onRequestFinish: params.onRequestFinish,
		onToolCallStart: params.onToolCallStart,
		onToolCallUpdate: params.onToolCallUpdate,
		onToolCallFinish: params.onToolCallFinish,
		onToolCallResult: params.onToolCallResult,
		inFlight: 0,
		activityVersion: 0,
		activityWaiters: /* @__PURE__ */ new Set()
	});
}
/** Resolve yield state bound to the request's admitted CLI capture generation. */
function resolveMcpLoopbackYieldContext(captureHandle) {
	const capture = captureHandle?.capture;
	if (!capture?.onYield) return;
	return {
		cacheKey: String(capture.generation),
		onYield: async (message) => {
			await capture.onYield?.(message);
		}
	};
}
/** Bind an authenticated HTTP request to the active capture generation before reading its body. */
function markMcpLoopbackRequestStarted(captureKey) {
	const normalizedKey = captureKey?.trim() ?? "";
	if (!normalizedKey) return;
	const capture = toolCallCaptures.get(normalizedKey);
	if (!capture) return;
	capture.inFlight += 1;
	notifyMcpLoopbackToolCallCaptureActivity(capture);
	try {
		capture.onRequestStart?.();
	} catch {}
	return {
		capture,
		classified: false,
		finished: false
	};
}
/** Mark a request body as parsed so it no longer represents an unknown possible send. */
function markMcpLoopbackRequestClassified(captureHandle) {
	if (!captureHandle || captureHandle.classified || captureHandle.finished) return;
	captureHandle.classified = true;
	try {
		captureHandle.capture.onRequestClassified?.();
	} catch {}
}
/** Mark an authenticated request as settled and wake capture drains. */
function markMcpLoopbackRequestFinished(captureHandle) {
	if (!captureHandle || captureHandle.finished) return;
	markMcpLoopbackRequestClassified(captureHandle);
	captureHandle.finished = true;
	const { capture } = captureHandle;
	try {
		capture.onRequestFinish?.();
	} catch {}
	capture.inFlight = Math.max(0, capture.inFlight - 1);
	notifyMcpLoopbackToolCallCaptureActivity(capture);
}
/** Mark a captured loopback tool call as in flight. */
function markMcpLoopbackToolCallStarted(params) {
	const toolName = params.toolName.trim();
	if (!toolName || params.requestCaptureHandle?.finished) return;
	const captureKey = params.captureKey?.trim() ?? "";
	const capture = params.requestCaptureHandle?.capture ?? toolCallCaptures.get(captureKey);
	if (!capture) return;
	const call = {
		toolName,
		args: params.args
	};
	capture.inFlight += 1;
	notifyMcpLoopbackToolCallCaptureActivity(capture);
	try {
		capture.onToolCallStart?.(call);
	} catch {}
	return {
		capture,
		call,
		prepared: false,
		finished: false
	};
}
/** Update an admitted call with the final arguments produced by gateway hooks. */
function updateMcpLoopbackToolCallCapture(captureHandle, call) {
	if (!captureHandle || captureHandle.finished) return;
	const previous = captureHandle.call;
	captureHandle.call = call;
	captureHandle.prepared = true;
	try {
		captureHandle.capture.onToolCallUpdate?.({
			previous,
			current: call
		});
	} catch {}
}
/** Report a completed call without letting observer failures alter tool execution. */
function recordMcpLoopbackToolCallResult(params) {
	const toolName = params.toolName.trim();
	if (!toolName) return;
	try {
		params.captureHandle.capture.onToolCallResult({
			toolName,
			args: params.args,
			result: params.result,
			isError: params.isError
		});
	} catch {}
}
/** Mark a captured loopback tool call as settled and wake idle drains. */
function markMcpLoopbackToolCallFinished(captureHandle) {
	if (!captureHandle || captureHandle.finished) return;
	captureHandle.finished = true;
	const { capture } = captureHandle;
	try {
		capture.onToolCallFinish?.(captureHandle.call, { prepared: captureHandle.prepared });
	} catch {}
	capture.inFlight = Math.max(0, capture.inFlight - 1);
	notifyMcpLoopbackToolCallCaptureActivity(capture);
}
async function waitForMcpLoopbackToolCallCaptureActivity(capture, timeoutMs) {
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (active) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			capture.activityWaiters.delete(resolveActivity);
			resolve(active);
		};
		const resolveActivity = () => finish(true);
		const timer = setTimeout(() => finish(false), Math.max(0, timeoutMs));
		timer.unref?.();
		capture.activityWaiters.add(resolveActivity);
	});
}
/** Wait for admitted calls to settle and for a quiet request-admission grace. */
async function waitForMcpLoopbackToolCallCaptureIdle(captureKey, options) {
	const normalizedKey = captureKey.trim();
	const capture = toolCallCaptures.get(normalizedKey);
	if (!capture) return true;
	const deadline = Date.now() + Math.max(0, options.timeoutMs);
	while (toolCallCaptures.get(normalizedKey) === capture) {
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) return false;
		if (capture.inFlight > 0) {
			await waitForMcpLoopbackToolCallCaptureActivity(capture, remainingMs);
			continue;
		}
		const admissionGraceMs = Math.max(0, options.admissionGraceMs);
		if (admissionGraceMs === 0) return true;
		const activityVersion = capture.activityVersion;
		const quietWaitMs = Math.min(admissionGraceMs, remainingMs);
		if (!await waitForMcpLoopbackToolCallCaptureActivity(capture, quietWaitMs) && quietWaitMs === admissionGraceMs && capture.inFlight === 0 && capture.activityVersion === activityVersion) return true;
	}
	return true;
}
/** Clear an unfinished invocation capture. Attempt keys are unique per CLI execution. */
function clearMcpLoopbackToolCallCapture(captureKey) {
	deleteMcpLoopbackToolCallCapture(captureKey.trim());
}
/** Return a copy of the active loopback runtime, if one has been installed. */
function getActiveMcpLoopbackRuntime() {
	return activeRuntime ? { ...activeRuntime } : void 0;
}
/** Install the active loopback runtime used by in-process MCP callers. */
function setActiveMcpLoopbackRuntime(runtime) {
	activeRuntime = { ...runtime };
}
/** Choose the bearer token matching owner/non-owner caller identity. */
function resolveMcpLoopbackBearerToken(runtime, senderIsOwner) {
	return senderIsOwner ? runtime.ownerToken : runtime.nonOwnerToken;
}
/** Clear loopback runtime only when the owning token matches the active runtime. */
function clearActiveMcpLoopbackRuntimeByOwnerToken(ownerToken) {
	if (activeRuntime?.ownerToken === ownerToken) activeRuntime = void 0;
}
/** Build the MCP server config injected into agents for loopback tool access. */
function createMcpLoopbackServerConfig(port) {
	return { mcpServers: { openclaw: {
		type: "http",
		url: `http://127.0.0.1:${port}/mcp`,
		alwaysLoad: true,
		headers: {
			Authorization: "Bearer ${OPENCLAW_MCP_TOKEN}",
			"x-session-key": "${OPENCLAW_MCP_SESSION_KEY}",
			"x-openclaw-session-id": "${OPENCLAW_MCP_SESSION_ID}",
			"x-openclaw-agent-id": "${OPENCLAW_MCP_AGENT_ID}",
			"x-openclaw-account-id": "${OPENCLAW_MCP_ACCOUNT_ID}",
			"x-openclaw-message-channel": "${OPENCLAW_MCP_MESSAGE_CHANNEL}",
			"x-openclaw-current-channel-id": "${OPENCLAW_MCP_CURRENT_CHANNEL_ID}",
			"x-openclaw-current-thread-ts": "${OPENCLAW_MCP_CURRENT_THREAD_TS}",
			"x-openclaw-current-message-id": "${OPENCLAW_MCP_CURRENT_MESSAGE_ID}",
			"x-openclaw-current-inbound-audio": "${OPENCLAW_MCP_CURRENT_INBOUND_AUDIO}",
			"x-openclaw-inbound-event-kind": "${OPENCLAW_MCP_INBOUND_EVENT_KIND}",
			"x-openclaw-source-reply-delivery-mode": "${OPENCLAW_MCP_SOURCE_REPLY_DELIVERY_MODE}",
			"x-openclaw-require-explicit-message-target": "${OPENCLAW_MCP_REQUIRE_EXPLICIT_MESSAGE_TARGET}",
			"x-openclaw-cli-capture-key": "${OPENCLAW_MCP_CLI_CAPTURE_KEY}"
		}
	} } };
}
//#endregion
export { getActiveMcpLoopbackRuntime as a, markMcpLoopbackRequestStarted as c, recordMcpLoopbackToolCallResult as d, resolveMcpLoopbackBearerToken as f, waitForMcpLoopbackToolCallCaptureIdle as g, updateMcpLoopbackToolCallCapture as h, createMcpLoopbackServerConfig as i, markMcpLoopbackToolCallFinished as l, setActiveMcpLoopbackRuntime as m, clearActiveMcpLoopbackRuntimeByOwnerToken as n, markMcpLoopbackRequestClassified as o, resolveMcpLoopbackYieldContext as p, clearMcpLoopbackToolCallCapture as r, markMcpLoopbackRequestFinished as s, beginMcpLoopbackToolCallCapture as t, markMcpLoopbackToolCallStarted as u };
