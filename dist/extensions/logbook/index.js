import { i as resolveGlobalSingleton } from "../../global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { a as canonicalPathFromExistingAncestor } from "../../fs-safe-BAPek8At.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { i as SqliteWorkerError } from "../../sqlite-worker-contract-DgNznZvn.mjs";
import { c as openSqliteWorkerStore } from "../../sqlite-worker-store-H5HXDD9v.mjs";
import { t as KeyedAsyncQueue } from "../../keyed-async-queue-CTreGrmR.mjs";
import { t as ErrorCodes } from "../../gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "../../error-codes-DvB36bCj.mjs";
import { t as canonicalizeBase64 } from "../../base64-B5EyWEOm.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../sqlite-runtime-DhVTOiCi.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../file-access-runtime-CWjkXCju.mjs";
import "../../media-runtime-Cwd1EZJ3.mjs";
import "../../gateway-runtime-BCC8MoQW.mjs";
import "../../global-singleton-D_6N_QHn.mjs";
import { a as revisionWindow, c as OBSERVATION_JSON_SCHEMA, d as buildCardsPrompt, f as buildObservationInstructions, l as buildAskPrompt, m as dayKeyFor, n as parseCardsJson, o as selectBatchFrames, p as buildStandupPrompt, r as parseObservationSegments, s as validateCardCoverage, t as CARD_LOOKBACK_MS, u as buildCardsCorrectionPrompt } from "../../analyze-8ysrnznv.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/logbook/src/config.ts
const DEFAULTS = {
	captureEnabled: true,
	captureIntervalSeconds: 30,
	analysisIntervalMinutes: 15,
	screenIndex: 0,
	maxWidth: 1440,
	retentionDays: 14
};
function clampNumber(value, fallback, min, max) {
	return Math.min(max, Math.max(min, Math.round(typeof value === "number" && Number.isFinite(value) ? value : fallback)));
}
function resolveLogbookConfig(raw) {
	const value = raw && typeof raw === "object" ? raw : {};
	return {
		captureEnabled: value.captureEnabled !== false,
		captureIntervalSeconds: clampNumber(value.captureIntervalSeconds, DEFAULTS.captureIntervalSeconds, 5, 600),
		analysisIntervalMinutes: clampNumber(value.analysisIntervalMinutes, DEFAULTS.analysisIntervalMinutes, 3, 120),
		nodeId: normalizeOptionalString(value.nodeId),
		screenIndex: clampNumber(value.screenIndex, DEFAULTS.screenIndex, 0, 16),
		maxWidth: clampNumber(value.maxWidth, DEFAULTS.maxWidth, 480, 3840),
		visionModel: normalizeOptionalString(value.visionModel),
		retentionDays: clampNumber(value.retentionDays, DEFAULTS.retentionDays, 1, 365)
	};
}
/** Splits a "provider/model" ref; model ids may themselves contain slashes. */
function parseModelRef(ref) {
	const slash = ref.indexOf("/");
	if (slash <= 0 || slash === ref.length - 1) return null;
	return {
		provider: ref.slice(0, slash),
		model: ref.slice(slash + 1)
	};
}
//#endregion
//#region extensions/logbook/src/frame-io.ts
const MAX_FRAME_OPERATIONS = 128;
/** Frame reads and pruning share admission while SQLite remains owned by the worker. */
function acquireLogbookFrameIo(root) {
	const state = resolveGlobalSingleton(Symbol.for("openclaw.logbookFrameIo"), () => ({
		queue: new KeyedAsyncQueue(),
		pending: 0
	}));
	const accepted = /* @__PURE__ */ new Set();
	let closing;
	return {
		run(operation) {
			if (closing) return Promise.reject(/* @__PURE__ */ new Error("Logbook frame I/O is closed"));
			if (state.pending >= MAX_FRAME_OPERATIONS) return Promise.reject(Object.assign(/* @__PURE__ */ new Error("Logbook frame I/O queue capacity reached"), { code: "overloaded" }));
			state.pending += 1;
			const result = state.queue.enqueue(root, operation);
			accepted.add(result);
			const settle = () => {
				state.pending -= 1;
				accepted.delete(result);
			};
			result.then(settle, settle);
			return result;
		},
		close() {
			closing ??= Promise.allSettled(accepted).then(() => void 0);
			return closing;
		}
	};
}
//#endregion
//#region extensions/logbook/src/store.ts
var LogbookStore = class LogbookStore {
	static async open(dataDir, workerModuleUrl) {
		if (!dataDir) throw new Error("Logbook data directory is required");
		const root = await canonicalPathFromExistingAncestor(path.resolve(dataDir));
		const worker = await openSqliteWorkerStore({
			moduleUrl: workerModuleUrl,
			databasePath: path.join(dataDir, "logbook.sqlite"),
			input: { dataDir: root }
		});
		return new LogbookStore(dataDir, worker, acquireLogbookFrameIo(root));
	}
	constructor(dataDir, worker, frameIo) {
		this.dataDir = dataDir;
		this.worker = worker;
		this.frameIo = frameIo;
		this.framesDir = path.join(dataDir, "frames");
	}
	close() {
		this.closing ??= (async () => {
			await this.frameIo.close();
			await this.worker.close();
		})();
		return this.closing;
	}
	execute(type, input) {
		if (this.closing) return Promise.reject(new SqliteWorkerError("Logbook store is closed", "closed"));
		return this.worker.execute({
			type,
			input
		});
	}
	frameFilePath(day, capturedAtMs) {
		return path.join(this.framesDir, day, `${capturedAtMs}.jpg`);
	}
	insertFrame(params) {
		return this.execute("insertFrame", params);
	}
	lastFrame() {
		return this.execute("lastFrame", void 0);
	}
	unbatchedActiveFrames(limit) {
		return this.execute("unbatchedActiveFrames", { limit });
	}
	countUnbatchedActiveFrames() {
		return this.execute("countUnbatchedActiveFrames", void 0);
	}
	frameById(id) {
		return this.execute("frameById", { id });
	}
	framesInRange(startMs, endMs) {
		return this.execute("framesInRange", {
			startMs,
			endMs
		});
	}
	createBatch(params) {
		return this.execute("createBatch", params);
	}
	setBatchStatus(batchId, status, error, model) {
		return this.execute("setBatchStatus", {
			batchId,
			status,
			error,
			model
		});
	}
	latestBatch() {
		return this.execute("latestBatch", void 0);
	}
	resetRunningBatches() {
		return this.execute("resetRunningBatches", void 0);
	}
	resetErrorBatches() {
		return this.execute("resetErrorBatches", void 0);
	}
	nextPendingBatch() {
		return this.execute("nextPendingBatch", void 0);
	}
	batchFrames(batchId) {
		return this.execute("batchFrames", { batchId });
	}
	replaceObservations(batchId, day, segments) {
		return this.execute("replaceObservations", {
			batchId,
			day,
			segments
		});
	}
	observationsInRange(day, startMs, endMs, tailLimit) {
		return this.execute("observationsInRange", {
			day,
			startMs,
			endMs,
			tailLimit
		});
	}
	cardsForDay(day, window) {
		return this.execute("cardsForDay", {
			day,
			window
		});
	}
	countCardsForDay(day) {
		return this.execute("countCardsForDay", { day });
	}
	replaceCardsInWindow(day, startMs, endMs, drafts, options) {
		return this.execute("replaceCardsInWindow", {
			day,
			startMs,
			endMs,
			drafts,
			selectKeyframes: options?.selectKeyframes
		});
	}
	listDays() {
		return this.execute("listDays", void 0);
	}
	timelineForDay(day) {
		return this.execute("timelineForDay", { day });
	}
	getStandup(day) {
		return this.execute("getStandup", { day });
	}
	saveStandup(day, text) {
		return this.execute("saveStandup", {
			day,
			text
		});
	}
	captureFrame(params) {
		const buffer = Buffer.from(params.buffer);
		const input = {
			...params,
			buffer
		};
		return this.frameIo.run(async () => {
			const contentHash = createHash("sha256").update(buffer).digest("hex");
			const previous = await this.worker.execute({
				type: "lastFrame",
				input: void 0
			});
			const filePath = this.frameFilePath(input.day, input.capturedAtMs);
			await mkdir(path.dirname(filePath), {
				recursive: true,
				mode: 448
			});
			await writeFile(filePath, buffer, { mode: 384 });
			return await this.worker.execute({
				type: "insertFrame",
				input: {
					capturedAtMs: input.capturedAtMs,
					day: input.day,
					path: filePath,
					screenIndex: input.screenIndex,
					width: input.width,
					height: input.height,
					byteSize: buffer.byteLength,
					contentHash,
					idle: previous?.contentHash === contentHash
				}
			});
		});
	}
	framePayload(id) {
		return this.frameIo.run(async () => {
			const frame = await this.worker.execute({
				type: "frameById",
				input: { id }
			});
			if (!frame) return null;
			return {
				frameId: frame.id,
				capturedAtMs: frame.capturedAtMs,
				width: frame.width,
				height: frame.height,
				format: "jpeg",
				base64: (await readFile(frame.path)).toString("base64")
			};
		});
	}
	batchImages(batchId) {
		return this.frameIo.run(async () => {
			const frames = await this.worker.execute({
				type: "sampledBatchFrames",
				input: { batchId }
			});
			const images = [];
			for (const frame of frames) images.push({
				frame,
				buffer: await readFile(frame.path)
			});
			return images;
		});
	}
	pruneFrames(olderThanMs) {
		return this.frameIo.run(() => this.worker.execute({
			type: "pruneFrames",
			input: { olderThanMs }
		}));
	}
};
//#endregion
//#region extensions/logbook/src/service.ts
const ANALYSIS_TICK_MS = 6e4;
const PRUNE_TICK_MS = 36e5;
const MODEL_MISSING_MESSAGE = "no vision model: set plugins.entries.logbook.config.visionModel or configure tools.media";
const MODEL_MISSING_LOG_INTERVAL_MS = 6e5;
const CAPTURE_FAILURE_PAUSE_TICKS = 10;
const CAPTURE_FAILURE_THRESHOLD = 3;
const JPEG_QUALITY = .6;
const STRUCTURED_MEDIA_PROVIDER = "codex";
/** node.invoke responses wrap the node result in {payload, payloadJSON}. */
function unwrapInvokePayload(raw) {
	if (!raw || typeof raw !== "object") return null;
	const envelope = raw;
	if (envelope.payload && typeof envelope.payload === "object") return envelope.payload;
	if (typeof envelope.payloadJSON === "string" && envelope.payloadJSON.length > 0) try {
		return JSON.parse(envelope.payloadJSON);
	} catch {
		return null;
	}
	return "base64" in envelope || "error" in envelope ? envelope : null;
}
/** Capture commands in preference order: app nodes first, headless node hosts second. */
const CAPTURE_COMMANDS = ["screen.snapshot", "logbook.snapshot"];
var LogbookService = class {
	constructor(config, deps) {
		this.config = config;
		this.deps = deps;
		this.store = null;
		this.operations = /* @__PURE__ */ new Set();
		this.captureTimer = null;
		this.analysisTimer = null;
		this.pruneTimer = null;
		this.captureInFlight = false;
		this.analysisInFlight = false;
		this.capturePaused = false;
		this.captureFailures = 0;
		this.captureBackoffTicks = 0;
		this.lastModelMissingLogMs = 0;
		this.cachedNode = null;
		this.failedNodeIds = /* @__PURE__ */ new Set();
	}
	async start() {
		if (this.starting || this.stopping) throw new Error("Logbook service cannot be started again");
		this.starting = this.trackOperation(async () => {
			const store = await LogbookStore.open(this.deps.dataDir, this.deps.workerModuleUrl);
			this.store = store;
			try {
				if (this.stopping) return;
				await store.resetRunningBatches();
				if (this.stopping) return;
				await this.pruneStore(store);
				if (this.stopping) return;
				this.captureTimer = setInterval(() => {
					this.captureTick();
				}, this.config.captureIntervalSeconds * 1e3);
				this.captureTimer.unref?.();
				this.analysisTimer = setInterval(() => {
					this.analysisTick();
				}, ANALYSIS_TICK_MS);
				this.analysisTimer.unref?.();
				this.pruneTimer = setInterval(() => {
					this.prune();
				}, PRUNE_TICK_MS);
				this.pruneTimer.unref?.();
				this.deps.logger.info(`logbook: started (capture every ${this.config.captureIntervalSeconds}s, analysis window ${this.config.analysisIntervalMinutes}m, data ${this.deps.dataDir})`);
			} catch (error) {
				this.store = null;
				await store.close();
				throw error;
			}
		});
		await this.starting;
	}
	stop() {
		if (this.stopping) return this.stopping;
		for (const timer of [
			this.captureTimer,
			this.analysisTimer,
			this.pruneTimer
		]) if (timer) clearInterval(timer);
		this.captureTimer = null;
		this.analysisTimer = null;
		this.pruneTimer = null;
		this.stopping = Promise.allSettled(this.operations).then(async () => {
			const store = this.store;
			this.store = null;
			await store?.close();
		});
		return this.stopping;
	}
	trackOperation(run) {
		const operation = Promise.resolve().then(run);
		this.operations.add(operation);
		const settled = () => this.operations.delete(operation);
		operation.then(settled, settled);
		return operation;
	}
	requireStore() {
		if (this.stopping || !this.store) throw new Error("Logbook service is not running");
		return this.store;
	}
	setCapturePaused(paused) {
		this.capturePaused = paused;
		if (!paused) {
			this.captureBackoffTicks = 0;
			this.captureFailures = 0;
		}
	}
	async resolveNode() {
		if (this.cachedNode) return { node: this.cachedNode };
		const { nodes } = await this.deps.runtime.nodes.list({ connected: true });
		const captureCommand = (node) => CAPTURE_COMMANDS.find((command) => (node.commands ?? []).includes(command));
		const commandRank = (node) => CAPTURE_COMMANDS.indexOf(captureCommand(node));
		const candidates = nodes.filter((node) => captureCommand(node) !== void 0).toSorted((a, b) => commandRank(a) - commandRank(b) || a.nodeId.localeCompare(b.nodeId));
		const wanted = this.config.nodeId?.toLowerCase();
		let pool = candidates.filter((node) => !this.failedNodeIds.has(node.nodeId));
		if (pool.length === 0) {
			this.failedNodeIds.clear();
			pool = candidates;
		}
		const picked = wanted ? candidates.find((node) => node.nodeId.toLowerCase() === wanted || node.displayName?.toLowerCase() === wanted) : pool[0];
		const command = picked ? captureCommand(picked) : void 0;
		if (!picked || !command) {
			const inventory = nodes.map((node) => `${node.displayName ?? node.nodeId}(${(node.commands ?? []).join("/") || "no commands"})`).join(", ") || "none";
			return { reason: `no connected node exposes ${CAPTURE_COMMANDS.join(" or ")}; connected: ${inventory}` };
		}
		this.cachedNode = {
			nodeId: picked.nodeId,
			displayName: picked.displayName,
			command
		};
		return { node: this.cachedNode };
	}
	async captureTick() {
		const store = this.store;
		if (this.stopping || !this.config.captureEnabled || this.capturePaused || this.captureInFlight || !store) return;
		if (this.captureBackoffTicks > 0) {
			this.captureBackoffTicks -= 1;
			return;
		}
		this.captureInFlight = true;
		return this.trackOperation(async () => {
			try {
				const resolved = await this.resolveNode();
				if ("reason" in resolved) {
					if (this.lastCaptureError !== resolved.reason) this.deps.logger.warn(`logbook: ${resolved.reason}`);
					this.lastCaptureError = resolved.reason;
					return;
				}
				const node = resolved.node;
				const raw = unwrapInvokePayload(await this.deps.runtime.nodes.invoke({
					nodeId: node.nodeId,
					command: node.command,
					params: {
						screenIndex: this.config.screenIndex,
						maxWidth: this.config.maxWidth,
						quality: JPEG_QUALITY,
						format: "jpeg"
					},
					timeoutMs: 3e4
				}));
				if (raw?.error) throw new Error(raw.error);
				const rawBase64 = raw?.base64;
				if (rawBase64 === void 0 || rawBase64 === "") throw new Error(`${node.command} returned no image payload`);
				if (typeof rawBase64 !== "string") throw new Error(`${node.command} returned invalid image payload`);
				const base64 = canonicalizeBase64(rawBase64);
				if (!base64) throw new Error(`${node.command} returned invalid image payload`);
				const buffer = Buffer.from(base64, "base64");
				const capturedAtMs = Date.now();
				const day = dayKeyFor(capturedAtMs);
				await store.captureFrame({
					capturedAtMs,
					day,
					screenIndex: this.config.screenIndex,
					width: raw?.width,
					height: raw?.height,
					buffer
				});
				this.lastCaptureAtMs = capturedAtMs;
				this.lastCaptureError = void 0;
				this.captureFailures = 0;
				this.failedNodeIds.clear();
			} catch (err) {
				this.captureFailures += 1;
				if (this.cachedNode) this.failedNodeIds.add(this.cachedNode.nodeId);
				this.cachedNode = null;
				this.lastCaptureError = err instanceof Error ? err.message : String(err);
				if (this.captureFailures >= CAPTURE_FAILURE_THRESHOLD) {
					this.captureBackoffTicks = CAPTURE_FAILURE_PAUSE_TICKS;
					this.deps.logger.warn(`logbook: capture failing (${this.lastCaptureError}); backing off for ${CAPTURE_FAILURE_PAUSE_TICKS} ticks`);
				}
			} finally {
				this.captureInFlight = false;
			}
		});
	}
	resolveVisionModel() {
		if (this.config.visionModel) {
			const ref = parseModelRef(this.config.visionModel);
			return ref ? {
				ref,
				source: "config"
			} : { source: "missing" };
		}
		const media = this.deps.fullConfig.tools?.media;
		if (media?.image?.enabled === false) return { source: "missing" };
		const entries = media?.models ?? [];
		for (const entry of entries) if (entry.type !== "cli" && entry.provider?.trim().toLowerCase() === STRUCTURED_MEDIA_PROVIDER && typeof entry.model === "string" && (!entry.capabilities || entry.capabilities.includes("image"))) return {
			ref: {
				provider: STRUCTURED_MEDIA_PROVIDER,
				model: entry.model,
				profile: entry.profile,
				preferredProfile: entry.preferredProfile
			},
			source: "media-defaults"
		};
		return { source: "missing" };
	}
	async analyzeNow() {
		const store = this.requireStore();
		if (this.analysisInFlight) return {
			started: false,
			reason: "analysis already running"
		};
		if (!this.resolveVisionModel().ref) return {
			started: false,
			reason: MODEL_MISSING_MESSAGE
		};
		this.analysisInFlight = true;
		return this.trackOperation(async () => {
			let handedOff = false;
			try {
				await store.resetErrorBatches();
				if (!await store.nextPendingBatch()) {
					if (!await this.enqueueNextBatch(store, true)) return {
						started: false,
						reason: "no unanalyzed activity captured yet"
					};
				}
				this.requireStore();
				this.analysisInFlight = false;
				this.analysisTick();
				handedOff = true;
				return { started: true };
			} finally {
				if (!handedOff) this.analysisInFlight = false;
			}
		});
	}
	async analysisTick() {
		const store = this.store;
		if (this.stopping || this.analysisInFlight || !store) return;
		if (!this.resolveVisionModel().ref) {
			const now = Date.now();
			if (now - this.lastModelMissingLogMs > MODEL_MISSING_LOG_INTERVAL_MS) {
				this.lastModelMissingLogMs = now;
				this.deps.logger.warn(`logbook: analysis paused; ${MODEL_MISSING_MESSAGE}`);
			}
			return;
		}
		this.analysisInFlight = true;
		return this.trackOperation(async () => {
			try {
				if (this.stopping) return;
				await this.enqueueElapsedWindow(store);
				for (let i = 0; i < 4 && !this.stopping; i += 1) {
					const batch = await store.nextPendingBatch();
					if (!batch || this.stopping) return;
					await this.runBatch(store, batch);
				}
			} catch (err) {
				this.deps.logger.error(`logbook: analysis tick failed: ${String(err)}`);
			} finally {
				this.analysisInFlight = false;
			}
		});
	}
	async enqueueNextBatch(store, force = false) {
		const selection = selectBatchFrames({
			frames: await store.unbatchedActiveFrames(2e3),
			windowMs: this.config.analysisIntervalMinutes * 6e4,
			nowMs: Date.now(),
			force
		});
		if (!selection) return false;
		await store.createBatch({
			day: dayKeyFor(selection.startMs),
			startMs: selection.startMs,
			endMs: selection.endMs,
			frameIds: selection.frameIds
		});
		return true;
	}
	async enqueueElapsedWindow(store) {
		while (!this.stopping && await this.enqueueNextBatch(store));
	}
	async runBatch(store, batch) {
		const vision = this.resolveVisionModel();
		if (!vision.ref) return;
		await store.setBatchStatus(batch.id, "running", void 0, `${vision.ref.provider}/${vision.ref.model}`);
		try {
			const sampled = await store.batchImages(batch.id);
			const images = sampled.map(({ frame, buffer }) => ({
				type: "image",
				buffer,
				fileName: path.basename(frame.path),
				mime: "image/jpeg"
			}));
			const observationResult = await this.deps.runtime.mediaUnderstanding.extractStructuredWithModel({
				provider: vision.ref.provider,
				model: vision.ref.model,
				profile: vision.ref.profile,
				preferredProfile: vision.ref.preferredProfile,
				input: images,
				instructions: buildObservationInstructions({
					frameTimes: sampled.map(({ frame }) => frame.capturedAtMs),
					startMs: batch.startMs,
					endMs: batch.endMs
				}),
				schemaName: "logbook.observations",
				jsonSchema: OBSERVATION_JSON_SCHEMA,
				cfg: this.deps.fullConfig,
				timeoutMs: 18e4
			});
			const segments = parseObservationSegments({
				raw: observationResult.text ?? "",
				day: batch.day,
				startMs: batch.startMs,
				endMs: batch.endMs
			});
			if (segments.length === 0) {
				await store.setBatchStatus(batch.id, "error", "vision model returned no usable segments");
				return;
			}
			await store.replaceObservations(batch.id, batch.day, segments);
			await this.reviseCards(store, batch);
			await store.setBatchStatus(batch.id, "done");
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			await store.setBatchStatus(batch.id, "error", message);
			this.deps.logger.warn(`logbook: batch ${batch.id} failed: ${message}`);
		}
	}
	async reviseCards(store, batch) {
		const lookbackStart = batch.startMs - CARD_LOOKBACK_MS;
		const previousCards = await store.cardsForDay(batch.day, {
			startMs: lookbackStart,
			endMs: batch.endMs
		});
		const observations = await store.observationsInRange(batch.day, Math.min(lookbackStart, batch.startMs), batch.endMs);
		const window = revisionWindow({
			batchStartMs: batch.startMs,
			batchEndMs: batch.endMs,
			previousCards
		});
		const prompt = buildCardsPrompt({
			day: batch.day,
			observations,
			previousCards,
			windowStartMs: window.startMs,
			windowEndMs: window.endMs
		});
		const requiredSpans = [...previousCards.map((card) => ({
			startMs: card.startMs,
			endMs: card.endMs
		})), {
			startMs: batch.startMs,
			endMs: batch.endMs
		}];
		const evaluate = (raw) => {
			const parsed = parseCardsJson({
				raw,
				day: batch.day,
				windowStartMs: window.startMs,
				windowEndMs: window.endMs
			});
			if (!parsed.ok) return parsed;
			const coverage = validateCardCoverage({
				drafts: parsed.drafts,
				requiredSpans,
				windowStartMs: window.startMs,
				windowEndMs: window.endMs
			});
			return coverage.ok ? parsed : {
				ok: false,
				error: coverage.error
			};
		};
		const first = await this.deps.runtime.llm.complete({
			messages: [{
				role: "user",
				content: prompt
			}],
			purpose: "logbook.cards",
			maxTokens: 4e3
		});
		let parsed = evaluate(first.text);
		if (!parsed.ok) parsed = evaluate((await this.deps.runtime.llm.complete({
			messages: [
				{
					role: "user",
					content: prompt
				},
				{
					role: "assistant",
					content: first.text
				},
				{
					role: "user",
					content: buildCardsCorrectionPrompt(parsed.error)
				}
			],
			purpose: "logbook.cards.repair",
			maxTokens: 4e3
		})).text);
		if (!parsed.ok) throw new Error(`card synthesis failed validation: ${parsed.error}`);
		await store.replaceCardsInWindow(batch.day, window.startMs, window.endMs, parsed.drafts, { selectKeyframes: true });
	}
	async standup(day, refresh) {
		const store = this.requireStore();
		return this.trackOperation(async () => {
			if (!refresh) {
				const cached = await store.getStandup(day);
				if (cached) return cached;
			}
			const previousDay = dayKeyFor((/* @__PURE__ */ new Date(`${day}T12:00:00`)).getTime() - 864e5);
			const result = await this.deps.runtime.llm.complete({
				messages: [{
					role: "user",
					content: buildStandupPrompt({
						day,
						cards: await store.cardsForDay(day),
						previousDayCards: await store.cardsForDay(previousDay)
					})
				}],
				purpose: "logbook.standup",
				maxTokens: 800
			});
			await store.saveStandup(day, result.text.trim());
			const saved = await store.getStandup(day);
			if (!saved) throw new Error("standup save failed");
			return saved;
		});
	}
	async ask(day, question) {
		const store = this.requireStore();
		return this.trackOperation(async () => {
			const observations = await store.observationsInRange(day, 0, Number.MAX_SAFE_INTEGER, 200);
			return (await this.deps.runtime.llm.complete({
				messages: [{
					role: "user",
					content: buildAskPrompt({
						day,
						cards: await store.cardsForDay(day),
						observations,
						question
					})
				}],
				purpose: "logbook.ask",
				maxTokens: 600
			})).text.trim();
		});
	}
	async timelineForDay(day) {
		const store = this.requireStore();
		return this.trackOperation(() => store.timelineForDay(day));
	}
	async listDays() {
		const store = this.requireStore();
		return this.trackOperation(() => store.listDays());
	}
	async framePayload(id) {
		const store = this.requireStore();
		return this.trackOperation(() => store.framePayload(id));
	}
	async framesInRange(startMs, endMs) {
		const store = this.requireStore();
		return this.trackOperation(() => store.framesInRange(startMs, endMs));
	}
	async status() {
		const store = this.requireStore();
		return this.trackOperation(async () => {
			const today = dayKeyFor(Date.now());
			const latestBatch = await store.latestBatch();
			const vision = this.resolveVisionModel();
			return {
				captureEnabled: this.config.captureEnabled,
				capturePaused: this.capturePaused,
				captureIntervalSeconds: this.config.captureIntervalSeconds,
				analysisIntervalMinutes: this.config.analysisIntervalMinutes,
				retentionDays: this.config.retentionDays,
				nodeId: this.cachedNode?.nodeId ?? this.config.nodeId,
				nodeName: this.cachedNode?.displayName,
				lastCaptureAtMs: this.lastCaptureAtMs,
				lastCaptureError: this.lastCaptureError,
				pendingFrames: await store.countUnbatchedActiveFrames(),
				analysisRunning: this.analysisInFlight,
				lastBatch: latestBatch ? {
					id: latestBatch.id,
					day: latestBatch.day,
					status: latestBatch.status,
					endMs: latestBatch.endMs,
					error: latestBatch.error
				} : void 0,
				visionModel: vision.ref ? `${vision.ref.provider}/${vision.ref.model}` : void 0,
				visionModelSource: vision.source,
				today,
				todayCards: await store.countCardsForDay(today),
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
			};
		});
	}
	async prune() {
		const store = this.store;
		if (this.stopping || !store) return;
		return this.trackOperation(async () => {
			try {
				await this.pruneStore(store);
			} catch (error) {
				this.deps.logger.error(`logbook: pruning failed: ${String(error)}`);
			}
		});
	}
	async pruneStore(store) {
		const cutoff = Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1e3;
		const removed = await store.pruneFrames(cutoff);
		if (removed > 0) this.deps.logger.info(`logbook: pruned ${removed} frames older than ${this.config.retentionDays}d`);
	}
};
//#endregion
//#region extensions/logbook/index.ts
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const logbookConfigSchema = { parse(value) {
	return resolveLogbookConfig(value);
} };
function readDayParam(params) {
	const day = params?.day;
	if (day === void 0) return dayKeyFor(Date.now());
	if (typeof day !== "string" || !DAY_PATTERN.test(day)) throw new Error("day must be YYYY-MM-DD");
	return day;
}
function readNumberParam(params, key) {
	const value = params?.[key];
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) throw new Error(`${key} must be a positive number`);
	return value;
}
var logbook_default = definePluginEntry({
	id: "logbook",
	name: "Logbook",
	description: "Automatic work journal built from periodic screen snapshots",
	configSchema: logbookConfigSchema,
	nodeHostCommands: [{
		command: "logbook.snapshot",
		hasActiveWork: () => false,
		cap: "screen",
		dangerous: false,
		handle: async (paramsJSON) => {
			const { handleLogbookSnapshot } = await import("../../node-host--QznlANg.mjs");
			let params;
			try {
				params = paramsJSON ? JSON.parse(paramsJSON) : void 0;
			} catch {
				params = void 0;
			}
			return JSON.stringify(await handleLogbookSnapshot(params));
		}
	}],
	register(api) {
		const config = logbookConfigSchema.parse(api.pluginConfig);
		let service = null;
		let opening = null;
		let generation = 0;
		let stopping;
		let retired = false;
		const stopService = () => {
			generation++;
			const current = service ?? opening;
			service = null;
			opening = null;
			return stopping ??= current?.stop();
		};
		const requireService = () => {
			if (!service) throw new Error("Logbook service is not running");
			return service;
		};
		const sendError = (respond, err) => {
			const message = formatErrorMessage(err);
			respond(false, { error: message }, errorShape(ErrorCodes.UNAVAILABLE, message));
		};
		const handle = (run) => async ({ params, respond }) => {
			try {
				respond(true, await run(params));
			} catch (err) {
				sendError(respond, err);
			}
		};
		api.session.controls.registerControlUiDescriptor({
			surface: "tab",
			id: "logbook",
			label: "Logbook",
			description: "Your day as a timeline, built from screen snapshots.",
			icon: "sun",
			group: "control",
			requiredScopes: ["operator.write"]
		});
		api.registerNodeInvokePolicy({
			commands: ["logbook.snapshot"],
			defaultPlatforms: ["macos"],
			handle: async (ctx) => {
				if ((ctx.config.gateway?.nodes?.commands?.deny ?? []).includes("screen.snapshot")) return {
					ok: false,
					code: "SCREEN_CAPTURE_DENIED",
					message: "screen capture is denied by gateway.nodes.commands.deny (screen.snapshot); Logbook capture stays blocked until it is removed"
				};
				return await ctx.invokeNode();
			}
		});
		api.registerService({
			id: "logbook",
			start: async (ctx) => {
				if (retired) throw new Error("Logbook plugin runtime has been retired");
				const currentGeneration = ++generation;
				await stopping;
				if (retired || currentGeneration !== generation) return;
				stopping = void 0;
				if (!api.runtimeSource) throw new Error("Logbook requires an OpenClaw host with runtime entrypoint metadata");
				const next = new LogbookService(config, {
					runtime: api.runtime,
					fullConfig: ctx.config,
					logger: ctx.logger,
					dataDir: path.join(ctx.stateDir, "logbook"),
					workerModuleUrl: new URL(`./src/store.worker${path.extname(api.runtimeSource)}`, pathToFileURL(api.runtimeSource))
				});
				opening = next;
				try {
					await next.start();
					if (retired || currentGeneration !== generation) {
						await next.stop();
						return;
					}
					service = next;
				} catch (error) {
					await next.stop();
					throw error;
				} finally {
					if (opening === next) opening = null;
				}
			},
			stop: stopService
		});
		api.lifecycle.registerRuntimeLifecycle({
			id: "logbook-service",
			cleanup: ({ reason, sessionKey, runId }) => {
				if (sessionKey === void 0 && runId === void 0 && (reason === "restart" || reason === "disable")) {
					retired = true;
					return stopService();
				}
			}
		});
		const registerRead = (method, run) => api.registerGatewayMethod(method, handle(run), { scope: "operator.read" });
		const registerWrite = (method, run) => api.registerGatewayMethod(method, handle(run), { scope: "operator.write" });
		api.registerGatewayMethod("logbook.status", handle(() => requireService().status()), {
			scope: "operator.read",
			profileAccess: "independent"
		});
		registerRead("logbook.days", async () => ({ days: await requireService().listDays() }));
		registerRead("logbook.timeline", (params) => requireService().timelineForDay(readDayParam(params)));
		registerWrite("logbook.frames", async (params) => {
			const startMs = readNumberParam(params, "startMs");
			const endMs = readNumberParam(params, "endMs");
			return { frames: await requireService().framesInRange(startMs, endMs) };
		});
		registerWrite("logbook.frame", async (params) => {
			const frameId = readNumberParam(params, "frameId");
			const frame = await requireService().framePayload(frameId);
			if (!frame) throw new Error(`frame ${frameId} not found`);
			return frame;
		});
		registerWrite("logbook.standup", (params) => {
			const refresh = params?.refresh === true;
			return requireService().standup(readDayParam(params), refresh);
		});
		registerWrite("logbook.ask", async (params) => {
			const question = params?.question;
			if (typeof question !== "string" || question.trim().length === 0) throw new Error("question is required");
			return { answer: await requireService().ask(readDayParam(params), question.trim()) };
		});
		registerWrite("logbook.capture.set", (params) => {
			const paused = params?.paused === true;
			const svc = requireService();
			svc.setCapturePaused(paused);
			return svc.status();
		});
		registerWrite("logbook.analyze.now", () => requireService().analyzeNow());
	}
});
//#endregion
export { logbook_default as default };
