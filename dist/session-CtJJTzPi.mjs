import { n as getPwAiModule } from "./pw-ai-module-NkBl91vk.mjs";
import { t as clearBrowserScreencastTokens } from "./tokens-DV2NHQmZ.mjs";
//#region extensions/browser/src/browser/screencast/wire.ts
function encodeBrowserScreencastFrame(url, frame) {
	const header = Buffer.from(JSON.stringify({
		url,
		cssWidth: frame.metadata.deviceWidth,
		cssHeight: frame.metadata.deviceHeight,
		scrollX: frame.metadata.scrollOffsetX,
		scrollY: frame.metadata.scrollOffsetY,
		ts: frame.metadata.timestamp
	}), "utf8");
	const jpeg = Buffer.from(frame.data, "base64");
	const wire = Buffer.allocUnsafe(4 + header.length + jpeg.length);
	wire.writeUInt32BE(header.length, 0);
	header.copy(wire, 4);
	jpeg.copy(wire, 4 + header.length);
	return wire;
}
//#endregion
//#region extensions/browser/src/browser/screencast/session.ts
const MAX_BUFFERED_BYTES = 2097152;
const FRAME_INTERVAL_MS = 50;
const sessions = /* @__PURE__ */ new Map();
var BrowserScreencastSession = class {
	constructor(key, params) {
		this.key = key;
		this.params = params;
		this.viewers = /* @__PURE__ */ new Map();
		this.readyViewers = /* @__PURE__ */ new Set();
		this.acknowledgements = /* @__PURE__ */ new Set();
		this.captureDrain = Promise.resolve();
		this.closed = false;
		this.navigationEpoch = 0;
		this.pending = /* @__PURE__ */ new Set();
		this.onTargetClosed = () => {
			this.close(4004, "target_closed");
		};
		this.onCdpClosed = (cdp) => {
			if (this.capture?.cdp === cdp) this.onTargetClosed();
		};
		this.onNavigation = (frame) => {
			if (frame === this.page?.mainFrame()) this.trackWork(this.checkNavigation(this.page.url()));
		};
		this.onLoad = () => {
			this.trackWork(this.updateMetadata(this.navigationEpoch));
		};
		params.lifecycleSignal.addEventListener("abort", this.onTargetClosed, { once: true });
	}
	addViewer(ws, requester) {
		const onRequesterGone = () => ws.close(4006, "authority_revoked");
		this.viewers.set(ws, requester);
		for (const work of this.pending) requester.trackWork?.(work);
		ws.once("close", () => {
			requester.signal?.removeEventListener("abort", onRequesterGone);
			requester.release?.();
			this.viewers.delete(ws);
			this.readyViewers.delete(ws);
			if (this.viewers.size === 0) {
				const cleanup = this.close();
				requester.trackWork?.(cleanup);
			}
		});
		requester.signal?.addEventListener("abort", onRequesterGone, { once: true });
		if (!this.isViewerCurrent(ws)) return;
		this.sendReady();
	}
	trackWork(work) {
		this.pending.add(work);
		work.then(() => this.pending.delete(work), () => this.pending.delete(work));
		for (const requester of this.viewers.values()) requester.trackWork?.(work);
		return work;
	}
	isViewerCurrent(ws) {
		const requester = this.viewers.get(ws);
		if (!requester) return false;
		if (requester.signal?.aborted || requester.isCurrent?.() === false) {
			ws.close(4006, "authority_revoked");
			return false;
		}
		return true;
	}
	isCurrent() {
		if (this.closed) return false;
		try {
			this.params.lifecycleSignal.throwIfAborted();
			this.params.assertCurrent();
			if (![...this.viewers.keys()].some((ws) => this.isViewerCurrent(ws))) {
				this.onTargetClosed();
				return false;
			}
			return true;
		} catch {
			this.onTargetClosed();
			return false;
		}
	}
	async start() {
		try {
			if (!this.isCurrent()) return;
			const pw = await getPwAiModule();
			if (!this.isCurrent()) return;
			if (!pw) {
				await this.close(4005, "unsupported");
				return;
			}
			const page = await pw.getPageForTargetId({
				cdpUrl: this.params.cdpUrl,
				targetId: this.params.targetId,
				ssrfPolicy: this.params.ssrfPolicy
			});
			if (!this.isCurrent() || page.isClosed()) {
				this.onTargetClosed();
				return;
			}
			this.page = page;
			page.on("close", this.onTargetClosed);
			page.on("framenavigated", this.onNavigation);
			page.on("load", this.onLoad);
			await this.checkNavigation(page.url());
		} catch {
			await this.close(4004, "target_closed");
		}
	}
	async checkNavigation(url) {
		const retired = this.retireCapture();
		const epoch = this.navigationEpoch;
		try {
			await this.params.checkNavigationAllowed(url);
		} catch {
			if (epoch === this.navigationEpoch) this.close(4003, "navigation_blocked");
			return;
		}
		const page = this.page;
		const current = () => this.isCurrent() && epoch === this.navigationEpoch && page?.url() === url;
		if (!page || !current()) return;
		try {
			await retired;
			if (!current()) return;
			const cdp = await page.context().newCDPSession(page);
			if (!current()) {
				await cdp.detach().catch(() => {});
				return;
			}
			const onFrame = (frame) => this.onFrame(cdp, frame);
			this.capture = {
				cdp,
				onFrame
			};
			cdp.on("close", this.onCdpClosed);
			cdp.on("Page.screencastFrame", onFrame);
			this.checkedUrl = url;
			await this.updateMetadata(epoch);
			if (!current() || this.capture?.cdp !== cdp) return;
			await cdp.send("Page.startScreencast", {
				format: "jpeg",
				quality: this.params.quality,
				maxWidth: this.params.maxWidth,
				maxHeight: this.params.maxHeight,
				everyNthFrame: 1
			});
		} catch {
			if (current()) this.onTargetClosed();
		}
	}
	async updateMetadata(epoch) {
		const page = this.page;
		const url = this.checkedUrl;
		if (!page || url === void 0 || page.url() !== url) return;
		const title = await page.title().catch(() => "");
		if (!this.isCurrent() || epoch !== this.navigationEpoch || this.checkedUrl !== page.url()) return;
		this.metadata = {
			url,
			title
		};
		for (const ws of this.readyViewers) this.send(ws, JSON.stringify({
			type: "meta",
			...this.metadata
		}));
		this.sendReady();
	}
	sendReady() {
		if (!this.isCurrent() || !this.metadata || this.metadata.url !== this.checkedUrl || this.page?.url() !== this.checkedUrl) return;
		for (const ws of this.viewers.keys()) if (!this.readyViewers.has(ws) && this.send(ws, JSON.stringify({
			type: "ready",
			targetId: this.params.targetId,
			...this.metadata
		}))) this.readyViewers.add(ws);
	}
	send(ws, data) {
		if (!this.isViewerCurrent(ws) || ws.readyState !== 1) return false;
		if (typeof data !== "string" && ws.bufferedAmount >= MAX_BUFFERED_BYTES) return false;
		try {
			ws.send(data, (error) => {
				if (error) ws.terminate();
			});
			return true;
		} catch {
			ws.terminate();
			return false;
		}
	}
	onFrame(cdp, frame) {
		const page = this.page;
		if (this.capture?.cdp !== cdp || !page || !this.isCurrent()) return;
		const url = this.checkedUrl;
		const pageUrl = page.url();
		if (pageUrl !== url) {
			this.trackWork(this.checkNavigation(pageUrl));
			return;
		}
		if (url === void 0) return;
		const timer = setTimeout(() => {
			this.acknowledgements.delete(timer);
			if (this.capture?.cdp !== cdp || !this.isCurrent()) return;
			this.trackWork(cdp.send("Page.screencastFrameAck", { sessionId: frame.sessionId }).then(() => void 0).catch(() => {
				if (this.capture?.cdp === cdp) this.onTargetClosed();
			}));
		}, FRAME_INTERVAL_MS);
		timer.unref();
		this.acknowledgements.add(timer);
		const wire = encodeBrowserScreencastFrame(url, frame);
		for (const ws of this.readyViewers) this.send(ws, wire);
	}
	close(code, reason) {
		if (this.stopPromise) return this.stopPromise;
		this.closed = true;
		this.params.lifecycleSignal.removeEventListener("abort", this.onTargetClosed);
		this.page?.off("close", this.onTargetClosed);
		this.page?.off("framenavigated", this.onNavigation);
		this.page?.off("load", this.onLoad);
		const viewers = [...this.viewers.keys()];
		const requesters = [...this.viewers.values()];
		this.viewers.clear();
		this.readyViewers.clear();
		this.stopPromise = this.retireCapture().finally(() => {
			if (sessions.get(this.key) === this) sessions.delete(this.key);
		});
		for (const requester of requesters) requester.trackWork?.(this.stopPromise);
		for (const ws of viewers) ws.close(code, reason);
		return this.stopPromise;
	}
	retireCapture() {
		this.checkedUrl = void 0;
		this.navigationEpoch += 1;
		const capture = this.capture;
		this.capture = void 0;
		for (const timer of this.acknowledgements) clearTimeout(timer);
		this.acknowledgements.clear();
		if (capture) {
			const { cdp, onFrame } = capture;
			cdp.off("close", this.onCdpClosed);
			cdp.off("Page.screencastFrame", onFrame);
			this.captureDrain = Promise.all([this.captureDrain, cdp.detach().catch(() => {})]).then(() => {});
		}
		return this.captureDrain;
	}
};
function attachBrowserScreencastViewer(params, ws, ingress) {
	if (params.requesterSignal?.aborted || params.isRequesterCurrent?.() === false || ingress?.signal?.aborted || ingress?.isCurrent?.() === false) {
		params.releaseRequester?.();
		ws.close(4006, "authority_revoked");
		return;
	}
	try {
		params.lifecycleSignal.throwIfAborted();
		params.assertCurrent();
	} catch {
		params.releaseRequester?.();
		ws.close(4004, "target_closed");
		return;
	}
	const key = `${params.profileName}:${params.targetId}`;
	const requester = {
		signal: ingress?.signal ? params.requesterSignal ? AbortSignal.any([params.requesterSignal, ingress.signal]) : ingress.signal : params.requesterSignal,
		isCurrent: () => params.isRequesterCurrent?.() !== false && ingress?.isCurrent?.() !== false,
		release: params.releaseRequester,
		trackWork: ingress?.trackWork
	};
	let session = sessions.get(key);
	let previousDrain;
	if (session && (session.closed || session.params.profileSignal !== params.profileSignal)) {
		previousDrain = session.close(4004, "target_closed");
		session = void 0;
	}
	if (session) {
		session.addViewer(ws, requester);
		return;
	}
	session = new BrowserScreencastSession(key, params);
	sessions.set(key, session);
	session.addViewer(ws, requester);
	const next = session;
	next.trackWork(Promise.resolve(previousDrain).then(() => next.start()));
}
function stopBrowserScreencasts() {
	clearBrowserScreencastTokens();
	const drains = [...sessions.values()].map((session) => session.close(1012, "gateway shutting down"));
	return Promise.allSettled(drains).then(() => {});
}
//#endregion
export { stopBrowserScreencasts as n, attachBrowserScreencastViewer as t };
