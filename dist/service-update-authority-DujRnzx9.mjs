import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/daemon/service-update-authority.ts
const GATEWAY_UPDATE_EXECUTOR_CONTRACT = "root-spawner-v1";
var GatewayServiceAuthorityError = class extends Error {
	constructor(cause, outcome) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.outcome = outcome;
		this.code = "service-authority-revoked";
		this.name = "GatewayServiceAuthorityError";
	}
};
const owners = new AsyncLocalStorage();
const nativeCommands = /* @__PURE__ */ new WeakMap();
const nativeDispatches = /* @__PURE__ */ new WeakMap();
/** Only the current update interval can supply native process custody. */
function getGatewayServiceUpdateNativeCommand() {
	const owner = owners.getStore();
	return owner ? nativeCommands.get(owner.assertCurrent) : void 0;
}
/** Bind the caller and every inherited update grant to this native-operation lifetime.
* Inherited async work and retained callbacks must fail after closure. */
async function withGatewayServiceUpdateAuthority(assertOwner, operation, options) {
	const parent = owners.getStore();
	const originalRoot = parent?.originalRoot ?? options?.originalRoot;
	let active = true;
	let accepting = true;
	let tail = Promise.resolve();
	const pending = /* @__PURE__ */ new Set();
	const nativeCommand = options?.nativeCommand;
	const track = (work) => {
		pending.add(work);
		work.then(() => pending.delete(work), () => pending.delete(work));
		return work;
	};
	const assertScope = (compensating = false) => {
		if (!active) throw new GatewayServiceAuthorityError(/* @__PURE__ */ new Error("Native service authority has closed."));
		try {
			owners.run(parent, () => {
				parent?.assertCurrent();
				options?.assertRecoveryCurrent?.();
				if (!compensating || !options?.assertRecoveryCurrent) assertOwner?.();
			});
		} catch (error) {
			throw error instanceof GatewayServiceAuthorityError ? error : new GatewayServiceAuthorityError(error);
		}
	};
	const assertCurrent = () => assertScope();
	try {
		assertCurrent();
	} catch (error) {
		throw new GatewayServiceAuthorityError(error, "unchanged");
	}
	if (nativeCommand) {
		const dispatch = (nativeCommand === (parent && nativeCommands.get(parent.assertCurrent)) ? nativeDispatches.get(nativeCommand) : void 0) ?? (async (argv, commandOptions, assertSubmittedScope) => {
			if (!active || !accepting) throw new GatewayServiceAuthorityError(/* @__PURE__ */ new Error("Native service authority has closed."));
			const command = [...argv];
			const selected = {
				...commandOptions,
				baseEnv: { ...commandOptions.baseEnv },
				env: { ...commandOptions.env }
			};
			const deadline = selected.timeoutMs === void 0 ? void 0 : Date.now() + resolveTimerTimeoutMs(selected.timeoutMs, 1);
			const expired = () => Object.assign(/* @__PURE__ */ new Error("Native command admission timed out."), { code: "ETIMEDOUT" });
			const previous = tail;
			let started = false;
			const work = track(previous.then(async () => {
				if (!active || !accepting) throw new GatewayServiceAuthorityError(/* @__PURE__ */ new Error("Native service authority has closed."));
				assertCurrent();
				assertSubmittedScope();
				selected.signal?.throwIfAborted();
				const remaining = deadline === void 0 ? void 0 : deadline - Date.now();
				if (remaining !== void 0 && remaining <= 0) throw expired();
				started = true;
				const result = await nativeCommand(command, {
					...selected,
					timeoutMs: remaining
				});
				if (result.cleanup === "uncertain") throw new CommandProcessCleanupError();
				assertCurrent();
				assertSubmittedScope();
				return result;
			}));
			tail = work.then(() => void 0, () => void 0);
			if (await awaitWithinDeadline(() => previous, deadline) === ABSOLUTE_DEADLINE_EXPIRED && !started) throw expired();
			return await work;
		});
		const bound = (argv, commandOptions) => {
			if (!active || !accepting) return Promise.reject(new GatewayServiceAuthorityError(/* @__PURE__ */ new Error("Native service authority has closed.")));
			return track(dispatch(argv, commandOptions, assertCurrent));
		};
		nativeCommands.set(assertCurrent, bound);
		nativeDispatches.set(bound, dispatch);
	}
	try {
		return await owners.run({
			assertCurrent,
			updateOwned: parent?.updateOwned || (options?.updateOwned ?? true),
			originalRoot,
			compensate: (restore) => owners.run(parent, () => withGatewayServiceUpdateAuthority(() => assertScope(true), restore, {
				originalRoot,
				nativeCommand
			}))
		}, async () => {
			const invoke = async () => {
				try {
					const result = await operation(assertCurrent);
					if (!nativeCommand) assertCurrent();
					return result;
				} catch (error) {
					throw retainServiceAuthorityFailure(error);
				}
			};
			if (!nativeCommand) return await invoke();
			const [outcome] = await Promise.allSettled([invoke()]);
			accepting = false;
			if (outcome.status === "rejected") active = false;
			const failures = [];
			while (pending.size) for (const settlement of await Promise.allSettled(pending)) if (settlement.status === "rejected") failures.push(settlement.reason);
			if (failures.length) throw new AggregateError(outcome.status === "rejected" ? [outcome.reason, ...failures] : failures, "Native command scope did not settle successfully.");
			if (outcome.status === "rejected") throw outcome.reason;
			assertCurrent();
			return outcome.value;
		});
	} finally {
		accepting = false;
		active = false;
		await Promise.allSettled(pending);
		const bound = nativeCommands.get(assertCurrent);
		if (bound) nativeDispatches.delete(bound);
		nativeCommands.delete(assertCurrent);
	}
}
/** Ordinary user service commands have no update owner and retain their behavior. */
function assertGatewayServiceUpdateCurrent() {
	const owner = owners.getStore();
	owner?.assertCurrent();
	return owner !== void 0;
}
function isUpdateOwnedGatewayServiceCommand() {
	return owners.getStore()?.updateOwned === true;
}
/** Original-root evidence is usable only while its inherited owner remains live. */
function readGatewayServiceUpdateOriginalRoot() {
	const owner = owners.getStore();
	owner?.assertCurrent();
	return owner?.originalRoot;
}
/** Detached or unmanaged fallbacks cannot retain the updater grant. */
function assertGatewayServiceFallbackAllowed(action) {
	assertGatewayServiceUpdateCurrent();
	if (isUpdateOwnedGatewayServiceCommand()) throw new Error(`UPDATE_NATIVE_AUTHORITY: ${action} is not an update-owned native operation.`);
}
function retainServiceAuthorityFailure(error) {
	if (!(error instanceof GatewayServiceAuthorityError)) try {
		assertGatewayServiceUpdateCurrent();
	} catch (cause) {
		return new GatewayServiceAuthorityError(new AggregateError([error, cause], cause instanceof Error ? cause.message : String(cause)));
	}
	return error;
}
/** Only captured publication receipts may use this while their original lock is live. */
async function withGatewayServiceInstallationRecovery(install, restore) {
	try {
		const result = await install();
		assertGatewayServiceUpdateCurrent();
		return result;
	} catch (cause) {
		if (hasCommandProcessCleanupError(cause)) throw cause;
		const error = retainServiceAuthorityFailure(cause);
		let restored;
		try {
			const owner = owners.getStore();
			restored = await (owner ? owner.compensate(restore) : restore());
		} catch (recoveryError) {
			const failure = new AggregateError([error, recoveryError], `${error instanceof Error ? error.message : String(error)}\nThe previous service definition could not be restored.`);
			throw error instanceof GatewayServiceAuthorityError ? new GatewayServiceAuthorityError(failure, "recovery-pending") : failure;
		}
		throw error instanceof GatewayServiceAuthorityError ? new GatewayServiceAuthorityError(error, error.outcome === "recovery-pending" ? error.outcome : restored ? "restored" : error.outcome ?? "unchanged") : error;
	}
}
//#endregion
export { getGatewayServiceUpdateNativeCommand as a, withGatewayServiceInstallationRecovery as c, assertGatewayServiceUpdateCurrent as i, withGatewayServiceUpdateAuthority as l, GatewayServiceAuthorityError as n, isUpdateOwnedGatewayServiceCommand as o, assertGatewayServiceFallbackAllowed as r, readGatewayServiceUpdateOriginalRoot as s, GATEWAY_UPDATE_EXECUTOR_CONTRACT as t };
