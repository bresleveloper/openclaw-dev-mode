import { t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { r as resolveGeneratedImageDownloadMaxBytes } from "./configured-max-bytes-BaCve0jk.mjs";
import { d as postJsonRequest } from "./shared-BMUa_P4s.mjs";
import { n as isProviderApiKeyConfiguredAsync } from "./provider-auth-availability-CfYdMNuk.mjs";
import "./media-runtime-CmxLZuo1.mjs";
import "./media-generation-runtime-BgMYgoiy.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-http-BuV15s4V.mjs";
import { c as resolveInlineImageJsonResponseMaxBytes } from "./image-assets-PTBoX6Eo.mjs";
import "./image-generation-DwjRbF_L.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { i as resolveMinimaxMediaRequestConfig } from "./media-provider-runtime-DyOG3XQb.mjs";
//#region extensions/minimax/image-generation-provider.ts
const DEFAULT_MINIMAX_IMAGE_BASE_URL = "https://api.minimax.io";
const CN_MINIMAX_IMAGE_BASE_URL = "https://api.minimaxi.com";
const DEFAULT_MODEL = "image-01";
const DEFAULT_OUTPUT_MIME = "image/png";
const MINIMAX_MAX_IMAGE_RESULTS = 9;
const MINIMAX_SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"16:9",
	"4:3",
	"3:2",
	"2:3",
	"3:4",
	"9:16",
	"21:9"
];
function isMinimaxCnHost(value) {
	const trimmed = value?.trim();
	if (!trimmed) return false;
	const candidate = /^[a-z][a-z\d+.-]*:\/\//iu.test(trimmed) ? trimmed : `https://${trimmed}`;
	const hostname = URL.parse(candidate)?.hostname.toLowerCase();
	return hostname === "minimaxi.com" || (hostname?.endsWith(".minimaxi.com") ?? false);
}
function resolveMinimaxImageBaseUrl(cfg, providerId) {
	const apiHost = process.env.MINIMAX_API_HOST;
	if (isMinimaxCnHost(apiHost)) return CN_MINIMAX_IMAGE_BASE_URL;
	const providerBaseUrl = cfg?.models?.providers?.[providerId]?.baseUrl;
	if (isMinimaxCnHost(providerBaseUrl)) return CN_MINIMAX_IMAGE_BASE_URL;
	return DEFAULT_MINIMAX_IMAGE_BASE_URL;
}
function buildMinimaxImageGenerationProvider(providerId = "minimax") {
	return {
		id: providerId,
		label: "MiniMax",
		defaultModel: DEFAULT_MODEL,
		models: [DEFAULT_MODEL],
		isConfiguredAsync: (ctx) => isProviderApiKeyConfiguredAsync({
			provider: providerId,
			...ctx
		}),
		capabilities: {
			generate: {
				maxCount: MINIMAX_MAX_IMAGE_RESULTS,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: false
			},
			edit: {
				enabled: true,
				maxCount: MINIMAX_MAX_IMAGE_RESULTS,
				maxInputImages: 1,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: false
			},
			geometry: { aspectRatios: [...MINIMAX_SUPPORTED_ASPECT_RATIOS] }
		},
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: providerId,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("MiniMax API key missing");
			const baseUrl = resolveMinimaxImageBaseUrl(req.cfg, providerId);
			const { baseUrl: resolvedBaseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveMinimaxMediaRequestConfig({
				cfg: req.cfg,
				providerId,
				apiKey: auth.apiKey,
				baseUrl,
				capability: "image"
			});
			const body = {
				model: req.model || DEFAULT_MODEL,
				prompt: req.prompt,
				response_format: "base64",
				n: req.count ?? 1
			};
			if (req.aspectRatio?.trim()) body.aspect_ratio = req.aspectRatio.trim();
			const ref = req.inputImages?.at(0);
			if (ref) body.subject_reference = [{
				type: "character",
				image_file: `data:${ref.mimeType || "image/jpeg"};base64,${ref.buffer.toString("base64")}`
			}];
			const { response, release } = await postJsonRequest({
				url: `${resolvedBaseUrl}/v1/image_generation`,
				headers,
				body,
				timeoutMs: req.timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork,
				ssrfPolicy: req.ssrfPolicy,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "MiniMax image generation failed");
				const data = await readProviderJsonResponse(response, "minimax.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(MINIMAX_MAX_IMAGE_RESULTS, resolveGeneratedImageDownloadMaxBytes(req.cfg)) });
				const baseResp = data.base_resp;
				if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) {
					const msg = baseResp.status_msg ?? "";
					throw new Error(`MiniMax image generation API error (${baseResp.status_code}): ${msg}`);
				}
				const base64Images = data.data?.image_base64 ?? [];
				const failedCount = data.metadata?.failed_count ?? 0;
				if (base64Images.length === 0) {
					const reason = failedCount > 0 ? `${failedCount} image(s) failed to generate` : "no images returned";
					throw new Error(`MiniMax image generation returned no images: ${reason}`);
				}
				return {
					images: base64Images.map((b64, index) => {
						if (!b64) return null;
						const canonicalBase64 = canonicalizeBase64(b64);
						if (!canonicalBase64) throw new Error("MiniMax image generation returned malformed image base64");
						return {
							buffer: Buffer.from(canonicalBase64, "base64"),
							mimeType: DEFAULT_OUTPUT_MIME,
							fileName: `image-${index + 1}.png`
						};
					}).filter((entry) => entry !== null),
					model: req.model || DEFAULT_MODEL
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildMinimaxImageGenerationProvider as t };
