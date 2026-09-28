import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
//#region src/meeting-bot/session-transcript-store.ts
const TRANSCRIPT_MAX_LINES = 2e3;
function transcriptLineKey(line) {
	return JSON.stringify([
		line.at ?? "",
		line.speaker ?? "",
		line.text
	]);
}
function maximalTranscriptOverlap(previousKeys, currentKeys) {
	const limit = Math.min(previousKeys.length, currentKeys.length);
	for (let length = limit; length > 0; length -= 1) {
		const previousStart = previousKeys.length - length;
		if (currentKeys.slice(0, length).every((key, index) => key === previousKeys[previousStart + index])) return length;
	}
	return 0;
}
var MeetingTranscriptDeliveryError = class extends Error {
	constructor(cause, finalCaptureError) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.name = "MeetingTranscriptDeliveryError";
		if (finalCaptureError !== void 0) this.finalCaptureError = finalCaptureError instanceof Error ? finalCaptureError.message : typeof finalCaptureError === "string" ? finalCaptureError : "unknown final capture error";
	}
};
var MeetingSessionTranscriptStore = class {
	#transcripts = /* @__PURE__ */ new Map();
	#captures = new KeyedAsyncQueue();
	#finalizing = /* @__PURE__ */ new Set();
	#pendingLines = /* @__PURE__ */ new Map();
	#retired = /* @__PURE__ */ new Set();
	#streamCursors = /* @__PURE__ */ new Map();
	constructor(options) {
		this.options = options;
	}
	async read(sessionId, options = {}) {
		const session = this.options.getSession(sessionId);
		if (!session) return { found: false };
		if (!this.options.isTranscribeSession(session)) throw new Error("transcript is only available for transcribe-mode sessions");
		const sinceIndex = options.sinceIndex ?? 0;
		if (!Number.isSafeInteger(sinceIndex) || sinceIndex < 0) throw new Error("sinceIndex must be a non-negative safe integer");
		if (session.state === "active" && !this.#finalizing.has(session.id)) await this.capture(session);
		const snapshot = this.#transcripts.get(sessionId) ?? {
			droppedLines: 0,
			lines: []
		};
		const startIndex = Math.max(sinceIndex, snapshot.droppedLines);
		return {
			found: true,
			sessionId,
			startIndex,
			nextIndex: snapshot.droppedLines + snapshot.lines.length,
			droppedLines: snapshot.droppedLines,
			...session.transcriptEvicted ? { evicted: true } : {},
			lines: snapshot.lines.slice(startIndex - snapshot.droppedLines)
		};
	}
	startFinalizing(sessionId) {
		this.#finalizing.add(sessionId);
	}
	finishFinalizing(sessionId) {
		this.#finalizing.delete(sessionId);
	}
	async capture(session, options = {}) {
		try {
			await this.#capture(session, options, true);
		} catch (error) {
			if (!(error instanceof MeetingTranscriptDeliveryError)) throw error;
		}
	}
	async captureNotes(session, options = {}) {
		await this.#capture(session, options, false);
	}
	async flushPending(session) {
		await this.#capture(session, {}, false, true);
	}
	async #capture(session, options, requireTranscribeMode, pendingOnly = false) {
		await this.#captures.enqueue(session.id, async () => {
			await this.#captureTask(session, options, requireTranscribeMode, pendingOnly);
		});
	}
	async #captureTask(session, options, requireTranscribeMode, pendingOnly) {
		let pendingError;
		try {
			await this.#flushPending(session);
		} catch (error) {
			if (pendingOnly) throw error;
			pendingError = error;
		}
		if (pendingOnly) return;
		if (!this.options.isBrowserSession(session) || requireTranscribeMode && !this.options.isTranscribeSession(session) || !this.options.hasBrowserTab(session)) {
			if (pendingError) throw pendingError;
			return;
		}
		let snapshot;
		try {
			snapshot = await this.options.capture(session, options);
		} catch (error) {
			if (pendingError) throw new MeetingTranscriptDeliveryError(pendingError.cause ?? pendingError, error);
			throw error;
		}
		if (snapshot) {
			if (this.options.isTranscribeSession(session)) this.#merge(session.id, snapshot);
			const cursor = this.#pendingLines.get(session.id)?.at(-1)?.cursor ?? this.#streamCursors.get(session.id);
			const delta = this.#snapshotDelta(cursor, snapshot);
			if (pendingError) {
				if (delta.lines.length > 0) this.#queuePending(session.id, snapshot, delta, 0, delta.prefixKeys, true);
				else if (delta.commitEmpty) this.#queuePendingCursor(session.id, {
					pageEpoch: snapshot.epoch,
					pageNextIndex: snapshot.droppedLines + snapshot.lines.length,
					tailKeys: delta.prefixKeys
				});
				throw pendingError;
			}
			let tailKeys = [...delta.prefixKeys];
			for (const [index, line] of delta.lines.entries()) {
				try {
					await this.options.onLines?.(session, [line]);
				} catch (error) {
					this.#queuePending(session.id, snapshot, delta, index, tailKeys);
					throw new MeetingTranscriptDeliveryError(error);
				}
				tailKeys = [...tailKeys, transcriptLineKey(line)].slice(-64);
				this.#streamCursors.set(session.id, {
					pageEpoch: snapshot.epoch,
					pageNextIndex: delta.startIndex + index + 1,
					tailKeys
				});
			}
			if (delta.lines.length === 0 && delta.commitEmpty) this.#streamCursors.set(session.id, {
				pageEpoch: snapshot.epoch,
				pageNextIndex: snapshot.droppedLines + snapshot.lines.length,
				tailKeys: delta.prefixKeys
			});
		} else if (pendingError) throw pendingError;
	}
	async #flushPending(session) {
		const pending = this.#pendingLines.get(session.id);
		for (;;) {
			const next = pending?.[0];
			if (!next) break;
			if (next.line) try {
				await this.options.onLines?.(session, [next.line]);
			} catch (error) {
				throw new MeetingTranscriptDeliveryError(error);
			}
			this.#streamCursors.set(session.id, next.cursor);
			pending.shift();
		}
		if (pending?.length === 0) this.#pendingLines.delete(session.id);
	}
	#queuePending(sessionId, snapshot, delta, failedIndex, prefixKeys, append = false) {
		let tailKeys = [...prefixKeys];
		const pending = delta.lines.slice(failedIndex).map((line, offset) => {
			tailKeys = [...tailKeys, transcriptLineKey(line)].slice(-64);
			return {
				line,
				cursor: {
					pageEpoch: snapshot.epoch,
					pageNextIndex: delta.startIndex + failedIndex + offset + 1,
					tailKeys
				}
			};
		});
		const combined = [...append ? this.#pendingLines.get(sessionId) ?? [] : [], ...pending];
		this.#pendingLines.set(sessionId, combined);
	}
	#queuePendingCursor(sessionId, cursor) {
		const pending = this.#pendingLines.get(sessionId) ?? [];
		pending.push({ cursor });
		this.#pendingLines.set(sessionId, pending);
	}
	retire(sessionId) {
		const snapshot = this.#transcripts.get(sessionId);
		if (snapshot) {
			this.#transcripts.delete(sessionId);
			this.#transcripts.set(sessionId, snapshot);
			this.#retired.delete(sessionId);
			this.#retired.add(sessionId);
		}
		const retainedIds = [...this.#retired].filter((id) => this.#transcripts.has(id)).toSorted((left, right) => (this.options.getSession(left)?.updatedAt ?? "").localeCompare(this.options.getSession(right)?.updatedAt ?? ""));
		for (const id of retainedIds.slice(0, -4)) {
			this.#transcripts.delete(id);
			this.#retired.delete(id);
			const session = this.options.getSession(id);
			if (session) session.transcriptEvicted = true;
		}
		this.#pendingLines.delete(sessionId);
		this.#streamCursors.delete(sessionId);
	}
	#snapshotDelta(previous, snapshot) {
		const pageNextIndex = snapshot.droppedLines + snapshot.lines.length;
		if (!previous || previous.pageEpoch !== snapshot.epoch) return {
			commitEmpty: previous !== void 0,
			lines: snapshot.lines,
			prefixKeys: [],
			startIndex: snapshot.droppedLines
		};
		if (snapshot.droppedLines >= previous.pageNextIndex) return {
			commitEmpty: true,
			lines: snapshot.lines,
			prefixKeys: [],
			startIndex: snapshot.droppedLines
		};
		if (snapshot.epoch === void 0 && previous.pageEpoch === void 0) {
			const previousStartIndex = previous.pageNextIndex - previous.tailKeys.length;
			const overlapStart = Math.max(previousStartIndex, snapshot.droppedLines);
			const overlapEnd = Math.min(previous.pageNextIndex, pageNextIndex);
			if (!(overlapStart < overlapEnd && Array.from({ length: overlapEnd - overlapStart }, (_, offset) => overlapStart + offset).every((absoluteIndex) => previous.tailKeys[absoluteIndex - previousStartIndex] === transcriptLineKey(snapshot.lines[absoluteIndex - snapshot.droppedLines]))) && snapshot.lines.length > 0 || pageNextIndex < previous.pageNextIndex) {
				const currentKeys = snapshot.lines.map(transcriptLineKey);
				const overlap = maximalTranscriptOverlap(previous.tailKeys, currentKeys);
				return {
					commitEmpty: true,
					lines: snapshot.lines.slice(overlap),
					prefixKeys: previous.tailKeys.slice(previous.tailKeys.length - overlap),
					startIndex: snapshot.droppedLines + overlap
				};
			}
		}
		if (pageNextIndex <= previous.pageNextIndex) return {
			commitEmpty: false,
			lines: [],
			prefixKeys: previous.tailKeys,
			startIndex: pageNextIndex
		};
		return {
			commitEmpty: false,
			lines: snapshot.lines.slice(previous.pageNextIndex - snapshot.droppedLines),
			prefixKeys: previous.tailKeys,
			startIndex: previous.pageNextIndex
		};
	}
	#merge(sessionId, snapshot) {
		const pageNextIndex = snapshot.droppedLines + snapshot.lines.length;
		const retained = this.#transcripts.get(sessionId);
		if (!retained) {
			const excess = Math.max(0, snapshot.lines.length - TRANSCRIPT_MAX_LINES);
			this.#transcripts.set(sessionId, {
				droppedLines: snapshot.droppedLines + excess,
				lines: excess > 0 ? snapshot.lines.slice(excess) : snapshot.lines,
				pageEpoch: snapshot.epoch,
				pageNextIndex
			});
			return;
		}
		const retainedNextIndex = retained.droppedLines + retained.lines.length;
		if (retained.pageEpoch !== snapshot.epoch) {
			if (snapshot.droppedLines > 0) {
				retained.droppedLines = retainedNextIndex + snapshot.droppedLines;
				retained.lines = [...snapshot.lines];
			} else retained.lines.push(...snapshot.lines);
			retained.pageEpoch = snapshot.epoch;
			retained.pageNextIndex = pageNextIndex;
		} else if (pageNextIndex > retained.pageNextIndex) {
			if (snapshot.droppedLines > retained.pageNextIndex) {
				retained.droppedLines = retainedNextIndex - retained.pageNextIndex + snapshot.droppedLines;
				retained.lines = [...snapshot.lines];
			} else retained.lines.push(...snapshot.lines.slice(retained.pageNextIndex - snapshot.droppedLines));
			retained.pageNextIndex = pageNextIndex;
		}
		const excess = retained.lines.length - TRANSCRIPT_MAX_LINES;
		if (excess > 0) {
			retained.lines.splice(0, excess);
			retained.droppedLines += excess;
		}
	}
};
//#endregion
export { MeetingTranscriptDeliveryError as n, MeetingSessionTranscriptStore as t };
