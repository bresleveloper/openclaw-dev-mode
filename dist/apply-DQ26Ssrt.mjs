import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { n as resolveConcurrency } from "./resolve-P9fG0vPg.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { o as resolveAttachmentKind } from "./attachments.normalize-Bc-RMc93.mjs";
import { i as selectAttachments } from "./attachments-89SLAze5.mjs";
import { n as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as createMediaAttachmentCache } from "./runner.attachments-rd3GUHfO.mjs";
import { r as runCapability, t as buildProviderRegistry } from "./runner-CmkZKbQO.mjs";
import { n as sendTranscriptEcho } from "./echo-transcript-buuj5Mkr.mjs";
import { a as renderMediaAttachmentDisposition, i as applyAttachmentMarkerBudget, o as resolveFileExtractionLimits, t as extractFileContext } from "./file-context-DOBCPO5g.mjs";
import pMap from "p-map";
//#region packages/media-understanding-common/src/format.ts
const sectionByKind = {
	"audio.transcription": {
		title: "Audio",
		label: "Transcript"
	},
	"image.description": {
		title: "Image",
		label: "Description"
	},
	"video.description": {
		title: "Video",
		label: "Description"
	}
};
/** Formats media-understanding outputs into the chat body sent back to the model. */
function formatMediaUnderstandingBody(params) {
	const outputs = params.outputs.filter((output) => output.text.trim());
	if (outputs.length === 0) return params.body ?? "";
	const userText = params.body?.trim() || void 0;
	const sections = [];
	if (userText && outputs.length > 1) sections.push(`User text:\n${userText}`);
	const counts = /* @__PURE__ */ new Map();
	for (const output of outputs) counts.set(output.kind, (counts.get(output.kind) ?? 0) + 1);
	const seen = /* @__PURE__ */ new Map();
	for (const output of outputs) {
		const count = counts.get(output.kind) ?? 1;
		const next = (seen.get(output.kind) ?? 0) + 1;
		seen.set(output.kind, next);
		const suffix = count > 1 ? ` ${next}/${count}` : "";
		const section = sectionByKind[output.kind];
		const userSection = outputs.length === 1 && userText ? `User text:\n${userText}\n` : "";
		sections.push(`[${section.title}${suffix}]\n${userSection}${section.label}:\n${output.text}`);
	}
	return sections.join("\n\n").trim();
}
/** Formats one or more audio transcript outputs for legacy transcript-only callers. */
function formatAudioTranscripts(outputs) {
	if (outputs.length === 1) {
		const [output] = outputs;
		if (output) return output.text;
		throw new Error("expected single audio transcript to be defined");
	}
	return outputs.map((output, index) => `Audio ${index + 1}:\n${output.text}`).join("\n\n");
}
//#endregion
//#region src/media-understanding/apply-capability.ts
async function runMediaCapability(params) {
	try {
		return await runCapability(params);
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`Media understanding task failed: ${String(err)}`);
		const selection = selectAttachments({
			capability: params.capability,
			attachments: params.media,
			policy: params.config?.attachments
		});
		return {
			outputs: [],
			decision: {
				capability: params.capability,
				outcome: "failed",
				attachments: [],
				attachmentDispositions: Object.fromEntries([...selection.selected.map(({ index }) => [index, { kind: "failed" }]), ...selection.droppedAttachmentIndexes.map((index) => [index, { kind: "not-selected" }])]),
				...params.capability === "image" ? { nativeVisionActive: false } : {}
			}
		};
	}
}
//#endregion
//#region src/media-understanding/apply.ts
const CAPABILITY_ORDER = [
	"image",
	"audio",
	"video"
];
const AUDIO_ONLY_CAPABILITY_ORDER = ["audio"];
const EMPTY_VOICE_NOTE_PLACEHOLDER = "[Voice note could not be transcribed because the audio attachment was too small]";
function appendFileBlocks(body, suffix) {
	if (suffix === void 0) return body ?? "";
	const base = typeof body === "string" ? body.trim() : "";
	if (!base) return suffix;
	return `${base}\n\n${suffix}`.trim();
}
const SELF_SERVE_CONTEXT_FIELDS = [
	"Body",
	"BodyForAgent",
	"agentText"
];
function enableLocalPathSelfServe(upgrades, contexts, stagedPaths) {
	for (const context of contexts) for (const upgrade of upgrades) {
		const stagedPath = stagedPaths?.get(upgrade.attachmentIndex);
		if (stagedPaths && !stagedPath) continue;
		const selfServe = upgrade.render(stagedPath);
		if (!selfServe) continue;
		for (const field of SELF_SERVE_CONTEXT_FIELDS) {
			const value = context[field];
			if (typeof value === "string") context[field] = value.replace(upgrade.fallback, selfServe);
		}
	}
}
function renderMediaAttachmentMarkers(params) {
	const handledIndexes = new Set(params.outputs.map((output) => output.attachmentIndex));
	const decisions = new Map(params.decisions.map((decision) => [decision.capability, decision]));
	return params.attachments.flatMap((attachment) => {
		const capability = resolveAttachmentKind(attachment);
		if (capability !== "image" && capability !== "audio" && capability !== "video") return [];
		if (capability === "image" && params.deliveredImageIndexes?.has(attachment.index)) return [];
		const decision = decisions.get(capability);
		if (!decision || handledIndexes.has(attachment.index)) return [];
		const disposition = decision.attachmentDispositions?.[attachment.index];
		if (capability === "image" && decision.nativeVisionActive !== false && disposition?.kind !== "failed") return [];
		const text = disposition ? renderMediaAttachmentDisposition(capability, disposition) : null;
		return text ? [{
			text,
			consumesMarkerBudget: true
		}] : [];
	});
}
async function applyMediaUnderstanding(params) {
	const { ctx, cfg } = params;
	const originalUserText = [
		ctx.CommandBody,
		ctx.RawBody,
		ctx.Body
	].map((value) => normalizeOptionalString(value)).find(Boolean);
	const attachments = normalizeMediaAttachments(ctx);
	const providerRegistry = buildProviderRegistry(params.providers, cfg);
	const cache = createMediaAttachmentCache(attachments, {
		localPathRoots: resolveMediaAttachmentLocalRoots({
			cfg,
			ctx,
			workspaceDir: params.workspaceDir
		}),
		includeDefaultLocalPathRoots: false,
		ssrfPolicy: cfg.tools?.web?.fetch?.ssrfPolicy,
		workspaceDir: params.workspaceDir
	});
	try {
		const results = await pMap(params.processingMode === "files-only" ? [] : params.processingMode === "audio-only" || params.processingMode === "audio-and-files" ? AUDIO_ONLY_CAPABILITY_ORDER : CAPABILITY_ORDER, async (capability) => await runMediaCapability({
			capability,
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providerRegistry,
			config: cfg.tools?.media?.[capability],
			activeModel: params.activeModel
		}), {
			concurrency: resolveConcurrency(cfg),
			stopOnError: false
		});
		const outputs = [];
		const decisions = [];
		const audioAttachmentIndexes = /* @__PURE__ */ new Set();
		for (const entry of results) {
			decisions.push(entry.decision);
			if (entry.decision.capability !== "audio") {
				for (const output of entry.outputs) outputs.push(output);
				continue;
			}
			const audioOutputsByAttachmentIndex = /* @__PURE__ */ new Map();
			for (const output of entry.outputs) {
				audioOutputsByAttachmentIndex.set(output.attachmentIndex, output);
				audioAttachmentIndexes.add(output.attachmentIndex);
			}
			for (const attachment of entry.decision.attachments) {
				const output = audioOutputsByAttachmentIndex.get(attachment.attachmentIndex);
				if (output) outputs.push(output);
				else if (attachment.attempts.some((attempt) => attempt.reason?.trim().startsWith("tooSmall"))) outputs.push({
					kind: "audio.transcription",
					attachmentIndex: attachment.attachmentIndex,
					text: EMPTY_VOICE_NOTE_PLACEHOLDER,
					provider: "openclaw",
					model: "synthetic-empty-audio"
				});
			}
		}
		if (decisions.length > 0) ctx.MediaUnderstandingDecisions = [...ctx.MediaUnderstandingDecisions ?? [], ...decisions];
		if (outputs.length > 0) {
			const audioOutputs = outputs.filter((output) => output.kind === "audio.transcription");
			if (audioOutputs.length > 0) {
				const transcript = formatAudioTranscripts(audioOutputs);
				ctx.Transcript = transcript;
				if (originalUserText) {
					ctx.CommandBody = originalUserText;
					ctx.RawBody = originalUserText;
				} else {
					ctx.CommandBody = transcript;
					ctx.RawBody = transcript;
				}
				const audioCfg = cfg.tools?.media?.audio;
				if (audioCfg?.echoTranscript && transcript) await sendTranscriptEcho({
					ctx,
					cfg,
					transcript,
					format: audioCfg.echoFormat ?? "📝 \"{transcript}\""
				});
			} else if (originalUserText) {
				ctx.CommandBody = originalUserText;
				ctx.RawBody = originalUserText;
			}
			ctx.MediaUnderstanding = [...ctx.MediaUnderstanding ?? [], ...outputs];
		}
		const fileContext = params.processingMode === "audio-only" ? {
			blocks: [],
			images: [],
			localPathSelfServeUpgrades: []
		} : await extractFileContext({
			attachments,
			cache,
			cfg,
			limits: resolveFileExtractionLimits(cfg),
			skipAttachmentIndexes: audioAttachmentIndexes.size > 0 ? audioAttachmentIndexes : void 0,
			selfServePathsEnabled: params.selfServeLocalPaths === true
		});
		const mediaMarkers = renderMediaAttachmentMarkers({
			attachments,
			decisions,
			outputs,
			deliveredImageIndexes: params.deliveredImageIndexes
		});
		const contextBlocks = applyAttachmentMarkerBudget([...fileContext.blocks, ...mediaMarkers]);
		if (outputs.length > 0 || contextBlocks.length > 0) {
			const fileSuffix = contextBlocks.length > 0 ? contextBlocks.join("\n\n").trim() : void 0;
			const enrich = (body) => appendFileBlocks(formatMediaUnderstandingBody({
				body,
				outputs
			}), fileSuffix);
			ctx.agentText = enrich(ctx.agentText ?? ctx.BodyForAgent ?? ctx.Body);
			ctx.Body = enrich(ctx.Body);
			finalizeInboundContext(ctx, { forceBodyForCommands: true });
		}
		return {
			extractedFileImages: fileContext.images,
			...fileContext.localPathSelfServeUpgrades.length > 0 ? { enableLocalPathSelfServe: (contexts, stagedPaths) => enableLocalPathSelfServe(fileContext.localPathSelfServeUpgrades, contexts, stagedPaths) } : {}
		};
	} finally {
		await cache.cleanup();
	}
}
//#endregion
export { applyMediaUnderstanding as t };
