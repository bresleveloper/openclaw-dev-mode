import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { a as maxBytesForKind } from "./constants-DUxuqQz8.mjs";
import { d as readProviderBinaryResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import "./configured-max-bytes-Cf0SSUBz.mjs";
import { a as fetchProviderDownloadResponse, i as createProviderOperationTimeoutResolver, r as createProviderOperationDeadline } from "./shared-BLFkM12I.mjs";
import "./runtime-shared-B1C-7v_z.mjs";
//#region src/media-generation/provider-assets.ts
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
		const mimeType = normalizeOptionalString(handle.response.headers.get("content-type")) ?? "video/mp4";
		const maxBytes = params.maxBytes ?? maxBytesForKind("video");
		const readOptions = {
			maxBytes,
			chunkTimeoutMs: params.chunkTimeoutMs,
			timeoutMs,
			onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`${params.label} timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`${params.label} exceeds ${maxBytesLocal} bytes`)
		};
		const buffer = params.validateBinaryResponse ? await readProviderBinaryResponse(handle.response, params.label, "video", readOptions) : await readResponseWithLimit(handle.response, maxBytes, readOptions);
		const ext = extensionForMime(mimeType)?.replace(/^\./u, "") ?? "mp4";
		return {
			buffer,
			mimeType,
			fileName: `video-${(params.index ?? 0) + 1}.${ext}`,
			...params.metadata ? { metadata: params.metadata } : {}
		};
	} finally {
		await handle.release?.();
	}
}
//#endregion
export { downloadGeneratedVideoAsset as t };
