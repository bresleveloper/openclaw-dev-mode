import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
//#region src/channels/plugins/setup-group-access.ts
/**
* Prompts for the group access policy allowed by the channel setup flow.
*/
async function promptChannelAccessPolicy(params) {
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
	const initialValue = params.currentPolicy ?? "allowlist";
	return await params.prompter.select({
		message: `${params.label} access`,
		options,
		initialValue
	});
}
/**
* Prompts for group allowlist entries and normalizes the response.
*/
async function promptChannelAllowlist(params) {
	const initialValue = params.currentEntries && params.currentEntries.length > 0 ? normalizeStringEntries(params.currentEntries).join(", ") : void 0;
	const raw = await params.prompter.text({
		message: `${params.label} allowlist (comma-separated)`,
		placeholder: params.placeholder,
		initialValue
	});
	return normalizeStringEntries(raw.split(/[\n,;]+/g));
}
/**
* Prompts for the full group access config, including allowlist entries when needed.
*/
async function promptChannelAccessConfig(params) {
	const hasEntries = (params.currentEntries ?? []).length > 0;
	const shouldPrompt = params.defaultPrompt ?? !hasEntries;
	if (!await params.prompter.confirm({
		message: params.updatePrompt ? `Update ${params.label} access?` : `Configure ${params.label} access?`,
		initialValue: shouldPrompt
	})) return null;
	const policy = await promptChannelAccessPolicy(params);
	if (policy !== "allowlist" || params.skipAllowlistEntries) return {
		policy,
		entries: []
	};
	return {
		policy,
		entries: await promptChannelAllowlist(params)
	};
}
//#endregion
export { promptChannelAccessConfig as t };
