import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as resolveManifestDeclaredProviderAuthChoices } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { r as isProviderCliLoginChoiceStartable, t as formatProviderLoginChoiceRef } from "./provider-login-options-C1Hm1UhP.mjs";
import { n as normalizeManualAuthProvider } from "./auth-manual-input-D5E4UzkF.mjs";
import { t as readGatewayApiKeyParams } from "./auth-gateway-CsnDMRxn.mjs";
//#region src/commands/models/auth-login-gateway.ts
async function readGatewayLoginParams(opts, sessionId, signal) {
	const provider = opts.provider ? normalizeManualAuthProvider(opts.provider) : void 0;
	const method = normalizeLowercaseStringOrEmpty(opts.method);
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		isolateEnv: true,
		skipPluginValidation: true
	});
	signal.throwIfAborted();
	if (!snapshot.valid) throw createInvalidConfigError(snapshot.path, formatInvalidConfigDetails(snapshot.issues));
	const choices = resolveManifestDeclaredProviderAuthChoices({
		config: snapshot.runtimeConfig,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).filter((choice) => isProviderCliLoginChoiceStartable(choice) && (provider === void 0 || choice.providerId === provider) && (!method || normalizeLowercaseStringOrEmpty(choice.methodId) === method));
	if (!choices.length) throw new Error("No Gateway-compatible login matches this provider and method. Choose a declared credential-only sign-in method, or stop the Gateway through its service owner and rerun this command offline.");
	const prompter = createClackPrompter(process.stderr, signal);
	const choice = choices.length === 1 ? choices[0] : void 0;
	const authChoice = choice ? formatProviderLoginChoiceRef(choice) : await prompter.select({
		message: "Choose a provider sign-in method",
		options: choices.map((entry) => ({
			value: formatProviderLoginChoiceRef(entry),
			label: entry.choiceLabel,
			hint: `${entry.providerId} / ${entry.methodId}`
		}))
	}).catch((error) => {
		if (error instanceof WizardCancelledError) throw new ExitError(0);
		throw error;
	});
	signal.throwIfAborted();
	return {
		sessionId,
		authChoice,
		agentId: opts.agent
	};
}
async function answerLoginStep(step, prompter, signal) {
	const message = sanitizeTerminalText(step.message ?? step.title ?? "Continue");
	if (step.externalUrl) await prompter.note(sanitizeTerminalText(step.externalUrl), "Open this URL to continue");
	if (step.deviceCode) await prompter.note(sanitizeTerminalText(step.deviceCode.code), step.title ?? "Device code");
	switch (step.type) {
		case "text": {
			if (!process.stdin.isTTY && step.sensitive) return (await readGatewayApiKeyParams({ provider: "login" }, signal)).apiKey;
			const value = await prompter.text({
				message,
				sensitive: step.sensitive,
				placeholder: step.placeholder,
				initialValue: typeof step.initialValue === "string" ? step.initialValue : void 0,
				signal
			});
			if (step.sensitive) registerSecretValueForRedaction(value);
			return value;
		}
		case "select": return prompter.select({
			message,
			options: step.options ?? [],
			initialValue: step.initialValue
		});
		case "multiselect": return prompter.multiselect({
			message,
			options: step.options ?? [],
			initialValues: Array.isArray(step.initialValue) ? step.initialValue : void 0
		});
		case "confirm":
		case "action":
			if (step.executor === "gateway") return;
			return prompter.confirm({
				message,
				initialValue: typeof step.initialValue === "boolean" ? step.initialValue : void 0
			});
		case "note":
			await prompter.note(message, step.title);
			return;
		case "progress":
			await prompter.note(message, step.title);
			return;
	}
}
async function answerBrowserStep(request, sessionId, step, signal) {
	const prompt = new AbortController();
	const promptSignal = AbortSignal.any([signal, prompt.signal]);
	const answer = answerLoginStep(step, createClackPrompter(process.stderr, promptSignal), promptSignal).then((value) => ({ value }), (error) => ({ error }));
	try {
		for (;;) {
			const tick = new AbortController();
			let answered;
			try {
				answered = await Promise.race([answer, sleep(1e3, AbortSignal.any([signal, tick.signal])).then(() => void 0)]);
			} finally {
				tick.abort();
			}
			signal.throwIfAborted();
			if (answered) {
				if ("error" in answered) throw answered.error;
				return answered;
			}
			const next = await request("wizard.next", { sessionId }, { signal });
			if (next.done || next.step?.id !== step.id) return { next };
		}
	} finally {
		prompt.abort();
		await answer;
	}
}
async function runGatewayLoginWizard(request, sessionId, signal, runtime) {
	const prompter = createClackPrompter(process.stderr, signal);
	let done = false;
	try {
		let result = await request("wizard.next", { sessionId }, {
			signal,
			timeoutMs: 15e5
		});
		while (!result.done) {
			signal.throwIfAborted();
			if (result.error) runtime.error(sanitizeTerminalText(result.error));
			const step = result.step;
			let value;
			if (step?.type === "text" && step.externalUrl) {
				const answered = await answerBrowserStep(request, sessionId, step, signal);
				if ("next" in answered) {
					result = answered.next;
					continue;
				}
				value = answered.value;
			} else value = step ? await answerLoginStep(step, prompter, signal) : void 0;
			signal.throwIfAborted();
			try {
				result = await request("wizard.next", {
					sessionId,
					...step && step.type !== "progress" && step.executor !== "gateway" ? { answer: {
						stepId: step.id,
						value
					} } : {}
				}, {
					signal,
					timeoutMs: 15e5
				});
			} catch (error) {
				if (step?.type !== "text" || !step.externalUrl) throw error;
				const current = await request("wizard.next", { sessionId }, { signal });
				if (!current.done) throw error;
				result = current;
			}
		}
		done = true;
		if (result.status === "cancelled") throw new WizardCancelledError(result.error);
		if (result.status === "error") throw new Error(result.error ?? "Gateway provider login failed.");
		runtime.log("Provider sign-in saved and connection update confirmed by the Gateway.");
	} catch (error) {
		if (!done && !signal.aborted) await request("wizard.cancel", {
			sessionId,
			closeInput: true
		});
		if (error instanceof WizardCancelledError) {
			runtime.log("Login session closed. Credentials already saved were not undone.");
			return;
		}
		throw error;
	}
}
//#endregion
export { readGatewayLoginParams, runGatewayLoginWizard };
