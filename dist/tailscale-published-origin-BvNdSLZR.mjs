import { setMaxListeners } from "node:events";
//#region src/gateway/tailscale-published-origin.ts
let publishedOrigin;
/** Publish only a live managed route; its owner withdraws the origin on exit or shutdown. */
function prepareTailscalePublishedOrigin(snapshot) {
	const url = new URL(snapshot.origin);
	if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("Tailscale published origin must be an absolute HTTPS origin");
	const owner = new AbortController();
	setMaxListeners(0, owner.signal);
	const previous = publishedOrigin?.owner;
	publishedOrigin = {
		origin: url.origin,
		mode: snapshot.mode,
		owner
	};
	previous?.abort();
	return () => {
		if (publishedOrigin?.owner === owner) publishedOrigin = void 0;
		owner.abort();
	};
}
function getTailscalePublishedOrigin() {
	return publishedOrigin ? {
		origin: publishedOrigin.origin,
		mode: publishedOrigin.mode,
		signal: publishedOrigin.owner.signal
	} : void 0;
}
//#endregion
export { prepareTailscalePublishedOrigin as n, getTailscalePublishedOrigin as t };
