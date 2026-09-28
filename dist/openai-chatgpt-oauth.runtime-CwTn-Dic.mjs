import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-CKERJRZ6.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./setup-tools-D_Fbo3nn.mjs";
import { t as loginOpenAICodex } from "./openai-chatgpt-oauth-flow.runtime.js";
import { t as runOpenAIOAuthTlsPreflight } from "./openai-chatgpt-oauth-preflight.runtime.js";
import path from "node:path";
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
export { loginOpenAICodexOAuth as t };
