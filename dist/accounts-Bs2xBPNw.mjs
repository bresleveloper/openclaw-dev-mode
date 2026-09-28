import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as writeRuntimeJson, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-BydhPR1U.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-Beq7kS5p.mjs";
import "./version-CwNT1gaY.mjs";
import { n as readGatewayDispatchConfigWithShellEnvFallback } from "./gateway-dispatch-config-D6ryKgcX.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-Dr91v3w1.mjs";
import { r as resolveGatewayClientBootstrap } from "./client-bootstrap-CE3rvLFg.mjs";
import { t as GatewayClient } from "./client-CpsABkfT.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-CQVpDp5M.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-G1LpD3Dj.mjs";
import { n as openUrl } from "./browser-open-4uUcM1Wd.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { t as resolveGatewayAuthOptions } from "./gateway-secret-options-M1xQSlWM.mjs";
//#region src/commands/models/accounts-gateway.ts
async function withModelsAccountsGateway(options, access, runtime, run) {
	const localPortOverride = resolveGatewayLocalPortOverride(options);
	const timeoutMs = resolveTimerTimeoutMs(parseTimeoutMsWithFallback(options.timeout, 3e4, { invalidType: "error" }), 3e4);
	const config = await readGatewayDispatchConfigWithShellEnvFallback();
	const { gatewayToken: token, gatewayPassword: password } = resolveGatewayAuthOptions(options);
	const bootstrap = await resolveGatewayClientBootstrap({
		config,
		gatewayUrl: options.url,
		localPortOverride,
		explicitAuth: {
			token,
			password
		}
	});
	const gatewayUrl = projectGatewayUrlForDiagnostics(bootstrap.url);
	runtime.error(`Scope: Personal\nGateway: ${sanitizeTerminalText(gatewayUrl)}`);
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config,
		value: normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
			config,
			targetUrl: bootstrap.url
		})),
		targetUrl: bootstrap.url,
		env: process.env
	});
	const lifetime = new AbortController();
	const ready = createDeferredCore();
	const fail = (error) => {
		lifetime.abort(error);
		ready.reject(error);
		client.stop();
	};
	const client = new GatewayClient({
		url: bootstrap.url,
		deviceAuthScope: bootstrap.deviceAuthScope,
		token: bootstrap.auth.token,
		password: bootstrap.auth.password,
		edgeAuthHeaders,
		tlsFingerprint: bootstrap.tlsFingerprint,
		preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
		requestTimeoutMs: timeoutMs,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		clientDisplayName: "openclaw models accounts",
		mode: GATEWAY_CLIENT_MODES.CLI,
		role: "operator",
		scopes: access === "write" ? ["operator.read", "operator.write"] : ["operator.read"],
		minProtocol: 4,
		maxProtocol: 4,
		notifyOnStartupRetry: true,
		onHelloOk: () => ready.resolve(),
		onConnectError: fail,
		onClose: () => {
			fail(/* @__PURE__ */ new Error("Gateway connection closed. Re-run the personal-account command."));
		}
	});
	const cancel = () => {
		const error = new ExitError(130, "Personal account operation cancelled.");
		lifetime.abort(error);
		ready.reject(error);
	};
	process.once("SIGINT", cancel);
	process.once("SIGTERM", cancel);
	const timer = setTimeout(() => fail(/* @__PURE__ */ new Error("Gateway connection timed out.")), timeoutMs);
	try {
		await Promise.all([ready.promise, startGatewayClientWhenEventLoopReady(client, {
			timeoutMs,
			signal: lifetime.signal,
			clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs }
		}).then((result) => {
			if (!result.ready) throw lifetime.signal.reason ?? /* @__PURE__ */ new Error("Gateway connection timed out.");
			return result;
		})]);
		clearTimeout(timer);
		lifetime.signal.throwIfAborted();
		let profile;
		try {
			({profile} = await client.request("users.self", {}, { signal: lifetime.signal }));
		} catch (error) {
			lifetime.signal.throwIfAborted();
			if (error instanceof GatewayClientRequestError && error.gatewayCode === "FORBIDDEN") throw new Error([
				"Personal model accounts require a signed-in person with access to this Gateway.",
				"Use --url with its Tailscale Serve or trusted-proxy WSS address. Omit shared Gateway token/password credentials when using Tailscale identity.",
				"For proxy client sign-in, see https://docs.openclaw.ai/gateway/remote#gateway-behind-an-identity-aware-proxy. Browser sign-in and device pairing alone do not identify this CLI; ask an administrator if access is denied.",
				"For shared or agent-local credentials instead, use `openclaw models auth login`."
			].join("\n"), { cause: error });
			throw error;
		}
		lifetime.signal.throwIfAborted();
		const person = profile.displayName?.trim() || profile.emails[0] || profile.githubIdentity?.login || profile.id;
		runtime.error(`Person: ${sanitizeTerminalText(person)}`);
		return await run({
			client,
			signal: lifetime.signal,
			profile
		});
	} finally {
		clearTimeout(timer);
		process.off("SIGINT", cancel);
		process.off("SIGTERM", cancel);
		lifetime.abort();
		try {
			await client.stopAndWait({ timeoutMs: 1e3 });
		} catch {
			client.stop();
		}
	}
}
//#endregion
//#region src/commands/models/accounts.ts
const SESSION_DEFAULT_NOTE = "This default applies to new sessions. Existing sessions keep their selected account.";
async function selectAccountChoice(message, choices, requested, prompter) {
	if (choices.length === 0) throw new Error(`No ${message.toLowerCase()} is available for personal accounts on this Gateway.`);
	const id = requested?.trim() ?? (choices.length === 1 ? choices[0]?.id : await prompter.select({
		message,
		options: choices.map((choice) => ({
			value: choice.id,
			label: sanitizeTerminalText(choice.label),
			hint: choice.hint && sanitizeTerminalText(choice.hint)
		})),
		searchable: true
	}));
	const selected = choices.find((choice) => choice.id === id);
	if (!selected) throw new Error(`Unknown ${message.toLowerCase()} ${sanitizeTerminalText(id ?? "")}. Available: ${choices.map((choice) => sanitizeTerminalText(choice.id)).join(", ")}.`);
	return selected;
}
async function answerAccountStep(step, signal) {
	const prompter = createClackPrompter(process.stderr, signal);
	signal.throwIfAborted();
	const message = sanitizeTerminalText(step.message ?? step.title ?? "Continue");
	const options = step.options?.map((option) => ({
		...option,
		label: sanitizeTerminalText(option.label),
		hint: option.hint && sanitizeTerminalText(option.hint)
	})) ?? [];
	switch (step.type) {
		case "note":
			if (step.format === "plain") await prompter.plain?.(message);
			else await prompter.note(message, step.title && sanitizeTerminalText(step.title));
			return;
		case "text": {
			const value = await prompter.text({
				message,
				sensitive: step.sensitive,
				placeholder: step.placeholder && sanitizeTerminalText(step.placeholder),
				initialValue: typeof step.initialValue === "string" ? sanitizeTerminalText(step.initialValue) : void 0
			});
			if (step.sensitive) registerSecretValueForRedaction(value);
			return value;
		}
		case "select": return await prompter.select({
			message,
			options,
			initialValue: step.initialValue,
			searchable: true
		});
		case "multiselect": return await prompter.multiselect({
			message,
			options,
			initialValues: Array.isArray(step.initialValue) ? step.initialValue : void 0,
			searchable: true
		});
		case "confirm":
		case "action": return await prompter.confirm({
			message,
			initialValue: typeof step.initialValue === "boolean" ? step.initialValue : void 0
		});
		case "progress": return;
	}
}
async function connectAccount(client, start, signal, runtime) {
	signal.throwIfAborted();
	const started = await client.request("users.authConnect.start", start);
	const params = {
		profileId: start.profileId,
		connectId: started.connectId
	};
	let active;
	let displayedProgress;
	let openedExternalUrl;
	const retirePrompt = async () => {
		active?.controller.abort();
		await active?.answer;
		active = void 0;
	};
	try {
		signal.throwIfAborted();
		let result = await client.request("users.authConnect.status", params, { signal });
		while (result.status === "pending") {
			const step = result.step;
			if (active?.id !== step?.id) await retirePrompt();
			signal.throwIfAborted();
			if (step?.externalUrl && step.externalUrl !== openedExternalUrl) {
				runtime.error(`Open this URL to continue:\n${sanitizeTerminalText(step.externalUrl)}`);
				await openUrl(step.externalUrl);
				signal.throwIfAborted();
				openedExternalUrl = step.externalUrl;
			}
			if (step?.type === "progress" || step?.type === "action" && step.executor !== "client") {
				if (displayedProgress !== step.id) {
					runtime.error(sanitizeTerminalText(step.message ?? step.title ?? "Working…"));
					displayedProgress = step.id;
				}
			} else if (step && !active) {
				const controller = new AbortController();
				active = {
					id: step.id,
					controller,
					answer: answerAccountStep(step, AbortSignal.any([signal, controller.signal])).then((value) => ({ value }), (error) => ({ error }))
				};
			}
			const tick = new AbortController();
			let answer;
			try {
				answer = await Promise.race([sleep(1e3, AbortSignal.any([signal, tick.signal])).then(() => void 0), ...active ? [active.answer] : []]);
			} finally {
				tick.abort();
			}
			signal.throwIfAborted();
			if (answer && active) {
				const stepId = active.id;
				await retirePrompt();
				if ("error" in answer) throw answer.error;
				result = await client.request("users.authConnect.answer", {
					...params,
					stepId,
					value: answer.value
				}, { signal });
				if (result.status === "pending" && result.error) runtime.error(sanitizeTerminalText(result.error));
			} else result = await client.request("users.authConnect.status", params, { signal });
		}
		return result;
	} catch (error) {
		await retirePrompt();
		let cancelled;
		try {
			cancelled = await client.request("users.authConnect.cancel", params, { timeoutMs: 3e3 });
			if (cancelled.status === "pending") throw new Error("The sign-in operation is still pending.", { cause: error });
		} catch (cancelError) {
			throw new Error("Could not confirm sign-in cancellation. The connection is closing; run `openclaw models accounts list` to check whether an account was saved.", { cause: cancelError });
		}
		if (cancelled.status === "connected" || error instanceof WizardCancelledError || signal.aborted) return cancelled;
		throw new Error("Sign-in did not complete. Re-run `openclaw models accounts login`.", { cause: error });
	} finally {
		await retirePrompt();
	}
}
async function modelsAccountsListCommand(options, runtime) {
	await withModelsAccountsGateway(options, "read", runtime, async ({ client, signal }) => {
		const result = await client.request("users.listModelAccounts", options.cursor ? { cursor: options.cursor } : {}, { signal });
		if (options.json) {
			writeRuntimeJson(runtime, result);
			return;
		}
		runtime.log("Personal model accounts:");
		if (result.accounts.length === 0) runtime.log("No saved accounts on this page. Use `openclaw models accounts login`.");
		for (const account of result.accounts) runtime.log(`${account.selected ? "*" : "-"} ${sanitizeTerminalText(account.authProfileId)}  ${sanitizeTerminalText(account.provider)}/${account.authType}  ${sanitizeTerminalText(account.label)}${account.selected ? " (new-session default)" : ""}`);
		runtime.log(SESSION_DEFAULT_NOTE);
		if (result.nextCursor) runtime.log(`Next page: openclaw models accounts list --cursor ${sanitizeTerminalText(result.nextCursor)}`);
	});
}
async function modelsAccountsLoginCommand(options, runtime) {
	if (!isTerminalInteractive(process.stderr)) throw new Error("Personal account login requires an interactive terminal for protected input. Run this command in a terminal, or use Connected accounts in Profile. Never paste credentials or authorization codes into chat or command arguments.");
	try {
		await withModelsAccountsGateway(options, "write", runtime, async ({ client, signal, profile }) => {
			const profileId = profile.id;
			const catalog = await client.request("users.authConnect.catalog", { profileId }, { signal });
			signal.throwIfAborted();
			const prompter = createClackPrompter(process.stderr, signal);
			const provider = await selectAccountChoice("Provider", catalog.providers, options.provider, prompter);
			const method = await selectAccountChoice("Sign-in method", provider.methods, options.method, prompter);
			signal.throwIfAborted();
			const result = await connectAccount(client, {
				profileId,
				provider: provider.id,
				method: method.id
			}, signal, runtime);
			if (options.json) writeRuntimeJson(runtime, {
				profileId,
				provider: provider.id,
				...result
			});
			if (result.status === "connected") {
				if (!options.json) runtime.log(`Signed in: ${sanitizeTerminalText(result.authProfileId)}. ${SESSION_DEFAULT_NOTE}`);
				return;
			}
			if (result.status === "cancelled") {
				runtime.error("Personal account sign-in cancelled.");
				throw new ExitError(130);
			}
			if (options.json) throw new ExitError(1);
			const reason = result.status === "failed" ? ` (${result.reason})` : "";
			throw new Error(`Personal account sign-in ${result.status}${reason}. Re-run the login command.`);
		});
	} catch (error) {
		if (error instanceof WizardCancelledError) throw new ExitError(130, "Personal account sign-in cancelled.");
		throw error;
	}
}
async function modelsAccountsUseCommand(options, runtime) {
	await withModelsAccountsGateway(options, "write", runtime, async ({ client, signal, profile }) => {
		const profileId = profile.id;
		const result = await client.request("users.selectModelAccount", {
			profileId,
			authProfileId: options.authProfileId
		}, { signal });
		if (options.json) writeRuntimeJson(runtime, {
			profileId,
			...result
		});
		else runtime.log(`Selected ${sanitizeTerminalText(options.authProfileId)}. ${SESSION_DEFAULT_NOTE}`);
	});
}
async function modelsAccountsClearDefaultCommand(options, runtime) {
	await withModelsAccountsGateway(options, "write", runtime, async ({ client, signal, profile }) => {
		const profileId = profile.id;
		const result = await client.request("users.unlinkAuthProfile", {
			profileId,
			provider: options.provider
		}, { signal });
		if (options.json) writeRuntimeJson(runtime, {
			profileId,
			...result
		});
		else runtime.log(`Cleared the ${sanitizeTerminalText(options.provider)} new-session default. Saved credentials and existing session accounts are unchanged.`);
	});
}
//#endregion
export { modelsAccountsClearDefaultCommand, modelsAccountsListCommand, modelsAccountsLoginCommand, modelsAccountsUseCommand };
