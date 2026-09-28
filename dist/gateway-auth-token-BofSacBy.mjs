import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-CfUfLe1u.mjs";
import { t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BzNXiOK5.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import "./auth-CRxiLJL8.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-CcdrhaFf.mjs";
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
