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
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			source.service();
			const outcome = source.read();
			if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
			else if (outcome.status === "rejected") completion.reject(outcome.error);
		} catch (error) {
			completion.reject(error);
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	return flatMapRetainedOutcome(source, (outcome) => {
		if (outcome.status === "rejected") throw outcome.error;
		return next(outcome.value);
	});
}
/** Final-only recovery joins the owner's successor rather than replaying the failed operation. */
function flatMapRetainedOutcome(source, next) {
	const inContext = AsyncLocalStorage.snapshot();
	let child;
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!child) {
				let outcome;
				try {
					source.service();
					outcome = source.read();
				} catch (error) {
					outcome = {
						status: "rejected",
						error
					};
				}
				if (outcome.status === "pending") return;
				child = next(outcome);
				child.result.then(serviceInContext, serviceInContext);
			}
			child.service();
			const outcome = child.read();
			if (outcome.status === "fulfilled") completion.resolve(outcome.value);
			else if (outcome.status === "rejected") completion.reject(outcome.error);
		} catch (error) {
			completion.reject(error);
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Join the owner's real cleanup; that owner chooses how simultaneous failures combine. */
function finallyRetainedOperation(source, cleanup, combineErrors = (_source, cleanupError) => cleanupError) {
	const inContext = AsyncLocalStorage.snapshot();
	let original;
	let child;
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
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
				child.result.then(serviceInContext, serviceInContext);
			}
			if (!child) return;
			child.service();
			const outcome = child.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "rejected") throw outcome.error;
			if (original.status === "rejected") completion.reject(original.error);
			else completion.resolve(original.value);
		} catch (error) {
			try {
				completion.reject(original?.status === "rejected" ? combineErrors(original.error, error) : error);
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
//#endregion
export { mapRetainedOperation as i, finallyRetainedOperation as n, flatMapRetainedOperation as r, createRetainedOperation as t };
