import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata, x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-CeJbvk_b.mjs";
import { n as getCoreTtsAttemptResultMediaUrls, t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-z42MPFVT.mjs";
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
function selectToolMedia(params) {
	let mediaUrls = Array.from(new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	const payloads = params.payloads?.length ? [...params.payloads] : [];
	const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning && !payload.isError);
	const visiblePayload = payloads[payloadIndex];
	const isSourceReplyTranscriptMirror = params.sourceReplyDeliveryMode === "message_tool_only" && visiblePayload && getReplyPayloadMetadata(visiblePayload)?.sourceReplyTranscriptMirror;
	if (visiblePayload?.text && mediaUrls.length > 0 && !isSourceReplyTranscriptMirror) {
		const selected = splitMediaFromOutput(visiblePayload.text, {
			extractAudioDirectives: false,
			extractMediaDirectives: false,
			markdownImageAllowlist: mediaUrls
		});
		if (selected.mediaUrls?.length) {
			const selectedMediaUrls = new Set(selected.mediaUrls);
			mediaUrls = mediaUrls.filter((url) => selectedMediaUrls.has(url));
			payloads[payloadIndex] = copyReplyPayloadMetadata(visiblePayload, {
				...visiblePayload,
				text: selected.text
			});
		}
	}
	return {
		payloads,
		mediaUrls,
		payloadIndex,
		isSourceReplyTranscriptMirror
	};
}
/**
* Merges media emitted by tools into the channel payloads produced by the
* assistant turn. The first successful, non-reasoning reply owns the media so
* text and attachments stay together; metadata is preserved for delivery bookkeeping.
*/
function mergeAttemptToolMediaPayloads(params) {
	return mergeSelectedToolMedia(params, selectToolMedia(params));
}
function mergeSelectedToolMedia(params, { payloads, mediaUrls, payloadIndex, isSourceReplyTranscriptMirror }) {
	const mediaUrlSet = new Set(mediaUrls);
	const autoDeliveryMediaUrls = Array.from(new Set(params.toolAutoDeliveryMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	const hostOwnedMediaUrls = Array.from(new Set(params.hostOwnedToolMediaUrls?.map((url) => url.trim()).filter((url) => url.length > 0 && mediaUrlSet.has(url)) ?? []));
	if (mediaUrls.length === 0 && autoDeliveryMediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia) return params.payloads;
	const buildMediaPayload = (urls, includeAudio) => ({
		mediaUrls: urls.length ? urls : void 0,
		mediaUrl: urls[0],
		audioAsVoice: includeAudio && params.toolAudioAsVoice || void 0,
		trustedLocalMedia: params.toolTrustedLocalMedia || void 0
	});
	const shouldSplitHostOwnedMedia = params.sourceReplyDeliveryMode === "message_tool_only" && hostOwnedMediaUrls.length > 0;
	const hostOwnedMediaUrlSet = new Set(hostOwnedMediaUrls);
	const autoDeliveryOnlyMediaUrls = autoDeliveryMediaUrls.filter((url) => !hostOwnedMediaUrlSet.has(url));
	const shouldSplitAutoDeliveryMedia = params.sourceReplyDeliveryMode === "message_tool_only" && autoDeliveryOnlyMediaUrls.length > 0;
	const autoDeliveryMediaUrlSet = new Set(autoDeliveryMediaUrls);
	const mergeableMediaUrls = shouldSplitHostOwnedMedia || shouldSplitAutoDeliveryMedia ? mediaUrls.filter((url) => !hostOwnedMediaUrlSet.has(url) && !autoDeliveryMediaUrlSet.has(url)) : mediaUrls;
	const appendOwnedMedia = (nextPayloads) => {
		const withHostOwnedMedia = !shouldSplitHostOwnedMedia ? nextPayloads : [...nextPayloads, markReplyPayloadForSourceSuppressionDelivery(buildMediaPayload(hostOwnedMediaUrls, false))];
		if (!shouldSplitAutoDeliveryMedia) return withHostOwnedMedia;
		return [...withHostOwnedMedia, markReplyPayloadForSourceSuppressionDelivery({
			...buildMediaPayload(autoDeliveryOnlyMediaUrls, true),
			trustedLocalMedia: true
		})];
	};
	if (isSourceReplyTranscriptMirror) return appendOwnedMedia(payloads);
	if (payloadIndex >= 0) {
		const payload = payloads.at(payloadIndex);
		if (!payload) return payloads;
		if (mergeableMediaUrls.length === 0 && (shouldSplitHostOwnedMedia || shouldSplitAutoDeliveryMedia)) return appendOwnedMedia(payloads);
		const mergedMediaUrls = Array.from(/* @__PURE__ */ new Set([...payload.mediaUrls ?? [], ...mergeableMediaUrls]));
		payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
			mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
			audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
			trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0
		});
		return appendOwnedMedia(payloads);
	}
	if (shouldSplitHostOwnedMedia || shouldSplitAutoDeliveryMedia) {
		const genericMediaPayload = mergeableMediaUrls.length > 0 ? [buildMediaPayload(mergeableMediaUrls, true)] : [];
		return appendOwnedMedia([...payloads, ...genericMediaPayload]);
	}
	const mediaPayload = buildMediaPayload(mergeableMediaUrls, true);
	return appendOwnedMedia([...payloads, mediaPayload]);
}
/** Keeps unsent artifacts with the logical run while their plugin generation retires. */
function createPendingToolMediaCarry() {
	const batches = [];
	return {
		capture(attempt) {
			if (!attempt.toolMediaUrls?.length && !attempt.toolAudioAsVoice) return;
			batches.push(copyCoreTtsAttemptResultProvenance(attempt, {
				toolMediaUrls: attempt.toolMediaUrls ? Object.freeze([...attempt.toolMediaUrls]) : void 0,
				hostOwnedToolMediaUrls: attempt.hostOwnedToolMediaUrls ? Object.freeze([...attempt.hostOwnedToolMediaUrls]) : void 0,
				toolAudioAsVoice: attempt.toolAudioAsVoice,
				toolTrustedLocalMedia: attempt.toolTrustedLocalMedia
			}));
		},
		merge(params, operationalRunInstance) {
			if (batches.length === 0) return mergeAttemptToolMediaPayloads(params);
			const allBatches = [...batches.map((batch) => ({
				...batch,
				toolAutoDeliveryMediaUrls: getCoreTtsAttemptResultMediaUrls(batch, batch.toolMediaUrls, operationalRunInstance)
			})), params];
			const selected = selectToolMedia({
				...params,
				toolMediaUrls: allBatches.flatMap((batch) => batch.toolMediaUrls ?? [])
			});
			const selectedUrls = new Set(selected.mediaUrls);
			const projected = allBatches.map((batch) => Object.assign({}, batch, {
				hadMedia: Boolean(batch.toolMediaUrls?.length || batch.toolAutoDeliveryMediaUrls?.length),
				toolMediaUrls: [...new Set(batch.toolMediaUrls?.map((url) => url.trim()).filter((url) => selectedUrls.has(url)) ?? [])]
			}));
			const owners = /* @__PURE__ */ new Map();
			for (const field of [
				"hostOwnedToolMediaUrls",
				"toolAutoDeliveryMediaUrls",
				"toolMediaUrls"
			]) for (const batch of projected) for (const raw of batch[field] ?? []) {
				const url = raw.trim();
				if ((field !== "hostOwnedToolMediaUrls" || batch.toolMediaUrls.includes(url)) && !owners.has(url)) owners.set(url, batch);
			}
			const visible = selected.payloads[selected.payloadIndex];
			let payloads;
			if (visible?.mediaUrl || visible?.mediaUrls?.length) payloads = selected.payloads;
			if (visible && payloads && !selected.isSourceReplyTranscriptMirror) {
				const mediaUrl = visible.mediaUrl && !owners.has(visible.mediaUrl.trim()) ? visible.mediaUrl : void 0;
				const mediaUrls = visible.mediaUrls?.filter((url) => !owners.has(url.trim()));
				if (mediaUrl !== visible.mediaUrl || mediaUrls?.length !== visible.mediaUrls?.length) payloads[selected.payloadIndex] = copyReplyPayloadMetadata(visible, {
					...visible,
					mediaUrl,
					mediaUrls: mediaUrls?.length ? mediaUrls : void 0,
					...!mediaUrl && !mediaUrls?.length ? {
						audioAsVoice: void 0,
						trustedLocalMedia: void 0
					} : {}
				});
			}
			for (const batch of projected) {
				const owned = (urls) => urls?.filter((url) => owners.get(url.trim()) === batch);
				const mediaUrls = owned(batch.toolMediaUrls) ?? [];
				const toolAutoDeliveryMediaUrls = owned(batch.toolAutoDeliveryMediaUrls);
				if (batch.hadMedia && mediaUrls.length === 0 && !toolAutoDeliveryMediaUrls?.length) continue;
				const first = payloads === void 0;
				const current = first ? selected : {
					payloads: [],
					payloadIndex: -1,
					isSourceReplyTranscriptMirror: selected.isSourceReplyTranscriptMirror
				};
				const next = mergeSelectedToolMedia({
					...batch,
					toolAutoDeliveryMediaUrls,
					hostOwnedToolMediaUrls: owned(batch.hostOwnedToolMediaUrls),
					payloads: first ? selected.payloads : void 0,
					sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
				}, {
					...current,
					mediaUrls
				});
				payloads = payloads === void 0 ? next : [...payloads, ...next ?? []];
			}
			const emptied = payloads?.[selected.payloadIndex];
			if (payloads && visible && emptied && !hasReplyPayloadContent(emptied, { extraContent: emptied.audioAsVoice })) {
				const originalUrls = new Set([...visible.mediaUrls ?? [], ...visible.mediaUrl ? [visible.mediaUrl] : []].map((url) => url.trim()));
				const replacement = payloads.find((payload, index) => index >= selected.payloads.length && [...payload.mediaUrls ?? [], ...payload.mediaUrl ? [payload.mediaUrl] : []].some((url) => originalUrls.has(url)));
				if (replacement) {
					copyReplyPayloadMetadata(visible, replacement);
					payloads.splice(selected.payloadIndex, 1);
				}
			}
			return payloads ?? selected.payloads;
		},
		clear() {
			batches.length = 0;
		}
	};
}
//#endregion
export { mergeAttemptToolMediaPayloads as n, createPendingToolMediaCarry as t };
