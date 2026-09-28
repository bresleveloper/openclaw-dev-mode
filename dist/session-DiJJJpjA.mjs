import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as WizardCancelledError, t as DEVICE_CODE_PHISHING_WARNING } from "./prompts-DLsO8MlU.mjs";
import { randomUUID } from "node:crypto";
//#region src/wizard/session.ts
const WIZARD_STEP_INPUT_REQUIREMENT_BY_TYPE = {
	note: "never",
	select: "always",
	text: "always",
	confirm: "always",
	multiselect: "always",
	progress: "never",
	action: "client-executor"
};
/** Whether a step needs a user answer instead of client or gateway acknowledgement. */
function wizardStepAwaitsInput(step) {
	const requirement = WIZARD_STEP_INPUT_REQUIREMENT_BY_TYPE[step.type];
	switch (requirement) {
		case "always": return true;
		case "never": return false;
		case "client-executor": return step.executor === "client";
	}
	return requirement;
}
/** Remove secret prefill before a wizard step crosses a client boundary. */
function sanitizeWizardStepForClient(step) {
	if (step.sensitive !== true || step.initialValue === void 0) return step;
	const safe = { ...step };
	delete safe.initialValue;
	return safe;
}
function normalizeTextAnswer(value) {
	if (value === null || value === void 0) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
}
/** Own enumerable, closure-bound methods survive the runtime installer's note adapter. */
function createWizardSessionPrompter(session) {
	async function prompt(step) {
		return await session.awaitAnswer(createStep(step));
	}
	function createStep(step) {
		const externalUrl = session.consumeExternalUrl(step.type === "note");
		return {
			...step,
			...externalUrl ? { externalUrl } : {},
			id: randomUUID()
		};
	}
	return {
		cancel(message) {
			throw new WizardCancelledError(message);
		},
		async intro(title) {
			await prompt({
				type: "note",
				title,
				message: "",
				executor: "client"
			});
		},
		async outro(message) {
			await prompt({
				type: "note",
				title: "Done",
				message,
				executor: "client"
			});
		},
		async note(message, title) {
			await prompt({
				type: "note",
				title,
				message,
				executor: "client"
			});
		},
		async deviceCode(params) {
			const externalUrl = session.consumeExternalUrl(true);
			const fallbackMessage = [
				params.message ?? "Enter this one-time code on the provider's sign-in page.",
				...externalUrl ? [externalUrl] : [],
				`Code: ${params.code}`,
				...params.expiresInMinutes ? [`Code expires in ${params.expiresInMinutes} minutes.`] : [],
				DEVICE_CODE_PHISHING_WARNING
			].join("\n");
			session.pushProgress(fallbackMessage, {
				title: params.title,
				deviceCode: {
					code: params.code,
					...params.expiresInMinutes ? { expiresInMinutes: params.expiresInMinutes } : {},
					...params.message ? { message: params.message } : {}
				}
			});
		},
		async plain(message) {
			await prompt({
				type: "note",
				message,
				format: "plain",
				executor: "client"
			});
		},
		async select(params) {
			return await prompt({
				type: "select",
				message: params.message,
				options: params.options.map((opt) => ({
					value: opt.value,
					label: opt.label,
					hint: opt.hint
				})),
				initialValue: params.initialValue,
				executor: "client"
			});
		},
		async multiselect(params) {
			const res = await prompt({
				type: "multiselect",
				message: params.message,
				options: params.options.map((opt) => ({
					value: opt.value,
					label: opt.label,
					hint: opt.hint
				})),
				initialValue: params.initialValues,
				executor: "client"
			});
			return Array.isArray(res) ? res : [];
		},
		async text(params) {
			const res = await session.awaitAnswer(createStep({
				type: "text",
				message: params.message,
				initialValue: params.initialValue,
				placeholder: params.placeholder,
				sensitive: params.sensitive,
				executor: "client"
			}), params.validate, params.signal);
			return res === null || res === void 0 ? "" : typeof res === "string" ? res : typeof res === "number" || typeof res === "boolean" || typeof res === "bigint" ? String(res) : "";
		},
		async confirm(params) {
			return await prompt({
				type: "confirm",
				message: params.message,
				initialValue: params.initialValue,
				executor: "client"
			}) === true;
		},
		progress(label) {
			let stopped = false;
			session.pushProgress(label);
			return {
				update: (message) => {
					if (!stopped) session.pushProgress(message);
				},
				stop: (message) => {
					if (stopped) return;
					stopped = true;
					if (message) session.pushProgress(message);
				}
			};
		},
		async openUrl(url) {
			session.queueExternalUrl(url);
		}
	};
}
var WizardSession = class {
	constructor(runner, options) {
		this.runner = runner;
		this.abortController = new AbortController();
		this.currentStep = null;
		this.progressSteps = [];
		this.deliveredProgressStepIds = /* @__PURE__ */ new Set();
		this.stepDeferred = null;
		this.cancellationLocked = false;
		this.preparationCancellationLocked = false;
		this.expiryPending = false;
		this.settled = false;
		this.devicePresentation = {};
		this.answerDeferred = /* @__PURE__ */ new Map();
		this.status = "running";
		const prompter = createWizardSessionPrompter(this);
		if (options?.timeoutMs !== void 0) {
			this.expiryTimer = setTimeout(() => {
				this.expiryPending = true;
				this.cancel();
			}, options.timeoutMs);
			this.expiryTimer.unref?.();
		}
		this.runnerPromise = this.run(prompter);
	}
	async next() {
		if (this.status !== "running") return this.terminalResult();
		const progressStep = this.progressSteps.shift();
		if (progressStep) {
			this.rememberDeliveredProgressStep(progressStep.id);
			return {
				done: false,
				step: progressStep,
				status: this.status
			};
		}
		if (this.currentStep) return {
			done: false,
			step: this.currentStep,
			status: this.status
		};
		if (!this.stepDeferred) this.stepDeferred = createDeferredCore();
		const step = await this.stepDeferred.promise;
		if (step && this.getStatus() === "running") return {
			done: false,
			step,
			status: "running"
		};
		return this.terminalResult();
	}
	/** A non-consuming view for polling clients; retired prompts are never replayed. */
	getCurrentStep() {
		return this.status === "running" ? this.currentStep ?? this.progressSteps.at(-1) : void 0;
	}
	terminalResult() {
		return {
			done: true,
			status: this.status,
			error: this.error,
			...this.configuredAccounts ? {
				channels: [...new Set(this.configuredAccounts.map((entry) => entry.channel))],
				accounts: this.configuredAccounts.map((entry) => ({ ...entry }))
			} : {},
			...this.status === "done" && this.preparedModelRef ? { preparedModelRef: this.preparedModelRef } : {},
			...this.status === "done" && this.modelActivation ? { modelActivation: this.modelActivation } : {},
			...this.status === "error" && this.activationRejection ? { activationRejection: this.activationRejection } : {}
		};
	}
	/** Record what the channels flow actually configured (channels flow only). */
	setConfiguredAccounts(accounts) {
		this.configuredAccounts = accounts.map((entry) => ({ ...entry }));
	}
	/** Record the exact provider-owned model prepared by a setup flow. */
	setPreparedModelRef(modelRef) {
		this.preparedModelRef = modelRef;
	}
	/** Record the live activation result, distinct from provider preparation. */
	setModelActivation(activation) {
		this.modelActivation = activation;
	}
	/** Only the activation owner can distinguish rejection from possibly committed failure. */
	setActivationRejection(rejection) {
		this.activationRejection = rejection;
	}
	async answer(stepId, value) {
		const pending = this.answerDeferred.get(stepId);
		if (!pending) {
			if (this.deliveredProgressStepIds.delete(stepId)) return;
			throw new Error("wizard: no pending step");
		}
		const normalizedValue = pending.text ? normalizeTextAnswer(value) : value;
		if (pending.text && normalizedValue === void 0) return "wizard: text answer must be a scalar value";
		const validationError = pending.validate?.(normalizedValue) ?? void 0;
		if (validationError) return validationError;
		this.answerDeferred.delete(stepId);
		this.currentStep = null;
		pending.deferred.resolve(normalizedValue);
	}
	cancel() {
		if (this.status !== "running" || this.cancellationLocked || this.inputClosedError || this.preparationCancellationLocked) return false;
		this.status = "cancelled";
		this.error = "cancelled";
		this.abortController.abort(new WizardCancelledError());
		this.rejectPendingAnswers();
		this.consumeExternalUrl();
		this.progressSteps = [];
		this.deliveredProgressStepIds.clear();
		this.resolveStep(null);
		return true;
	}
	/** Close client input without interrupting an operation past its commit point. */
	close(error) {
		if (this.status !== "running") return;
		this.inputClosedError ??= error;
		this.consumeExternalUrl();
		if (!this.cancellationLocked && !this.preparationCancellationLocked) this.abortController.abort(this.inputClosedError);
		this.rejectPendingAnswers(this.inputClosedError);
	}
	/** The underlying mutation crossed its durable commit point and must finish. */
	lockCancellation() {
		this.signal.throwIfAborted();
		if (!this.cancellationLocked) this.finishPreparation();
		this.cancellationLocked = true;
	}
	/** Protect preparation until the next client checkpoint or final commit. */
	lockCancellationForPreparation() {
		this.signal.throwIfAborted();
		this.preparationCancellationLocked = true;
	}
	/** Resume cancellation after preparation, before more input or verification. */
	finishPreparation() {
		this.preparationCancellationLocked = false;
		if (this.inputClosedError && !this.cancellationLocked) {
			this.abortController.abort(this.inputClosedError);
			throw this.inputClosedError;
		}
		if (this.expiryPending) {
			this.cancel();
			this.signal.throwIfAborted();
		}
	}
	get signal() {
		return this.abortController.signal;
	}
	pushStep(step) {
		this.currentStep = step;
		this.resolveStep(step);
	}
	pushProgress(message, presentation) {
		if (this.status !== "running") return;
		clearImmediate(this.externalUrlImmediate);
		this.externalUrlImmediate = void 0;
		if (presentation) {
			this.devicePresentation = {
				...presentation,
				message
			};
			this.progressSteps = [];
		}
		const step = {
			...this.devicePresentation,
			id: randomUUID(),
			type: "progress",
			message: !presentation && this.devicePresentation.message ? `${this.devicePresentation.message}\n\n${message}` : message,
			executor: "gateway",
			...this.pendingExternalUrl ? { externalUrl: this.pendingExternalUrl } : {}
		};
		if (this.stepDeferred) {
			this.rememberDeliveredProgressStep(step.id);
			this.resolveStep(step);
			return;
		}
		if (this.progressSteps.length >= 2) {
			this.progressSteps[this.progressSteps.length - 1] = step;
			return;
		}
		this.progressSteps.push(step);
	}
	rememberDeliveredProgressStep(stepId) {
		this.deliveredProgressStepIds.add(stepId);
		if (this.deliveredProgressStepIds.size <= 64) return;
		const oldest = this.deliveredProgressStepIds.values().next().value;
		if (oldest) this.deliveredProgressStepIds.delete(oldest);
	}
	queueExternalUrl(url) {
		if (this.status !== "running" || this.inputClosedError) return;
		clearImmediate(this.externalUrlImmediate);
		this.pendingExternalUrl = url;
		this.externalUrlImmediate = setImmediate(() => {
			this.pushProgress("Complete sign-in in your browser.");
		});
	}
	consumeExternalUrl(retain = false) {
		clearImmediate(this.externalUrlImmediate);
		this.externalUrlImmediate = void 0;
		const url = this.pendingExternalUrl;
		if (!retain) {
			this.pendingExternalUrl = void 0;
			this.devicePresentation = {};
		}
		return url;
	}
	async run(prompter) {
		try {
			await this.runner(prompter, this.signal, this);
			if (this.status === "running") this.status = "done";
		} catch (err) {
			if (this.status !== "running") return;
			const error = err instanceof WizardCancelledError ? this.inputClosedError ?? err : err;
			if (error instanceof WizardCancelledError) {
				this.status = "cancelled";
				this.error = error.message;
			} else {
				this.status = "error";
				this.error = coerceErrorMessage(error);
			}
		} finally {
			this.settled = true;
			this.consumeExternalUrl();
			if (this.expiryTimer) clearTimeout(this.expiryTimer);
			this.rejectPendingAnswers();
			this.resolveStep(null);
		}
	}
	rejectPendingAnswers(error = new WizardCancelledError()) {
		this.currentStep = null;
		for (const pending of this.answerDeferred.values()) pending.deferred.reject(error);
		this.answerDeferred.clear();
	}
	async awaitAnswer(step, validate, signal) {
		if (this.status !== "running") throw new Error("wizard: session not running");
		const clientCheckpoint = wizardStepAwaitsInput(step) || step.type === "note" && step.executor === "client";
		if (this.inputClosedError) {
			if (clientCheckpoint) this.finishPreparation();
			throw this.inputClosedError;
		}
		signal?.throwIfAborted();
		if (clientCheckpoint) this.finishPreparation();
		const deferred = createDeferredCore();
		this.answerDeferred.set(step.id, {
			deferred,
			text: step.type === "text",
			validate
		});
		const abort = () => {
			this.answerDeferred.delete(step.id);
			if (this.currentStep?.id === step.id) this.currentStep = null;
			deferred.reject(signal?.reason);
		};
		signal?.addEventListener("abort", abort, { once: true });
		this.pushStep(step);
		try {
			return await deferred.promise;
		} finally {
			signal?.removeEventListener("abort", abort);
		}
	}
	resolveStep(step) {
		if (!this.stepDeferred) return;
		const deferred = this.stepDeferred;
		this.stepDeferred = null;
		deferred.resolve(step);
	}
	getStatus() {
		return this.status;
	}
	/** Whether the runner has stopped and can no longer mutate setup state. */
	isSettled() {
		return this.settled;
	}
	/** Resolves after the runner can no longer mutate setup state. */
	whenSettled() {
		return this.runnerPromise;
	}
	getError() {
		return this.error;
	}
};
//#endregion
export { sanitizeWizardStepForClient as n, wizardStepAwaitsInput as r, WizardSession as t };
