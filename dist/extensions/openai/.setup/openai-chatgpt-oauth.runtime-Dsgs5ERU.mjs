import { t as loginOpenAICodex } from "./openai-chatgpt-oauth-flow.runtime-DsW0hMIP.mjs";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { inspectTlsCertificateError } from "openclaw/plugin-sdk/provider-http";
import path from "node:path";
import { ensureGlobalUndiciEnvProxyDispatcher } from "openclaw/plugin-sdk/runtime-env";
import { formatCliCommand } from "openclaw/plugin-sdk/setup-tools";
//#region extensions/openai/openai-chatgpt-oauth-preflight.runtime.ts
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
function getErrorRecord(error) {
	return error && typeof error === "object" ? error : null;
}
function extractFailure(error) {
	const tlsFailure = inspectTlsCertificateError(error);
	if (tlsFailure) return {
		code: tlsFailure.code,
		message: tlsFailure.message,
		kind: "tls-cert"
	};
	const root = getErrorRecord(error);
	const rootCause = getErrorRecord(root?.cause);
	return {
		code: typeof rootCause?.code === "string" ? rootCause.code : void 0,
		message: typeof rootCause?.message === "string" ? rootCause.message : typeof root?.message === "string" ? root.message : String(error),
		kind: "network"
	};
}
async function runOpenAIOAuthTlsPreflight(options) {
	const timeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, 5e3);
	const fetchImpl = options?.fetchImpl ?? fetch;
	options?.signal?.throwIfAborted();
	options?.assertCurrent?.();
	let response;
	try {
		response = await fetchImpl(OPENAI_AUTH_PROBE_URL, {
			method: "GET",
			redirect: "manual",
			signal: options?.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs)
		});
		return { ok: true };
	} catch (error) {
		options?.signal?.throwIfAborted();
		options?.assertCurrent?.();
		const failure = extractFailure(error);
		return {
			ok: false,
			kind: failure.kind,
			code: failure.code,
			message: failure.message
		};
	} finally {
		if (response?.bodyUsed !== true) await response?.body?.cancel().catch(() => void 0);
	}
}
//#endregion
//#region extensions/openai/openai-chatgpt-oauth.runtime.ts
const manualInputPromptMessage = "Paste the authorization code (or full redirect URL):";
const openAICodexOAuthOriginator = "openclaw";
const localManualFallbackDelayMs = 15e3;
const localManualFallbackGraceMs = 1e3;
function resolveHomebrewPrefixFromExecPath(execPath) {
	const marker = `${path.sep}Cellar${path.sep}`;
	const idx = execPath.indexOf(marker);
	if (idx > 0) return execPath.slice(0, idx);
	return process.env.HOMEBREW_PREFIX?.trim() || null;
}
function resolveCertBundlePath() {
	const prefix = resolveHomebrewPrefixFromExecPath(process.execPath);
	return prefix ? path.join(prefix, "etc", "openssl@3", "cert.pem") : null;
}
function formatOpenAIOAuthTlsPreflightFix(result) {
	const certBundlePath = resolveCertBundlePath();
	const lines = [
		"OpenAI OAuth prerequisites check failed: Node/OpenSSL cannot validate TLS certificates.",
		`Cause: ${result.code ? `${result.code} (${result.message})` : result.message}`,
		"",
		"Fix (Homebrew Node/OpenSSL):",
		`- ${formatCliCommand("brew postinstall ca-certificates")}`,
		`- ${formatCliCommand("brew postinstall openssl@3")}`
	];
	if (certBundlePath) lines.push(`- Verify cert bundle exists: ${certBundlePath}`);
	lines.push("- Retry the OAuth login flow.");
	return lines.join("\n");
}
function settleAfterDelay(params) {
	return new Promise((resolve) => {
		const complete = () => {
			clearTimeout(timer);
			resolve("settled");
		};
		const timer = setTimeout(() => resolve("delay"), params.delayMs);
		params.waitForLoginToSettle.then(complete, complete);
	});
}
function waitForeverForPromptInput() {
	return new Promise(() => {});
}
function createOpenAICodexOAuthError(code, message, cause) {
	return Object.assign(new Error(`OpenAI Codex OAuth failed (${code}): ${message}`, { cause }), { code });
}
function rewriteOpenAICodexOAuthError(error) {
	const message = formatErrorMessage(error);
	if (/unsupported_country_region_territory/i.test(message)) return createOpenAICodexOAuthError("unsupported_region", ["OpenAI rejected the token exchange for this country, region, or network route.", "If you normally use a proxy, verify HTTPS_PROXY, HTTP_PROXY, or ALL_PROXY is set for the OpenClaw process and then retry `openclaw models auth login --provider openai`."].join(" "), error);
	if (/state mismatch|missing authorization code/i.test(message)) return createOpenAICodexOAuthError("callback_validation_failed", message, error);
	return error instanceof Error ? error : new Error(message);
}
function createManualCodeInputHandler(params) {
	let manualFallbackPromise;
	const promptForManualCode = () => params.onPrompt({ message: manualInputPromptMessage });
	const switchToManualEntry = async (progressMessage, logMessage) => {
		params.updateProgress(progressMessage);
		if (logMessage) params.runtime.log(logMessage);
		params.stopProgress("Manual OAuth entry required");
		return await promptForManualCode();
	};
	const runLocalManualFallback = async () => {
		if (!params.hasBrowserAuthStarted()) return await switchToManualEntry("Local OAuth callback was unavailable. Paste the redirect URL to continue...", "OpenAI Codex OAuth local callback did not start; switching to manual entry immediately.");
		for (const delayMs of [localManualFallbackDelayMs, localManualFallbackGraceMs]) if (await settleAfterDelay({
			delayMs,
			waitForLoginToSettle: params.waitForLoginToSettle
		}) === "settled") return await waitForeverForPromptInput();
		return await switchToManualEntry("Browser callback did not finish. Paste the redirect URL to continue...", `OpenAI Codex OAuth callback did not arrive within ${localManualFallbackDelayMs}ms; switching to manual entry (callback_timeout).`);
	};
	return async () => {
		manualFallbackPromise ??= params.isRemote ? promptForManualCode() : runLocalManualFallback();
		return await manualFallbackPromise;
	};
}
async function loginOpenAICodexOAuth(params) {
	const { prompter, runtime, isRemote, openUrl, localBrowserMessage } = params;
	ensureGlobalUndiciEnvProxyDispatcher();
	const preflight = await runOpenAIOAuthTlsPreflight({
		signal: params.signal,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	if (!preflight.ok && preflight.kind === "tls-cert") {
		const hint = formatOpenAIOAuthTlsPreflightFix(preflight);
		await prompter.note(hint, "OAuth prerequisites");
		runtime.error(hint);
		throw new Error(`OpenAI Codex OAuth prerequisites failed: ${preflight.message}`);
	}
	await prompter.note(isRemote ? [
		"You are running in a remote/VPS environment.",
		"A URL will be shown for you to open in your LOCAL browser.",
		"Open it, sign in, then paste the redirect URL here.",
		"If this OpenClaw process can receive the browser callback, sign-in may finish automatically before you paste."
	].join("\n") : [
		"Browser will open for OpenAI authentication.",
		"If the callback doesn't auto-complete, paste the redirect URL.",
		"OpenAI OAuth uses localhost:1455 for the callback."
	].join("\n"), "OpenAI Codex OAuth");
	const spin = prompter.progress("Starting OAuth flow...");
	let progressActive = true;
	const updateProgress = (message) => {
		if (progressActive) spin.update(message);
	};
	const stopProgress = (message) => {
		if (progressActive) {
			progressActive = false;
			spin.stop(message);
		}
	};
	let browserAuthStarted = false;
	let markLoginSettled;
	const waitForLoginToSettle = new Promise((resolve) => {
		markLoginSettled = resolve;
	});
	const manualPromptAbort = new AbortController();
	try {
		const { onAuth: baseOnAuth, onPrompt } = params.oauth.createVpsAwareHandlers({
			isRemote,
			prompter,
			runtime,
			spin,
			openUrl,
			localBrowserMessage: localBrowserMessage ?? "Complete sign-in in browser...",
			manualPromptMessage: manualInputPromptMessage,
			manualPromptSignal: manualPromptAbort.signal
		});
		const onAuth = async (event) => {
			browserAuthStarted = true;
			await baseOnAuth(event);
		};
		const creds = await loginOpenAICodex({
			onAuth,
			onPrompt,
			originator: openAICodexOAuthOriginator,
			onManualCodeInput: params.onManualCodeInput ?? createManualCodeInputHandler({
				isRemote,
				onPrompt,
				runtime,
				updateProgress,
				stopProgress,
				waitForLoginToSettle,
				hasBrowserAuthStarted: () => browserAuthStarted
			}),
			onProgress: (msg) => updateProgress(msg),
			signal: params.signal,
			assertCurrent: params.assertCurrent
		});
		stopProgress("OpenAI OAuth complete");
		return creds ?? null;
	} catch (err) {
		stopProgress("OpenAI OAuth failed");
		const rewrittenError = rewriteOpenAICodexOAuthError(err);
		runtime.error(String(rewrittenError));
		await prompter.note("Trouble with OAuth? See https://docs.openclaw.ai/start/faq", "OAuth help");
		throw rewrittenError;
	} finally {
		manualPromptAbort.abort();
		markLoginSettled();
	}
}
//#endregion
export { loginOpenAICodexOAuth };
