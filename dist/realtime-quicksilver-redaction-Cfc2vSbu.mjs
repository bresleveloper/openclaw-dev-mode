//#region extensions/openai/realtime-quicksilver-redaction.ts
const OPENAI_GPT_LIVE_AUTH_REQUIRED = "GPT-Live Talk requires an OpenAI Platform API key";
const OPENAI_GPT_LIVE_AUTHORED_PLATFORM_AUTH_UNAVAILABLE = "GPT-Live Talk requires a working OpenAI Platform API key. The selected Platform API-key source could not be resolved; fix or remove it.";
const OPENAI_GPT_LIVE_PUBLIC_AUTH_REQUIRED = "GPT-Live Talk requires either an OpenAI Platform API key or a ChatGPT OAuth subscription profile";
const OPENAI_GPT_LIVE_PUBLIC_AUTHORED_PLATFORM_AUTH_UNAVAILABLE = "GPT-Live Talk requires a working OpenAI Platform API key or ChatGPT OAuth subscription profile. No OAuth profile was available and the selected Platform API-key source could not be resolved; fix or remove it.";
function projectOpenAIQuicksilverAuthErrorMessage(error) {
	const message = error instanceof Error ? error.message : "";
	if (message === "GPT-Live Talk requires an OpenAI Platform API key" || message === "GPT-Live Talk requires a working OpenAI Platform API key. The selected Platform API-key source could not be resolved; fix or remove it." || message === "GPT-Live Talk requires either an OpenAI Platform API key or a ChatGPT OAuth subscription profile" || message === "GPT-Live Talk requires a working OpenAI Platform API key or ChatGPT OAuth subscription profile. No OAuth profile was available and the selected Platform API-key source could not be resolved; fix or remove it.") return message;
	return "OpenAI GPT-Live authentication failed";
}
function projectOpenAIQuicksilverErrorMessage(kind) {
	switch (kind) {
		case "gateway": return "OpenAI GPT-Live gateway relay failed";
		case "provider": return "OpenAI GPT-Live provider error";
		case "transport": return "OpenAI GPT-Live transport failed";
	}
	throw new Error("Unexpected realtime error category");
}
//#endregion
export { projectOpenAIQuicksilverAuthErrorMessage as a, OPENAI_GPT_LIVE_PUBLIC_AUTH_REQUIRED as i, OPENAI_GPT_LIVE_AUTH_REQUIRED as n, projectOpenAIQuicksilverErrorMessage as o, OPENAI_GPT_LIVE_PUBLIC_AUTHORED_PLATFORM_AUTH_UNAVAILABLE as r, OPENAI_GPT_LIVE_AUTHORED_PLATFORM_AUTH_UNAVAILABLE as t };
