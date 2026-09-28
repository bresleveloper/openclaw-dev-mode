import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/gateway/agent-event-assistant-text.ts
/** Append provenance is usable only while the wire still matches the merge base. */
function resolveAssistantTextStreamDelta(previous, merged, streamed) {
	if (previous === streamed && merged.appendedText !== void 0) return merged.appendedText;
	return merged.text.startsWith(streamed.text) ? merged.text.slice(streamed.text.length) : void 0;
}
/** A text-bearing empty result clears output; a missing text payload does not. */
function resolveAssistantResultText(result) {
	const payloads = asOptionalObjectRecord(result)?.payloads;
	const texts = Array.isArray(payloads) ? payloads.flatMap((payload) => {
		const text = asOptionalObjectRecord(payload)?.text;
		return typeof text === "string" ? [text] : [];
	}) : [];
	return texts.length > 0 ? texts.filter(Boolean).join("\n\n") : void 0;
}
/** Settled provisional output is run-wide; ordinary item streams keep their wire projection. */
function resolveAssistantTextCompletion(params) {
	if (params.pending) return params.resultText ?? (params.pending.text || (params.streamedText ? "" : params.fallbackText));
	return params.streamedText ? params.assistantText.text : (params.resultText ?? params.assistantText.text) || params.fallbackText;
}
/** Unkeyed held snapshots, including terminal echoes, describe the whole pending run. */
function mergePendingAssistantText(previous, input) {
	return mergeAssistantText(previous, !input.itemId && input.text !== void 0 ? {
		...input,
		replace: true
	} : input, "append-only");
}
/** Preserve snapshot presence: an absent snapshot is not an empty item. */
function resolveAssistantTextInput(data) {
	const record = asOptionalObjectRecord(data);
	if (!record || typeof record.text !== "string" && typeof record.delta !== "string") return;
	return {
		text: typeof record.text === "string" ? record.text : void 0,
		delta: typeof record.delta === "string" ? record.delta : void 0,
		itemId: typeof record.itemId === "string" && record.itemId ? record.itemId : void 0,
		replace: record.replace === true,
		replaceable: record.replaceable === true,
		...Array.isArray(record.managedMediaUrls) ? { managedMediaUrls: record.managedMediaUrls.filter((url) => typeof url === "string") } : {}
	};
}
/** Merge item snapshots without imposing a transport's display or wire limit. */
function mergeAssistantText(previous, input, unkeyed) {
	let scope = previous.scope;
	if (!input.itemId) scope = void 0;
	else if (scope?.itemId !== input.itemId) {
		const prefix = input.replace && input.replaceable ? "" : previous.text;
		scope = {
			itemId: input.itemId,
			prefix,
			boundaryNewlines: !prefix || prefix.endsWith("\n\n") ? 0 : prefix.endsWith("\n") ? 1 : 2,
			separatorLength: 0
		};
	}
	let text;
	if (scope) {
		if (input.text === void 0 && scope === previous.scope && previous.text.length - scope.prefix.length - scope.separatorLength >= 2) {
			const appendedText = input.delta ?? "";
			return {
				text: previous.text + appendedText,
				scope,
				appendedText
			};
		}
		const itemText = input.text ?? (scope === previous.scope ? previous.text.slice(scope.prefix.length + scope.separatorLength) : "") + (input.delta ?? "");
		const leadingNewlines = itemText.startsWith("\n\n") ? 2 : itemText.startsWith("\n") ? 1 : 0;
		if (!scope.prefix) scope.boundaryNewlines = Math.min(scope.boundaryNewlines, scope.separatorLength + leadingNewlines);
		scope.separatorLength = itemText ? Math.max(0, scope.boundaryNewlines - leadingNewlines) : 0;
		text = scope.prefix + "\n".repeat(scope.separatorLength) + itemText;
	} else if (input.text === void 0) {
		const appendedText = input.delta ?? "";
		return {
			text: previous.text + appendedText,
			scope,
			appendedText
		};
	} else if (unkeyed === "append-only") {
		if (input.replace) return {
			text: input.text,
			scope
		};
		if (input.text.startsWith(previous.text)) return {
			text: input.text,
			scope,
			appendedText: input.text.slice(previous.text.length)
		};
		const appendedText = input.delta ?? input.text;
		return {
			text: previous.text + appendedText,
			scope,
			appendedText
		};
	} else if (previous.text && input.text.length > previous.text.length && input.text.startsWith(previous.text)) text = input.text;
	else if (input.delta) text = previous.text + input.delta;
	else text = previous.text.startsWith(input.text) ? previous.text : input.text;
	return {
		text,
		scope
	};
}
//#endregion
export { resolveAssistantTextInput as a, resolveAssistantTextCompletion as i, mergePendingAssistantText as n, resolveAssistantTextStreamDelta as o, resolveAssistantResultText as r, mergeAssistantText as t };
