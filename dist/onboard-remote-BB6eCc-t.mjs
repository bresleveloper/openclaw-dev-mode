import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { u as isSecureWebSocketUrl } from "./net-DU4aWKLv.mjs";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { t as detectBinary } from "./detect-binary-CzJJYZjS.mjs";
import "./onboard-helpers-0ZuVvEiw.mjs";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-7FOSjRoY.mjs";
import { a as resolveWideAreaDiscoveryDomain } from "./widearea-dns-BFMogE6t.mjs";
import { t as discoverGatewayBeacons } from "./bonjour-discovery-CBYV1n_U.mjs";
import { n as buildGatewayDiscoveryTarget, t as buildGatewayDiscoveryLabel } from "./gateway-discovery-targets-C0RefHI5.mjs";
import { n as promptSecretRefForSetup } from "./provider-auth-ref-ChoLFiKM.mjs";
//#region src/commands/onboard-remote.ts
const DEFAULT_GATEWAY_URL = "ws://127.0.0.1:18789";
function buildLabel(beacon) {
	return buildGatewayDiscoveryLabel(beacon);
}
function ensureWsUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return DEFAULT_GATEWAY_URL;
	return trimmed;
}
function validateGatewayWebSocketUrl(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("ws://") && !trimmed.startsWith("wss://")) return t("wizard.remote.validWebSocketUrl");
	if (!isSecureWebSocketUrl(trimmed, { allowPrivateWs: process.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" })) return t("wizard.remote.insecureRemoteUrl");
}
/** Prompts for remote gateway connection and auth settings. */
async function promptRemoteGatewayConfig(cfg, prompter, options) {
	let selectedBeacon = null;
	let suggestedUrl = cfg.gateway?.remote?.url ?? DEFAULT_GATEWAY_URL;
	let discoveryRemote;
	const hasBonjourTool = await detectBinary("dns-sd") || await detectBinary("avahi-browse");
	const wantsDiscover = hasBonjourTool ? await prompter.confirm({
		message: t("wizard.remote.bonjour"),
		initialValue: true
	}) : false;
	if (!hasBonjourTool) await prompter.note(["Bonjour discovery requires dns-sd (macOS) or avahi-browse (Linux).", "Docs: https://docs.openclaw.ai/gateway/discovery"].join("\n"), "Discovery");
	if (wantsDiscover) {
		const wideAreaDomain = resolveWideAreaDiscoveryDomain({ configDomain: cfg.discovery?.wideArea?.domain });
		const spin = prompter.progress(t("wizard.remote.searchProgress"));
		const beacons = await discoverGatewayBeacons({
			timeoutMs: 2e3,
			wideAreaDomain
		});
		spin.stop(beacons.length > 0 ? t("wizard.remote.foundGateways", { count: beacons.length }) : t("wizard.remote.noGatewaysFound"));
		if (beacons.length > 0) {
			const selection = await prompter.select({
				message: t("wizard.remote.selectGateway"),
				options: [...beacons.map((beacon, index) => ({
					value: String(index),
					label: buildLabel(beacon)
				})), {
					value: "manual",
					label: t("wizard.remote.enterUrlManually")
				}]
			});
			if (selection !== "manual") {
				const idx = parseStrictNonNegativeInteger(selection);
				selectedBeacon = idx === void 0 ? null : beacons[idx] ?? null;
			}
		}
	}
	if (selectedBeacon) {
		const target = buildGatewayDiscoveryTarget(selectedBeacon);
		if (target.endpoint) {
			const { host, port } = target.endpoint;
			if (await prompter.select({
				message: t("wizard.remote.connectionMethod"),
				options: [{
					value: "direct",
					label: `Direct gateway WS (${host}:${port})`
				}, {
					value: "ssh",
					label: t("wizard.remote.sshTunnel")
				}]
			}) === "direct") {
				suggestedUrl = `wss://${host}:${port}`;
				const fingerprint = target.endpoint.gatewayTlsFingerprintSha256;
				if (await prompter.confirm({
					message: t("wizard.remote.trustGateway", {
						host: `${host}:${port}`,
						fingerprint: fingerprint ?? t("wizard.remote.fingerprintMissing")
					}),
					initialValue: false
				})) {
					discoveryRemote = {
						url: suggestedUrl,
						transport: "direct",
						...fingerprint ? { tlsFingerprint: fingerprint } : {}
					};
					await prompter.note([
						t("wizard.remote.directDefaultsTls"),
						`Using: ${suggestedUrl}`,
						...fingerprint ? [`TLS pin: ${fingerprint}`] : [],
						t("wizard.remote.loopbackSshHint")
					].join("\n"), t("wizard.remote.directAccessTitle"));
				} else suggestedUrl = DEFAULT_GATEWAY_URL;
			} else {
				suggestedUrl = DEFAULT_GATEWAY_URL;
				discoveryRemote = {
					url: suggestedUrl,
					transport: "ssh"
				};
				await prompter.note([
					"Start a tunnel before using the CLI:",
					`ssh -N -L 18789:127.0.0.1:${port} <user>@${host}${target.sshPort ? ` -p ${target.sshPort}` : ""}`,
					"Docs: https://docs.openclaw.ai/gateway/remote"
				].join("\n"), t("wizard.remote.sshTunnelTitle"));
			}
		}
	}
	const url = ensureWsUrl(await prompter.text({
		message: t("wizard.remote.websocketUrl"),
		initialValue: suggestedUrl,
		validate: (value) => validateGatewayWebSocketUrl(value)
	}));
	const selectedDiscovery = discoveryRemote?.url === url ? discoveryRemote : void 0;
	const existingSecret = (!cfg.gateway?.remote?.url || url === cfg.gateway.remote.url.trim()) && selectedDiscovery?.transport !== "ssh" ? cfg.gateway?.remote?.token ?? cfg.gateway?.remote?.password : void 0;
	let token;
	if (await resolveSecretInputModeForEnvSelection({
		prompter,
		explicitMode: options?.secretInputMode,
		copy: {
			modeMessage: t("wizard.gateway.remoteTokenMode"),
			plaintextLabel: t("wizard.remote.plaintextTokenLabel"),
			plaintextHint: t("wizard.remote.plaintextTokenHint")
		}
	}) === "ref") {
		if (!await prompter.confirm({
			message: t("wizard.remote.noSecretConfirm"),
			initialValue: false
		})) token = (await promptSecretRefForSetup({
			provider: "gateway-remote-token",
			config: cfg,
			prompter,
			preferredEnvVar: "OPENCLAW_GATEWAY_TOKEN",
			copy: {
				sourceMessage: t("wizard.remote.gatewayTokenStoredMessage"),
				envVarPlaceholder: "OPENCLAW_GATEWAY_TOKEN"
			}
		})).ref;
	} else while (true) {
		const input = (await prompter.text({
			message: t("wizard.remote.tokenPrompt"),
			placeholder: t("wizard.remote.secretPlaceholder"),
			sensitive: true
		})).trim();
		if (input) {
			token = input;
			break;
		}
		if (existingSecret && await prompter.confirm({
			message: t("wizard.remote.keepSecretConfirm"),
			initialValue: true
		})) {
			token = existingSecret;
			break;
		}
		if (await prompter.confirm({
			message: t("wizard.remote.noSecretConfirm"),
			initialValue: false
		})) break;
	}
	const remoteOriginUrl = options && "remoteOriginUrl" in options ? options.remoteOriginUrl : cfg.gateway?.remote?.url;
	const edgeAuth = remoteOriginUrl && gatewayOriginScope(url) === gatewayOriginScope(remoteOriginUrl) ? cfg.gateway?.remote?.edgeAuth : void 0;
	return {
		...cfg,
		gateway: {
			...cfg.gateway,
			mode: "remote",
			remote: {
				...url === remoteOriginUrl?.trim() && selectedDiscovery?.transport !== "ssh" ? cfg.gateway?.remote : {},
				url,
				edgeAuth,
				token,
				password: void 0,
				...selectedDiscovery?.transport === "direct" ? selectedDiscovery : {}
			}
		}
	};
}
//#endregion
export { validateGatewayWebSocketUrl as n, promptRemoteGatewayConfig as t };
