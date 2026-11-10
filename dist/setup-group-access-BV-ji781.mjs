import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
//#region src/channels/plugins/setup-group-access.ts
/** Prompts for group access and, when needed, its allowlist entries. */
async function promptChannelAccessConfig(params) {
	const hasEntries = (params.currentEntries ?? []).length > 0;
	if (!await params.prompter.confirm({
		message: params.updatePrompt ? `Update ${params.label} access?` : `Configure ${params.label} access?`,
		initialValue: params.defaultPrompt ?? !hasEntries
	})) return null;
	const options = [{
		value: "allowlist",
		label: "Allowlist (recommended)"
	}];
	if (params.allowOpen !== false) options.push({
		value: "open",
		label: "Open (allow all channels)"
	});
	if (params.allowDisabled !== false) options.push({
		value: "disabled",
		label: "Disabled (block all channels)"
	});
	const policy = await params.prompter.select({
		message: `${params.label} access`,
		options,
		initialValue: params.currentPolicy ?? "allowlist"
	});
	if (policy !== "allowlist" || params.skipAllowlistEntries) return {
		policy,
		entries: []
	};
	const initialValue = params.currentEntries && params.currentEntries.length > 0 ? normalizeStringEntries(params.currentEntries).join(", ") : void 0;
	const raw = await params.prompter.text({
		message: `${params.label} allowlist (comma-separated)`,
		placeholder: params.placeholder,
		initialValue
	});
	return {
		policy,
		entries: normalizeStringEntries(raw.split(/[\n,;]+/g))
	};
}
//#endregion
export { promptChannelAccessConfig as t };
