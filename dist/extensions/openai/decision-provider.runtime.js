import { d as normalizeResolvedSecretInputString } from "../../types.secrets-Dgbd2kyP.mjs";
import { n as findNormalizedProviderValue } from "../../provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir } from "../../agent-scope-config-fjA2T9Gz.mjs";
import { t as parseRetryAfterHeaderSeconds } from "../../retry-after-CxjQxTZn.mjs";
import { p as readProviderJsonObjectResponse } from "../../provider-http-errors-CjVOxCE5.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "../../provider-request-config-WdycwKIG.mjs";
import { n as buildTimeoutAbortSignal } from "../../fetch-timeout-AfCp6rSy.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "../../proxy-env-5Nd20RhP.mjs";
import { i as fetchWithSsrFGuard, s as withTrustedEnvProxyGuardedFetchMode } from "../../fetch-guard-DRapCKeS.mjs";
import { k as isProviderAuthError } from "../../model-auth-provider-config-C_EL9CxV.mjs";
import { h as resolveProviderHttpRequestConfig } from "../../shared-BMUa_P4s.mjs";
import "../../fetch-runtime-Dg4wMDiG.mjs";
import "../../retry-runtime-CUY_Gz8_.mjs";
import "../../secret-input-CHX7JVid.mjs";
import "../../agent-scope-runtime-Dld1eD8B.mjs";
import "../../ssrf-runtime-z2wN0VZP.mjs";
import "../../extension-shared-Bp_Ziw8S.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CMRSW7VK.mjs";
import "../../provider-http-BuV15s4V.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { c as resolveOpenAIDefaultBaseUrl, i as classifyOpenAIBaseUrl, t as OPENAI_API_BASE_URL } from "../../base-url-Baro1bPi.mjs";
//#region extensions/openai/decision-provider.runtime.ts
function text(value) {
	return typeof value === "string" ? value : value === void 0 ? "" : JSON.stringify(value);
}
function questions(batch) {
	return Object.entries(batch.questions).map(([name, question]) => {
		const instructions = text(question.instructions);
		if (question.type === "boolean") return {
			type: "predicate",
			name,
			instructions: question.criteria ? `${instructions}\nTrue criterion: ${text(question.criteria.true)}\nFalse criterion: ${text(question.criteria.false)}` : instructions
		};
		if (question.type === "choice") return {
			type: "choice",
			name,
			instructions,
			choices: Object.entries(question.criteria).map(([value, description]) => ({
				value,
				description: text(description)
			}))
		};
		return {
			type: "score",
			name,
			instructions,
			levels: question.criteria.map((description, index) => ({
				label: String(index),
				description: text(description)
			}))
		};
	});
}
function record(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function probability(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}
function parseResult(batch, payload) {
	const entries = Object.entries(batch.questions);
	if (typeof payload.model !== "string" || !payload.model || payload.model.length > 256 || !Array.isArray(payload.answers) || payload.answers.length !== entries.length) return {
		status: "unavailable",
		reason: "invalid-response"
	};
	const answers = [];
	for (const [index, [name, question]] of entries.entries()) {
		const answer = payload.answers[index];
		if (!record(answer) || answer.name !== name) return {
			status: "unavailable",
			reason: "invalid-response"
		};
		if (answer.type === "refusal") return {
			status: "unavailable",
			reason: "unsupported-input"
		};
		if (question.type === "boolean") {
			if (answer.type !== "predicate" || !probability(answer.probability)) return {
				status: "unavailable",
				reason: "invalid-response"
			};
			answers.push([name, {
				type: "boolean",
				probabilityTrue: answer.probability
			}]);
			continue;
		}
		if (answer.type !== question.type || !Array.isArray(answer.probabilities) || typeof answer.confidence !== "number" || !Number.isFinite(answer.confidence)) return {
			status: "unavailable",
			reason: "invalid-response"
		};
		const labels = question.type === "choice" ? Object.keys(question.criteria) : question.criteria.map((_, i) => String(i));
		const distribution = /* @__PURE__ */ new Map();
		for (const item of answer.probabilities) {
			const label = record(item) ? item[question.type === "choice" ? "value" : "label"] : void 0;
			if (!record(item) || typeof label !== "string" || !labels.includes(label) || distribution.has(label) || !probability(item.probability) || question.type === "score" && item.value !== Number(label)) return {
				status: "unavailable",
				reason: "invalid-response"
			};
			distribution.set(label, item.probability);
		}
		if (distribution.size !== labels.length || ![...distribution.values()].some((value) => value > 0)) return {
			status: "unavailable",
			reason: "invalid-response"
		};
		if (question.type === "choice") {
			if (typeof answer.choice !== "string" || !distribution.has(answer.choice)) return {
				status: "unavailable",
				reason: "invalid-response"
			};
			answers.push([name, {
				type: "choice",
				choice: answer.choice,
				confidence: answer.confidence,
				probabilities: Object.fromEntries(distribution)
			}]);
		} else {
			if (typeof answer.score !== "number" || !Number.isFinite(answer.score) || answer.score < 0 || answer.score > labels.length - 1) return {
				status: "unavailable",
				reason: "invalid-response"
			};
			answers.push([name, {
				type: "score",
				score: answer.score,
				confidence: answer.confidence,
				probabilities: labels.map((label) => distribution.get(label))
			}]);
		}
	}
	const usage = payload.usage;
	if (!record(usage) || typeof usage.input_tokens !== "number" || !Number.isInteger(usage.input_tokens) || usage.input_tokens < 0 || typeof usage.output_tokens !== "number" || !Number.isInteger(usage.output_tokens) || usage.output_tokens < 0) return {
		status: "unavailable",
		reason: "invalid-response"
	};
	return {
		status: "ok",
		result: {
			model: payload.model,
			answers: Object.fromEntries(answers),
			usage: {
				inputTokens: usage.input_tokens,
				outputTokens: usage.output_tokens
			}
		}
	};
}
async function evaluateOpenAIDecision(batch, context, config) {
	context.signal.throwIfAborted();
	const providerConfig = findNormalizedProviderValue(config.models?.providers, "openai");
	const configuredBaseUrl = providerConfig?.baseUrl ?? resolveOpenAIDefaultBaseUrl();
	const endpointKind = classifyOpenAIBaseUrl(configuredBaseUrl);
	if (endpointKind === "chatgpt" || endpointKind === "invalid") return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	let auth;
	try {
		auth = await resolveApiKeyForProvider({
			provider: "openai",
			cfg: config,
			modelId: context.model,
			modelApi: "openai-responses",
			modelBaseUrl: configuredBaseUrl,
			capability: "decision",
			...context.agentId ? { agentDir: resolveAgentDir(config, context.agentId) } : {},
			signal: context.signal
		});
	} catch (error) {
		context.signal.throwIfAborted();
		return {
			status: "unavailable",
			reason: isProviderAuthError(error, "missing-provider-auth") || isProviderAuthError(error, "missing-api-key") ? "credentials-unavailable" : "authentication"
		};
	}
	context.signal.throwIfAborted();
	if (auth.mode !== "api-key" || !auth.apiKey) return {
		status: "unavailable",
		reason: "credentials-unavailable"
	};
	const timeoutMs = context.deadlineMonotonicMs - performance.now();
	if (timeoutMs <= 0) return {
		status: "unavailable",
		reason: "transport"
	};
	const { signal: timeoutSignal, cleanup } = buildTimeoutAbortSignal({
		signal: context.signal,
		timeoutMs,
		operation: "OpenAI decision"
	});
	const signal = timeoutSignal ?? context.signal;
	const assertActive = () => {
		signal.throwIfAborted();
		if (performance.now() >= context.deadlineMonotonicMs || context.isAdmissible && !context.isAdmissible()) throw new Error("OpenAI decision is no longer admitted.");
	};
	try {
		const configuredHeaders = {};
		try {
			for (const [name, value] of Object.entries(providerConfig?.headers ?? {})) {
				const resolved = normalizeResolvedSecretInputString({
					value,
					path: `models.providers.openai.headers.${name}`,
					defaults: config.secrets?.defaults
				});
				if (resolved !== void 0) configuredHeaders[name] = resolved;
			}
		} catch {
			return {
				status: "unavailable",
				reason: "credentials-unavailable"
			};
		}
		const { baseUrl, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
			baseUrl: endpointKind === "platform" ? OPENAI_API_BASE_URL : configuredBaseUrl,
			defaultBaseUrl: OPENAI_API_BASE_URL,
			defaultHeaders: {
				Authorization: `Bearer ${auth.apiKey}`,
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			headers: configuredHeaders,
			request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
			provider: "openai",
			capability: "other",
			transport: "http"
		});
		const url = `${baseUrl.replace(/\/$/, "")}/decisions`;
		const request = {
			url,
			signal,
			beforeRequest: assertActive,
			maxRedirects: 0,
			dispatcherPolicy,
			init: {
				method: "POST",
				headers,
				body: JSON.stringify({
					model: context.model,
					input: text(batch.state),
					questions: questions(batch)
				})
			}
		};
		const { response, release } = await fetchWithSsrFGuard(!dispatcherPolicy && shouldUseEnvHttpProxyForUrl(url) ? withTrustedEnvProxyGuardedFetchMode(request) : request);
		try {
			if (!response.ok) {
				await response.body?.cancel();
				if (response.status === 401 || response.status === 403) return {
					status: "unavailable",
					reason: "authentication"
				};
				if (response.status === 429) {
					const seconds = parseRetryAfterHeaderSeconds(response.headers.get("retry-after"));
					return {
						status: "unavailable",
						reason: "rate-limited",
						...seconds === void 0 ? {} : { retryAfterMs: seconds * 1e3 }
					};
				}
				return {
					status: "unavailable",
					reason: [
						400,
						413,
						422
					].includes(response.status) ? "unsupported-input" : "transport"
				};
			}
			let payload;
			try {
				payload = await readProviderJsonObjectResponse(response, "OpenAI decision", {
					maxBytes: 1048576,
					signal,
					requestHeaders: headers
				});
			} catch {
				signal.throwIfAborted();
				return {
					status: "unavailable",
					reason: "invalid-response"
				};
			}
			assertActive();
			if (JSON.stringify(payload).includes(auth.apiKey)) return {
				status: "unavailable",
				reason: "invalid-response"
			};
			return parseResult(batch, payload);
		} finally {
			await release();
		}
	} catch {
		context.signal.throwIfAborted();
		return {
			status: "unavailable",
			reason: "transport"
		};
	} finally {
		cleanup();
	}
}
//#endregion
export { evaluateOpenAIDecision };
