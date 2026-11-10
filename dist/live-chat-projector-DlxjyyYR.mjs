import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as resolveAssistantEventPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { g as stripInternalRuntimeContext, n as INTERNAL_RUNTIME_CONTEXT_END, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-DLJtDQoI.mjs";
import { a as createTextProjection, i as createConditionalTextProjector, r as createActivatedProjector } from "./text-projection-mdP9TY8k.mjs";
import { n as inlineDirectiveDisplayTextFilter, u as stripInlineDirectiveTagsForDisplay } from "./directive-tags-DmdxLrNX.mjs";
import { n as splitMediaOutput, t as isRelativeAssistantMediaReference } from "./parse-output-DRIp2d_R.mjs";
import { c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-DHFPcfdZ.mjs";
import { C as stripSuppressedControlReplyToken, S as isSuppressedControlReplyText, b as SUPPRESSED_CONTROL_REPLY_TOKENS, g as stripAssistantMediaDirectivesForDisplay, x as isSuppressedControlReplyLeadFragment } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { n as splitTrailingDirective } from "./streaming-directives-Bc5NTbqS.mjs";
//#region src/gateway/live-chat-projector.ts
const MAX_LIVE_CHAT_BUFFER_CHARS = 5e5;
/** Cap live display text without letting later snapshots resurrect the retired prefix. */
function capLiveAssistantText(snapshot) {
	const { text, scope } = snapshot;
	const capped = text.length > MAX_LIVE_CHAT_BUFFER_CHARS ? sliceUtf16Safe(text, -5e5) : text;
	if (scope) {
		const retired = text.length - capped.length;
		const retiredAfterPrefix = Math.max(0, retired - scope.prefix.length);
		scope.boundaryNewlines = retiredAfterPrefix > scope.separatorLength ? 0 : Math.max(0, scope.boundaryNewlines - retiredAfterPrefix);
		scope.separatorLength = Math.max(0, scope.separatorLength - retiredAfterPrefix);
		scope.prefix = sliceUtf16Safe(scope.prefix, retired);
	}
	return capped;
}
/** Removes runtime-only context/directive tags from the merged live assistant buffer. */
function normalizeLiveAssistantBufferedText(text, options) {
	const normalized = stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(text).text);
	return stripAssistantMediaDirectivesForDisplay(options?.final ? normalized : stripPendingLiveAssistantTail(normalized), options?.managedMediaUrls ?? []);
}
function stripPendingLiveAssistantTail(text) {
	const trailing = splitTrailingDirective(text);
	const parsedTail = trailing.tail ? splitMediaOutput(trailing.tail, { extractAudioDirectives: false }) : void 0;
	return parsedTail?.mediaUrls?.length && parsedTail.mediaUrls.every((url) => !isRelativeAssistantMediaReference(url)) ? text : trailing.text;
}
const pendingLiveAssistantTailFilter = {
	transform: stripPendingLiveAssistantTail,
	create: () => {
		let previousChar = "";
		let openBrackets = false;
		let possibleMediaLine = true;
		let mediaPrefixLength = 0;
		return createConditionalTextProjector(stripPendingLiveAssistantTail, (input) => {
			for (const char of input.delta ?? input.text) {
				if (previousChar === "[" && char === "[") openBrackets = true;
				else if (previousChar === "]" && char === "]") openBrackets = false;
				previousChar = char;
				if (char === "\n") {
					possibleMediaLine = true;
					mediaPrefixLength = 0;
				} else if (possibleMediaLine && mediaPrefixLength < 5) {
					if (mediaPrefixLength === 0 && /\s/u.test(char)) continue;
					possibleMediaLine = char.toUpperCase() === "MEDIA"[mediaPrefixLength];
					if (possibleMediaLine) mediaPrefixLength += 1;
				}
			}
			return openBrackets || previousChar === "[" || possibleMediaLine && mediaPrefixLength > 0;
		});
	}
};
/** One run-owned display chain; replacements rebuild every syntax and visibility probe. */
function createLiveAssistantTextProjection(options) {
	const managedMediaUrls = [...options?.managedMediaUrls ?? []];
	let classified = projectLiveAssistantBufferedText("");
	const controlFilter = {
		transform: (text) => projectLiveAssistantBufferedText(text).text,
		create: () => {
			let active = false;
			let ordinary = false;
			let hasContent = false;
			const project = createActivatedProjector({
				activationTokens: SUPPRESSED_CONTROL_REPLY_TOKENS,
				transform: (text) => {
					active = true;
					classified = projectLiveAssistantBufferedText(text);
					return classified.text;
				}
			});
			return (input) => {
				const result = project(input);
				if (!active) {
					hasContent ||= /\S/u.test(input.delta ?? input.text);
					classified = !ordinary && hasContent ? projectLiveAssistantBufferedText(input.text) : {
						text: input.text,
						suppress: !input.text,
						pendingLeadFragment: false
					};
					ordinary ||= hasContent && !classified.suppress && !classified.pendingLeadFragment;
				}
				return result;
			};
		}
	};
	const projection = createTextProjection([
		inlineDirectiveDisplayTextFilter,
		{
			activationTokens: [
				INTERNAL_RUNTIME_CONTEXT_BEGIN,
				INTERNAL_RUNTIME_CONTEXT_END,
				"runtime-generated"
			],
			transform: stripInternalRuntimeContext
		},
		...options?.final ? [] : [pendingLiveAssistantTailFilter],
		...managedMediaUrls.length ? [{
			activationTokens: ["MEDIA:"],
			transform: (text) => stripAssistantMediaDirectivesForDisplay(text, managedMediaUrls)
		}] : [],
		controlFilter
	]);
	let previousVisible = "";
	let previousSuppressed = true;
	const present = (result, replace = false) => {
		const visible = classified.suppress ? "" : result.text;
		const delta = replace ? null : classified.suppress ? previousVisible ? null : "" : previousSuppressed ? visible : result.delta;
		previousVisible = visible;
		previousSuppressed = classified.suppress;
		return {
			...classified,
			text: result.text,
			delta
		};
	};
	return {
		get source() {
			return projection.source;
		},
		append: (delta, preparedSource) => present(projection.append(delta, preparedSource)),
		replace: (text) => present(projection.replace(text), true)
	};
}
/** Projects buffered assistant text into display text or a suppressed/pending state. */
function projectLiveAssistantBufferedText(rawText, options) {
	const withoutTrailingControlToken = stripSuppressedControlReplyToken(rawText);
	const text = startsWithSilentToken(withoutTrailingControlToken, "NO_REPLY") ? stripLeadingSilentToken(withoutTrailingControlToken, SILENT_REPLY_TOKEN) : withoutTrailingControlToken;
	if (!text || isSuppressedControlReplyText(text)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(text)) return {
		text,
		suppress: true,
		pendingLeadFragment: true
	};
	return {
		text,
		suppress: false,
		pendingLeadFragment: false
	};
}
/** Returns true when an assistant event phase should not appear in live chat. */
function shouldSuppressAssistantEventForLiveChat(data) {
	return resolveAssistantEventPhase(data) === "commentary";
}
//#endregion
export { shouldSuppressAssistantEventForLiveChat as a, projectLiveAssistantBufferedText as i, createLiveAssistantTextProjection as n, normalizeLiveAssistantBufferedText as r, capLiveAssistantText as t };
