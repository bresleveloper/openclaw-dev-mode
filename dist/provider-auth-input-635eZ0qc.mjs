import { c as normalizeOptionalLowercaseString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as isMalformedApiKeyInput } from "./credential-state-NmgqOc1o.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-7FOSjRoY.mjs";
//#region src/plugins/provider-auth-input.ts
/** Normalizes provider auth input metadata collected from plugin setup flows. */
/** Keeps secret resolution out of synchronous provider setup metadata imports. */
const promptSecretRefForSetup = async (...args) => (await import("./provider-auth-ref-DhrdgGLl.mjs")).promptSecretRefForSetup(...args);
const DEFAULT_KEY_PREVIEW = {
	head: 4,
	tail: 4
};
/** Normalizes pasted API-key input, including shell assignment forms. */
function normalizeApiKeyInput(raw) {
	const trimmed = normalizeStringifiedOptionalString(raw) ?? "";
	if (!trimmed) return "";
	const normalizedPaste = normalizeSecretInput(trimmed);
	const assignmentMatch = normalizedPaste.match(/^(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.+)$/);
	const valuePart = assignmentMatch ? expectDefined(assignmentMatch[1], "assignment match capture group 1").trim() : normalizedPaste;
	const withoutSemicolon = valuePart.endsWith(";") ? valuePart.slice(0, -1).trim() : valuePart;
	const unquoted = withoutSemicolon.length >= 2 && (withoutSemicolon.startsWith("\"") && withoutSemicolon.endsWith("\"") || withoutSemicolon.startsWith("'") && withoutSemicolon.endsWith("'") || withoutSemicolon.startsWith("`") && withoutSemicolon.endsWith("`")) ? withoutSemicolon.slice(1, -1) : withoutSemicolon;
	return normalizeSecretInput(unquoted);
}
/** Validates required API-key input for setup prompts. */
const validateApiKeyInput = (value) => {
	const normalized = normalizeApiKeyInput(value);
	if (!normalized) return "Required";
	if (isMalformedApiKeyInput(normalized)) return "Paste the API key value, not an OpenClaw onboarding command.";
};
/** Formats a redacted API-key preview for setup confirmation prompts. */
function formatApiKeyPreview(raw, opts = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return "…";
	const head = opts.head ?? DEFAULT_KEY_PREVIEW.head;
	const tail = opts.tail ?? DEFAULT_KEY_PREVIEW.tail;
	if (trimmed.length <= head + tail) {
		const shortHead = Math.min(2, trimmed.length);
		const shortTail = Math.min(2, trimmed.length - shortHead);
		if (shortTail <= 0) return `${sliceUtf16Safe(trimmed, 0, shortHead)}…`;
		return `${sliceUtf16Safe(trimmed, 0, shortHead)}…${sliceUtf16Safe(trimmed, -shortTail)}`;
	}
	return `${sliceUtf16Safe(trimmed, 0, head)}…${sliceUtf16Safe(trimmed, -tail)}`;
}
/** Normalizes a token-provider selector from CLI/options input. */
function normalizeTokenProviderInput(tokenProvider) {
	return normalizeOptionalLowercaseString(tokenProvider);
}
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
async function ensureApiKeyFromOptionEnvOrPrompt(params) {
	const tokenProvider = normalizeTokenProviderInput(params.tokenProvider);
	if (params.token && tokenProvider && params.expectedProviders.some((provider) => normalizeTokenProviderInput(provider) === tokenProvider)) {
		const apiKey = params.normalize(params.token);
		const validationError = params.validate(apiKey);
		if (validationError) throw new Error(validationError);
		await params.setCredential(apiKey, params.secretInputMode);
		if (apiKey) return apiKey;
	}
	if (params.noteMessage) await params.prompter.note(params.noteMessage, params.noteTitle);
	return await ensureApiKeyFromEnvOrPrompt(params);
}
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
async function ensureApiKeyFromEnvOrPrompt(params) {
	const selectedMode = await resolveSecretInputModeForEnvSelection({
		prompter: params.prompter,
		explicitMode: params.secretInputMode
	});
	const [{ resolveEnvApiKey }, { extractEnvVarFromSourceLabel, promptSecretRefForSetup: promptSecretRef, resolveRefFallbackInput }] = await Promise.all([import("./model-auth-env-qI6sgyY5.mjs"), import("./provider-auth-ref-DhrdgGLl.mjs")]);
	const env = params.env ?? process.env;
	const envKey = resolveEnvApiKey(params.provider, env, {
		config: params.config,
		workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, resolveDefaultAgentId(params.config), env)
	});
	if (selectedMode === "ref") {
		const refParams = {
			provider: params.provider,
			config: params.config,
			preferredEnvVar: envKey?.source ? extractEnvVarFromSourceLabel(envKey.source) : void 0,
			env
		};
		const resolved = typeof params.prompter.select !== "function" ? resolveRefFallbackInput(refParams) : await promptSecretRef({
			...refParams,
			prompter: params.prompter
		});
		await params.setCredential(resolved.ref, selectedMode);
		return resolved.resolvedValue;
	}
	if (envKey && selectedMode === "plaintext") {
		if (await params.prompter.confirm({
			message: `Use existing ${params.envLabel} (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
			initialValue: true
		})) {
			await params.setCredential(envKey.apiKey, selectedMode);
			return envKey.apiKey;
		}
	}
	const key = await params.prompter.text({
		message: params.promptMessage,
		placeholder: "API key",
		validate: params.validate,
		sensitive: true
	});
	const apiKey = params.normalize(key ?? "");
	await params.setCredential(apiKey, selectedMode);
	return apiKey;
}
//#endregion
export { normalizeTokenProviderInput as a, normalizeApiKeyInput as i, ensureApiKeyFromOptionEnvOrPrompt as n, promptSecretRefForSetup as o, formatApiKeyPreview as r, validateApiKeyInput as s, ensureApiKeyFromEnvOrPrompt as t };
