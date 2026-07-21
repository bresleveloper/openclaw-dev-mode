import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as stripAnsi } from "./ansi-D1GK_odF.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as createCliProgress } from "./progress-DXZjrYcT.js";
import { n as stylePromptMessage, r as stylePromptTitle, t as stylePromptHint } from "./prompt-style-BQVvtDcR.js";
import { t as note$1 } from "./note-w8AYQ4sA.js";
import { n as WizardNavigationError, t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { styleText } from "node:util";
import { S_BAR, S_BAR_END, S_CHECKBOX_ACTIVE, S_CHECKBOX_INACTIVE, S_CHECKBOX_SELECTED, S_PASSWORD_MASK, S_RADIO_ACTIVE, S_RADIO_INACTIVE, autocomplete, autocompleteMultiselect, cancel, confirm, intro, isCancel, limitOptions, multiselect, outro, password, select, settings, spinner, symbol, symbolBar, text } from "@clack/prompts";
import { AutocompletePrompt, ConfirmPrompt, MultiSelectPrompt, PasswordPrompt, SelectPrompt, TextPrompt, settings as settings$1, wrapTextWithPrefix } from "@clack/core";
//#region src/wizard/clack-navigation-prompts.ts
function getOptionLabel(option) {
	return option.label ?? String(option.value ?? "");
}
function computeLabel(label, format) {
	if (!label.includes("\n")) return format(label);
	return label.split("\n").map((line) => format(line)).join("\n");
}
function getFilteredOption(searchText, option) {
	if (!searchText) return true;
	const term = searchText.toLowerCase();
	return getOptionLabel(option).toLowerCase().includes(term) || (option.hint ?? "").toLowerCase().includes(term) || String(option.value).toLowerCase().includes(term);
}
function getSelectedOptions(values, options) {
	return options.filter((option) => values.includes(option.value));
}
function adaptOptionFilter(filter) {
	return filter ? (search, option) => filter(search, option) : void 0;
}
function formatNavigationFooter(navigation) {
	if (!navigation || !navigation.canGoBack && !navigation.canGoForward) return "";
	return [navigation.canGoBack ? styleText("dim", "← back") : void 0, navigation.canGoForward ? styleText("dim", "→ next") : void 0].filter(Boolean).join("  ");
}
function navigationFooterLines(guideVisible, barStyle, navigation, extraHints = []) {
	const footer = formatNavigationFooter(navigation);
	if (!footer) return [];
	const hintLine = [footer, ...extraHints].join("  ");
	return [`${guideVisible ? `${styleText(barStyle, S_BAR)}  ` : ""}${hintLine}`];
}
function hasGuide(opts) {
	return opts.withGuide ?? settings$1.withGuide;
}
function selectOptionRenderer(option, state) {
	const label = getOptionLabel(option);
	switch (state) {
		case "disabled": return `${styleText("gray", S_RADIO_INACTIVE)} ${computeLabel(label, (text) => styleText("gray", text))}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
		case "selected": return computeLabel(label, (text) => styleText("dim", text));
		case "active": return `${styleText("green", S_RADIO_ACTIVE)} ${label}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
		case "cancelled": return computeLabel(label, (text) => styleText(["strikethrough", "dim"], text));
		default: return `${styleText("dim", S_RADIO_INACTIVE)} ${computeLabel(label, (text) => styleText("dim", text))}`;
	}
}
function selectWithNavigationFooter(opts) {
	return new SelectPrompt({
		options: opts.options,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		initialValue: opts.initialValue,
		render() {
			const showGuide = hasGuide(opts);
			const titlePrefix = `${symbol(this.state)}  `;
			const titlePrefixBar = `${symbolBar(this.state)}  `;
			const messageLines = wrapTextWithPrefix(opts.output, opts.message, titlePrefixBar, titlePrefix);
			const title = `${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${messageLines}\n`;
			switch (this.state) {
				case "submit": {
					const submitPrefix = showGuide ? `${styleText("gray", S_BAR)}  ` : "";
					return `${title}${wrapTextWithPrefix(opts.output, selectOptionRenderer(this.options[this.cursor], "selected"), submitPrefix)}`;
				}
				case "cancel": {
					const cancelPrefix = showGuide ? `${styleText("gray", S_BAR)}  ` : "";
					return `${title}${wrapTextWithPrefix(opts.output, selectOptionRenderer(this.options[this.cursor], "cancelled"), cancelPrefix)}${showGuide ? `\n${styleText("gray", S_BAR)}` : ""}`;
				}
				default: {
					const prefix = showGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					const footerLines = [...navigationFooterLines(showGuide, "cyan", opts.navigation, [styleText("dim", "↑/↓ option")]), showGuide ? styleText("cyan", S_BAR_END) : ""];
					const titleLineCount = title.split("\n").length;
					const footerLineCount = footerLines.length + 1;
					return `${title}${prefix}${limitOptions({
						output: opts.output,
						cursor: this.cursor,
						options: this.options,
						maxItems: opts.maxItems,
						columnPadding: prefix.length,
						rowPadding: titleLineCount + footerLineCount,
						style: (item, active) => selectOptionRenderer(item, item.disabled ? "disabled" : active ? "active" : "inactive")
					}).join(`\n${prefix}`)}\n${footerLines.join("\n")}\n`;
				}
			}
		}
	}).prompt();
}
function autocompleteWithNavigationFooter(opts) {
	return new AutocompletePrompt({
		options: opts.options,
		initialValue: opts.initialValue === void 0 ? void 0 : [opts.initialValue],
		initialUserInput: opts.initialUserInput,
		placeholder: opts.placeholder,
		filter: adaptOptionFilter(opts.filter) ?? getFilteredOption,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		validate: opts.validate,
		render() {
			const showGuide = hasGuide(opts);
			const headings = showGuide ? [styleText("gray", S_BAR), `${symbol(this.state)}  ${opts.message}`] : [`${symbol(this.state)}  ${opts.message}`];
			const userInput = this.userInput;
			const options = this.options;
			const showPlaceholder = userInput === "" && opts.placeholder !== void 0;
			const opt = (option, state) => {
				const label = getOptionLabel(option);
				const hint = option.hint && option.value === this.focusedValue ? styleText("dim", ` (${option.hint})`) : "";
				switch (state) {
					case "active": return `${styleText("green", S_RADIO_ACTIVE)} ${label}${hint}`;
					case "inactive": return `${styleText("dim", S_RADIO_INACTIVE)} ${styleText("dim", label)}`;
					case "disabled": return `${styleText("gray", S_RADIO_INACTIVE)} ${styleText(["strikethrough", "gray"], label)}`;
				}
				return "";
			};
			switch (this.state) {
				case "submit": {
					const selected = getSelectedOptions(this.selectedValues, options);
					const label = selected.length > 0 ? `  ${styleText("dim", selected.map(getOptionLabel).join(", "))}` : "";
					const submitPrefix = showGuide ? styleText("gray", S_BAR) : "";
					return `${headings.join("\n")}\n${submitPrefix}${label}`;
				}
				case "cancel": {
					const userInputText = userInput ? `  ${styleText(["strikethrough", "dim"], userInput)}` : "";
					const cancelPrefix = showGuide ? styleText("gray", S_BAR) : "";
					return `${headings.join("\n")}\n${cancelPrefix}${userInputText}`;
				}
				default: {
					const barStyle = this.state === "error" ? "yellow" : "cyan";
					const guidePrefix = showGuide ? `${styleText(barStyle, S_BAR)}  ` : "";
					const guidePrefixEnd = showGuide ? styleText(barStyle, S_BAR_END) : "";
					const searchText = this.isNavigating || showPlaceholder ? opts.placeholder || userInput ? ` ${styleText("dim", showPlaceholder ? opts.placeholder ?? "" : userInput)}` : "" : ` ${this.userInputWithCursor}`;
					const matches = this.filteredOptions.length !== options.length ? styleText("dim", ` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? "" : "es"})`) : "";
					const noResults = this.filteredOptions.length === 0 && userInput ? [`${guidePrefix}${styleText("yellow", "No matches found")}`] : [];
					const validationError = this.state === "error" ? [`${guidePrefix}${styleText("yellow", this.error)}`] : [];
					if (showGuide) headings.push(guidePrefix.trimEnd());
					headings.push(`${guidePrefix}${styleText("dim", "Search:")}${searchText}${matches}`, ...noResults, ...validationError);
					const footers = [
						`${guidePrefix}${[
							`${styleText("dim", "↑/↓")} to select`,
							`${styleText("dim", "Enter:")} confirm`,
							`${styleText("dim", "Type:")} to search`
						].join(" • ")}`,
						...navigationFooterLines(showGuide, barStyle, opts.navigation),
						guidePrefixEnd
					];
					const displayOptions = this.filteredOptions.length === 0 ? [] : limitOptions({
						cursor: this.cursor,
						options: this.filteredOptions,
						columnPadding: showGuide ? 3 : 0,
						rowPadding: headings.length + footers.length,
						style: (option, active) => opt(option, option.disabled ? "disabled" : active ? "active" : "inactive"),
						maxItems: opts.maxItems,
						output: opts.output
					});
					return [
						...headings,
						...displayOptions.map((option) => `${guidePrefix}${option}`),
						...footers
					].join("\n");
				}
			}
		}
	}).prompt();
}
function textWithNavigationFooter(opts) {
	return new TextPrompt({
		validate: opts.validate,
		placeholder: opts.placeholder,
		defaultValue: opts.defaultValue,
		initialValue: opts.initialValue,
		output: opts.output,
		signal: opts.signal,
		input: opts.input,
		render() {
			const showGuide = hasGuide(opts);
			const title = `${`${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${symbol(this.state)}  `}${opts.message}\n`;
			const placeholder = opts.placeholder ? styleText("inverse", opts.placeholder[0] ?? "") + styleText("dim", opts.placeholder.slice(1)) : styleText(["inverse", "hidden"], "_");
			const userInput = !this.userInput ? placeholder : this.userInputWithCursor;
			const value = this.value ?? "";
			switch (this.state) {
				case "error": {
					const errorText = this.error ? `  ${styleText("yellow", this.error)}` : "";
					const errorPrefix = showGuide ? `${styleText("yellow", S_BAR)}  ` : "";
					const errorPrefixEnd = showGuide ? styleText("yellow", S_BAR_END) : "";
					const footerLines = navigationFooterLines(showGuide, "yellow", opts.navigation);
					return `${title.trim()}\n${errorPrefix}${userInput}\n${footerLines.length ? `${footerLines.join("\n")}\n` : ""}${errorPrefixEnd}${errorText}\n`;
				}
				case "submit": {
					const valueText = value ? `  ${styleText("dim", value)}` : "";
					return `${title}${showGuide ? styleText("gray", S_BAR) : ""}${valueText}`;
				}
				case "cancel": {
					const valueText = value ? `  ${styleText(["strikethrough", "dim"], value)}` : "";
					const cancelPrefix = showGuide ? styleText("gray", S_BAR) : "";
					return `${title}${cancelPrefix}${valueText}${value.trim() ? `\n${cancelPrefix}` : ""}`;
				}
				default: {
					const defaultPrefix = showGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					const defaultPrefixEnd = showGuide ? styleText("cyan", S_BAR_END) : "";
					const footerLines = navigationFooterLines(showGuide, "cyan", opts.navigation);
					return `${title}${defaultPrefix}${userInput}\n${footerLines.length ? `${footerLines.join("\n")}\n` : ""}${defaultPrefixEnd}\n`;
				}
			}
		}
	}).prompt();
}
function passwordWithNavigationFooter(opts) {
	return new PasswordPrompt({
		validate: opts.validate,
		mask: opts.mask ?? S_PASSWORD_MASK,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		render() {
			const showGuide = hasGuide(opts);
			const title = `${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${symbol(this.state)}  ${opts.message}\n`;
			const userInput = this.userInputWithCursor;
			const masked = this.masked;
			switch (this.state) {
				case "error": {
					const errorPrefix = showGuide ? `${styleText("yellow", S_BAR)}  ` : "";
					const errorPrefixEnd = showGuide ? `${styleText("yellow", S_BAR_END)}  ` : "";
					const maskedText = masked ?? "";
					if (opts.clearOnError) this.clear();
					const footerLines = navigationFooterLines(showGuide, "yellow", opts.navigation);
					return `${title.trim()}\n${errorPrefix}${maskedText}\n${footerLines.length ? `${footerLines.join("\n")}\n` : ""}${errorPrefixEnd}${styleText("yellow", this.error)}\n`;
				}
				case "submit": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${masked ? styleText("dim", masked) : ""}`;
				case "cancel": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${masked ? styleText(["strikethrough", "dim"], masked) : ""}${masked && showGuide ? `\n${styleText("gray", S_BAR)}` : ""}`;
				default: {
					const defaultPrefix = showGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					const defaultPrefixEnd = showGuide ? styleText("cyan", S_BAR_END) : "";
					const footerLines = navigationFooterLines(showGuide, "cyan", opts.navigation);
					return `${title}${defaultPrefix}${userInput}\n${footerLines.length ? `${footerLines.join("\n")}\n` : ""}${defaultPrefixEnd}\n`;
				}
			}
		}
	}).prompt();
}
function multiselectOptionRenderer(option, state) {
	const label = getOptionLabel(option);
	if (state === "disabled") return `${styleText("gray", S_CHECKBOX_INACTIVE)} ${computeLabel(label, (str) => styleText(["strikethrough", "gray"], str))}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
	if (state === "active") return `${styleText("cyan", S_CHECKBOX_ACTIVE)} ${label}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
	if (state === "selected") return `${styleText("green", S_CHECKBOX_SELECTED)} ${computeLabel(label, (text) => styleText("dim", text))}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
	if (state === "cancelled") return computeLabel(label, (text) => styleText(["strikethrough", "dim"], text));
	if (state === "active-selected") return `${styleText("green", S_CHECKBOX_SELECTED)} ${label}${option.hint ? ` ${styleText("dim", `(${option.hint})`)}` : ""}`;
	if (state === "submitted") return computeLabel(label, (text) => styleText("dim", text));
	return `${styleText("dim", S_CHECKBOX_INACTIVE)} ${computeLabel(label, (text) => styleText("dim", text))}`;
}
function multiselectWithNavigationFooter(opts) {
	const required = opts.required ?? true;
	return new MultiSelectPrompt({
		options: opts.options,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		initialValues: opts.initialValues,
		required,
		cursorAt: opts.cursorAt,
		validate(selected) {
			if (required && (selected === void 0 || selected.length === 0)) return `Please select at least one option.\n${styleText("reset", styleText("dim", `Press ${styleText([
				"gray",
				"bgWhite",
				"inverse"
			], " space ")} to select, ${styleText("gray", styleText("bgWhite", styleText("inverse", " enter ")))} to submit`))}`;
		},
		render() {
			const showGuide = hasGuide(opts);
			const wrappedMessage = wrapTextWithPrefix(opts.output, opts.message, showGuide ? `${symbolBar(this.state)}  ` : "", `${symbol(this.state)}  `);
			const title = `${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${wrappedMessage}\n`;
			const value = this.value ?? [];
			const styleOption = (option, active) => {
				if (option.disabled) return multiselectOptionRenderer(option, "disabled");
				const selected = value.includes(option.value);
				if (active && selected) return multiselectOptionRenderer(option, "active-selected");
				if (selected) return multiselectOptionRenderer(option, "selected");
				return multiselectOptionRenderer(option, active ? "active" : "inactive");
			};
			switch (this.state) {
				case "submit": {
					const submitText = this.options.filter(({ value: optionValue }) => value.includes(optionValue)).map((option) => multiselectOptionRenderer(option, "submitted")).join(styleText("dim", ", ")) || styleText("dim", "none");
					return `${title}${wrapTextWithPrefix(opts.output, submitText, showGuide ? `${styleText("gray", S_BAR)}  ` : "")}`;
				}
				case "cancel": {
					const label = this.options.filter(({ value: optionValue }) => value.includes(optionValue)).map((option) => multiselectOptionRenderer(option, "cancelled")).join(styleText("dim", ", "));
					if (label.trim() === "") return `${title}${styleText("gray", S_BAR)}`;
					return `${title}${wrapTextWithPrefix(opts.output, label, showGuide ? `${styleText("gray", S_BAR)}  ` : "")}${showGuide ? `\n${styleText("gray", S_BAR)}` : ""}`;
				}
				case "error": {
					const prefix = showGuide ? `${styleText("yellow", S_BAR)}  ` : "";
					const footer = this.error.split("\n").map((line, index) => index === 0 ? `${showGuide ? `${styleText("yellow", S_BAR_END)}  ` : ""}${styleText("yellow", line)}` : `   ${line}`).join("\n");
					const titleLineCount = title.split("\n").length;
					const footerLineCount = footer.split("\n").length + 1;
					return `${title}${prefix}${limitOptions({
						output: opts.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: opts.maxItems,
						columnPadding: prefix.length,
						rowPadding: titleLineCount + footerLineCount,
						style: styleOption
					}).join(`\n${prefix}`)}\n${footer}\n`;
				}
				default: {
					const prefix = showGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					const footerLines = [...navigationFooterLines(showGuide, "cyan", opts.navigation, [styleText("dim", "↑/↓ option"), styleText("dim", "space select")]), showGuide ? styleText("cyan", S_BAR_END) : ""];
					const titleLineCount = title.split("\n").length;
					const footerLineCount = footerLines.length + 1;
					return `${title}${prefix}${limitOptions({
						output: opts.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: opts.maxItems,
						columnPadding: prefix.length,
						rowPadding: titleLineCount + footerLineCount,
						style: styleOption
					}).join(`\n${prefix}`)}\n${footerLines.join("\n")}\n`;
				}
			}
		}
	}).prompt();
}
function autocompleteMultiselectWithNavigationFooter(opts) {
	const formatOption = (option, active, selectedValues, focusedValue) => {
		const isSelected = selectedValues.includes(option.value);
		const label = getOptionLabel(option);
		const hint = option.hint && focusedValue !== void 0 && option.value === focusedValue ? styleText("dim", ` (${option.hint})`) : "";
		const checkbox = isSelected ? styleText("green", S_CHECKBOX_SELECTED) : styleText("dim", S_CHECKBOX_INACTIVE);
		if (option.disabled) return `${styleText("gray", S_CHECKBOX_INACTIVE)} ${styleText(["strikethrough", "gray"], label)}`;
		if (active) return `${checkbox} ${label}${hint}`;
		return `${checkbox} ${styleText("dim", label)}`;
	};
	const prompt = new AutocompletePrompt({
		options: opts.options,
		multiple: true,
		placeholder: opts.placeholder,
		filter: adaptOptionFilter(opts.filter) ?? getFilteredOption,
		validate: () => {
			if (opts.required && prompt.selectedValues.length === 0) return "Please select at least one item";
		},
		initialValue: opts.initialValues,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		render() {
			const showGuide = hasGuide(opts);
			const title = `${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${symbol(this.state)}  ${opts.message}\n`;
			const userInput = this.userInput;
			const showPlaceholder = userInput === "" && opts.placeholder !== void 0;
			const searchText = this.isNavigating || showPlaceholder ? styleText("dim", showPlaceholder ? opts.placeholder ?? "" : userInput) : this.userInputWithCursor;
			const options = this.options;
			const matches = this.filteredOptions.length !== options.length ? styleText("dim", ` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? "" : "es"})`) : "";
			switch (this.state) {
				case "submit": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${styleText("dim", `${this.selectedValues.length} items selected`)}`;
				case "cancel": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${styleText(["strikethrough", "dim"], userInput)}`;
				default: {
					const barStyle = this.state === "error" ? "yellow" : "cyan";
					const guidePrefix = showGuide ? `${styleText(barStyle, S_BAR)}  ` : "";
					const guidePrefixEnd = showGuide ? styleText(barStyle, S_BAR_END) : "";
					const instructions = [
						`${styleText("dim", "↑/↓")} to navigate`,
						`${styleText("dim", this.isNavigating ? "Space/Tab:" : "Tab:")} select`,
						`${styleText("dim", "Enter:")} confirm`,
						`${styleText("dim", "Type:")} to search`
					];
					const noResults = this.filteredOptions.length === 0 && userInput ? [`${guidePrefix}${styleText("yellow", "No matches found")}`] : [];
					const errorMessage = this.state === "error" ? [`${guidePrefix}${styleText("yellow", this.error)}`] : [];
					const headerLines = [
						...`${title}${showGuide ? styleText(barStyle, S_BAR) : ""}`.split("\n"),
						`${guidePrefix}${styleText("dim", "Search:")} ${searchText}${matches}`,
						...noResults,
						...errorMessage
					];
					const footerLines = [
						`${guidePrefix}${instructions.join(" • ")}`,
						...navigationFooterLines(showGuide, barStyle, opts.navigation),
						guidePrefixEnd
					];
					const displayOptions = limitOptions({
						cursor: this.cursor,
						options: this.filteredOptions,
						style: (option, active) => formatOption(option, active, this.selectedValues, this.focusedValue),
						maxItems: opts.maxItems,
						output: opts.output,
						rowPadding: headerLines.length + footerLines.length
					});
					return [
						...headerLines,
						...displayOptions.map((option) => `${guidePrefix}${option}`),
						...footerLines
					].join("\n");
				}
			}
		}
	});
	return prompt.prompt();
}
function confirmWithNavigationFooter(opts) {
	const active = opts.active ?? "Yes";
	const inactive = opts.inactive ?? "No";
	return new ConfirmPrompt({
		active,
		inactive,
		signal: opts.signal,
		input: opts.input,
		output: opts.output,
		initialValue: opts.initialValue ?? true,
		render() {
			const showGuide = hasGuide(opts);
			const titlePrefix = `${symbol(this.state)}  `;
			const titlePrefixBar = showGuide ? `${styleText("gray", S_BAR)}  ` : "";
			const messageLines = wrapTextWithPrefix(opts.output, opts.message, titlePrefixBar, titlePrefix);
			const title = `${showGuide ? `${styleText("gray", S_BAR)}\n` : ""}${messageLines}\n`;
			const value = this.value ? active : inactive;
			switch (this.state) {
				case "submit": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${styleText("dim", value)}`;
				case "cancel": return `${title}${showGuide ? `${styleText("gray", S_BAR)}  ` : ""}${styleText(["strikethrough", "dim"], value)}${showGuide ? `\n${styleText("gray", S_BAR)}` : ""}`;
				default: {
					const defaultPrefix = showGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					const defaultPrefixEnd = showGuide ? styleText("cyan", S_BAR_END) : "";
					const separator = opts.vertical ? showGuide ? `\n${styleText("cyan", S_BAR)}  ` : "\n" : ` ${styleText("dim", "/")} `;
					const footerLines = navigationFooterLines(showGuide, "cyan", opts.navigation, [styleText("dim", "↑/↓ option")]);
					return `${title}${defaultPrefix}${this.value ? `${styleText("green", S_RADIO_ACTIVE)} ${active}` : `${styleText("dim", S_RADIO_INACTIVE)} ${styleText("dim", active)}`}${separator}${!this.value ? `${styleText("green", S_RADIO_ACTIVE)} ${inactive}` : `${styleText("dim", S_RADIO_INACTIVE)} ${styleText("dim", inactive)}`}\n${footerLines.length > 0 ? `${footerLines.join("\n")}\n` : ""}${defaultPrefixEnd}\n`;
				}
			}
		}
	}).prompt();
}
//#endregion
//#region src/wizard/clack-prompter.ts
function guardCancel(value) {
	if (isCancel(value)) {
		cancel(stylePromptTitle("Setup cancelled.") ?? "Setup cancelled.");
		throw new WizardCancelledError();
	}
	return value;
}
function resolveNavigationDirection(navigation, key) {
	if (key?.name === "left" && navigation?.canGoBack) return "back";
	if (key?.name === "right" && navigation?.canGoForward) return "forward";
}
function hasPromptNavigation(navigation) {
	return navigation?.canGoBack === true || navigation?.canGoForward === true;
}
async function withHorizontalCursorActionsDisabled(disabled, work) {
	if (!disabled) return await work();
	const hadLeft = settings.actions.has("left");
	const hadRight = settings.actions.has("right");
	settings.actions.delete("left");
	settings.actions.delete("right");
	try {
		return await work();
	} finally {
		if (hadLeft) settings.actions.add("left");
		if (hadRight) settings.actions.add("right");
	}
}
async function runPromptWithNavigation(navigation, work) {
	const controller = navigation?.canGoBack || navigation?.canGoForward ? new AbortController() : void 0;
	let rejectNavigation;
	const onKeypress = (_input, key) => {
		const nextDirection = resolveNavigationDirection(navigation, key);
		if (!nextDirection) return;
		rejectNavigation?.(new WizardNavigationError(nextDirection));
		controller?.abort();
	};
	try {
		if (!controller) return guardCancel(await work(void 0));
		const navigationPromise = new Promise((_, reject) => {
			rejectNavigation = reject;
		});
		process.stdin.on("keypress", onKeypress);
		const promptPromise = work(controller.signal);
		promptPromise.catch(() => {});
		return guardCancel(await Promise.race([promptPromise, navigationPromise]));
	} finally {
		if (controller) process.stdin.off("keypress", onKeypress);
	}
}
function normalizeSearchTokens(search) {
	return normalizeLowercaseStringOrEmpty(search).split(/\s+/).map((token) => token.trim()).filter((token) => token.length > 0);
}
function buildOptionSearchText(option) {
	return normalizeLowercaseStringOrEmpty(`${stripAnsi(option.label ?? "")} ${stripAnsi(option.hint ?? "")} ${String(option.value ?? "")}`);
}
function tokenizedOptionFilter(search, option) {
	const tokens = normalizeSearchTokens(search);
	if (tokens.length === 0) return true;
	const haystack = buildOptionSearchText(option);
	return tokens.every((token) => haystack.includes(token));
}
function createClackPrompter() {
	return {
		intro: async (title) => {
			intro(stylePromptTitle(title) ?? title);
		},
		outro: async (message) => {
			outro(stylePromptTitle(message) ?? message);
		},
		note: async (message, title) => {
			note$1(message, title);
		},
		plain: async (message) => {
			process.stdout.write(message.endsWith("\n") ? message : `${message}\n`);
		},
		select: async (params) => {
			const options = params.options.map((opt) => {
				const base = {
					value: opt.value,
					label: opt.label
				};
				return opt.hint === void 0 ? base : {
					...base,
					hint: stylePromptHint(opt.hint)
				};
			});
			if (params.searchable) return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await autocompleteWithNavigationFooter({
				message: stylePromptMessage(params.message),
				options,
				initialValue: params.initialValue,
				filter: tokenizedOptionFilter,
				signal,
				navigation: params.navigation
			}) : await autocomplete({
				message: stylePromptMessage(params.message),
				options,
				initialValue: params.initialValue,
				filter: tokenizedOptionFilter,
				signal
			})));
			return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await selectWithNavigationFooter({
				message: stylePromptMessage(params.message),
				options,
				initialValue: params.initialValue,
				signal,
				navigation: params.navigation
			}) : await select({
				message: stylePromptMessage(params.message),
				options,
				initialValue: params.initialValue,
				signal
			})));
		},
		multiselect: async (params) => {
			const options = params.options.map((opt) => {
				const base = {
					value: opt.value,
					label: opt.label
				};
				return opt.hint === void 0 ? base : {
					...base,
					hint: stylePromptHint(opt.hint)
				};
			});
			if (params.searchable) return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await autocompleteMultiselectWithNavigationFooter({
				message: stylePromptMessage(params.message),
				options,
				initialValues: params.initialValues,
				filter: tokenizedOptionFilter,
				signal,
				navigation: params.navigation
			}) : await autocompleteMultiselect({
				message: stylePromptMessage(params.message),
				options,
				initialValues: params.initialValues,
				filter: tokenizedOptionFilter,
				signal
			})));
			return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await multiselectWithNavigationFooter({
				message: stylePromptMessage(params.message),
				options,
				initialValues: params.initialValues,
				signal,
				navigation: params.navigation
			}) : await multiselect({
				message: stylePromptMessage(params.message),
				options,
				initialValues: params.initialValues,
				signal
			})));
		},
		text: async (params) => {
			const validate = params.validate;
			if (params.sensitive) return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await passwordWithNavigationFooter({
				message: stylePromptMessage(params.message),
				validate: validate ? (value) => validate(value ?? "") : void 0,
				navigation: params.navigation,
				signal
			}) : await password({
				message: stylePromptMessage(params.message),
				validate: validate ? (value) => validate(value ?? "") : void 0,
				signal
			})));
			return await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => params.navigation ? await textWithNavigationFooter({
				message: stylePromptMessage(params.message),
				initialValue: params.initialValue,
				placeholder: params.placeholder,
				validate: validate ? (value) => validate(value ?? "") : void 0,
				navigation: params.navigation,
				signal
			}) : await text({
				message: stylePromptMessage(params.message),
				initialValue: params.initialValue,
				placeholder: params.placeholder,
				validate: validate ? (value) => validate(value ?? "") : void 0,
				signal
			})));
		},
		confirm: async (params) => await withHorizontalCursorActionsDisabled(hasPromptNavigation(params.navigation), async () => await runPromptWithNavigation(params.navigation, async (signal) => {
			const message = stylePromptMessage(params.message);
			if (params.navigation) return await confirmWithNavigationFooter({
				message,
				initialValue: params.initialValue,
				vertical: params.layout === "vertical",
				navigation: params.navigation,
				signal
			});
			if (params.layout === "vertical") return await select({
				message,
				options: [{
					value: true,
					label: "Yes"
				}, {
					value: false,
					label: "No"
				}],
				initialValue: params.initialValue ?? true,
				signal
			});
			return await confirm({
				message,
				initialValue: params.initialValue,
				signal
			});
		})),
		progress: (label) => {
			const spin = spinner();
			spin.start(theme.accent(label));
			const osc = createCliProgress({
				label,
				indeterminate: true,
				enabled: true,
				fallback: "none"
			});
			return {
				update: (message) => {
					spin.message(theme.accent(message));
					osc.setLabel(message);
				},
				stop: (message) => {
					osc.done();
					if (message === void 0) spin.clear();
					else spin.stop(message);
				}
			};
		}
	};
}
//#endregion
export { tokenizedOptionFilter as n, createClackPrompter as t };
