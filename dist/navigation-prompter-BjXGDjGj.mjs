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
			intro: (title) => this.display(() => this.base.intro(title)),
			outro: (message) => this.display(() => this.base.outro(message)),
			note: (message, title) => this.display(() => this.base.note(message, title)),
			...this.base.deviceCode ? { deviceCode: (params) => this.display(() => this.base.deviceCode?.(params)) } : {},
			plain: (message) => this.display(() => this.base.plain?.(message)),
			select: async (params) => await this.prompt({
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
			...this.base.openUrl ? { openUrl: (url) => this.display(() => this.base.openUrl?.(url)) } : {},
			disableBackNavigation: () => {
				this.backNavigationDisabled = true;
				this.targetIndex = void 0;
			}
		};
		basePrompterByNavigationPrompter.set(this.prompter, unwrapNavigationPrompter(base));
	}
	async run(runner) {
		while (true) {
			this.cursor = 0;
			this.restartRequested = false;
			this.boundaryBackRequested = false;
			try {
				return {
					status: "completed",
					value: await runner(this.prompter)
				};
			} catch (error) {
				if (error instanceof WizardNavigationError && error.direction === "back") {
					if (this.restartRequested) continue;
					if (this.boundaryBackRequested) return { status: "back" };
				}
				throw error;
			}
		}
	}
	shouldSuppressOutput() {
		return this.targetIndex !== void 0 && this.cursor <= this.targetIndex;
	}
	async display(write) {
		if (!this.shouldSuppressOutput()) await write();
	}
	matchingRecord(index, signature) {
		const record = this.records[index];
		if (!record) return;
		if (record.signature === signature) return record;
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
			signature: request.signature,
			answer,
			answerKey
		};
		if (!previous || previous.answerKey !== answerKey || previous.signature !== request.signature) this.records.splice(index + 1);
	}
	async prompt(request) {
		const index = this.cursor;
		const record = this.matchingRecord(index, request.signature);
		if (this.targetIndex !== void 0 && index < this.targetIndex && record) {
			this.cursor = index + 1;
			return record.answer;
		}
		const paramsWithNavigation = {
			...record ? request.withInitial(request.params, record.answer) : request.params,
			navigation: {
				canGoBack: !this.backNavigationDisabled && (index > 0 || this.options.allowBackFromStart === true),
				canGoForward: record !== void 0
			}
		};
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
	return new WizardPromptNavigator(unwrapNavigationPrompter(basePrompter), { allowBackFromStart: true }).run(runner);
}
async function runWizardWithPromptNavigation(basePrompter, runner) {
	await new WizardPromptNavigator(basePrompter).run(runner);
}
//#endregion
export { runWizardWithPromptNavigationScope as n, runWizardWithPromptNavigation as t };
