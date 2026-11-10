import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "../../record-coerce-TIsquoVR.mjs";
import { d as readProviderBinaryResponse, m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "../../provider-http-errors-CjVOxCE5.mjs";
import { d as mergeSsrFPolicies } from "../../ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard } from "../../fetch-guard-DRapCKeS.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { _ as resolveProviderOperationTimeoutMs } from "../../shared-BMUa_P4s.mjs";
import { c as ssrfPolicyFromPrivateNetworkOptIn } from "../../ssrf-policy-DoYWKlsK.mjs";
import "../../ssrf-runtime-z2wN0VZP.mjs";
import "../../provider-http-BuV15s4V.mjs";
import { c as resolveInlineImageJsonResponseMaxBytes, s as parseOpenAiCompatibleImageResponse } from "../../image-assets-PTBoX6Eo.mjs";
import "../../image-generation-DwjRbF_L.mjs";
//#region extensions/openai/image-generation-response.ts
async function readOpenAIImageGenerationResponse(response, params) {
	const timeoutMs = () => resolveProviderOperationTimeoutMs({
		deadline: params.deadline,
		defaultTimeoutMs: params.timeoutMs
	});
	await assertOkOrThrowHttpError(response, `${params.operation} failed`, { bodyTimeoutMs: timeoutMs });
	let payload = await readProviderJsonResponse(response, "openai.image-generation", {
		maxBytes: resolveInlineImageJsonResponseMaxBytes(params.maxImages, params.maxBytes),
		timeoutMs
	});
	if (isRecord(payload) && Array.isArray(payload.data)) {
		const providerOrigin = new URL(params.providerUrl).origin;
		const dispatcherPolicy = params.dispatcherPolicy;
		const externalDispatcherPolicy = dispatcherPolicy?.mode === "explicit-proxy" ? {
			...dispatcherPolicy,
			proxyTls: void 0,
			pinnedHostname: void 0
		} : dispatcherPolicy ? {
			...dispatcherPolicy,
			connect: void 0,
			pinnedHostname: void 0
		} : void 0;
		const downloadOptions = {
			policy: mergeSsrFPolicies(params.ssrfPolicy, ssrfPolicyFromPrivateNetworkOptIn(params.allowPrivateNetwork)),
			resolveDispatcherPolicy: (url) => url.origin === providerOrigin ? dispatcherPolicy : externalDispatcherPolicy,
			useEnvProxyForEligibleUrls: true,
			auditContext: "openai-image-download"
		};
		const entries = [];
		let downloads = 0;
		for (const entry of payload.data) {
			const record = asOptionalObjectRecord(entry);
			const url = record && !normalizeOptionalString(record.b64_json) ? normalizeOptionalString(record.url) : void 0;
			if (!record || !url) {
				entries.push(entry);
				continue;
			}
			if (downloads >= params.maxDownloads) throw new Error(`${params.operation} returned too many image URLs`);
			downloads += 1;
			const { response: download, release } = await fetchWithSsrFGuard({
				...downloadOptions,
				url,
				init: { method: "GET" },
				timeoutMs: timeoutMs(),
				fetchImpl: fetch
			});
			try {
				await assertOkOrThrowHttpError(download, "OpenAI image download failed", { bodyTimeoutMs: timeoutMs });
				const mimeType = download.headers.get("Content-Type")?.split(";")[0]?.trim().toLowerCase();
				if (!mimeType || !/^image\/[a-z0-9.+-]+$/.test(mimeType)) {
					download.body?.cancel().catch(() => void 0);
					throw new Error("OpenAI image download: expected an image Content-Type");
				}
				const buffer = await readProviderBinaryResponse(download, "OpenAI image download", "image", {
					maxBytes: params.maxBytes,
					timeoutMs
				});
				entries.push({
					...record,
					b64_json: buffer.toString("base64"),
					mime_type: mimeType
				});
			} finally {
				await release();
			}
		}
		payload = {
			...payload,
			data: entries
		};
	}
	const images = parseOpenAiCompatibleImageResponse(payload, {
		defaultMimeType: params.defaultMimeType,
		malformedResponseError: `${params.operation} response malformed`
	});
	if (images.length === 0) throw new Error(`${params.operation} response missing image data`);
	return images;
}
//#endregion
export { readOpenAIImageGenerationResponse };
