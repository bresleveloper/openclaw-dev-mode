import { r as fetchWithRuntimeDispatcherOrMockedGlobal } from "./runtime-fetch-BrykW3rc.mjs";
import { i as getFileExtension } from "./mime-1zBUMwu6.mjs";
import { i as saveRemoteMedia } from "./fetch-BtTl3cm9.mjs";
//#region src/media/store.remote.runtime.ts
const REMOTE_MEDIA_TIMEOUT_MS = 3e4;
const fetchWithoutIgnoredBody = async (input, init) => {
	const response = await fetchWithRuntimeDispatcherOrMockedGlobal(input, init);
	if (response.ok) return response;
	response.body?.cancel().catch(() => void 0);
	return new Response(null, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
};
async function saveRemoteMediaForStore(params) {
	const { id, path, size, contentType } = await saveRemoteMedia({
		url: params.source,
		fetchImpl: fetchWithoutIgnoredBody,
		requestInit: {
			headers: params.headers,
			signal: params.abortSignal
		},
		filePathHint: params.source,
		originalFilename: `_${getFileExtension(params.source) ?? ""}`,
		maxBytes: params.maxBytes,
		maxRedirects: 5,
		responseHeaderTimeoutMs: REMOTE_MEDIA_TIMEOUT_MS,
		readIdleTimeoutMs: REMOTE_MEDIA_TIMEOUT_MS,
		subdir: params.subdir
	});
	return {
		id,
		path,
		size,
		contentType
	};
}
//#endregion
export { saveRemoteMediaForStore };
