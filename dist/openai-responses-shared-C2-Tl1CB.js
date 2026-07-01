import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { l as calculateCost, n as transformMessages, t as sanitizeSurrogates, u as clampThinkingLevel } from "./sanitize-unicode-DcA7E1vi.js";
import { n as parseStreamingJson } from "./json-parse-CydVzlvP.js";
import { n as projectOpenAITools } from "./openai-prompt-cache-Ki7_LdG-.js";
import { a as stripSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { t as headersToRecord } from "./headers-CaXpIDsu.js";
import { c as isResponsesTextContentPartType, i as resolveOpenAIStrictToolSetting, n as normalizeOpenAIStrictToolParameters, r as resolveOpenAIProjectedToolsStrictToolFlag, s as isAzureResponsesTextDeltaEvent, t as findOpenAIStrictToolProjectionDiagnostics, u as resolveResponsesMessageSnapshotCollapse } from "./openai-tool-schema-DbmoOWEn.js";
import { t as shortHash } from "./hash-mbqDyGo7.js";
import { createHash } from "node:crypto";
//#region src/llm/providers/openai-responses-tools.ts
const log = createSubsystemLogger("llm/openai-responses");
const MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 64;
const loggedStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
/** Converts and returns the projection used to reconcile tool choices. */
function convertResponsesToolPayload(tools, options) {
	const projection = projectOpenAITools(tools);
	const strict = resolveResponsesStrictToolFlag(projection, resolveResponsesStrictToolSetting(options), options?.model);
	return {
		projection,
		tools: sortResponsesToolsByName(projection.tools).map((tool) => {
			const result = {
				type: "function",
				name: tool.name,
				description: tool.description,
				parameters: normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, options?.model?.compat)
			};
			if (strict !== void 0) result.strict = strict;
			return result;
		})
	};
}
function resolveResponsesStrictToolSetting(options) {
	if (options?.strict !== void 0) return options.strict;
	if (options?.model) return resolveOpenAIStrictToolSetting(options.model, {
		transport: "stream",
		supportsStrictMode: options.supportsStrictMode
	});
	return false;
}
function resolveResponsesStrictToolFlag(projection, strictSetting, model) {
	const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
	if (strictSetting === true && strict === false && model && log.isEnabled("debug", "any")) {
		const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
		if (shouldLogStrictToolDowngradeDiagnostic(diagnostics, model)) {
			const sample = diagnostics.slice(0, 5).map((entry) => ({
				tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
				violations: entry.violations.slice(0, 8)
			}));
			log.debug(`OpenAI responses tool schema strict mode downgraded to strict=false for ${model.provider ?? "unknown"}/${model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`, {
				provider: model.provider,
				model: model.id,
				incompatibleToolCount: diagnostics.length,
				sample
			});
		}
	}
	return strict;
}
function shouldLogStrictToolDowngradeDiagnostic(diagnostics, model) {
	const key = createHash("sha256").update(JSON.stringify({
		provider: model.provider,
		model: model.id,
		diagnostics: diagnostics.map((entry) => ({
			toolIndex: entry.toolIndex,
			toolName: entry.toolName ?? null,
			violations: entry.violations
		}))
	})).digest("hex");
	if (loggedStrictToolDowngradeDiagnosticKeys.has(key)) return false;
	if (loggedStrictToolDowngradeDiagnosticKeys.size >= MAX_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) loggedStrictToolDowngradeDiagnosticKeys.clear();
	loggedStrictToolDowngradeDiagnosticKeys.add(key);
	return true;
}
function compareToolText(left, right) {
	const leftText = left ?? "";
	const rightText = right ?? "";
	if (leftText < rightText) return -1;
	if (leftText > rightText) return 1;
	return 0;
}
function sortResponsesToolsByName(tools) {
	return tools.toSorted((left, right) => compareToolText(left.name, right.name) || compareToolText(left.description, right.description));
}
//#endregion
//#region src/llm/providers/openai-responses-shared.ts
function normalizeResponsesReasoningReplayItem(params) {
	const next = { ...params.item };
	if (!Array.isArray(next.summary)) next.summary = [];
	if (!params.replayResponsesItemIds) delete next.id;
	return next;
}
function encodeTextSignatureV1(id, phase) {
	const payload = {
		v: 1,
		id
	};
	if (phase) payload.phase = phase;
	return JSON.stringify(payload);
}
function parseTextSignature(signature) {
	if (!signature) return;
	if (signature.startsWith("{")) try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1) {
			const id = typeof parsed.id === "string" ? parsed.id : void 0;
			const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
			if (id !== void 0 || phase !== void 0) return {
				id,
				phase
			};
			return;
		}
	} catch {}
	return { id: signature };
}
function resolveReplayableResponsesMessageId(params) {
	if (!params.textSignatureId) return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
	return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
	const messages = [];
	const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
	const normalizeIdPart = (part) => {
		const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
		return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
	};
	const buildForeignResponsesItemId = (itemId) => {
		const normalized = `fc_${shortHash(itemId)}`;
		return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
	};
	const normalizeToolCallId = (id, targetModel, source) => {
		if (!allowedToolCallProviders.has(model.provider)) return normalizeIdPart(id);
		if (!id.includes("|")) return normalizeIdPart(id);
		const [callId, itemId] = id.split("|");
		const normalizedCallId = normalizeIdPart(callId);
		let normalizedItemId = source.provider !== model.provider || source.api !== model.api ? buildForeignResponsesItemId(itemId) : normalizeIdPart(itemId);
		if (!normalizedItemId.startsWith("fc_")) normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
		return `${normalizedCallId}|${normalizedItemId}`;
	};
	const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
	if ((options?.includeSystemPrompt ?? true) && context.systemPrompt) {
		const role = model.reasoning ? "developer" : "system";
		messages.push({
			type: "message",
			role,
			content: [{
				type: "input_text",
				text: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
			}]
		});
	}
	let msgIndex = 0;
	for (const msg of transformedMessages) {
		if (msg.role === "user") if (typeof msg.content === "string") messages.push({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: sanitizeSurrogates(msg.content)
			}]
		});
		else {
			const content = msg.content.map((item) => {
				if (item.type === "text") return {
					type: "input_text",
					text: sanitizeSurrogates(item.text)
				};
				return {
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				};
			});
			if (content.length === 0) continue;
			messages.push({
				type: "message",
				role: "user",
				content
			});
		}
		else if (msg.role === "assistant") {
			const output = [];
			let textFallbackOrdinal = 0;
			const assistantMsg = msg;
			let previousReplayItemWasReasoning = false;
			const isDifferentModel = assistantMsg.model !== model.id && assistantMsg.provider === model.provider && assistantMsg.api === model.api;
			for (const block of msg.content) if (block.type === "thinking") {
				if (block.thinkingSignature) {
					const reasoningItem = normalizeResponsesReasoningReplayItem({
						item: JSON.parse(block.thinkingSignature),
						replayResponsesItemIds: shouldReplayResponsesItemIds
					});
					output.push(reasoningItem);
					previousReplayItemWasReasoning = true;
				}
			} else if (block.type === "text") {
				const textBlock = block;
				const parsedSignature = parseTextSignature(textBlock.textSignature);
				let msgId = shouldReplayResponsesItemIds ? resolveReplayableResponsesMessageId({
					textSignatureId: parsedSignature?.id,
					fallbackId: `msg_${msgIndex}`,
					fallbackOrdinal: textFallbackOrdinal,
					previousReplayItemWasReasoning
				}) : void 0;
				if (!parsedSignature?.id) textFallbackOrdinal += 1;
				if (msgId && msgId.length > 64) msgId = `msg_${shortHash(msgId)}`;
				const messageItem = {
					type: "message",
					role: "assistant",
					content: [{
						type: "output_text",
						text: sanitizeSurrogates(textBlock.text),
						annotations: []
					}],
					status: "completed",
					...msgId ? { id: msgId } : {},
					phase: parsedSignature?.phase
				};
				output.push(messageItem);
				previousReplayItemWasReasoning = false;
			} else if (block.type === "toolCall") {
				const toolCall = block;
				const [callId, itemIdRaw] = toolCall.id.split("|");
				let itemId = shouldReplayResponsesItemIds ? itemIdRaw : void 0;
				if (shouldReplayResponsesItemIds && isDifferentModel && itemId?.startsWith("fc_")) itemId = void 0;
				output.push({
					type: "function_call",
					...itemId ? { id: itemId } : {},
					call_id: callId,
					name: toolCall.name,
					arguments: JSON.stringify(toolCall.arguments)
				});
				previousReplayItemWasReasoning = false;
			}
			if (output.length === 0) continue;
			messages.push(...output);
		} else if (msg.role === "toolResult") {
			const textResult = msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
			const hasImages = msg.content.some((c) => c.type === "image");
			const hasText = textResult.length > 0;
			const [callId] = msg.toolCallId.split("|");
			let output;
			if (hasImages && model.input.includes("image")) {
				const contentParts = [];
				if (hasText) contentParts.push({
					type: "input_text",
					text: sanitizeSurrogates(textResult)
				});
				for (const block of msg.content) if (block.type === "image") contentParts.push({
					type: "input_image",
					detail: "auto",
					image_url: `data:${block.mimeType};base64,${block.data}`
				});
				output = contentParts;
			} else output = sanitizeSurrogates(hasText ? textResult : "(see attached image)");
			messages.push({
				type: "function_call_output",
				call_id: callId,
				output
			});
		}
		msgIndex++;
	}
	return messages;
}
function createResponsesAssistantOutput(model, api = model.api) {
	return {
		role: "assistant",
		content: [],
		api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function resolveResponsesReasoningEffort(model, reasoning) {
	const clampedReasoning = reasoning ? clampThinkingLevel(model, reasoning) : void 0;
	if (!clampedReasoning || clampedReasoning === "off") return;
	return clampedReasoning === "max" ? "xhigh" : clampedReasoning;
}
function applyCommonResponsesParams(params, model, context, options, config) {
	if (options?.maxTokens) params.max_output_tokens = options.maxTokens;
	if (options?.temperature !== void 0) params.temperature = options.temperature;
	if (context.tools) {
		const converted = convertResponsesToolPayload(context.tools, { model });
		if (converted.tools.length > 0) params.tools = converted.tools;
	}
	if (!model.reasoning) return;
	if (options?.reasoningEffort || options?.reasoningSummary) {
		params.reasoning = {
			effort: options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium",
			summary: options?.reasoningSummary || "auto"
		};
		params.include = ["reasoning.encrypted_content"];
	} else if ((config?.setDefaultReasoningOff ?? true) && model.thinkingLevelMap?.off !== null) params.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
}
function buildResponsesRequestOptions(options) {
	return {
		...options?.signal ? { signal: options.signal } : {},
		...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
		...options?.maxRetries !== void 0 ? { maxRetries: options.maxRetries } : {}
	};
}
function cleanStreamingScratchBuffers(output) {
	for (const block of output.content) {
		delete block.index;
		delete block.partialJson;
	}
}
async function runResponsesStreamLifecycle(params) {
	const { stream, model, output, options } = params;
	try {
		const client = params.createClient();
		let requestParams = params.buildParams();
		const nextParams = await options?.onPayload?.(requestParams, model);
		if (nextParams !== void 0) requestParams = nextParams;
		const { data: openaiStream, response } = await client.responses.create(requestParams, buildResponsesRequestOptions(options)).withResponse();
		await options?.onResponse?.({
			status: response.status,
			headers: headersToRecord(response.headers)
		}, model);
		stream.push({
			type: "start",
			partial: output
		});
		await processResponsesStream(openaiStream, output, stream, model, params.processStreamOptions);
		if (options?.signal?.aborted) throw new Error("Request was aborted");
		if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
		stream.push({
			type: "done",
			reason: output.stopReason,
			message: output
		});
		stream.end();
	} catch (error) {
		cleanStreamingScratchBuffers(output);
		output.stopReason = options?.signal?.aborted ? "aborted" : "error";
		output.errorMessage = params.formatError(error);
		stream.push({
			type: "error",
			reason: output.stopReason,
			error: output
		});
		stream.end();
	}
}
async function processResponsesStream(openaiStream, output, stream, model, options) {
	let currentItem = null;
	let currentBlock = null;
	let lastTextBlock = null;
	let pendingMessageText = null;
	const blocks = output.content;
	const blockIndex = () => blocks.length - 1;
	const appendPendingMessageDelta = (delta) => {
		pendingMessageText = `${pendingMessageText ?? ""}${delta}`;
		const priorText = lastTextBlock?.block.text ?? "";
		if (priorText.startsWith(pendingMessageText) || pendingMessageText.startsWith(priorText)) return;
		currentBlock = {
			type: "text",
			text: pendingMessageText
		};
		blocks.push(currentBlock);
		stream.push({
			type: "text_start",
			contentIndex: blockIndex(),
			partial: output
		});
		stream.push({
			type: "text_delta",
			contentIndex: blockIndex(),
			delta: pendingMessageText,
			partial: output
		});
		pendingMessageText = null;
	};
	for await (const event of openaiStream) if (event.type === "response.created") output.responseId = event.response.id;
	else if (event.type === "response.output_item.added") {
		const item = event.item;
		if (item.type !== "message") {
			lastTextBlock = null;
			pendingMessageText = null;
		}
		if (item.type === "reasoning") {
			currentItem = item;
			currentBlock = {
				type: "thinking",
				thinking: ""
			};
			output.content.push(currentBlock);
			stream.push({
				type: "thinking_start",
				contentIndex: blockIndex(),
				partial: output
			});
		} else if (item.type === "message") {
			currentItem = item;
			if (lastTextBlock) {
				currentBlock = null;
				pendingMessageText = "";
			} else {
				currentBlock = {
					type: "text",
					text: ""
				};
				output.content.push(currentBlock);
				stream.push({
					type: "text_start",
					contentIndex: blockIndex(),
					partial: output
				});
			}
		} else if (item.type === "function_call") {
			currentItem = item;
			currentBlock = {
				type: "toolCall",
				id: `${item.call_id}|${item.id}`,
				name: item.name,
				arguments: {},
				partialJson: item.arguments || ""
			};
			output.content.push(currentBlock);
			stream.push({
				type: "toolcall_start",
				contentIndex: blockIndex(),
				partial: output
			});
		}
	} else if (event.type === "response.reasoning_summary_part.added") {
		if (currentItem && currentItem.type === "reasoning") {
			currentItem.summary = currentItem.summary || [];
			currentItem.summary.push(event.part);
		}
	} else if (event.type === "response.reasoning_summary_text.delta") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentItem.summary = currentItem.summary || [];
			const lastPart = currentItem.summary[currentItem.summary.length - 1];
			if (lastPart) {
				currentBlock.thinking += event.delta;
				lastPart.text += event.delta;
				stream.push({
					type: "thinking_delta",
					contentIndex: blockIndex(),
					delta: event.delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.reasoning_summary_part.done") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentItem.summary = currentItem.summary || [];
			const lastPart = currentItem.summary[currentItem.summary.length - 1];
			if (lastPart) {
				currentBlock.thinking += "\n\n";
				lastPart.text += "\n\n";
				stream.push({
					type: "thinking_delta",
					contentIndex: blockIndex(),
					delta: "\n\n",
					partial: output
				});
			}
		}
	} else if (event.type === "response.reasoning_text.delta") {
		if (currentItem?.type === "reasoning" && currentBlock?.type === "thinking") {
			currentBlock.thinking += event.delta;
			stream.push({
				type: "thinking_delta",
				contentIndex: blockIndex(),
				delta: event.delta,
				partial: output
			});
		}
	} else if (event.type === "response.content_part.added") {
		if (currentItem?.type === "message") {
			currentItem.content = currentItem.content || [];
			if (event.part.type === "output_text" || event.part.type === "text" || event.part.type === "refusal") currentItem.content.push(event.part);
		}
	} else if (event.type === "response.output_text.delta") {
		if (currentItem?.type === "message") {
			if (!currentItem.content || currentItem.content.length === 0) continue;
			const lastPart = currentItem.content[currentItem.content.length - 1];
			if (isResponsesTextContentPartType(lastPart?.type)) {
				lastPart.text += event.delta;
				if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
				else if (currentBlock?.type === "text") {
					currentBlock.text += event.delta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: event.delta,
						partial: output
					});
				}
			}
		}
	} else if (isAzureResponsesTextDeltaEvent(event)) {
		if (currentItem?.type === "message") {
			currentItem.content = currentItem.content || [];
			let lastPart = currentItem.content[currentItem.content.length - 1];
			if (lastPart?.type !== "text") {
				lastPart = {
					type: "text",
					text: ""
				};
				currentItem.content.push(lastPart);
			}
			lastPart.text += event.delta;
			if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
			else if (currentBlock?.type === "text") {
				currentBlock.text += event.delta;
				stream.push({
					type: "text_delta",
					contentIndex: blockIndex(),
					delta: event.delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.refusal.delta") {
		if (currentItem?.type === "message") {
			if (!currentItem.content || currentItem.content.length === 0) continue;
			const lastPart = currentItem.content[currentItem.content.length - 1];
			if (lastPart?.type === "refusal") {
				lastPart.refusal += event.delta;
				if (pendingMessageText !== null) appendPendingMessageDelta(event.delta);
				else if (currentBlock?.type === "text") {
					currentBlock.text += event.delta;
					stream.push({
						type: "text_delta",
						contentIndex: blockIndex(),
						delta: event.delta,
						partial: output
					});
				}
			}
		}
	} else if (event.type === "response.function_call_arguments.delta") {
		if (currentItem?.type === "function_call" && currentBlock?.type === "toolCall") {
			currentBlock.partialJson += event.delta;
			currentBlock.arguments = parseStreamingJson(currentBlock.partialJson);
			stream.push({
				type: "toolcall_delta",
				contentIndex: blockIndex(),
				delta: event.delta,
				partial: output
			});
		}
	} else if (event.type === "response.function_call_arguments.done") {
		if (currentItem?.type === "function_call" && currentBlock?.type === "toolCall") {
			const previousPartialJson = currentBlock.partialJson;
			const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
			if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
				currentBlock.partialJson = doneArguments;
				currentBlock.arguments = parseStreamingJson(currentBlock.partialJson);
			}
			if (doneArguments?.startsWith(previousPartialJson)) {
				const delta = doneArguments.slice(previousPartialJson.length);
				if (delta.length > 0) stream.push({
					type: "toolcall_delta",
					contentIndex: blockIndex(),
					delta,
					partial: output
				});
			}
		}
	} else if (event.type === "response.output_item.done") {
		const item = event.item;
		if (item.type !== "message") {
			lastTextBlock = null;
			pendingMessageText = null;
		}
		if (item.type === "reasoning" && currentBlock?.type === "thinking") {
			const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
			const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
			currentBlock.thinking = summaryText || contentText || currentBlock.thinking;
			currentBlock.thinkingSignature = JSON.stringify(item);
			stream.push({
				type: "thinking_end",
				contentIndex: blockIndex(),
				content: currentBlock.thinking,
				partial: output
			});
			currentBlock = null;
		} else if (item.type === "message" && (currentBlock?.type === "text" || pendingMessageText !== null)) {
			const finalText = item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
			const phase = item.phase ?? void 0;
			const collapse = pendingMessageText !== null ? resolveResponsesMessageSnapshotCollapse({
				prior: lastTextBlock && {
					text: lastTextBlock.block.text,
					phase: lastTextBlock.phase
				},
				nextText: finalText,
				nextPhase: phase
			}) : { kind: "keep" };
			pendingMessageText = null;
			if (collapse.kind === "extend" && lastTextBlock) {
				lastTextBlock.block.text = collapse.text;
				lastTextBlock.block.textSignature = encodeTextSignatureV1(item.id, phase);
				stream.push({
					type: "text_end",
					contentIndex: lastTextBlock.index,
					content: collapse.text,
					partial: output
				});
			} else {
				if (currentBlock?.type !== "text") {
					currentBlock = {
						type: "text",
						text: ""
					};
					blocks.push(currentBlock);
					stream.push({
						type: "text_start",
						contentIndex: blockIndex(),
						partial: output
					});
				}
				currentBlock.text = finalText;
				currentBlock.textSignature = encodeTextSignatureV1(item.id, phase);
				lastTextBlock = {
					block: currentBlock,
					index: blockIndex(),
					phase
				};
				stream.push({
					type: "text_end",
					contentIndex: blockIndex(),
					content: currentBlock.text,
					partial: output
				});
			}
			currentBlock = null;
		} else if (item.type === "function_call") {
			const args = currentBlock?.type === "toolCall" && currentBlock.partialJson ? parseStreamingJson(currentBlock.partialJson) : parseStreamingJson(item.arguments || "{}");
			let toolCall;
			if (currentBlock?.type === "toolCall") {
				currentBlock.arguments = args;
				delete currentBlock.partialJson;
				toolCall = currentBlock;
			} else toolCall = {
				type: "toolCall",
				id: `${item.call_id}|${item.id}`,
				name: item.name,
				arguments: args
			};
			currentBlock = null;
			stream.push({
				type: "toolcall_end",
				contentIndex: blockIndex(),
				toolCall,
				partial: output
			});
		}
	} else if (event.type === "response.completed") {
		const response = event.response;
		if (response?.id) output.responseId = response.id;
		if (response?.usage) {
			const cachedTokens = response.usage.input_tokens_details?.cached_tokens || 0;
			output.usage = {
				input: (response.usage.input_tokens || 0) - cachedTokens,
				output: response.usage.output_tokens || 0,
				cacheRead: cachedTokens,
				cacheWrite: 0,
				totalTokens: response.usage.total_tokens || 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			};
		}
		calculateCost(model, output.usage);
		if (options?.applyServiceTierPricing) {
			const serviceTier = options.resolveServiceTier ? options.resolveServiceTier(response?.service_tier, options.serviceTier) : response?.service_tier ?? options.serviceTier;
			options.applyServiceTierPricing(output.usage, serviceTier);
		}
		output.stopReason = mapStopReason(response?.status);
		if (output.content.some((b) => b.type === "toolCall") && output.stopReason === "stop") output.stopReason = "toolUse";
	} else if (event.type === "error") throw new Error(event.message ? `Error Code ${event.code}: ${event.message}` : "Unknown error");
	else if (event.type === "response.failed") {
		const error = event.response?.error;
		const details = event.response?.incomplete_details;
		const msg = error ? `${error.code || "unknown"}: ${error.message || "no message"}` : details?.reason ? `incomplete: ${details.reason}` : "Unknown error (no error details in response)";
		throw new Error(msg);
	}
}
function mapStopReason(status) {
	if (!status) return "stop";
	switch (status) {
		case "completed": return "stop";
		case "incomplete": return "length";
		case "failed":
		case "cancelled": return "error";
		case "in_progress":
		case "queued": return "stop";
		default: throw new Error(`Unhandled stop reason: ${String(status)}`);
	}
}
//#endregion
export { resolveResponsesReasoningEffort as a, processResponsesStream as i, convertResponsesMessages as n, runResponsesStreamLifecycle as o, createResponsesAssistantOutput as r, convertResponsesToolPayload as s, applyCommonResponsesParams as t };
