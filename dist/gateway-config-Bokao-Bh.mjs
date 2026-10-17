import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as createGatewayEnvSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as randomToken } from "./random-token-Sl4a6KEQ.mjs";
import { s as normalizeGatewayTokenInput } from "./onboard-helpers-BpPrDUJb.mjs";
import { t as validateDottedDecimalIPv4Input } from "./ipv4-BHcDGqAk.mjs";
import { t as rejectOnboardingOption } from "./onboard-options-CNC8ppU5.mjs";
import { t as provisionGatewayTokenStoreRef } from "./auth-token-store-ref-C9_eadNU.mjs";
//#region src/commands/onboard-non-interactive/local/gateway-config.ts
/** Applies gateway CLI options to the pending config and returns normalized runtime settings. */
async function applyNonInteractiveGatewayConfig(params) {
	const { opts, runtime } = params;
	const existingGateway = params.nextConfig.gateway;
	const port = opts.gatewayPort ?? params.defaultPort;
	let bind = opts.gatewayBind ?? existingGateway?.bind ?? "loopback";
	const explicitAuthMode = opts.gatewayAuth;
	const hasExplicitTokenAuthInput = opts.gatewayToken !== void 0 || opts.gatewayTokenRefEnv !== void 0;
	let authMode = explicitAuthMode ?? (hasExplicitTokenAuthInput ? "token" : opts.gatewayPassword !== void 0 ? "password" : existingGateway?.auth?.mode) ?? "token";
	const tailscaleMode = opts.tailscale ?? existingGateway?.tailscale?.mode ?? "off";
	if ((opts.gatewayBind !== void 0 || opts.tailscale !== void 0) && tailscaleMode !== "off" && bind !== "loopback") bind = "loopback";
	if (bind === "custom") {
		const customBindHostIssue = validateDottedDecimalIPv4Input(normalizeOptionalString(existingGateway?.customBindHost ?? ""));
		if (customBindHostIssue) {
			const setCommand = formatCliCommand("openclaw config set gateway.customBindHost <ipv4>");
			const interactiveCommand = formatCliCommand("openclaw onboard");
			rejectOnboardingOption(opts, runtime, `--gateway-bind custom requires gateway.customBindHost: ${customBindHostIssue}. Set it with ${setCommand} and rerun, or run ${interactiveCommand} interactively to be prompted for it.`);
			return null;
		}
	}
	const changesAuthOrTailscale = explicitAuthMode !== void 0 || hasExplicitTokenAuthInput || opts.tailscale !== void 0;
	if (changesAuthOrTailscale && tailscaleMode === "serve" && authMode === "none") authMode = "token";
	if (changesAuthOrTailscale && tailscaleMode === "funnel" && authMode !== "password") {
		if (authMode === "trusted-proxy") {
			rejectOnboardingOption(opts, runtime, "Tailscale Funnel requires password auth, but the Gateway is configured with \"trusted-proxy\" auth. Re-run with --gateway-auth password to switch, or keep Tailscale exposure off.");
			return null;
		}
		authMode = "password";
	}
	const nextConfig = params.nextConfig;
	let auth = existingGateway?.auth;
	const explicitGatewayToken = normalizeGatewayTokenInput(opts.gatewayToken);
	const envGatewayToken = normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN);
	const existingTokenInput = nextConfig.gateway?.auth?.token;
	const existingTokenRef = resolveSecretInputRef({
		value: existingTokenInput,
		defaults: nextConfig.secrets?.defaults
	}).ref;
	const existingPlaintextToken = normalizeGatewayTokenInput(existingTokenInput);
	const gatewayToken = explicitGatewayToken || existingPlaintextToken || envGatewayToken || void 0;
	const gatewayTokenRefEnv = normalizeOptionalString(opts.gatewayTokenRefEnv ?? "") ?? "";
	if (authMode === "token") {
		auth = {
			...auth,
			mode: "token"
		};
		if (gatewayTokenRefEnv) {
			if (!process.env[gatewayTokenRefEnv]?.trim()) {
				rejectOnboardingOption(opts, runtime, `Environment variable "${gatewayTokenRefEnv}" is missing or empty. Export it first, then rerun ${formatCliCommand("openclaw onboard --non-interactive")}.`);
				return null;
			}
			auth.token = createGatewayEnvSecretRef(nextConfig, gatewayTokenRefEnv);
		} else if (explicitGatewayToken || !existingTokenRef) {
			if (opts.secretInputMode !== "ref") auth.token = gatewayToken ?? randomToken();
			else if (!explicitGatewayToken && !existingPlaintextToken && envGatewayToken) auth.token = createGatewayEnvSecretRef(nextConfig, "OPENCLAW_GATEWAY_TOKEN");
			else auth.token = (await provisionGatewayTokenStoreRef({
				config: nextConfig,
				...gatewayToken ? { token: gatewayToken } : {}
			})).ref;
		}
	}
	if (authMode === "password") {
		const input = opts.gatewayPassword;
		const password = input === void 0 ? nextConfig.gateway?.auth?.password ?? normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD) : normalizeOptionalString(input);
		if (!password) {
			rejectOnboardingOption(opts, runtime, "Missing --gateway-password for password auth. Pass --gateway-password or use --gateway-auth token.");
			return null;
		}
		auth = {
			...auth,
			mode: "password",
			...input !== void 0 ? { password: opts.secretInputMode === "ref" ? createGatewayEnvSecretRef(nextConfig, "OPENCLAW_GATEWAY_PASSWORD") : password } : {}
		};
	}
	return {
		nextConfig: {
			...nextConfig,
			gateway: {
				...existingGateway,
				...auth ? { auth } : {},
				port,
				bind,
				tailscale: {
					...existingGateway?.tailscale,
					mode: tailscaleMode
				}
			}
		},
		port,
		bind,
		authMode,
		tailscaleMode
	};
}
//#endregion
export { applyNonInteractiveGatewayConfig as t };
