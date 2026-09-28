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
			tick();
		}, params.intervalMs);
		timer.unref?.();
	};
	const stop = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = void 0;
		tickInFlight = false;
	};
	const isRunning = () => timer !== void 0;
	return {
		tick,
		start,
		stop,
		isRunning
	};
}
//#endregion
export { createTypingKeepaliveLoop as t };
