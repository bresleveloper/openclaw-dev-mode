//#region src/process/process-deadline.ts
/** Let pending child exit and output notifications run before accepting a deadline. */
function setProcessTimeout(callback, delayMs) {
	let decision;
	const timer = setTimeout(() => {
		decision = setTimeout(callback, 0);
	}, delayMs);
	return {
		clear() {
			clearTimeout(timer);
			clearTimeout(decision);
		},
		refresh() {
			clearTimeout(decision);
			decision = void 0;
			timer.refresh();
		}
	};
}
//#endregion
export { setProcessTimeout as t };
