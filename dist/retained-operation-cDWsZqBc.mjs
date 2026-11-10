import { AsyncLocalStorage } from "node:async_hooks";
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
function driveRetainedOperation(source, advance, onError) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			advance(completion, serviceInContext);
		} catch (error) {
			try {
				completion.reject(onError ? onError(error) : error);
			} catch (combined) {
				completion.reject(combined);
			}
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	return driveRetainedOperation(source, (completion) => {
		source.service();
		const outcome = source.read();
		if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!child) {
			source.service();
			const outcome = source.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "rejected") throw outcome.error;
			child = next(outcome.value);
			child.result.then(service, service);
		}
		child.service();
		const outcome = child.read();
		if (outcome.status === "fulfilled") completion.resolve(outcome.value);
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Join the owner's real cleanup; that owner chooses how simultaneous failures combine. */
function finallyRetainedOperation(source, cleanup, combineErrors = (_source, cleanupError) => cleanupError) {
	let original;
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!original) {
			try {
				source.service();
				const outcome = source.read();
				if (outcome.status === "pending") return;
				original = outcome;
			} catch (error) {
				original = {
					status: "rejected",
					error
				};
			}
			child = cleanup(original);
			child.result.then(service, service);
		}
		if (!child) return;
		child.service();
		const outcome = child.read();
		if (outcome.status === "pending") return;
		if (outcome.status === "rejected") throw outcome.error;
		if (original.status === "rejected") completion.reject(original.error);
		else completion.resolve(original.value);
	}, (error) => original?.status === "rejected" ? combineErrors(original.error, error) : error);
}
//#endregion
export { mapRetainedOperation as i, finallyRetainedOperation as n, flatMapRetainedOperation as r, createRetainedOperation as t };
