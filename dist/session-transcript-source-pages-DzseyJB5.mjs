//#region src/gateway/session-transcript-source-pages.ts
const SOURCE_PAGE_MAX_BYTES = 8388608;
var SessionTranscriptSourceMessageTooLargeError = class extends Error {
	constructor() {
		super(`Transcript source message exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte page limit`);
		this.code = "TRANSCRIPT_SOURCE_MESSAGE_TOO_LARGE";
		this.name = "SessionTranscriptSourceMessageTooLargeError";
	}
};
/** Each pull releases its snapshot before the consumer or the next worker request runs. */
async function* iterateSessionTranscriptSourcePages(read, scope, options = {}, signal) {
	let cursor;
	do {
		signal?.throwIfAborted();
		const page = await read(scope, {
			...options,
			mode: "page",
			cursor
		}, signal);
		signal?.throwIfAborted();
		yield page;
		cursor = page.nextCursor;
	} while (cursor);
}
/** Array contracts (plugin hooks and model context) collect the same bounded source pages. */
async function collectSessionTranscriptMessages(read, scope, options) {
	const messages = [];
	for await (const page of iterateSessionTranscriptSourcePages(read, scope, options)) for (const message of page.messages) messages.push(message);
	return messages;
}
//#endregion
export { iterateSessionTranscriptSourcePages as i, SessionTranscriptSourceMessageTooLargeError as n, collectSessionTranscriptMessages as r, SOURCE_PAGE_MAX_BYTES as t };
