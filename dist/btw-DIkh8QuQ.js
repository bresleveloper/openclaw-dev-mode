import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { v as resolveSessionAgentId } from "./agent-scope-B2Pk_xhT.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-C2C4lJH6.js";
import { s as scanSessionTranscriptTree } from "./transcript-tree-3cM1TqAJ.js";
import { b as prepareProviderRuntimeAuth } from "./provider-runtime-CIKTXkgy.js";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-9jfx-1KO.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DNsOe2me.js";
import { r as ensureOpenClawModelsJson } from "./models-config-BVlG3rPj.js";
import { o as requireApiKey } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { a as stripToolResultDetails } from "./session-transcript-repair-BUFGXxrq.js";
import { i as streamSimple } from "./stream-rJVXLNrX.js";
import { i as protectPreparedProviderRuntimeAuth, s as unwrapSecretSentinelsForProviderEgress } from "./provider-local-service-0EmHG4yK.js";
import { c as parseSessionEntries, n as buildSessionContext, s as migrateSessionEntries } from "./session-manager-BKz2VYho.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import { n as sanitizeImageBlocks } from "./tool-images-Rr7Njheg.js";
import { o as getApiKeyForModel, r as applySecretRefHeaderSentinels } from "./model-auth-Cg-0So6j.js";
import { N as streamWithPayloadPatch } from "./provider-stream-shared-Dfb8yWNf.js";
import { n as resolveAgentTimeoutMs } from "./timeout-0Cw4kcol.js";
import "./diagnostic-DIVExDuf.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-CWfzp2UL.js";
import { o as getActiveEmbeddedRunSnapshot } from "./runs-CGcPGyzc.js";
import "./sessions-BIAJdhW6.js";
import { a as resolveCliRuntimeExecutionProvider, r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-B1-PRucg.js";
import { n as discoverModels, t as discoverAuthStorage } from "./agent-model-discovery-B8Sf1SDS.js";
import { r as resolveModelWithRegistry } from "./model-D8T34PHV.js";
import { i as resolvePluginHarnessPolicyToolsAllow, o as selectAgentHarness, r as resolveAvailableAgentHarnessPolicy } from "./selection-Bh0GAnPQ.js";
import { g as resolveEmbeddedAgentStreamFn } from "./attempt.model-diagnostic-events-Bj_3khAz.js";
import { t as registerProviderStreamForModel } from "./provider-stream-DeG5lLFa.js";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-C6r0hPGr.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-B7s-CsKk.js";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-Dw1V3X0j.js";
import { n as resolveSessionAuthProfileOverride } from "./session-override-BXceaoW0.js";
import { t as executePreparedCliRun } from "./execute.runtime-C0ywadR6.js";
import { t as prepareCliRunContext } from "./prepare.runtime-WLX8kmVY.js";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/agents/btw-transcript.ts
/**
* Reads prior session transcript context for `/btw` side-question handoffs.
*/
/** Resolves the persisted transcript file for a BTW session handoff. */
function resolveBtwSessionTranscriptPath(params) {
	try {
		const agentId = params.sessionKey?.split(":")[1];
		const pathOpts = resolveSessionFilePathOptions({
			agentId,
			storePath: params.storePath
		});
		return resolveSessionFilePath(params.sessionId, params.sessionEntry, pathOpts);
	} catch (error) {
		diagnosticLogger.debug(`resolveSessionTranscriptPath failed: sessionId=${params.sessionId} err=${String(error)}`);
		return;
	}
}
function readSessionEntryId(entry) {
	const id = entry.id;
	return typeof id === "string" && id.trim().length > 0 ? id : void 0;
}
function buildSessionBranchEntries(tree, leafId) {
	if (leafId === null) return [];
	if (!leafId) return;
	const branch = [];
	const seen = /* @__PURE__ */ new Set();
	let currentId = leafId;
	while (currentId) {
		if (seen.has(currentId)) return;
		seen.add(currentId);
		const node = tree.byId.get(currentId);
		if (!node) return;
		if (node.entry.type !== "leaf") branch.push(node.entry.parentId === node.parentId ? node.entry : {
			...node.entry,
			parentId: node.parentId
		});
		currentId = node.parentId ?? void 0;
	}
	return branch.toReversed();
}
function isTrailingUserMessage(entry) {
	return entry?.type === "message" && entry.message?.role === "user";
}
/**
* Reads prior messages for BTW continuation.
*
* When a transcript has fork links, this returns the selected snapshot branch
* instead of the full file so a resumed agent does not inherit sibling-branch
* messages.
*/
async function readBtwTranscriptMessages(params) {
	try {
		const entries = parseSessionEntries(await readFile(params.sessionFile, "utf-8"));
		migrateSessionEntries(entries);
		const sessionEntries = entries.filter((entry) => entry.type !== "session");
		const tree = scanSessionTranscriptTree(sessionEntries);
		if (!tree.hasLeafUpdate) return buildSessionContext(sessionEntries).messages;
		const hasSnapshotLeaf = params.snapshotLeafId !== void 0;
		let branchEntries = hasSnapshotLeaf ? buildSessionBranchEntries(tree, params.snapshotLeafId) : void 0;
		if (hasSnapshotLeaf && branchEntries === void 0) diagnosticLogger.debug(`btw snapshot leaf unavailable: sessionId=${params.sessionId} leaf=${params.snapshotLeafId}`);
		branchEntries ??= buildSessionBranchEntries(tree, tree.leafId);
		if (!hasSnapshotLeaf && isTrailingUserMessage(branchEntries?.at(-1))) {
			const trailingId = readSessionEntryId(branchEntries.at(-1));
			const parentId = trailingId ? tree.byId.get(trailingId)?.parentId : null;
			branchEntries = parentId ? buildSessionBranchEntries(tree, parentId) ?? [] : [];
		}
		const sessionContext = buildSessionContext(branchEntries ?? sessionEntries);
		return Array.isArray(sessionContext.messages) ? sessionContext.messages : [];
	} catch {
		return [];
	}
}
//#endregion
//#region src/agents/btw.ts
/**
* Runs `/btw` side questions against the active conversation without resuming
* or continuing the main task.
*/
function collectTextContent(content) {
	return content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function collectThinkingContent(content) {
	return content.filter((part) => part.type === "thinking").map((part) => part.thinking).join("");
}
function buildBtwSystemPrompt() {
	return [
		"You are answering an ephemeral /btw side question about the current conversation.",
		"Use the conversation only as background context.",
		"Answer only the side question in the last user message.",
		"Do not continue, resume, or complete any unfinished task from the conversation.",
		"Do not emit tool calls, pseudo-tool calls, shell commands, file writes, patches, or code unless the side question explicitly asks for them.",
		"Do not say you will continue the main task after answering.",
		"If the question can be answered briefly, answer briefly."
	].join("\n");
}
function resolveReturnedAuthProfileSource(sessionEntry, authProfileId) {
	if (!authProfileId?.trim()) return;
	return sessionEntry?.authProfileOverrideSource ?? (typeof sessionEntry?.authProfileOverrideCompactionCount === "number" ? "auto" : "user");
}
function buildBtwQuestionPrompt(question, inFlightPrompt) {
	const lines = ["Answer this side question only.", "Ignore any unfinished task in the conversation while answering it."];
	const trimmedPrompt = inFlightPrompt?.trim();
	if (trimmedPrompt) lines.push("", "Current in-flight main task request for background context only:", "<in_flight_main_task>", trimmedPrompt, "</in_flight_main_task>", "Do not continue or complete that task while answering the side question.");
	lines.push("", "<btw_side_question>", question.trim(), "</btw_side_question>");
	return lines.join("\n");
}
function collectBtwMessageText(content) {
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => {
		if (part.type === "text") return part.text;
		if (part.type === "image") return "[Image content omitted from CLI side-question context.]";
		return [];
	}).join("\n").trim();
}
function buildBtwCliPrompt(params) {
	const lines = [
		"Use this sanitized conversation history as background context only.",
		"Do not continue, resume, or complete any unfinished task from the conversation.",
		"",
		"<conversation_history>"
	];
	for (const message of params.messages) {
		const text = collectBtwMessageText(message.content);
		if (!text) continue;
		lines.push(`${message.role === "assistant" ? "Assistant" : "User"}:`, text, "");
	}
	lines.push("</conversation_history>", "");
	lines.push(buildBtwQuestionPrompt(params.question, params.inFlightPrompt));
	return lines.join("\n");
}
function normalizeBtwContentBlocks(content) {
	if (Array.isArray(content)) return content;
	if (content && typeof content === "object") return [content];
}
function isBtwTextBlock(block) {
	if (!block || typeof block !== "object") return false;
	const record = block;
	return normalizeLowercaseStringOrEmpty(record.type) === "text" && typeof record.text === "string";
}
function isBtwImageBlock(block) {
	if (!block || typeof block !== "object") return false;
	const record = block;
	return normalizeLowercaseStringOrEmpty(record.type) === "image" && typeof record.data === "string" && typeof record.mimeType === "string";
}
async function sanitizeBtwUserMessage(params) {
	if (typeof params.message.content === "string") return params.message;
	const blocks = normalizeBtwContentBlocks(params.message.content);
	if (!blocks) return;
	const content = [];
	for (const block of blocks) {
		if (isBtwTextBlock(block)) {
			content.push({
				type: "text",
				text: block.text
			});
			continue;
		}
		if (!isBtwImageBlock(block)) continue;
		const { images } = await sanitizeImageBlocks([block], "btw:context", params.imageLimits);
		const image = images[0];
		if (image) content.push(image);
	}
	if (content.length === 0) return;
	return {
		...params.message,
		content
	};
}
function sanitizeBtwAssistantMessage(message) {
	const rawContent = message.content;
	if (typeof rawContent === "string") {
		const trimmed = rawContent.trim();
		return trimmed.length > 0 ? {
			...message,
			content: [{
				type: "text",
				text: trimmed
			}]
		} : void 0;
	}
	const blocks = normalizeBtwContentBlocks(rawContent);
	if (!blocks) return;
	const content = blocks.flatMap((block) => isBtwTextBlock(block) ? [{
		type: "text",
		text: block.text
	}] : []);
	if (content.length === 0) return;
	return {
		...message,
		content
	};
}
async function toSimpleContextMessages(params) {
	const contextMessages = [];
	for (const message of params.messages) {
		if (!message || typeof message !== "object") continue;
		const role = message.role;
		if (role === "user") {
			const sanitizedMessage = await sanitizeBtwUserMessage({
				message,
				imageLimits: params.imageLimits
			});
			if (sanitizedMessage) contextMessages.push(sanitizedMessage);
			continue;
		}
		if (role !== "assistant") continue;
		const sanitizedMessage = sanitizeBtwAssistantMessage(message);
		if (sanitizedMessage) contextMessages.push(sanitizedMessage);
	}
	return stripToolResultDetails(contextMessages);
}
async function resolveRuntimeModel(params) {
	const modelsOptions = params.workspaceDir ? { workspaceDir: params.workspaceDir } : void 0;
	await ensureOpenClawModelsJson(params.cfg, params.agentDir, modelsOptions);
	const modelRegistry = discoverModels(discoverAuthStorage(params.agentDir), params.agentDir, modelsOptions);
	const model = resolveModelWithRegistry({
		provider: params.provider,
		modelId: params.model,
		modelRegistry,
		cfg: params.cfg
	});
	if (!model) throw new Error(`Unknown model: ${params.provider}/${params.model}`);
	const runtimeProvider = model.provider;
	const runtimeModelId = model.id;
	const authProfileId = await resolveSessionAuthProfileOverride({
		cfg: params.cfg,
		provider: runtimeProvider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: runtimeProvider,
			harnessRuntime: resolveAvailableAgentHarnessPolicy({
				provider: runtimeProvider,
				modelId: runtimeModelId,
				config: params.cfg,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			}).runtime,
			config: params.cfg
		}),
		agentDir: params.agentDir,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		isNewSession: params.isNewSession
	});
	return {
		model,
		authProfileId,
		authProfileIdSource: resolveReturnedAuthProfileSource(params.sessionEntry, authProfileId)
	};
}
async function runCliBtwSideQuestion(params) {
	const timeoutMs = resolveAgentTimeoutMs({
		cfg: params.cfg,
		overrideSeconds: params.opts?.timeoutOverrideSeconds
	});
	const prepared = await prepareCliRunContext({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		agentId: params.sessionAgentId,
		trigger: "user",
		sessionFile: params.sessionFile,
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		prompt: buildBtwCliPrompt({
			messages: params.messages,
			question: params.question,
			inFlightPrompt: params.inFlightPrompt
		}),
		extraSystemPrompt: buildBtwSystemPrompt(),
		executionMode: "side-question",
		provider: params.cliProvider,
		model: params.model,
		thinkLevel: params.resolvedThinkLevel,
		disableTools: true,
		timeoutMs,
		runTimeoutOverrideMs: timeoutMs,
		runId: params.opts?.runId ?? `btw-${randomUUID()}`,
		authProfileId: params.authProfileId,
		abortSignal: params.opts?.abortSignal,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId
	});
	try {
		const text = (await executePreparedCliRun(prepared)).text.trim();
		if (!text) throw new Error(`/btw side question via ${params.cliProvider} produced no answer.`);
		return { text };
	} finally {
		await prepared.preparedBackend.cleanup?.();
	}
}
/** Answers a side question using sanitized session context and no tool execution. */
async function runBtwSideQuestion(params) {
	const sessionId = params.sessionEntry.sessionId?.trim();
	if (!sessionId) throw new Error("No active session context.");
	const sessionFile = resolveBtwSessionTranscriptPath({
		sessionId,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	if (!sessionFile) throw new Error("No active session transcript.");
	const sessionAgentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, sessionAgentId);
	const preparedHarnesses = /* @__PURE__ */ new Map();
	const prepareHarness = async (provider, modelId) => {
		const key = `${provider}/${modelId}`;
		const cached = preparedHarnesses.get(key);
		if (cached) return cached;
		await ensureSelectedAgentHarnessPlugin({
			provider,
			modelId,
			config: params.cfg,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			workspaceDir
		});
		const harness = selectAgentHarness({
			provider,
			modelId,
			config: params.cfg,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey
		});
		preparedHarnesses.set(key, harness);
		return harness;
	};
	const harness = await prepareHarness(params.provider, params.model);
	let runtimeSelection;
	const resolveRuntimeSelection = async () => {
		if (!runtimeSelection) runtimeSelection = await resolveRuntimeModel({
			cfg: params.cfg,
			provider: params.provider,
			model: params.model,
			agentId: sessionAgentId,
			agentDir: params.agentDir,
			workspaceDir,
			sessionEntry: params.sessionEntry,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			isNewSession: params.isNewSession
		});
		return runtimeSelection;
	};
	const runHarnessSideQuestion = async (selectedHarness, runtime) => {
		if (!selectedHarness.runSideQuestion) throw new Error(`Selected agent harness "${selectedHarness.id}" does not support /btw side questions.`);
		const toolsAllow = resolvePluginHarnessPolicyToolsAllow({
			config: params.cfg,
			sessionKey: params.sessionKey,
			sandboxSessionKey: params.sandboxSessionKey,
			agentId: sessionAgentId,
			provider: runtime.model.provider,
			modelId: runtime.model.id,
			messageProvider: params.messageProvider,
			messageChannel: params.messageChannel,
			spawnedBy: params.spawnedBy,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			agentAccountId: params.agentAccountId,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		});
		return { text: (await selectedHarness.runSideQuestion({
			...params,
			provider: runtime.model.provider,
			model: runtime.model.id,
			runtimeModel: runtime.model,
			sessionId,
			sessionFile,
			agentId: sessionAgentId,
			workspaceDir,
			...toolsAllow ? { toolsAllow } : {},
			authProfileId: runtime.authProfileId,
			authProfileIdSource: runtime.authProfileIdSource
		})).text };
	};
	if (harness.runSideQuestion) return runHarnessSideQuestion(harness, await resolveRuntimeSelection());
	if (harness.id === "codex") throw new Error(`Selected agent harness "${harness.id}" does not support /btw side questions.`);
	const activeRunSnapshot = getActiveEmbeddedRunSnapshot(sessionId);
	const imageLimits = resolveImageSanitizationLimits(params.cfg);
	let messages = [];
	let inFlightPrompt;
	if (Array.isArray(activeRunSnapshot?.messages) && activeRunSnapshot.messages.length > 0) {
		messages = await toSimpleContextMessages({
			messages: activeRunSnapshot.messages,
			imageLimits
		});
		inFlightPrompt = activeRunSnapshot.inFlightPrompt;
	} else if (activeRunSnapshot) inFlightPrompt = activeRunSnapshot.inFlightPrompt;
	if (messages.length === 0) messages = await toSimpleContextMessages({
		messages: await readBtwTranscriptMessages({
			sessionFile,
			sessionId,
			snapshotLeafId: activeRunSnapshot?.transcriptLeafId
		}),
		imageLimits
	});
	if (messages.length === 0 && !inFlightPrompt?.trim()) throw new Error("No active session context.");
	const fallbackRuntime = resolveAvailableAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.cfg,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey
	}).runtime.trim();
	const sessionAuthProfileId = params.sessionEntry.authProfileOverride?.trim() || void 0;
	const sessionAuthProfileSource = resolveReturnedAuthProfileSource(params.sessionEntry, sessionAuthProfileId);
	const cliProviderFromSessionAuth = sessionAuthProfileId ? resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: sessionAgentId,
		modelId: params.model,
		authProfileId: sessionAuthProfileId
	})?.trim() : void 0;
	const cliProviderFromAuthOrder = !sessionAuthProfileId || sessionAuthProfileSource === "auto" ? resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: sessionAgentId,
		modelId: params.model
	})?.trim() : void 0;
	const cliProvider = cliProviderFromSessionAuth ?? cliProviderFromAuthOrder ?? (isCliRuntimeAliasForProvider({
		runtime: fallbackRuntime,
		provider: params.provider,
		cfg: params.cfg
	}) ? fallbackRuntime : void 0);
	if (cliProvider) return runCliBtwSideQuestion({
		cfg: params.cfg,
		model: params.model,
		question: params.question,
		sessionId,
		sessionFile,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		sessionAgentId,
		workspaceDir,
		cliProvider,
		authProfileId: cliProviderFromSessionAuth ? sessionAuthProfileId : void 0,
		resolvedThinkLevel: params.resolvedThinkLevel,
		messages,
		inFlightPrompt,
		opts: params.opts,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId
	});
	const runtimeSelectionForHarness = await resolveRuntimeSelection();
	const runtimeHarness = await prepareHarness(runtimeSelectionForHarness.model.provider, runtimeSelectionForHarness.model.id);
	if (runtimeHarness.runSideQuestion) return runHarnessSideQuestion(runtimeHarness, runtimeSelectionForHarness);
	if (runtimeHarness.id === "codex") throw new Error(`Selected agent harness "${runtimeHarness.id}" does not support /btw side questions.`);
	const { model, authProfileId, authProfileIdSource } = runtimeSelectionForHarness;
	let externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
		provider: model.provider,
		cfg: params.cfg,
		agentId: sessionAgentId,
		modelId: model.id,
		workspaceDir,
		userLockedAuthProfileId: authProfileIdSource === "user" ? authProfileId : void 0
	});
	if (!externalCliAuthScope.providerIds) {
		const noExternalAuthStore = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
		externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
			provider: model.provider,
			cfg: params.cfg,
			agentId: sessionAgentId,
			modelId: model.id,
			workspaceDir,
			store: noExternalAuthStore,
			userLockedAuthProfileId: authProfileIdSource === "user" ? authProfileId : void 0
		});
	}
	const authStore = externalCliAuthScope.providerIds ? ensureAuthProfileStore(params.agentDir, {
		externalCliProviderIds: externalCliAuthScope.providerIds,
		allowKeychainPrompt: false
	}) : void 0;
	const effectiveAuthProfileId = externalCliAuthScope.ignoreAutoPreferredProfile && authProfileIdSource !== "user" ? void 0 : authProfileId;
	const apiKeyInfo = await getApiKeyForModel({
		model,
		cfg: params.cfg,
		profileId: effectiveAuthProfileId,
		...authStore ? { store: authStore } : {},
		agentDir: params.agentDir,
		secretSentinels: true
	});
	const resolvedAuthProfileId = apiKeyInfo.profileId ?? effectiveAuthProfileId;
	let runtimeModel = model;
	let apiKey = apiKeyInfo.mode === "aws-sdk" && !apiKeyInfo.apiKey ? void 0 : requireApiKey(apiKeyInfo, model.provider);
	if (apiKey) {
		const preparedAuth = protectPreparedProviderRuntimeAuth({
			sourceApiKey: apiKey,
			provider: model.provider,
			preparedAuth: await prepareProviderRuntimeAuth({
				provider: model.provider,
				config: params.cfg,
				workspaceDir,
				env: process.env,
				context: {
					config: params.cfg,
					agentDir: params.agentDir,
					workspaceDir,
					env: process.env,
					provider: model.provider,
					modelId: model.id,
					model,
					apiKey: unwrapSecretSentinelsForProviderEgress(apiKey, "provider runtime auth exchange"),
					authMode: apiKeyInfo.mode,
					profileId: resolvedAuthProfileId
				}
			})
		});
		runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
		if (preparedAuth?.apiKey) apiKey = preparedAuth.apiKey;
	}
	runtimeModel = applySecretRefHeaderSentinels(runtimeModel, params.cfg);
	const streamFn = resolveEmbeddedAgentStreamFn({
		currentStreamFn: streamSimple,
		providerStreamFn: registerProviderStreamForModel({
			model: runtimeModel,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			env: process.env
		}),
		sessionId,
		signal: params.opts?.abortSignal,
		model: runtimeModel,
		resolvedApiKey: apiKey,
		authProfileId: resolvedAuthProfileId
	});
	const chunker = params.opts?.onBlockReply && params.blockReplyChunking ? new EmbeddedBlockChunker(params.blockReplyChunking) : void 0;
	let emittedBlocks = 0;
	let blockEmitChain = Promise.resolve();
	let answerText = "";
	let reasoningText = "";
	let assistantStarted = false;
	let sawTextEvent = false;
	const emitBlockChunk = async (text) => {
		if (!text.trim() || !params.opts?.onBlockReply) return;
		emittedBlocks += 1;
		blockEmitChain = blockEmitChain.then(async () => {
			await params.opts?.onBlockReply?.({
				text,
				btw: { question: params.question }
			});
		});
		await blockEmitChain;
	};
	const stream = await streamWithPayloadPatch(streamFn, runtimeModel, {
		systemPrompt: buildBtwSystemPrompt(),
		messages: [...messages, {
			role: "user",
			content: [{
				type: "text",
				text: buildBtwQuestionPrompt(params.question, inFlightPrompt)
			}],
			timestamp: Date.now()
		}]
	}, {
		apiKey,
		reasoning: void 0,
		signal: params.opts?.abortSignal
	}, (payloadObj) => {
		if (Array.isArray(payloadObj.tools) && payloadObj.tools.length === 0) delete payloadObj.tools;
	});
	let finalEvent;
	for await (const event of stream) {
		finalEvent = event.type === "done" || event.type === "error" ? event : finalEvent;
		if (!assistantStarted && (event.type === "text_start" || event.type === "start")) {
			assistantStarted = true;
			await params.opts?.onAssistantMessageStart?.();
		}
		if (event.type === "text_delta") {
			sawTextEvent = true;
			answerText += event.delta;
			chunker?.append(event.delta);
			if (chunker && params.resolvedBlockStreamingBreak === "text_end") chunker.drain({
				force: false,
				emit: (chunk) => void emitBlockChunk(chunk)
			});
			continue;
		}
		if (event.type === "text_end" && chunker && params.resolvedBlockStreamingBreak === "text_end") {
			chunker.drain({
				force: true,
				emit: (chunk) => void emitBlockChunk(chunk)
			});
			continue;
		}
		if (event.type === "thinking_delta") {
			reasoningText += event.delta;
			if (params.resolvedReasoningLevel !== "off") await params.opts?.onReasoningStream?.({
				text: reasoningText,
				isReasoning: true
			});
			continue;
		}
		if (event.type === "thinking_end" && params.resolvedReasoningLevel !== "off") await params.opts?.onReasoningEnd?.();
	}
	if (chunker && params.resolvedBlockStreamingBreak !== "text_end" && chunker.hasBuffered()) chunker.drain({
		force: true,
		emit: (chunk) => void emitBlockChunk(chunk)
	});
	await blockEmitChain;
	if (finalEvent?.type === "error") {
		const message = collectTextContent(finalEvent.error.content);
		throw new Error(message || finalEvent.error.errorMessage || "BTW failed.");
	}
	const finalMessage = finalEvent?.type === "done" ? finalEvent.message : void 0;
	if (finalMessage) {
		if (!sawTextEvent) answerText = collectTextContent(finalMessage.content);
		if (!reasoningText) collectThinkingContent(finalMessage.content);
	}
	const answer = answerText.trim();
	if (!answer) throw new Error("No BTW response generated.");
	if (emittedBlocks > 0) return;
	return { text: answer };
}
//#endregion
export { runBtwSideQuestion as t };
