//#region src/channels/typing-lifecycle.ts
/** Creates a cancellable keepalive loop for channel typing indicators. */
function createTypingKeepaliveLoop(params) {
	let timer;
	let tickInFlight = false;
	const tick = async () => {
		if (tickInFlight) return;
		tickInFlight = true;
		try {
			await params.onTick();
		} finally {
			tickInFlight = false;
		}
	};
	const start = () => {
		if (params.intervalMs <= 0 || timer) return;
		timer = setInterval(() => {
			tick().catch((err) => {
				const reason = err instanceof Error ? err.message : String(err);
				console.warn(`[typing] keepalive tick failed: ${reason}`);
			});
		}, params.intervalMs);
		timer.unref?.();
	};
	const stop = () => {
		clearInterval(timer);
		timer = void 0;
	};
	return {
		tick,
		start,
		stop,
		isRunning: () => timer !== void 0
	};
}
//#endregion
export { createTypingKeepaliveLoop as t };
