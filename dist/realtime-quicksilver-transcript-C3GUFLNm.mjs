import { c as chunkOpenAIQuicksilverAppendText, n as boundOpenAIQuicksilverContextItems, t as OPENAI_QUICKSILVER_CONTEXT_MAX_UTF8_BYTES } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
//#region extensions/openai/realtime-quicksilver-transcript.ts
/** Context eviction and immutable transcript publication have separate lifetimes. */
var OpenAIQuicksilverTranscript = class {
	constructor() {
		this.entries = [];
		this.pendingUserInput = "";
		this.publication = [];
		this.publicationBytes = 0;
	}
	append(event) {
		const last = this.entries.at(-1);
		if (last?.role === event.role && this.partialRole === event.role) last.text = event.kind === "transcript-delta" ? last.text + event.text : event.text;
		else this.entries.push({
			role: event.role,
			text: event.text
		});
		this.partialRole = event.kind === "transcript-delta" ? event.role : void 0;
		this.entries = boundOpenAIQuicksilverContextItems(this.entries);
	}
	appendPublic(event, target) {
		for (const text of chunkOpenAIQuicksilverAppendText(event.text, OPENAI_QUICKSILVER_CONTEXT_MAX_UTF8_BYTES)) {
			if (!target.canAppend()) return;
			const bytes = Buffer.byteLength(text, "utf8");
			if (this.publicationBytes + bytes > 8e3) {
				this.publish(this.consumePublication(), target);
				if (!target.canAppend()) return;
			}
			this.appendPublicContext({
				...event,
				text
			});
			const aggregate = this.publication.find((entry) => entry.role === event.role);
			if (aggregate) aggregate.text += text;
			else this.publication.push({
				role: event.role,
				text
			});
			this.publicationBytes += bytes;
			target.onTranscript?.(event.role, text, false);
		}
	}
	appendPublicContext(event) {
		if (event.role === "user") this.pendingUserInput = boundOpenAIQuicksilverContextItems(chunkOpenAIQuicksilverAppendText(this.pendingUserInput + event.text).map((text) => ({
			role: "user",
			text
		}))).map((entry) => entry.text).join("");
		const last = this.entries.at(-1);
		let text = event.text;
		if (last?.role === event.role && this.partialRole === event.role) {
			this.entries.pop();
			text = last.text + text;
		}
		this.entries.push(...chunkOpenAIQuicksilverAppendText(text).map((chunk) => ({
			role: event.role,
			text: chunk
		})));
		this.entries = boundOpenAIQuicksilverContextItems(this.entries);
		this.partialRole = event.role;
	}
	latestUserInput() {
		return this.pendingUserInput;
	}
	clearPendingUserInput() {
		this.pendingUserInput = "";
		this.partialRole = void 0;
	}
	consume() {
		const snapshot = {
			context: this.entries,
			publication: this.consumePublication()
		};
		this.clear();
		return snapshot;
	}
	consumePublication() {
		const publication = this.publication;
		this.publication = [];
		this.publicationBytes = 0;
		return publication;
	}
	publish(publication, target) {
		for (const entry of publication) {
			if (target.isCurrent?.() === false) break;
			target.onTranscript?.(entry.role, entry.text, true);
		}
	}
	clear() {
		this.entries = [];
		this.clearPendingUserInput();
		this.consumePublication();
	}
};
//#endregion
export { OpenAIQuicksilverTranscript as t };
