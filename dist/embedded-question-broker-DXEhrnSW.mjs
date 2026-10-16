import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { A as validateAgentRunDelegatedAuthority, b as registerAgentRunDelegatedAuthorityClosedHandler, c as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-BaxMDLZF.mjs";
import { Ar as validateQuestionResolveParams, Dr as validateQuestionGetParams, Or as validateQuestionListParams, jr as validateQuestionWaitAnswerParams, kr as validateQuestionRequestParams } from "./src-l2dWvEsN.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { h as registerActiveEmbeddedRunHumanInputWait } from "./run-state-BmDkKYBf.mjs";
import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as questionShapeError } from "./question-validation-COQSqSzK.mjs";
import { n as QuestionManagerError, r as QuestionManagerErrorCodes, t as QuestionManager } from "./question-manager-CWgnAtGc.mjs";
//#region src/infra/embedded-question-broker.ts
const EMBEDDED_SECRET_STORE_REQUEST_BLOCKER = "Secret store requests need a running Gateway; ask the operator to run `openclaw secrets store` or use the Control UI.";
let activeBroker = null;
function invalidRequest(message) {
	return new GatewayClientRequestError({
		code: "INVALID_REQUEST",
		message
	});
}
/** Serves the question RPC contract for one embedded backend lifetime. */
var EmbeddedQuestionBroker = class {
	constructor(scheduler) {
		this.listeners = /* @__PURE__ */ new Set();
		this.stopped = false;
		this.removeAuthorityListener = registerAgentRunDelegatedAuthorityClosedHandler(() => {
			this.manager.cancelClosedAuthorities();
		});
		this.manager = new QuestionManager(scheduler);
	}
	subscribe(listener) {
		return registerListener(this.listeners, listener);
	}
	request(params, signal) {
		signal?.throwIfAborted();
		if (this.stopped) throw new Error("Embedded question broker is stopped");
		if (!validateQuestionRequestParams(params)) throw invalidRequest("Invalid question.request params");
		if (params.questions.some((question) => question.secretStore)) throw invalidRequest(EMBEDDED_SECRET_STORE_REQUEST_BLOCKER);
		const error = questionShapeError(params.questions, {
			allowPlainSecretQuestions: true,
			validateUrls: false
		});
		if (error) throw invalidRequest(error);
		const caller = getGatewayToolCallerIdentity();
		const authority = caller?.approvalAuthority ?? (caller?.operationalRunInstance ? getActiveAgentRunDelegatedAuthority(caller.operationalRunInstance) : void 0);
		const isRequesterActive = () => {
			try {
				return !signal?.aborted && !caller?.approvalSignals?.some((inputSignal) => inputSignal.aborted) && (!caller?.operationalRunInstance || authority !== void 0) && (!authority || validateAgentRunDelegatedAuthority(authority)) && caller?.approvalAuthorityCheck?.() !== false && caller?.receiptAuthority?.() !== false;
			} catch {
				return false;
			}
		};
		const abort = () => {
			this.manager.get(record.id);
		};
		const record = this.manager.request({
			...structuredClone(params),
			...caller ? {
				agentId: caller.agentId,
				sessionKey: caller.sessionKey,
				...caller.operationalRunInstance ? { runId: caller.operationalRunInstance.runId } : {}
			} : {},
			timeoutMs: params.timeoutMs ?? 9e5,
			isRequesterActive,
			registerHumanInputWait: authority ? (isPending) => registerActiveEmbeddedRunHumanInputWait(authority, isPending) : void 0,
			onResolved: (event) => {
				signal?.removeEventListener("abort", abort);
				notifyListeners(this.listeners, {
					event: "question.resolved",
					payload: event
				});
			}
		});
		signal?.addEventListener("abort", abort, { once: true });
		notifyListeners(this.listeners, {
			event: "question.requested",
			payload: record
		});
		return {
			id: record.id,
			expiresAtMs: record.expiresAtMs
		};
	}
	async waitAnswer(params, signal) {
		signal?.throwIfAborted();
		if (!validateQuestionWaitAnswerParams(params)) throw invalidRequest("Invalid question.waitAnswer params");
		return await racePromiseWithAbortSignal(this.manager.waitAnswer(params.id, params.timeoutMs, params.includeResolutionId), signal);
	}
	resolve(params) {
		if (!validateQuestionResolveParams(params)) throw invalidRequest("Invalid question.resolve params");
		if ("cancel" in params) return this.manager.cancel(params.id, params.resolvedBy);
		if (params.secretStoreAllowedHosts !== void 0) throw invalidRequest("Secret store allowed hosts require a store-bound question.");
		return this.manager.resolve(params.id, params.answers, params.resolvedBy, { resolutionId: params.resolutionId });
	}
	get(params) {
		if (!validateQuestionGetParams(params)) throw invalidRequest("Invalid question.get params");
		const question = this.manager.get(params.id);
		if (!question) throw new QuestionManagerError(QuestionManagerErrorCodes.NOT_FOUND, `question '${params.id}' was not found`);
		return { question };
	}
	list(params = {}) {
		if (!validateQuestionListParams(params)) throw invalidRequest("Invalid question.list params");
		return { questions: this.manager.list() };
	}
	async call(method, params, extra) {
		extra?.signal?.throwIfAborted();
		try {
			switch (method) {
				case "question.request": return this.request(params, extra?.signal);
				case "question.waitAnswer": return await this.waitAnswer(params, extra?.signal);
				case "question.resolve": return this.resolve(params);
				case "question.get": return this.get(params);
				case "question.list": return this.list(params);
				default: throw invalidRequest(`Unsupported embedded question method: ${method}`);
			}
		} catch (error) {
			if (error instanceof QuestionManagerError) throw new GatewayClientRequestError({
				code: "INVALID_REQUEST",
				message: error.message,
				details: { reason: error.code }
			});
			throw error;
		}
	}
	stop() {
		if (this.stopped) return;
		this.stopped = true;
		this.removeAuthorityListener();
		for (const question of this.manager.list()) this.manager.cancel(question.id, "tui:embedded:stopped");
		this.manager.close();
		this.listeners.clear();
	}
};
function setEmbeddedQuestionBroker(broker) {
	activeBroker = broker;
}
function clearEmbeddedQuestionBroker(broker) {
	if (activeBroker === broker) activeBroker = null;
}
function getEmbeddedQuestionBroker() {
	return activeBroker;
}
//#endregion
export { setEmbeddedQuestionBroker as i, clearEmbeddedQuestionBroker as n, getEmbeddedQuestionBroker as r, EmbeddedQuestionBroker as t };
