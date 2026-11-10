import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
//#region src/auto-reply/reply/message-injection-authority.ts
const injectionQueues = resolveGlobalSingleton(Symbol.for("openclaw.messageInjectionQueues"), () => /* @__PURE__ */ new WeakMap());
const injectionAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.messageInjectionAdmissions"), () => /* @__PURE__ */ new WeakMap());
const questionAssertionFrame = resolveGlobalSingleton(Symbol.for("openclaw.messageInjectionQuestionAssertionFrame"), () => ({ active: false }));
/** Released adapters may wrap the callback; scope only its synchronous question assertion. */
function withQuestionInputAssertion(assertCurrent) {
	const previous = questionAssertionFrame.active;
	questionAssertionFrame.active = true;
	try {
		assertCurrent();
	} finally {
		questionAssertionFrame.active = previous;
	}
}
/** Queue predicates remain final; question grants retain the original policy/source assertion. */
function createLegacyMessageInjectionAuthority(assertCurrent, assertQueueCurrent) {
	return createMessageInjectionAuthority(() => {
		assertCurrent();
		if (!questionAssertionFrame.active) {
			assertQueueCurrent();
			assertCurrent();
		}
		return true;
	});
}
/** Bind final enqueue custody to this exact host-owned preparation. */
function bindMessageInjectionAdmission(prepare, admission) {
	injectionAdmissions.set(prepare, admission);
}
async function withMessageInjectionAdmission(prepare, consume) {
	let consumed = false;
	const consumeSync = () => {
		if (consumed) throw new Error("Message injection admission already consumed its input");
		const result = consume();
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("Message injection admission consumers must remain synchronous");
		}
		consumed = true;
		return result;
	};
	const admission = prepare && injectionAdmissions.get(prepare);
	if (!admission) {
		if (prepare) await prepare();
		return consumeSync();
	}
	try {
		const result = await admission(consumeSync);
		if (!consumed) throw new Error("Message injection admission did not consume its input");
		return result;
	} catch (cause) {
		if (consumed) throw new MessageInjectionAcceptedUnconfirmedError({ cause });
		throw cause;
	}
}
/** Order preparation on the captured backend; release before awaiting delivery. */
function enqueueMessageInjection(backend, run) {
	let queue = injectionQueues.get(backend);
	if (!queue) {
		queue = new KeyedAsyncQueue();
		injectionQueues.set(backend, queue);
	}
	const result = createDeferredCore();
	queue.enqueue("input", () => new Promise((release) => {
		run(release).then(result.resolve, result.reject).finally(release);
	})).catch(result.reject);
	return result.promise;
}
/** A refused owner assertion is terminal for this input, not permission to redispatch it. */
var MessageInjectionAuthorityError = class extends Error {
	constructor(options) {
		super("Message injection authority is no longer current", options);
		this.name = "MessageInjectionAuthorityError";
	}
};
/** The caller remains valid, but this target can no longer receive its input. */
var MessageInjectionTargetUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "MessageInjectionTargetUnavailableError";
	}
};
/** The delivery owner removed the exact queued input before provider submission. */
var MessageInjectionWithdrawnError = class extends MessageInjectionTargetUnavailableError {
	constructor(message) {
		super(message);
		this.name = "MessageInjectionWithdrawnError";
	}
};
/** Enqueued input retains custody even when admission cleanup or notification fails. */
var MessageInjectionAcceptedUnconfirmedError = class extends Error {
	constructor(options) {
		super("Message injection was accepted but its completion is unconfirmed", options);
		this.name = "MessageInjectionAcceptedUnconfirmedError";
	}
};
/** One injection stays revoked even if its source later appears current again. */
function createMessageInjectionAuthority(canInject) {
	let revoked;
	return () => {
		if (!revoked) {
			try {
				if (canInject()) return;
			} catch (cause) {
				revoked = new MessageInjectionAuthorityError({ cause });
			}
			revoked ??= new MessageInjectionAuthorityError();
		}
		throw revoked;
	};
}
//#endregion
export { bindMessageInjectionAdmission as a, enqueueMessageInjection as c, MessageInjectionWithdrawnError as i, withMessageInjectionAdmission as l, MessageInjectionAuthorityError as n, createLegacyMessageInjectionAuthority as o, MessageInjectionTargetUnavailableError as r, createMessageInjectionAuthority as s, MessageInjectionAcceptedUnconfirmedError as t, withQuestionInputAssertion as u };
