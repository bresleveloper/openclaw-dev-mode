//#region extensions/imessage/src/cli-output.ts
const IMESSAGE_CLI_STDOUT_MAX_CHARS = 8 * 1024 * 1024;
const IMESSAGE_CLI_STDERR_TAIL_CHARS = 64 * 1024;
function chunkToString(chunk) {
	return typeof chunk === "string" ? chunk : chunk.toString("utf8");
}
function appendIMessageCliStdout(current, chunk, maxChars = IMESSAGE_CLI_STDOUT_MAX_CHARS) {
	const next = current + chunkToString(chunk);
	if (next.length > maxChars) return {
		ok: false,
		message: `imsg stdout exceeded ${maxChars} characters`
	};
	return {
		ok: true,
		value: next
	};
}
function appendIMessageCliStderrTail(current, chunk, maxChars = IMESSAGE_CLI_STDERR_TAIL_CHARS) {
	const next = current + chunkToString(chunk);
	return next.length > maxChars ? next.slice(-maxChars) : next;
}
//#endregion
//#region extensions/imessage/src/markdown-format.ts
const MARKERS = [
	{
		marker: "***",
		styles: ["bold", "italic"],
		requireWordBoundary: false
	},
	{
		marker: "___",
		styles: ["underline", "italic"],
		requireWordBoundary: true
	},
	{
		marker: "~~",
		styles: ["strikethrough"],
		requireWordBoundary: false
	},
	{
		marker: "**",
		styles: ["bold"],
		requireWordBoundary: false
	},
	{
		marker: "__",
		styles: ["underline"],
		requireWordBoundary: true
	},
	{
		marker: "*",
		styles: ["italic"],
		requireWordBoundary: false
	},
	{
		marker: "_",
		styles: ["italic"],
		requireWordBoundary: true
	}
];
function tryConsumeMarker(input, i, m) {
	if (!input.startsWith(m.marker, i)) return null;
	if (m.marker.length === 1 && input[i + 1] === m.marker) return null;
	if (m.marker.length === 2 && input[i + 2] === m.marker[0]) return null;
	const isAtBoundary = (ch) => ch === void 0 || /\s/.test(ch);
	if (m.requireWordBoundary && i > 0 && !isAtBoundary(input[i - 1])) return null;
	const startInner = i + m.marker.length;
	const close = input.indexOf(m.marker, startInner);
	if (close === -1 || close === startInner) return null;
	if (m.requireWordBoundary && !isAtBoundary(input[close + m.marker.length])) return null;
	const inner = input.slice(startInner, close);
	if (!inner.trim()) return null;
	return {
		close,
		inner
	};
}
function parseInternal(input, baseOffset, sink) {
	let out = "";
	let i = 0;
	while (i < input.length) {
		let consumed = false;
		for (const m of MARKERS) {
			const hit = tryConsumeMarker(input, i, m);
			if (!hit) continue;
			const innerOffset = baseOffset + out.length;
			const innerStripped = parseInternal(hit.inner, innerOffset, sink);
			for (const style of m.styles) sink.push({
				start: innerOffset,
				length: innerStripped.length,
				styles: [style]
			});
			out += innerStripped;
			i = hit.close + m.marker.length;
			consumed = true;
			break;
		}
		if (!consumed) {
			out += input[i];
			i += 1;
		}
	}
	return out;
}
function extractMarkdownFormatRuns(input) {
	const ranges = [];
	return {
		text: parseInternal(input, 0, ranges),
		ranges
	};
}
//#endregion
export { appendIMessageCliStderrTail as n, appendIMessageCliStdout as r, extractMarkdownFormatRuns as t };
