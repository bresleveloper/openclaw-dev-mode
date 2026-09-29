import { t as buildDashscopeVideoGenerationProvider } from "./video-generation-DecFOzN4.mjs";
//#region extensions/alibaba/video-generation-provider.ts
const DEFAULT_ALIBABA_VIDEO_BASE_URL = "https://dashscope-intl.aliyuncs.com";
function isAlibabaVideoEndpointSupported(baseUrl) {
	try {
		const hostname = new URL(baseUrl ?? DEFAULT_ALIBABA_VIDEO_BASE_URL).hostname;
		return !/^(?:coding(?:-intl)?\.dashscope|token-plan\..+\.maas)\.aliyuncs\.com\.?$/iu.test(hostname);
	} catch {
		return true;
	}
}
const alibabaVideoGenerationProvider = buildDashscopeVideoGenerationProvider({
	providerId: "alibaba",
	label: "Alibaba Model Studio",
	taskLabel: "Alibaba Wan",
	defaultBaseUrl: DEFAULT_ALIBABA_VIDEO_BASE_URL,
	credentialPolicy: {
		acceptsApiKey: (apiKey) => !apiKey.trim().startsWith("sk-sp-"),
		acceptsBaseUrl: isAlibabaVideoEndpointSupported,
		unsupportedMessage: "Alibaba Wan video generation requires a Standard DashScope endpoint and a same-region Standard API key; Coding Plan and Token Plan credentials are not supported."
	}
});
//#endregion
export { alibabaVideoGenerationProvider as t };
