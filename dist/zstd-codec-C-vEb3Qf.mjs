import zlib from "node:zlib";
//#region src/infra/zstd-codec.ts
let resolvedCodec;
/** Resolve the process runtime once; persisted readers must reject unsupported compressed data. */
function resolveZstdCodec() {
	if (resolvedCodec !== void 0) return resolvedCodec;
	if (typeof zlib.zstdCompressSync !== "function" || typeof zlib.zstdDecompressSync !== "function") {
		resolvedCodec = null;
		return resolvedCodec;
	}
	const compress = zlib.zstdCompressSync.bind(zlib);
	const decompress = zlib.zstdDecompressSync.bind(zlib);
	resolvedCodec = {
		compress: (data, level, checksum) => {
			if (level === void 0 && checksum === void 0) return compress(data);
			return compress(data, { params: {
				...level === void 0 ? {} : { [zlib.constants.ZSTD_c_compressionLevel]: level },
				...checksum === void 0 ? {} : { [zlib.constants.ZSTD_c_checksumFlag]: checksum }
			} });
		},
		decompress: (data, maxOutputLength) => decompress(data, maxOutputLength === void 0 ? void 0 : { maxOutputLength })
	};
	return resolvedCodec;
}
//#endregion
export { resolveZstdCodec as t };
