import { i as __require } from "./chunk-CNf5ZN-e.js";
//#region src/llm/env-api-keys.ts
let existsSync = null;
let homedir = null;
let join = null;
const dynamicImport = (specifier) => import(specifier);
const NODE_FS_SPECIFIER = "node:fs";
const NODE_OS_SPECIFIER = "node:os";
const NODE_PATH_SPECIFIER = "node:path";
function loadNodeBuiltinModule(specifier) {
	const getBuiltinModule = typeof process !== "undefined" ? process : void 0;
	if (typeof getBuiltinModule?.getBuiltinModule === "function") return getBuiltinModule.getBuiltinModule(specifier);
	if (typeof __require === "function") return __require(specifier);
	return null;
}
function loadNodeHelpersSync() {
	try {
		const fsModule = loadNodeBuiltinModule(NODE_FS_SPECIFIER);
		const osModule = loadNodeBuiltinModule(NODE_OS_SPECIFIER);
		const pathModule = loadNodeBuiltinModule(NODE_PATH_SPECIFIER);
		existsSync ??= fsModule?.existsSync ?? null;
		homedir ??= osModule?.homedir ?? null;
		join ??= pathModule?.join ?? null;
		if (!existsSync || !homedir || !join) return false;
		return true;
	} catch {
		return false;
	}
}
if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
	if (!loadNodeHelpersSync()) {
		dynamicImport(NODE_FS_SPECIFIER).then((m) => {
			existsSync = m.existsSync;
		});
		dynamicImport(NODE_OS_SPECIFIER).then((m) => {
			homedir = m.homedir;
		});
		dynamicImport(NODE_PATH_SPECIFIER).then((m) => {
			join = m.join;
		});
	}
}
let procEnvCache = null;
function getProcessEnv() {
	return typeof process === "undefined" ? void 0 : process.env;
}
/**
* Fallback for https://github.com/oven-sh/bun/issues/27802
* Bun compiled binaries have an empty `process.env` inside sandbox
* environments on Linux. We can recover the env from `/proc/self/environ`.
*/
function getProcEnv(key) {
	if (typeof process === "undefined" || !process.versions?.bun) return;
	const env = getProcessEnv();
	if (!env) return;
	if (Object.keys(env).length > 0) return;
	if (procEnvCache === null) {
		procEnvCache = /* @__PURE__ */ new Map();
		try {
			const { readFileSync } = __require("node:fs");
			const data = readFileSync("/proc/self/environ", "utf-8");
			for (const entry of data.split("\0")) {
				const idx = entry.indexOf("=");
				if (idx > 0) procEnvCache.set(entry.slice(0, idx), entry.slice(idx + 1));
			}
		} catch {}
	}
	return procEnvCache.get(key);
}
function getEnvValue(key) {
	return getProcessEnv()?.[key] || getProcEnv(key);
}
let cachedVertexAdcCredentialsExists = null;
function hasVertexAdcCredentials() {
	if (cachedVertexAdcCredentialsExists === null) {
		if (!existsSync || !homedir || !join) {
			if (!(typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) || !loadNodeHelpersSync()) return false;
		}
		const nodeExistsSync = existsSync;
		const nodeHomedir = homedir;
		const nodeJoin = join;
		if (!nodeExistsSync || !nodeHomedir || !nodeJoin) return false;
		const gacPath = getEnvValue("GOOGLE_APPLICATION_CREDENTIALS");
		if (gacPath) cachedVertexAdcCredentialsExists = nodeExistsSync(gacPath) ? true : null;
		else cachedVertexAdcCredentialsExists = nodeExistsSync(nodeJoin(nodeHomedir(), ".config", "gcloud", "application_default_credentials.json")) ? true : null;
	}
	return cachedVertexAdcCredentialsExists === true;
}
function getApiKeyEnvVars(provider) {
	if (provider === "github-copilot") return ["COPILOT_GITHUB_TOKEN"];
	if (provider === "anthropic") return ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"];
	if (provider === "moonshot") return ["MOONSHOT_API_KEY", "KIMI_API_KEY"];
	if (provider === "kimi" || provider === "kimi-coding") return ["KIMI_API_KEY", "KIMICODE_API_KEY"];
	const envVar = {
		openai: "OPENAI_API_KEY",
		"azure-openai-responses": "AZURE_OPENAI_API_KEY",
		deepseek: "DEEPSEEK_API_KEY",
		google: "GEMINI_API_KEY",
		"google-vertex": "GOOGLE_CLOUD_API_KEY",
		groq: "GROQ_API_KEY",
		cerebras: "CEREBRAS_API_KEY",
		xai: "XAI_API_KEY",
		openrouter: "OPENROUTER_API_KEY",
		"vercel-ai-gateway": "AI_GATEWAY_API_KEY",
		zai: "ZAI_API_KEY",
		mistral: "MISTRAL_API_KEY",
		minimax: "MINIMAX_API_KEY",
		"minimax-cn": "MINIMAX_CN_API_KEY",
		moonshotai: "MOONSHOT_API_KEY",
		"moonshotai-cn": "MOONSHOT_API_KEY",
		huggingface: "HF_TOKEN",
		fireworks: "FIREWORKS_API_KEY",
		together: "TOGETHER_API_KEY",
		opencode: "OPENCODE_API_KEY",
		"opencode-go": "OPENCODE_API_KEY",
		"cloudflare-workers-ai": "CLOUDFLARE_API_KEY",
		"cloudflare-ai-gateway": "CLOUDFLARE_API_KEY",
		xiaomi: "XIAOMI_API_KEY",
		"xiaomi-token-plan-cn": "XIAOMI_TOKEN_PLAN_CN_API_KEY",
		"xiaomi-token-plan-ams": "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
		"xiaomi-token-plan-sgp": "XIAOMI_TOKEN_PLAN_SGP_API_KEY"
	}[provider];
	return envVar ? [envVar] : void 0;
}
/**
* Find configured environment variables that can provide an API key for a provider.
*
* This only reports actual API key variables. It intentionally excludes ambient
* credential sources such as AWS profiles, AWS IAM credentials, and Google
* Application Default Credentials.
*/
function findEnvKeys(provider) {
	const envVars = getApiKeyEnvVars(provider);
	if (!envVars) return;
	const found = envVars.filter((envVar) => Boolean(getEnvValue(envVar)));
	return found.length > 0 ? found : void 0;
}
/**
* Get API key for provider from known environment variables, e.g. OPENAI_API_KEY.
*
* Will not return API keys for providers that require OAuth tokens.
*/
function getEnvApiKey(provider) {
	const envKeys = findEnvKeys(provider);
	if (envKeys?.[0]) return getEnvValue(envKeys[0]);
	if (provider === "google-vertex") {
		const hasCredentials = hasVertexAdcCredentials();
		const hasProject = Boolean(getEnvValue("GOOGLE_CLOUD_PROJECT") || getEnvValue("GCLOUD_PROJECT"));
		const hasLocation = Boolean(getEnvValue("GOOGLE_CLOUD_LOCATION"));
		if (hasCredentials && hasProject && hasLocation) return "<authenticated>";
	}
	if (provider === "amazon-bedrock") {
		if (getEnvValue("AWS_PROFILE") || getEnvValue("AWS_ACCESS_KEY_ID") && getEnvValue("AWS_SECRET_ACCESS_KEY") || getEnvValue("AWS_BEARER_TOKEN_BEDROCK") || getEnvValue("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") || getEnvValue("AWS_CONTAINER_CREDENTIALS_FULL_URI") || getEnvValue("AWS_WEB_IDENTITY_TOKEN_FILE")) return "<authenticated>";
	}
}
//#endregion
export { getEnvApiKey as n, findEnvKeys as t };
