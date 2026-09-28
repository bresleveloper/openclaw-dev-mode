import { i as resolveSignalAccount, n as listSignalAccountIds } from "./accounts-BV6tDOTc.mjs";
import { c as signalNumberTextInput, i as createSignalCliPathTextInput, o as signalCompletionNote, s as signalDmPolicy } from "./channel-DhzTcFsK.mjs";
import { r as installSignalCli } from "./install-signal-cli-BDbzFcU2.mjs";
import { createDetectedBinaryStatus, createSetupTranslator, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { detectBinary } from "openclaw/plugin-sdk/setup-tools";
//#region extensions/signal/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "signal";
const configuredLabel = t("wizard.channels.statusConfigured");
const unconfiguredLabel = t("wizard.channels.statusNeedsSetup");
const managedStatus = createDetectedBinaryStatus({
	channelLabel: "Signal",
	binaryLabel: "signal-cli",
	configuredLabel,
	unconfiguredLabel,
	configuredHint: t("wizard.channels.statusSignalCliFound"),
	unconfiguredHint: t("wizard.channels.statusSignalCliMissing"),
	configuredScore: 1,
	unconfiguredScore: 0,
	resolveConfigured: ({ cfg, accountId }) => accountId ? resolveSignalAccount({
		cfg,
		accountId
	}).configured : listSignalAccountIds(cfg).some((resolvedAccountId) => resolveSignalAccount({
		cfg,
		accountId: resolvedAccountId
	}).configured),
	resolveBinaryPath: ({ cfg, accountId }) => {
		const transport = resolveSignalAccount({
			cfg,
			accountId
		}).transport;
		return transport.kind === "managed-native" ? transport.cliPath : "signal-cli";
	},
	detectBinary
});
//#endregion
//#region extensions/signal/src/channel.runtime.ts
const signalSetupWizard = {
	channel,
	status: {
		...managedStatus,
		resolveStatusLines: async (params) => {
			if (resolveSignalAccount(params).transport.kind === "managed-native") return await managedStatus.resolveStatusLines?.(params) ?? [];
			return [`Signal: ${params.configured ? configuredLabel : unconfiguredLabel}`];
		},
		resolveSelectionHint: async (params) => {
			if (resolveSignalAccount(params).transport.kind === "managed-native") return await managedStatus.resolveSelectionHint?.(params);
			return params.configured ? configuredLabel : unconfiguredLabel;
		},
		resolveQuickstartScore: async (params) => {
			if (resolveSignalAccount(params).transport.kind === "managed-native") return await managedStatus.resolveQuickstartScore?.(params);
			return params.configured ? 1 : 0;
		}
	},
	prepare: async ({ cfg, accountId, credentialValues, runtime, prompter, options }) => {
		if (!options?.allowSignalInstall) return;
		const transport = resolveSignalAccount({
			cfg,
			accountId
		}).transport;
		if (transport.kind !== "managed-native") return;
		const currentCliPath = (typeof credentialValues.cliPath === "string" ? credentialValues.cliPath : void 0) ?? (transport.kind === "managed-native" ? transport.cliPath : void 0) ?? "signal-cli";
		const cliDetected = await detectBinary(currentCliPath);
		if (!await prompter.confirm({
			message: cliDetected ? t("wizard.signal.reinstallPrompt") : t("wizard.signal.installPrompt"),
			initialValue: !cliDetected
		})) return;
		try {
			await options?.beforePersistentEffect?.();
			const result = await installSignalCli(runtime);
			if (result.ok && result.cliPath) {
				await prompter.note(`Installed signal-cli at ${result.cliPath}`, "Signal");
				return { credentialValues: { cliPath: result.cliPath } };
			}
			if (!result.ok) await prompter.note(result.error ?? "signal-cli install failed.", "Signal");
		} catch (error) {
			await prompter.note(`signal-cli install failed: ${String(error)}`, "Signal");
		}
	},
	credentials: [],
	textInputs: [createSignalCliPathTextInput(async ({ cfg, accountId, currentValue }) => {
		if (resolveSignalAccount({
			cfg,
			accountId
		}).transport.kind !== "managed-native") return false;
		return !await detectBinary(currentValue ?? "signal-cli");
	}), signalNumberTextInput],
	completionNote: signalCompletionNote,
	dmPolicy: signalDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { signalSetupWizard };
