import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-DiyhlGNl.mjs";
import { confirm, intro, outro, password, select, text } from "@clack/prompts";
//#region src/commands/configure.shared.ts
/** Parse repeated `--section` values into known configure wizard sections and invalid entries. */
function parseConfigureWizardSections(raw) {
	const sections = [];
	const invalid = [];
	for (const value of Array.isArray(raw) ? raw : []) {
		const section = String(value).trim();
		const known = CONFIGURE_WIZARD_SECTIONS.find((candidate) => candidate === section);
		if (known) sections.push(known);
		else invalid.push(section);
	}
	return {
		sections,
		invalid
	};
}
const CONFIGURE_SECTION_OPTIONS = [
	{
		value: "workspace",
		label: "Workspace",
		hint: "Set workspace + sessions"
	},
	{
		value: "model",
		label: "Model",
		hint: "Pick provider + credentials"
	},
	{
		value: "web",
		label: "Web tools",
		hint: "Configure web search (Perplexity/Brave) + fetch"
	},
	{
		value: "gateway",
		label: "Gateway",
		hint: "Port, bind, auth, tailscale"
	},
	{
		value: "daemon",
		label: "Daemon",
		hint: "Install/manage the background service"
	},
	{
		value: "channels",
		label: "Channels",
		hint: "Link WhatsApp/Telegram/etc and defaults"
	},
	{
		value: "plugins",
		label: "Plugins",
		hint: "Configure plugin settings (sandbox, tools, etc.)"
	},
	{
		value: "skills",
		label: "Skills",
		hint: "Install/enable workspace skills"
	},
	{
		value: "health",
		label: "Health check",
		hint: "Run gateway + channel checks"
	}
];
const CONFIGURE_WIZARD_SECTIONS = CONFIGURE_SECTION_OPTIONS.map((option) => option.value);
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const text$1 = (params) => text({
	...params,
	message: stylePromptMessage(params.message)
});
/** Styled password prompt wrapper. Echoes bullets so secrets never appear in cleartext. */
const password$1 = (params) => password({
	...params,
	message: stylePromptMessage(params.message)
});
const confirm$1 = (params) => confirm({
	...params,
	message: stylePromptMessage(params.message)
});
/** Styled select prompt wrapper that also normalizes option hints. */
const select$1 = (params) => select(styleSelectParams(params));
//#endregion
export { outro$1 as a, select$1 as c, intro$1 as i, text$1 as l, CONFIGURE_WIZARD_SECTIONS as n, parseConfigureWizardSections as o, confirm$1 as r, password$1 as s, CONFIGURE_SECTION_OPTIONS as t };
