import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as maxBytesForKind } from "./constants-GzjKtFvA.mjs";
import { r as extensionForMime } from "./mime-C3j3dfQb.mjs";
import "./http-body-DZQjJc2J.mjs";
import { i as readResponseWithLimit } from "./http-response-body-B70cE6fn.mjs";
import { d as readProviderBinaryResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import "./configured-max-bytes-BaCve0jk.mjs";
import { a as createProviderOperationTimeoutResolver, o as fetchProviderDownloadResponse, r as createProviderOperationDeadline } from "./shared-BMUa_P4s.mjs";
import "./runtime-shared-DrcE5eH-.mjs";
//#region src/media-generation/provider-assets.ts
/** Read a generated video, optionally delivering its remote URL when it exceeds the byte cap. */
async function readGeneratedVideoAsset(response, params) {
	const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
	const ext = extensionForMime(mimeType)?.replace(/^\./u, "") ?? "mp4";
	const asset = {
		mimeType,
		fileName: `video-${(params.index ?? 0) + 1}.${ext}`
	};
	const maxBytes = params.maxBytes ?? maxBytesForKind("video");
	let exceededMaxBytes = false;
	const readOptions = {
		...params.readOptions,
		maxBytes,
		onOverflow: ({ maxBytes: limit }) => {
			exceededMaxBytes = true;
			return /* @__PURE__ */ new Error(`${params.label} exceeds ${limit} bytes`);
		}
	};
	try {
		return {
			buffer: params.validateBinaryResponse ? await readProviderBinaryResponse(response, params.label, "video", readOptions) : await readResponseWithLimit(response, maxBytes, readOptions),
			...asset
		};
	} catch (error) {
		if (exceededMaxBytes && params.overflowUrl) return {
			url: params.overflowUrl,
			...asset
		};
		throw error;
	}
}
/** Download a generated video URL with size limits and inferred video metadata. */
async function downloadGeneratedVideoAsset(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: params.label
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? params.defaultTimeoutMs
	});
	const handle = params.fetchResponse ? await params.fetchResponse({
		deadline,
		timeoutMs
	}) : { response: await fetchProviderDownloadResponse({
		url: params.url,
		init: { method: "GET" },
		deadline,
		fetchFn: params.fetchFn,
		provider: params.provider,
		requestFailedMessage: params.requestFailedMessage
	}) };
	try {
		return {
			...await readGeneratedVideoAsset(handle.response, {
				label: params.label,
				maxBytes: params.maxBytes,
				index: params.index,
				validateBinaryResponse: params.validateBinaryResponse,
				readOptions: {
					chunkTimeoutMs: params.chunkTimeoutMs,
					timeoutMs,
					onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`${params.label} timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`)
				}
			}),
			...params.metadata ? { metadata: params.metadata } : {}
		};
	} finally {
		await handle.release?.();
	}
}
//#endregion
export { readGeneratedVideoAsset as n, downloadGeneratedVideoAsset as t };
