import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-BPKYf2nk.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { a as isExpectedCliError, n as formatCliFailureLines, o as isGatewayCredentialsCliError } from "./failure-output-CpIKhMiV.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-C-z_CCoa.mjs";
import { r as callGateway } from "./call-b1jzw5fz.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DRdbYkg7.mjs";
import { t as waitForGatewayDiagnostic } from "./gateway-diagnostic-readiness-CGusOQhU.mjs";
//#region src/commands/channels/status.ts
function redactGatewayUrlSecretsInText(text) {
	return text.replace(/\b(?:wss?|https?):\/\/[^\s"'<>]+/gi, (rawUrl) => {
		return redactSensitiveUrlLikeString(rawUrl);
	});
}
/** Query gateway channel status, falling back to config-only output when unavailable. */
async function channelsStatusCommand(opts, runtime = defaultRuntime) {
	const args = normalizeOptionalLowercaseString(opts.channel) === "all" ? {
		...opts,
		channel: void 0
	} : opts;
	const timeoutMs = parseTimeoutMsWithFallback(opts.timeout, DEFAULT_RESTART_HEALTH_TIMEOUT_MS, { invalidType: "error" });
	const statusLabel = opts.probe ? "Checking channel connections…" : "Checking channel status…";
	if (opts.json !== true && !process.stderr.isTTY) runtime.log(statusLabel);
	try {
		const remainingMs = await waitForGatewayDiagnostic({
			timeoutMs,
			json: opts.json
		}, runtime);
		if (remainingMs === void 0) return;
		const payload = await withProgress({
			label: statusLabel,
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => {
			const params = {
				probe: Boolean(opts.probe),
				timeoutMs: remainingMs
			};
			if (args.channel) params.channel = args.channel;
			return await callGateway({
				method: "channels.status",
				params,
				timeoutMs: remainingMs,
				sharedStateMode: "read-only"
			});
		});
		if (opts.json) {
			writeRuntimeJson(runtime, payload);
			return;
		}
		const { formatGatewayChannelsStatusLines } = await import("./status.runtime-ClRR-WLL.mjs");
		runtime.log(formatGatewayChannelsStatusLines(payload).join("\n"));
	} catch (err) {
		if (isGatewayProtocolResponseError(err)) throw err;
		const safeError = redactGatewayUrlSecretsInText(formatErrorMessage(err));
		const expectedError = isExpectedCliError(err);
		const gatewayAuthUnavailable = isGatewayCredentialsCliError(err) || isGatewaySecretRefUnavailableError(err);
		const expectedErrorOutput = expectedError ? formatCliFailureLines({
			title: "",
			error: err
		}).join("\n") : void 0;
		const { renderChannelsStatusFallback } = await import("./status.runtime-ClRR-WLL.mjs");
		await renderChannelsStatusFallback({
			opts: args,
			runtime,
			safeError,
			gatewayAuthUnavailable,
			expectedErrorOutput
		});
	}
}
//#endregion
export { channelsStatusCommand };
