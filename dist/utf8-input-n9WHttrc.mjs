//#region src/infra/utf8-input.ts
var Utf8InputError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "ERR_INVALID_UTF8";
	}
};
function strictUtf8Decoder(sourceLabel) {
	const decoder = new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	});
	return (bytes, stream = false) => {
		try {
			return decoder.decode(bytes, { stream });
		} catch (error) {
			throw new Utf8InputError(`${sourceLabel} must be valid UTF-8.`, { cause: error });
		}
	};
}
function decodeUtf8Input(bytes, sourceLabel) {
	return strictUtf8Decoder(sourceLabel)(bytes);
}
async function* decodeUtf8Chunks(chunks, sourceLabel) {
	const decode = strictUtf8Decoder(sourceLabel);
	for await (const chunk of chunks) yield decode(chunk, true);
	yield decode();
}
//#endregion
export { decodeUtf8Chunks as n, decodeUtf8Input as r, Utf8InputError as t };
