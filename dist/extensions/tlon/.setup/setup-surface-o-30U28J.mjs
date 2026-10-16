import { a as isBlockedUrbitHostname, c as resolveTlonAccount, n as createTlonSetupWizardBase, o as validateUrbitBaseUrl, t as applyTlonSetupConfig, u as normalizeShip } from "./setup-core-CDShPwjB.mjs";
import { createSetupTranslator, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
//#region extensions/tlon/src/setup-surface.ts
const t = createSetupTranslator();
const tlonSetupWizard = createTlonSetupWizardBase(async ({ cfg, accountId, prompter }) => {
	let next = cfg;
	const resolved = resolveTlonAccount(next, accountId);
	const validatedUrl = validateUrbitBaseUrl(resolved.url ?? "");
	if (!validatedUrl.ok) throw new Error(`Invalid URL: ${validatedUrl.error}`);
	let dangerouslyAllowPrivateNetwork = resolved.dangerouslyAllowPrivateNetwork ?? false;
	if (isBlockedUrbitHostname(validatedUrl.hostname)) {
		dangerouslyAllowPrivateNetwork = await prompter.confirm({
			message: t("wizard.tlon.privateNetworkPrompt"),
			initialValue: dangerouslyAllowPrivateNetwork
		});
		if (!dangerouslyAllowPrivateNetwork) throw new Error("Refusing private/internal ship URL without explicit network opt-in");
	}
	next = applyTlonSetupConfig({
		cfg: next,
		accountId,
		input: { dangerouslyAllowPrivateNetwork }
	});
	const currentGroups = resolved.groupChannels;
	if (await prompter.confirm({
		message: t("wizard.tlon.addGroupsPrompt"),
		initialValue: currentGroups.length > 0
	})) {
		const entry = await prompter.text({
			message: t("wizard.tlon.groupChannelsPrompt"),
			placeholder: "chat/~host-ship/general, chat/~host-ship/support",
			initialValue: currentGroups.join(", ") || void 0
		});
		next = applyTlonSetupConfig({
			cfg: next,
			accountId,
			input: { groupChannels: splitSetupEntries(entry ?? "") }
		});
	}
	const currentAllowlist = resolved.dmAllowlist;
	if (await prompter.confirm({
		message: t("wizard.tlon.restrictDmsPrompt"),
		initialValue: currentAllowlist.length > 0
	})) {
		const entry = await prompter.text({
			message: t("wizard.tlon.dmAllowlistPrompt"),
			placeholder: "~zod, ~nec",
			initialValue: currentAllowlist.join(", ") || void 0
		});
		next = applyTlonSetupConfig({
			cfg: next,
			accountId,
			input: { dmAllowlist: splitSetupEntries(entry ?? "").map((ship) => normalizeShip(ship)) }
		});
	}
	const autoDiscoverChannels = await prompter.confirm({
		message: t("wizard.tlon.autoDiscoveryPrompt"),
		initialValue: resolved.autoDiscoverChannels ?? true
	});
	next = applyTlonSetupConfig({
		cfg: next,
		accountId,
		input: { autoDiscoverChannels }
	});
	return { cfg: next };
});
//#endregion
export { tlonSetupWizard as t };
