import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BLCyfEDY.mjs";
import { r as resolveGatewayAuth } from "./auth-resolve-BLx2Z8Ad.mjs";
import "./auth-fv7y-hds.mjs";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-Du7cgCF-.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-DV-G0hQT.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
//#region src/commands/gateway-auth-token.ts
/** Reveal the configured shared Gateway token only to an explicitly interactive operator. */
async function gatewayAuthTokenCommand(runtime = defaultRuntime, options = {}) {
	if (!(options.interactive ?? isTerminalInteractive())) throw new Error("Refusing to print the Gateway token outside an interactive terminal. Run `openclaw gateway auth-token --show` directly in a terminal on the Gateway host.");
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.valid) throw new Error("Gateway config is invalid. Run `openclaw doctor --fix`, then try again.");
	const cfg = snapshot.sourceConfig ?? snapshot.config;
	if (cfg.gateway?.mode === "remote") throw new Error("This command must run on the Gateway host; the current config is in remote mode.");
	const env = options.env ?? process.env;
	assertExplicitGatewayAuthModeWhenBothConfigured(cfg);
	const configuredAuth = resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		env,
		tailscaleMode: cfg.gateway?.tailscale?.mode
	});
	if (configuredAuth.mode !== "token") throw new Error(`Gateway auth mode is ${configuredAuth.mode}; there is no active shared token to reveal.`);
	const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
		config: cfg,
		commandName: "gateway auth-token",
		targetIds: /* @__PURE__ */ new Set(["gateway.auth.token"]),
		mode: "enforce_resolved",
		allowedPaths: /* @__PURE__ */ new Set(["gateway.auth.token"])
	});
	const resolvedAuth = resolveGatewayAuth({
		authConfig: resolvedConfig.gateway?.auth,
		env,
		tailscaleMode: resolvedConfig.gateway?.tailscale?.mode
	});
	if (resolvedAuth.mode !== "token" || !resolvedAuth.token) throw new Error("No configured Gateway token is available. Run `openclaw doctor --generate-gateway-token`, restart the Gateway, then try again.");
	assertGatewayAuthNotKnownWeak(resolvedAuth);
	runtime.writeStdout(`${resolvedAuth.token}\n`);
}
//#endregion
export { gatewayAuthTokenCommand };
