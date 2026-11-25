import { a as isBlockedUrbitHostname, c as resolveTlonAccount, d as normalizeShip, n as createTlonSetupWizardBase, o as validateUrbitBaseUrl, t as applyTlonSetupConfig } from "./setup-core-B5UNhQkj.mjs";
import { createSetupTranslator, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
// extensions/tlon/src/setup-surface.ts
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
	for (const field of ["groupChannels", "dmAllowlist"]) {
		const groups = field === "groupChannels";
		const current = resolved[field];
		if (await prompter.confirm({
			message: t(groups ? "wizard.tlon.addGroupsPrompt" : "wizard.tlon.restrictDmsPrompt"),
			initialValue: current.length > 0
		})) {
			const entry = await prompter.text({
				message: t(groups ? "wizard.tlon.groupChannelsPrompt" : "wizard.tlon.dmAllowlistPrompt"),
				placeholder: groups ? "chat/~host-ship/general, chat/~host-ship/support" : "~zod, ~nec",
				initialValue: current.join(", ") || void 0
			});
			const entries = splitSetupEntries(entry ?? "");
			next = applyTlonSetupConfig({
				cfg: next,
				accountId,
				input: { [field]: groups ? entries : entries.map((ship) => normalizeShip(ship)) }
			});
		}
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
export { tlonSetupWizard as t };
