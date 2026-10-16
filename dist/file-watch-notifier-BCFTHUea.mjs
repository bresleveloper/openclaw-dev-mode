import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
//#region src/infra/file-watch-notifier.ts
/** Same-version watch IPC carries level invalidations, not an event history. */
function createFileWatchNotifier(output, onFailure) {
	const pending = /* @__PURE__ */ new Set();
	let rejectWrite;
	let accepting = true;
	let writing = false;
	let failure;
	let draining;
	let closing;
	const fail = (cause) => {
		if (failure) return;
		failure = cause instanceof Error ? cause : new Error("File watch output failed", { cause });
		accepting = false;
		pending.clear();
		rejectWrite?.(failure);
		try {
			onFailure();
		} catch (error) {
			failure = new AggregateError([failure, error], "File watch output retirement failed");
		}
	};
	const onClose = () => {
		if (!accepting && !writing && !pending.size) return;
		fail(/* @__PURE__ */ new Error("File watch output closed before notification retirement"));
	};
	output.on("error", fail);
	output.on("close", onClose);
	output.on("finish", onClose);
	queueMicrotask(() => {
		if (output.destroyed || output.writableEnded) onClose();
	});
	const pump = () => {
		if (draining || failure || !pending.size) return;
		const done = createDeferredCore();
		draining = done.promise;
		(async () => {
			while (pending.size) {
				const event = pending.values().next().value;
				pending.delete(event);
				await new Promise((resolve, reject) => {
					rejectWrite = reject;
					writing = true;
					try {
						output.write(JSON.stringify(event) + "\n", (error) => {
							writing = false;
							rejectWrite = void 0;
							if (error) reject(error);
							else resolve();
						});
					} catch (error) {
						writing = false;
						rejectWrite = void 0;
						reject(error instanceof Error ? error : new Error("File watch output write failed", { cause: error }));
					}
				});
			}
		})().catch(fail).then(() => {
			draining = void 0;
			rejectWrite = void 0;
			if (pending.size && !failure) pump();
			done.resolve();
		});
	};
	return {
		send(event) {
			if (!accepting) return;
			pending.delete(event);
			pending.add(event);
			pump();
		},
		close() {
			if (closing) return closing;
			accepting = false;
			closing = Promise.resolve().then(async () => {
				for (let active = draining; active; active = draining) await active;
				await new Promise((resolve) => {
					process.nextTick(resolve);
				});
				output.off("error", fail);
				output.off("close", onClose);
				output.off("finish", onClose);
				if (failure) throw failure;
			});
			return closing;
		}
	};
}
//#endregion
export { createFileWatchNotifier as t };
