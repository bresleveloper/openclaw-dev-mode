import { h as resolveMessagePresentationControlValue } from "./payload-BCsfdv86.js";
import { t as reduceInteractiveReply } from "./interactive-CpA84UtA.js";
//#region extensions/discord/src/shared-interactive.ts
function resolveDiscordInteractiveButtonStyle(style) {
	return style ?? "secondary";
}
function applyDiscordButtonCallback(spec, button) {
	const callbackData = resolveMessagePresentationControlValue(button);
	if (!callbackData) return;
	spec.callbackData = callbackData;
	if (button.action?.type === "command" || button.action?.type === "callback") spec.callbackDataKind = button.action.type;
}
function resolveDiscordSelectOptionValue(option) {
	return resolveMessagePresentationControlValue(option);
}
function resolveDiscordSelectCallbackDataKind(options) {
	const renderableOptions = options.filter((option) => resolveDiscordSelectOptionValue(option));
	if (renderableOptions.length > 0 && renderableOptions.every((option) => option.action?.type === "command")) return "command";
	if (renderableOptions.length > 0 && renderableOptions.every((option) => option.action?.type === "callback")) return "callback";
	if (renderableOptions.some((option) => option.action)) return "mixed";
}
const DISCORD_INTERACTIVE_BUTTON_ROW_SIZE = 5;
/**
* @deprecated Use buildDiscordPresentationComponents with MessagePresentation.
*/
function buildDiscordInteractiveComponents(interactive) {
	const blocks = reduceInteractiveReply(interactive, [], (state, block) => {
		if (block.type === "text") {
			const text = block.text.trim();
			if (text) state.push({
				type: "text",
				text
			});
			return state;
		}
		if (block.type === "buttons") {
			if (block.buttons.length === 0) return state;
			for (let index = 0; index < block.buttons.length; index += DISCORD_INTERACTIVE_BUTTON_ROW_SIZE) state.push({
				type: "actions",
				buttons: block.buttons.slice(index, index + DISCORD_INTERACTIVE_BUTTON_ROW_SIZE).map((button) => {
					const spec = {
						label: button.label,
						style: button.url ? "link" : resolveDiscordInteractiveButtonStyle(button.style)
					};
					applyDiscordButtonCallback(spec, button);
					if (button.url) spec.url = button.url;
					if (button.disabled === true) spec.disabled = true;
					if (button.reusable === true) spec.reusable = true;
					return spec;
				})
			});
			return state;
		}
		if (block.type === "select" && block.options.length > 0) {
			const options = block.options.map((option) => ({
				label: option.label,
				value: resolveDiscordSelectOptionValue(option)
			})).filter((option) => Boolean(option.value));
			if (options.length === 0) return state;
			const callbackDataKind = resolveDiscordSelectCallbackDataKind(block.options);
			if (callbackDataKind === "mixed") return state;
			state.push({
				type: "actions",
				select: {
					type: "string",
					placeholder: block.placeholder,
					options,
					callbackDataKind
				}
			});
		}
		return state;
	});
	return blocks.length > 0 ? { blocks } : void 0;
}
function buildDiscordPresentationComponents(presentation) {
	if (!presentation) return;
	const spec = { blocks: [] };
	if (presentation.title) spec.blocks?.push({
		type: "text",
		text: presentation.title
	});
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			const text = block.text.trim();
			if (text) spec.blocks?.push({
				type: "text",
				text: block.type === "context" ? `-# ${text}` : text
			});
			continue;
		}
		if (block.type === "divider") {
			spec.blocks?.push({ type: "separator" });
			continue;
		}
	}
	for (const block of presentation.blocks) {
		if (block.type === "buttons") {
			appendDiscordPresentationButtonBlocks(spec, block.buttons);
			continue;
		}
		if (block.type === "select" && block.options.length > 0) {
			const options = block.options.map((option) => ({
				label: option.label,
				value: resolveDiscordSelectOptionValue(option)
			})).filter((option) => Boolean(option.value));
			if (options.length === 0) continue;
			const callbackDataKind = resolveDiscordSelectCallbackDataKind(block.options);
			if (callbackDataKind === "mixed") continue;
			spec.blocks?.push({
				type: "actions",
				select: {
					type: "string",
					placeholder: block.placeholder,
					options,
					callbackDataKind
				}
			});
		}
	}
	return spec.blocks?.length ? spec : void 0;
}
function appendDiscordPresentationButtonBlocks(spec, buttons) {
	if (buttons.length === 0) return;
	for (let index = 0; index < buttons.length; index += DISCORD_INTERACTIVE_BUTTON_ROW_SIZE) spec.blocks?.push({
		type: "actions",
		buttons: buttons.slice(index, index + DISCORD_INTERACTIVE_BUTTON_ROW_SIZE).map((button) => {
			const component = {
				label: button.label,
				style: button.url ? "link" : resolveDiscordInteractiveButtonStyle(button.style)
			};
			applyDiscordButtonCallback(component, button);
			if (button.url) component.url = button.url;
			if (button.disabled === true) component.disabled = true;
			if (button.reusable === true) component.reusable = true;
			return component;
		})
	});
}
//#endregion
export { buildDiscordPresentationComponents as n, buildDiscordInteractiveComponents as t };
