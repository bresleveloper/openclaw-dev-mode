//#region src/process/bounded-line-framer.ts
/** Frames LF-delimited bytes without decoding or consuming an incomplete final line. */
function createBoundedLineFramer(maxBytes, overflowMessage) {
	let chunks = [];
	let byteLength = 0;
	const clear = () => {
		chunks = [];
		byteLength = 0;
	};
	return {
		get pendingByteLength() {
			return byteLength;
		},
		clear,
		*push(chunk) {
			let offset = 0;
			while (offset < chunk.length) {
				const newline = chunk.indexOf(10, offset);
				const end = newline === -1 ? chunk.length : newline;
				byteLength += end - offset;
				if (byteLength > maxBytes) throw new Error(overflowMessage);
				chunks.push(chunk.subarray(offset, end));
				if (newline === -1) break;
				const line = Buffer.concat(chunks, byteLength);
				clear();
				offset = newline + 1;
				yield line;
			}
		}
	};
}
//#endregion
export { createBoundedLineFramer as t };
