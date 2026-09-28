import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { t as parseOpenAIQuicksilverEvent } from "./realtime-quicksilver-events-DmOkRrC8.mjs";
//#region extensions/openai/realtime-quicksilver-protocol.ts
function buildOpenAIQuicksilverAudioAppend(model, audio) {
	return {
		type: isOpenAIGptLiveApiModel(model) ? "session.input_audio.append" : "input_audio.append",
		audio
	};
}
function buildOpenAIQuicksilverContextAppend(params) {
	if (isOpenAIGptLiveApiModel(params.model)) return {
		type: params.channel === "speakable" ? "session.commentary.append" : "session.thinking.append",
		delegation_id: params.delegationId ?? null,
		content: params.text
	};
	return {
		type: params.delegationId ? "delegation.context.append" : "session.context.append",
		...params.delegationId ? { delegation_item_id: params.delegationId } : {},
		...params.channel ? { channel: params.channel } : {},
		content: [{
			type: "input_text",
			text: params.text
		}]
	};
}
function openAIQuicksilverToolResultText(result) {
	if (typeof result === "string") return result;
	const record = asOptionalObjectRecord(result);
	if (record) for (const key of [
		"text",
		"result",
		"output",
		"error"
	]) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value;
	}
	try {
		return JSON.stringify(result) ?? String(result);
	} catch {
		return String(result);
	}
}
async function closeOpenAILiveSocket(socket) {
	let outcome;
	try {
		outcome = { reason: await new Promise((resolve, reject) => {
			const finish = (result) => {
				clearTimeout(timeout);
				socket.off("message", onMessage);
				socket.off("close", onClose);
				socket.off("error", onClose);
				if (result instanceof Error) reject(result);
				else resolve(result);
			};
			const onMessage = (data, isBinary) => {
				if (!isBinary) {
					const event = parseOpenAIQuicksilverEvent(rawDataToString(data), "gpt-live-1");
					if (event?.kind === "session-closed") finish(event.reason);
				}
			};
			const onClose = () => finish(/* @__PURE__ */ new Error("GPT-Live connection ended before session.closed; finalization is unconfirmed"));
			const timeout = setTimeout(() => finish(/* @__PURE__ */ new Error("GPT-Live session.closed timed out; finalization is unconfirmed")), 15e3);
			timeout.unref?.();
			socket.on("message", onMessage);
			socket.on("close", onClose);
			socket.on("error", onClose);
			if (socket.readyState !== 1) {
				onClose();
				return;
			}
			try {
				socket.send(JSON.stringify({ type: "session.close" }));
			} catch {
				onClose();
			}
		}) };
	} catch (error) {
		outcome = { error };
	}
	try {
		socket.close(1e3, "session closed");
	} catch {
		if (!("error" in outcome)) outcome = { error: /* @__PURE__ */ new Error("GPT-Live transport could not be closed") };
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.reason;
}
function retireOpenAIQuicksilverSessionWire(params) {
	const publicApi = isOpenAIGptLiveApiModel(params.model);
	const finish = (error) => {
		try {
			if (publicApi) params.delegations.detach();
			else params.delegations.stop(/* @__PURE__ */ new Error("GPT-Live delegation stopped"));
		} finally {
			params.controller.abort(/* @__PURE__ */ new Error("GPT-Live session closed"));
			if (!publicApi && params.socket.readyState === 1) try {
				params.socket.send(JSON.stringify({ type: "session.close" }));
			} catch {}
			try {
				params.socket.close(1e3, "session closed");
			} catch {}
			params.reportTerminal(error);
		}
	};
	if (!publicApi) {
		finish(params.error);
		return;
	}
	params.delegations.beginTranscriptDrain("abort");
	if (params.error || params.isFinalized() || params.socket.readyState !== 1) {
		finish(params.error);
		return;
	}
	return closeOpenAILiveSocket(params.socket).then((reason) => finish(reason === "content" || reason === "connection_lost" ? /* @__PURE__ */ new Error("GPT-Live session ended with a provider or connection failure") : void 0), (error) => {
		finish(/* @__PURE__ */ new Error("GPT-Live session finalization was not confirmed"));
		throw error;
	});
}
/** Transport diagnostics retain activity only, never routes, IDs, or frame content. */
function captureOpenAIQuicksilverTransportEvent(runtime, direction, kind) {
	runtime.captureWsEvent({
		url: "wss://realtime.invalid/private",
		direction,
		kind,
		flowId: "private-realtime",
		meta: {
			provider: "openai",
			capability: "gpt-live-voice"
		}
	});
}
//#endregion
export { openAIQuicksilverToolResultText as a, closeOpenAILiveSocket as i, buildOpenAIQuicksilverContextAppend as n, retireOpenAIQuicksilverSessionWire as o, captureOpenAIQuicksilverTransportEvent as r, buildOpenAIQuicksilverAudioAppend as t };
