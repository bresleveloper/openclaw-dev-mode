//#region src/gateway/websocket-keepalive.ts
/** Keep idle transports active; only the connection owner may impose a pong deadline. */
function startWebSocketKeepalive(socket, onMissedPong, transport) {
	let awaitingPong;
	let lastPongAt;
	let pongDeadline;
	let writeTimeoutActive = false;
	const previousTimeout = transport?.timeout ?? 0;
	const clearWriteTimeout = () => {
		if (writeTimeoutActive) {
			writeTimeoutActive = false;
			transport?.off("timeout", reportMissedPong);
			transport?.setTimeout(previousTimeout);
		}
	};
	const reportMissedPong = () => {
		if (awaitingPong) onMissedPong?.({
			...awaitingPong,
			lastPongAgeMs: lastPongAt === void 0 ? void 0 : performance.now() - lastPongAt,
			bufferedBytes: socket.bufferedAmount
		});
	};
	const onPong = () => {
		awaitingPong = void 0;
		pongDeadline = void 0;
		clearWriteTimeout();
		if (onMissedPong) lastPongAt = performance.now();
	};
	const stop = () => {
		clearInterval(timer);
		awaitingPong = void 0;
		clearWriteTimeout();
		socket.off("pong", onPong);
		socket.off("close", stop);
	};
	socket.on("pong", onPong);
	socket.once("close", stop);
	const timer = setInterval(() => {
		if (socket.readyState !== 1) {
			stop();
			return;
		}
		if (awaitingPong && onMissedPong) {
			if (writeTimeoutActive || pongDeadline !== void 0 && performance.now() < pongDeadline) return;
			reportMissedPong();
			return;
		}
		const attempt = { pingWriteState: "pending" };
		awaitingPong = attempt;
		pongDeadline = void 0;
		if (onMissedPong && transport) {
			writeTimeoutActive = true;
			transport.on("timeout", reportMissedPong);
			transport.setTimeout(25e3);
		}
		try {
			socket.ping(void 0, void 0, onMissedPong ? (error) => {
				if (awaitingPong !== attempt) return;
				attempt.pingWriteState = error ? "failed" : "completed";
				clearWriteTimeout();
				if (!error) pongDeadline = performance.now() + 25e3;
			} : void 0);
		} catch {
			attempt.pingWriteState = "failed";
			clearWriteTimeout();
		}
	}, 25e3);
	return stop;
}
//#endregion
export { startWebSocketKeepalive as t };
