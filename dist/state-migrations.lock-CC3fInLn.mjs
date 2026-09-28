import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-CYjRlApN.mjs";
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
		const detail = error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : options.formatAcquireError?.(error) ?? String(error);
		const guidance = options.retryGuidance ?? "Stop the Gateway and run `openclaw doctor --fix` again.";
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
		try {
			result = await lock.run(() => options.run(env));
		} catch (error) {
			if (!options.errorLabel) throw error;
			result.warnings.push(`${options.errorLabel}: ${String(error)}`);
		}
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
