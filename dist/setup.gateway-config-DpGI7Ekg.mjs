import { p as resolveSecretInputRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-Cyu8k-XJ.mjs";
import { r as findTailscaleBinary } from "./tailscale-BRIsmHIP.mjs";
import { t as randomToken } from "./random-token-B1woZa_H.mjs";
import { o as formatPortRangeHint } from "./error-format-B21fL1a_.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { f as validateGatewayPasswordInput, s as normalizeGatewayTokenInput } from "./onboard-helpers-0ZuVvEiw.mjs";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-7FOSjRoY.mjs";
import { t as validateDottedDecimalIPv4Input } from "./ipv4-CJtO5102.mjs";
import { i as maybeAddTailnetOriginToControlUiAllowedOrigins, n as TAILSCALE_EXPOSURE_OPTIONS } from "./gateway-config-prompts.shared-Dd6tegNp.mjs";
import { n as promptSecretRefForSetup } from "./provider-auth-ref-ChoLFiKM.mjs";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-ITwcxQGV.mjs";
import { t as provisionGatewayTokenStoreRef } from "./auth-token-store-ref-D2byOXhw.mjs";
//#region src/wizard/setup.gateway-config.ts
function getLocalizedTailscaleExposureOptions() {
	return TAILSCALE_EXPOSURE_OPTIONS.map((option) => ({
		hint: t(`wizard.gatewayTailscale.${option.value}Hint`),
		label: t(`wizard.gatewayTailscale.${option.value}`),
		value: option.value
	}));
}
function normalizeWizardTextInput(value) {
	return typeof value === "string" ? value.trim() : "";
}
function validateGatewayPortInput(value) {
	if (parsePort(value) === null) return formatPortRangeHint();
}
async function configureGatewayForSetup(opts) {
	const { flow, localPort, quickstartGateway, prompter } = opts;
	let { nextConfig } = opts;
	const port = flow === "quickstart" ? quickstartGateway.port : parsePort(await prompter.text({
		message: t("wizard.gateway.port"),
		initialValue: String(localPort),
		validate: validateGatewayPortInput
	}));
	if (port === null) throw new Error(formatPortRangeHint());
	let bind = flow === "quickstart" ? quickstartGateway.bind : await prompter.select({
		message: t("wizard.gateway.bindAddress"),
		options: [
			{
				value: "loopback",
				label: t("wizard.gateway.bindLoopback"),
				hint: t("wizard.gateway.bindLoopbackHint")
			},
			{
				value: "lan",
				label: t("wizard.gateway.bindLan"),
				hint: t("wizard.gateway.bindLanHint")
			},
			{
				value: "tailnet",
				label: t("wizard.gateway.bindTailnet"),
				hint: t("wizard.gateway.bindTailnetHint")
			},
			{
				value: "auto",
				label: t("wizard.gateway.bindAuto"),
				hint: t("wizard.gateway.bindAutoHint")
			},
			{
				value: "custom",
				label: t("wizard.gateway.bindCustom"),
				hint: t("wizard.gateway.bindCustomHint")
			}
		],
		initialValue: quickstartGateway.bind
	});
	let customBindHost = quickstartGateway.customBindHost;
	if (bind === "custom") {
		if (flow !== "quickstart" || !customBindHost) {
			const input = await prompter.text({
				message: t("wizard.gateway.bindCustomIp"),
				placeholder: "192.168.1.100",
				initialValue: customBindHost ?? "",
				validate: validateDottedDecimalIPv4Input
			});
			customBindHost = typeof input === "string" ? input.trim() : void 0;
		}
	}
	let authMode = quickstartGateway.authMode;
	const tailscaleMode = flow === "quickstart" ? quickstartGateway.tailscaleMode : await prompter.select({
		message: t("wizard.gateway.tailscaleExposure"),
		options: getLocalizedTailscaleExposureOptions(),
		initialValue: quickstartGateway.tailscaleMode
	});
	let tailscaleBin = null;
	if (tailscaleMode !== "off") {
		tailscaleBin = await findTailscaleBinary();
		if (!tailscaleBin) await prompter.note(t("wizard.gatewayTailscale.missingBinNote"), t("wizard.gatewayTailscale.warningTitle"));
	}
	if (tailscaleMode !== "off" && flow !== "quickstart") await prompter.note(t("wizard.gatewayTailscale.docsNote"), "Tailscale");
	if (tailscaleMode !== "off" && bind !== "loopback") {
		await prompter.note(t("wizard.gatewayNotes.tailscaleBindLoopback"), t("wizard.gatewayNotes.bindTitle"));
		bind = "loopback";
		customBindHost = void 0;
	}
	if (tailscaleMode === "funnel" && authMode !== "password") {
		await prompter.note(t("wizard.gatewayNotes.tailscaleFunnelPassword"), t("wizard.gateway.auth"));
		authMode = "password";
	}
	let gatewayToken;
	let gatewayTokenInput;
	if (authMode === "token") {
		const quickstartTokenString = normalizeSecretInputString(quickstartGateway.token);
		const quickstartTokenRef = resolveSecretInputRef({
			value: quickstartGateway.token,
			defaults: nextConfig.secrets?.defaults
		}).ref;
		const tokenMode = quickstartTokenRef ? "ref" : flow === "quickstart" && opts.secretInputMode !== "ref" ? "plaintext" : await resolveSecretInputModeForEnvSelection({
			prompter,
			explicitMode: opts.secretInputMode,
			copy: {
				modeMessage: t("wizard.gateway.authTokenMode"),
				plaintextLabel: t("wizard.gateway.plaintextTokenLabel"),
				plaintextHint: t("wizard.gateway.plaintextTokenHint"),
				refLabel: t("wizard.gateway.refLabel"),
				refHint: t("wizard.gateway.refHint")
			}
		});
		const ambientToken = normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN);
		if (tokenMode === "ref") {
			if (quickstartTokenRef) {
				gatewayTokenInput = quickstartTokenRef;
				gatewayToken = await resolveSetupSecretInputString({
					config: nextConfig,
					value: quickstartTokenRef,
					path: "gateway.auth.token",
					env: process.env
				});
			} else if (!quickstartTokenString && !ambientToken) {
				const provisioned = provisionGatewayTokenStoreRef({ config: nextConfig });
				gatewayTokenInput = provisioned.ref;
				gatewayToken = provisioned.token;
				await prompter.note(t("wizard.gateway.tokenStoreProvisioned", { name: provisioned.ref.id }), t("wizard.gateway.auth"));
			} else {
				const resolved = await promptSecretRefForSetup({
					provider: "gateway-auth-token",
					config: nextConfig,
					prompter,
					preferredEnvVar: "OPENCLAW_GATEWAY_TOKEN",
					copy: {
						sourceMessage: t("wizard.gateway.authTokenStoredMessage"),
						envVarPlaceholder: "OPENCLAW_GATEWAY_TOKEN"
					}
				});
				gatewayTokenInput = resolved.ref;
				gatewayToken = resolved.resolvedValue;
			}
		} else {
			gatewayToken = (quickstartTokenString ?? ambientToken) || randomToken();
			gatewayTokenInput = gatewayToken;
		}
	}
	if (authMode === "password") {
		const existingPasswordRef = resolveSecretInputRef({
			value: quickstartGateway.password,
			defaults: nextConfig.secrets?.defaults
		}).ref;
		let password = !(opts.secretInputMode === "ref" && !existingPasswordRef && (flow === "advanced" || quickstartGateway.password !== opts.baseConfig.gateway?.auth?.password)) ? quickstartGateway.password : existingPasswordRef ?? void 0;
		if (!password) {
			if (await resolveSecretInputModeForEnvSelection({
				prompter,
				explicitMode: opts.secretInputMode,
				copy: {
					modeMessage: t("wizard.gateway.authPasswordMode"),
					plaintextLabel: t("wizard.gateway.plaintextPasswordLabel"),
					plaintextHint: t("wizard.gateway.plaintextPasswordHint")
				}
			}) === "ref") password = (await promptSecretRefForSetup({
				provider: "gateway-auth-password",
				config: nextConfig,
				prompter,
				preferredEnvVar: "OPENCLAW_GATEWAY_PASSWORD",
				copy: {
					sourceMessage: t("wizard.gateway.authPasswordStoredMessage"),
					envVarPlaceholder: "OPENCLAW_GATEWAY_PASSWORD"
				}
			})).ref;
			else password = normalizeWizardTextInput(await prompter.text({
				message: t("wizard.gateway.passwordPrompt"),
				validate: validateGatewayPasswordInput,
				sensitive: true
			}));
		}
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "password",
					password
				}
			}
		};
	} else if (authMode === "token") nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			auth: {
				...nextConfig.gateway?.auth,
				mode: "token",
				token: gatewayTokenInput
			}
		}
	};
	nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			port,
			bind,
			...bind === "custom" && customBindHost ? { customBindHost } : {},
			tailscale: {
				...nextConfig.gateway?.tailscale,
				mode: tailscaleMode
			}
		}
	};
	nextConfig = ensureControlUiAllowedOriginsForNonLoopbackBind(nextConfig, { requireControlUiEnabled: true }).config;
	nextConfig = await maybeAddTailnetOriginToControlUiAllowedOrigins({
		config: nextConfig,
		tailscaleMode,
		tailscaleBin
	});
	return {
		nextConfig,
		settings: {
			port,
			bind,
			customBindHost: bind === "custom" ? customBindHost : void 0,
			authMode,
			gatewayToken,
			tailscaleMode
		}
	};
}
//#endregion
export { configureGatewayForSetup };
