import { l as deliverAgentHarnessUserInputPrompt, o as runAgentHarnessGatewayQuestion } from "./gateway-question-ZWAWv7RD.mjs";
import { t as STRUCTURED_INPUT_URL_COMPLETED_LABEL } from "./structured-input-B76WDvka.mjs";
//#region src/agents/harness/structured-input-execution.ts
const QUESTION_BATCH_SIZE = 3;
const STATUS_TEXT_LIMIT = 1024;
const EMPTY_FORM_ALLOW_LABEL = "Allow";
/** Executes one compiled form or URL with shared batching, secret, and fencing semantics. */
async function runStructuredInput(params) {
	if (params.input.kind === "unsupported") {
		await showStatus(params, params.input.message);
		return {
			status: "unsupported",
			message: params.input.message
		};
	}
	if (!isActive(params)) return {
		status: "cancelled",
		message: "Input request is no longer active."
	};
	const { plan } = params.input;
	if (plan.kind === "url") return runConfirmation(params, plan.question, {
		acceptLabel: STRUCTURED_INPUT_URL_COMPLETED_LABEL,
		subject: "URL confirmation",
		intro: params.promptOptions?.urlIntro
	});
	if (plan.fields.length === 0) return runConfirmation(params, {
		id: "confirm",
		header: "Confirm",
		question: plan.intro || "Allow this request?",
		isOther: false,
		isSecret: false,
		options: [{ label: EMPTY_FORM_ALLOW_LABEL }, { label: "Decline" }]
	}, {
		acceptLabel: EMPTY_FORM_ALLOW_LABEL,
		subject: "Form confirmation"
	});
	return runForm(params, plan.intro, plan.fields);
}
async function runConfirmation(params, question, confirmation) {
	const result = await ask(params, [question], 0, confirmation.intro);
	if (!isActive(params)) return {
		status: "cancelled",
		message: `${confirmation.subject} was cancelled before commit.`
	};
	if (result.status !== "answered") return cancelInput(params, result, confirmation.subject);
	return (result.answers.answers[question.id]?.[0])?.toLowerCase() === confirmation.acceptLabel.toLowerCase() ? {
		status: "answered",
		answers: result.answers.answers,
		content: {}
	} : { status: "declined" };
}
async function runForm(params, intro, fields) {
	const answers = {};
	let index = 0;
	let batch = 0;
	while (index < fields.length) {
		if (!isActive(params)) return {
			status: "cancelled",
			message: "Form input was cancelled before completion."
		};
		const secret = fields[index].question.isSecret;
		const subject = secret ? "Secret input" : "Form input";
		const batchFields = [];
		if (secret) batchFields.push(fields[index++]);
		else while (index < fields.length && batchFields.length < QUESTION_BATCH_SIZE && !fields[index]?.question.isSecret) batchFields.push(fields[index++]);
		const result = await ask(params, batchFields.map((entry) => entry.question), batch, intro);
		batch += 1;
		if (!isActive(params)) return {
			status: "cancelled",
			message: `${subject} was cancelled before commit.`
		};
		if (result.status !== "answered") return cancelInput(params, result, subject);
		for (const entry of batchFields) answers[entry.question.id] = result.answers.answers[entry.question.id] ?? [];
	}
	const content = [];
	for (const field of fields) {
		const decoded = field.decode(answers[field.question.id] ?? []);
		if (decoded.kind === "invalid") {
			await showStatus(params, decoded.message);
			return {
				status: "declined",
				message: decoded.message
			};
		}
		if (decoded.kind === "present") content.push(...decoded.entries);
	}
	if (!isActive(params)) return {
		status: "cancelled",
		message: "Form input was cancelled before commit."
	};
	return {
		status: "answered",
		answers,
		content: Object.fromEntries(content)
	};
}
function ask(params, questions, batch, intro) {
	return runAgentHarnessGatewayQuestion({
		questions,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		runId: params.runId,
		timeoutMs: params.timeoutMs,
		gatewayCall: params.gatewayCall,
		delivery: params.delivery,
		promptOptions: {
			...params.promptOptions,
			...intro ? { intro } : {}
		},
		signal: params.signal,
		questionId: params.questionId?.(batch)
	});
}
function isActive(params) {
	return params.signal?.aborted !== true && (params.isActive?.() ?? true);
}
async function cancelInput(params, result, subject) {
	const message = result.status === "expired" ? `${subject} expired.` : `${subject} was cancelled.`;
	await showStatus(params, message);
	return {
		status: "cancelled",
		message
	};
}
async function showStatus(params, message) {
	const question = {
		id: "unsupported",
		header: "Unsupported",
		question: message.slice(0, STATUS_TEXT_LIMIT),
		isOther: false,
		isSecret: false,
		options: null
	};
	try {
		await deliverAgentHarnessUserInputPrompt(params.delivery, [question], {
			...params.promptOptions,
			intro: params.promptOptions?.unsupportedIntro ?? "Input request could not be shown:"
		});
	} catch {}
}
//#endregion
export { runStructuredInput as t };
