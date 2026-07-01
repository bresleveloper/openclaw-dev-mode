import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { h as resolveMessagePresentationControlValue } from "./payload-BCsfdv86.js";
import { n as adaptMessagePresentationForChannel } from "./interactive-CpA84UtA.js";
import "./string-coerce-runtime-BiZzULo_.js";
//#region extensions/msteams/src/presentation.ts
const MSTEAMS_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: false,
	context: true,
	divider: true,
	limits: {
		actions: {
			supportsStyles: false,
			supportsDisabled: false
		},
		text: { markdownDialect: "markdown" }
	}
};
function buildMSTeamsPresentationCard(params) {
	const body = [];
	const text = normalizeOptionalString(params.text);
	if (text) body.push({
		type: "TextBlock",
		text,
		wrap: true
	});
	const presentation = adaptMessagePresentationForChannel({
		presentation: params.presentation,
		capabilities: MSTEAMS_PRESENTATION_CAPABILITIES
	});
	if (presentation.title) body.push({
		type: "TextBlock",
		text: presentation.title,
		weight: "Bolder",
		size: "Medium",
		wrap: true
	});
	const actions = [];
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			body.push({
				type: "TextBlock",
				text: block.text,
				wrap: true,
				...block.type === "context" ? {
					isSubtle: true,
					size: "Small"
				} : {}
			});
			continue;
		}
		if (block.type === "divider") {
			body.push({
				type: "TextBlock",
				text: "---",
				wrap: true,
				isSubtle: true
			});
			continue;
		}
		if (block.type === "buttons") for (const button of block.buttons) {
			const targetUrl = button.url ?? button.webApp?.url ?? button.web_app?.url;
			if (targetUrl) {
				actions.push({
					type: "Action.OpenUrl",
					title: button.label,
					url: targetUrl
				});
				continue;
			}
			const value = resolveMessagePresentationControlValue(button);
			if (value) actions.push({
				type: "Action.Submit",
				title: button.label,
				data: button.action?.type === "command" ? value : {
					value,
					label: button.label
				}
			});
		}
	}
	return {
		type: "AdaptiveCard",
		version: "1.4",
		body,
		...actions.length ? { actions } : {}
	};
}
//#endregion
export { buildMSTeamsPresentationCard as n, MSTEAMS_PRESENTATION_CAPABILITIES as t };
