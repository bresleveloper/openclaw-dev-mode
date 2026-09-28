import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as trimToUndefined } from "./credential-planner-D-JGW62E.mjs";
import "./credentials-CyW929E5.mjs";
import { r as resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-SF_iuPva.mjs";
import { t as inspectGatewayTlsCertificate } from "./gateway-DTjFIb6X.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-CcdrhaFf.mjs";
import { d as getQrRemoteCommandSecretTargetIds } from "./command-secret-targets-Dxp8wSEx.mjs";
import { o as PAIRING_SETUP_BOOTSTRAP_PROFILE, s as VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { t as renderQrTerminal } from "./qr-terminal-D9I7Hp6E.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { a as resolvePairingSetupFromConfig, n as encodePairingSetupCode } from "./setup-code-BNyr2Ilv.mjs";
//#region src/cli/qr-cli.ts
const LIMITED_TRANSPORT_WARNING = "This Gateway URL uses plaintext ws://, so the setup code was limited for safety. Use wss:// or Tailscale Serve, then generate a new code for full access.";
function renderQrAscii(data) {
	return renderQrTerminal(data, { small: true });
}
function readDevicePairPublicUrlFromConfig(cfg) {
	const value = cfg.plugins?.entries?.["device-pair"]?.config?.["publicUrl"];
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function shouldResolveLocalGatewayPasswordSecret(cfg, env) {
	if (trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD)) return false;
	const authMode = cfg.gateway?.auth?.mode;
	if (authMode === "password") return true;
	if (authMode === "token" || authMode === "none" || authMode === "trusted-proxy") return false;
	const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
	const configTokenConfigured = hasConfiguredSecretInput(cfg.gateway?.auth?.token, cfg.secrets?.defaults);
	return !envToken && !configTokenConfigured;
}
async function resolveLocalGatewayPasswordSecretIfNeeded(cfg) {
	const resolvedPassword = await resolveRequiredConfiguredSecretRefInputString({
		config: cfg,
		env: process.env,
		value: cfg.gateway?.auth?.password,
		path: "gateway.auth.password"
	});
	if (!resolvedPassword) return;
	if (!cfg.gateway?.auth) return;
	cfg.gateway.auth.password = resolvedPassword;
}
function emitQrSecretResolveDiagnostics(diagnostics, opts) {
	if (diagnostics.length === 0) return;
	const toStderr = opts.json === true || opts.setupCodeOnly === true;
	for (const entry of diagnostics) {
		const message = theme.warn(`[secrets] ${entry}`);
		if (toStderr) defaultRuntime.error(message);
		else defaultRuntime.log(message);
	}
}
function registerQrCli(program) {
	program.command("qr").description("Generate a mobile pairing QR code and setup code").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/qr", "docs.openclaw.ai/cli/qr")}\n`).option("--remote", "Use gateway.remote.url and gateway.remote token/password (ignores device-pair publicUrl)", false).option("--url <url>", "Override gateway URL used in the setup payload").option("--public-url <url>", "Override gateway public URL used in the setup payload").option("--token <token>", "Override gateway token for setup payload").option("--password <password>", "Override gateway password for setup payload").option("--limited", "Pair with limited operator access (omit operator.admin)", false).option("--voice-node", "Pair a voice node with node, read, and Talk access only", false).option("--setup-code-only", "Print only the setup code", false).option("--no-ascii", "Skip ASCII QR rendering").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			if (opts.token && opts.password) throw new Error("Use either --token or --password, not both.");
			if (opts.limited && opts.voiceNode) throw new Error("Use either --limited or --voice-node, not both.");
			const token = trimToUndefined(opts.token) ?? "";
			const password = trimToUndefined(opts.password) ?? "";
			const wantsRemote = opts.remote === true;
			const loadedRaw = getRuntimeConfig();
			if (wantsRemote && !opts.url && !opts.publicUrl) {
				const tailscaleMode = loadedRaw.gateway?.tailscale?.mode ?? "off";
				const remoteUrl = loadedRaw.gateway?.remote?.url;
				if (!Boolean(trimToUndefined(remoteUrl)) && !(tailscaleMode === "serve" || tailscaleMode === "funnel")) throw new Error("qr --remote requires gateway.remote.url (or gateway.tailscale.mode=serve/funnel).");
			}
			let loaded = loadedRaw;
			let remoteDiagnostics = [];
			if (wantsRemote && !token && !password) {
				const resolvedRemote = await resolveCommandSecretRefsViaGateway({
					config: loadedRaw,
					commandName: "qr --remote",
					targetIds: getQrRemoteCommandSecretTargetIds()
				});
				loaded = resolvedRemote.resolvedConfig;
				remoteDiagnostics = resolvedRemote.diagnostics;
			}
			const cfg = {
				...loaded,
				gateway: {
					...loaded.gateway,
					auth: { ...loaded.gateway?.auth }
				}
			};
			emitQrSecretResolveDiagnostics(remoteDiagnostics, opts);
			if (token) {
				cfg.gateway.auth.mode = "token";
				cfg.gateway.auth.token = token;
				cfg.gateway.auth.password = void 0;
			}
			if (password) {
				cfg.gateway.auth.mode = "password";
				cfg.gateway.auth.password = password;
				cfg.gateway.auth.token = void 0;
			}
			if (wantsRemote && !token && !password) {
				const remoteToken = trimToUndefined(cfg.gateway?.remote?.token) ?? "";
				const remotePassword = trimToUndefined(cfg.gateway?.remote?.password) ?? "";
				if (remoteToken) {
					cfg.gateway.auth.mode = "token";
					cfg.gateway.auth.token = remoteToken;
					cfg.gateway.auth.password = void 0;
				} else if (remotePassword) {
					cfg.gateway.auth.mode = "password";
					cfg.gateway.auth.password = remotePassword;
					cfg.gateway.auth.token = void 0;
				}
			}
			if (!wantsRemote && !password && !token && shouldResolveLocalGatewayPasswordSecret(cfg, process.env)) await resolveLocalGatewayPasswordSecretIfNeeded(cfg);
			const publicUrl = (typeof opts.url === "string" && opts.url.trim() ? opts.url.trim() : typeof opts.publicUrl === "string" && opts.publicUrl.trim() ? opts.publicUrl.trim() : void 0) ?? (wantsRemote ? void 0 : readDevicePairPublicUrlFromConfig(cfg));
			const resolved = await resolvePairingSetupFromConfig(cfg, {
				publicUrl,
				preferRemoteUrl: wantsRemote,
				...opts.voiceNode ? { bootstrapProfile: VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE } : opts.limited ? { bootstrapProfile: PAIRING_SETUP_BOOTSTRAP_PROFILE } : {},
				runCommandWithTimeout: async (argv, runOpts) => await runCommandWithTimeout(argv, { timeoutMs: runOpts.timeoutMs }),
				loadLocalTlsFingerprint: async () => {
					const certificate = await inspectGatewayTlsCertificate(cfg.gateway?.tls);
					return certificate.ok ? certificate.value.fingerprintSha256 : void 0;
				}
			});
			if (!resolved.ok) throw new Error(resolved.error);
			const setupCode = encodePairingSetupCode(resolved.payload);
			if (opts.json) {
				defaultRuntime.writeJson({
					setupCode,
					gatewayUrl: resolved.payload.url,
					...resolved.payload.urls ? { gatewayUrls: resolved.payload.urls } : {},
					auth: resolved.authLabel,
					urlSource: resolved.urlSource,
					access: resolved.access,
					...resolved.accessDowngraded ? { accessDowngraded: true } : {}
				});
				return;
			}
			if (opts.setupCodeOnly) {
				if (resolved.accessDowngraded) defaultRuntime.error(theme.warn(LIMITED_TRANSPORT_WARNING));
				defaultRuntime.log(setupCode);
				return;
			}
			const lines = [
				theme.heading("Pairing QR"),
				"Scan this with the OpenClaw mobile app (Onboarding -> Scan QR).",
				""
			];
			if (opts.ascii !== false) {
				const qrAscii = await renderQrAscii(setupCode);
				lines.push(qrAscii.trimEnd(), "");
			}
			lines.push(`${theme.muted("Setup code:")} ${setupCode}`, `${theme.muted("Gateway:")} ${resolved.payload.url}`, ...resolved.payload.urls?.slice(1).map((url) => `${theme.muted("Fallback:")} ${url}`) ?? [], `${theme.muted("Auth:")} ${resolved.authLabel}`, `${theme.muted("Access:")} ${resolved.access}`, ...resolved.accessDowngraded ? [theme.warn(LIMITED_TRANSPORT_WARNING)] : [], `${theme.muted("Source:")} ${resolved.urlSource}`, "", "Approve after scan with:", `  ${theme.command("openclaw devices list")}`, `  ${theme.command("openclaw devices approve <requestId>")}`);
			defaultRuntime.log(lines.join("\n"));
		});
	});
}
//#endregion
export { registerQrCli as t };
