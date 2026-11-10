import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { t as Utf8InputError } from "./utf8-input-n9WHttrc.mjs";
import { t as formatGatewayLockFailure } from "./gateway-lock-diagnostics--1HU333e.mjs";
//#region src/infra/state-migrations.lock.ts
/** Keep old Gateway writers excluded through migration, verification, and cleanup. */
async function withLegacyMigrationStateLock(options) {
	const env = {
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: 25,
			role: "sqlite-maintenance",
			timeoutMs: 250
		});
	} catch (error) {
		const detail = options.formatAcquireError?.(error) ?? formatGatewayLockFailure(error);
		const guidance = options.retryGuidance ?? "Resolve the lock failure, then run `openclaw doctor --fix` again.";
		return {
			changes: [],
			warnings: [`Failed migrating ${options.label}: ${detail}. ${guidance}`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: [`Failed migrating ${options.label}: exclusive state ownership unavailable.`]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		result = await lock.run(() => options.run(env));
	} catch (error) {
		if (!options.errorLabel) throw error;
		result.warnings.push(`${options.errorLabel}: ${String(error)}`);
		if (error instanceof Utf8InputError) result.warningDisposition = "recoverable";
	} finally {
		try {
			await lock.run(() => options.beforeRelease?.());
		} catch (error) {
			releaseError = error;
		}
		try {
			await lock.release();
		} catch (error) {
			releaseError ??= error;
		}
	}
	if (releaseError) {
		delete result.warningDisposition;
		result.warnings.push(`${options.releaseLabel} migration lock release failed: ${formatErrorMessage(releaseError)}`);
	}
	return result;
}
//#endregion
export { withLegacyMigrationStateLock as t };
