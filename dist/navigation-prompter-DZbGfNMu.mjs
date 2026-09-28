import { r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
//#region src/wizard/navigation-prompter.ts
const basePrompterByNavigationPrompter = /* @__PURE__ */ new WeakMap();
function unwrapNavigationPrompter(prompter) {
	let current = prompter;
	let base = basePrompterByNavigationPrompter.get(current);
	while (base) {
		current = base;
		base = basePrompterByNavigationPrompter.get(current);
	}
	return current;
}
function inertProgress() {
	return {
		update: () => {},
		stop: () => {}
	};
}
function stableKey(value) {
	if (value === void 0) return "undefined";
	try {
		return JSON.stringify(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
function optionSignature(options) {
	return stableKey(options.map((option) => [stableKey(option.value), option.label]));
}
function buildPromptSignature(kind, params) {
	return stableKey({
		kind,
		message: params.message,
		options: params.options ? optionSignature(params.options) : void 0,
		layout: params.layout
	});
}
function applyNavigation(params, navigation) {
	return {
		...params,
		navigation
	};
}
var WizardPromptNavigator = class {
	constructor(base, options = {}) {
		this.base = base;
		this.options = options;
		this.cursor = 0;
		this.restartRequested = false;
		this.boundaryBackRequested = false;
		this.backNavigationDisabled = false;
		this.records = [];
		this.prompter = {
			intro: async (title) => {
				if (!this.shouldSuppressOutput()) await this.base.intro(title);
			},
			outro: async (message) => {
				if (!this.shouldSuppressOutput()) await this.base.outro(message);
			},
			note: async (message, title) => {
				if (!this.shouldSuppressOutput()) await this.base.note(message, title);
			},
			...this.base.deviceCode ? { deviceCode: async (params) => {
				if (!this.shouldSuppressOutput()) await this.base.deviceCode?.(params);
			} } : {},
			plain: async (message) => {
				if (!this.shouldSuppressOutput()) await this.base.plain?.(message);
			},
			select: async (params) => await this.prompt({
				kind: "select",
				params,
				signature: buildPromptSignature("select", params),
				cacheAnswer: true,
				withInitial: (nextParams, answer) => ({
					...nextParams,
					initialValue: answer
				}),
				call: (nextParams) => this.base.select(nextParams)
			}),
			multiselect: async (params) => await this.prompt({
				kind: "multiselect",
				params,
				signature: buildPromptSignature("multiselect", params),
				cacheAnswer: true,
				withInitial: (nextParams, answer) => ({
					...nextParams,
					initialValues: Array.isArray(answer) ? answer : nextParams.initialValues
				}),
				call: (nextParams) => this.base.multiselect(nextParams)
			}),
			text: async (params) => await this.prompt({
				kind: "text",
				params,
				signature: buildPromptSignature("text", params),
				cacheAnswer: params.sensitive !== true,
				withInitial: (nextParams, answer) => ({
					...nextParams,
					initialValue: typeof answer === "string" ? answer : nextParams.initialValue
				}),
				call: (nextParams) => this.base.text(nextParams)
			}),
			confirm: async (params) => await this.prompt({
				kind: "confirm",
				params,
				signature: buildPromptSignature("confirm", params),
				cacheAnswer: true,
				withInitial: (nextParams, answer) => ({
					...nextParams,
					initialValue: typeof answer === "boolean" ? answer : nextParams.initialValue
				}),
				call: (nextParams) => this.base.confirm(nextParams)
			}),
			progress: (label) => this.shouldSuppressOutput() ? inertProgress() : this.base.progress(label),
			...this.base.openUrl ? { openUrl: async (url) => {
				if (!this.shouldSuppressOutput()) await this.base.openUrl?.(url);
			} } : {},
			disableBackNavigation: () => {
				this.backNavigationDisabled = true;
				this.targetIndex = void 0;
			}
		};
		basePrompterByNavigationPrompter.set(this.prompter, unwrapNavigationPrompter(base));
	}
	beginPass() {
		this.cursor = 0;
		this.restartRequested = false;
		this.boundaryBackRequested = false;
	}
	hasRestartRequest() {
		return this.restartRequested;
	}
	hasBoundaryBackRequest() {
		return this.boundaryBackRequested;
	}
	shouldSuppressOutput() {
		return this.targetIndex !== void 0 && this.cursor <= this.targetIndex;
	}
	matchingRecord(index, kind, signature) {
		const record = this.records[index];
		if (!record) return;
		if (record.kind === kind && record.signature === signature) return record;
		this.records.splice(index);
		if (this.targetIndex !== void 0 && index < this.targetIndex) this.targetIndex = void 0;
	}
	remember(index, request, answer) {
		if (!request.cacheAnswer) {
			this.records[index] = void 0;
			this.records.splice(index + 1);
			return;
		}
		const answerKey = stableKey(answer);
		const previous = this.records[index];
		this.records[index] = {
			kind: request.kind,
			signature: request.signature,
			answer,
			answerKey
		};
		if (!previous || previous.answerKey !== answerKey || previous.signature !== request.signature) this.records.splice(index + 1);
	}
	async prompt(request) {
		const index = this.cursor;
		const record = this.matchingRecord(index, request.kind, request.signature);
		if (this.targetIndex !== void 0 && index < this.targetIndex && record) {
			this.cursor = index + 1;
			return record.answer;
		}
		const paramsWithNavigation = applyNavigation(record ? request.withInitial(request.params, record.answer) : request.params, {
			canGoBack: !this.backNavigationDisabled && (index > 0 || this.options.allowBackFromStart === true),
			canGoForward: record !== void 0
		});
		try {
			const answer = await request.call(paramsWithNavigation);
			this.remember(index, request, answer);
			this.cursor = index + 1;
			if (this.targetIndex !== void 0 && index >= this.targetIndex) this.targetIndex = void 0;
			return answer;
		} catch (error) {
			if (error instanceof WizardNavigationError) {
				if (error.direction === "forward" && record) {
					this.cursor = index + 1;
					this.targetIndex = void 0;
					return record.answer;
				}
				if (error.direction === "back" && !this.backNavigationDisabled && index === 0 && this.options.allowBackFromStart === true) this.boundaryBackRequested = true;
				if (error.direction === "back" && !this.backNavigationDisabled && index > 0) {
					this.targetIndex = index - 1;
					this.restartRequested = true;
				}
			}
			throw error;
		}
	}
};
async function runWizardWithPromptNavigationScope(basePrompter, runner) {
	const navigator = new WizardPromptNavigator(unwrapNavigationPrompter(basePrompter), { allowBackFromStart: true });
	while (true) {
		navigator.beginPass();
		try {
			return {
				status: "completed",
				value: await runner(navigator.prompter)
			};
		} catch (error) {
			if (error instanceof WizardNavigationError && error.direction === "back") {
				if (navigator.hasRestartRequest()) continue;
				if (navigator.hasBoundaryBackRequest()) return { status: "back" };
			}
			throw error;
		}
	}
}
async function runWizardWithPromptNavigation(basePrompter, runner) {
	const navigator = new WizardPromptNavigator(basePrompter);
	while (true) {
		navigator.beginPass();
		try {
			await runner(navigator.prompter);
			return;
		} catch (error) {
			if (error instanceof WizardNavigationError && error.direction === "back" && navigator.hasRestartRequest()) continue;
			throw error;
		}
	}
}
//#endregion
export { runWizardWithPromptNavigationScope as n, runWizardWithPromptNavigation as t };
