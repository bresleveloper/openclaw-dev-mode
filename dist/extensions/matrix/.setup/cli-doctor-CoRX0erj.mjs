import { l as sanitizeMatrixPathSegment } from "./storage-paths-e_Vq6cvw.mjs";
import { n as listMatrixCryptoUnsafeState, r as recoverMatrixCryptoUnsafeState } from "./crypto-unsafe-state-doctor-D3WLE-t4.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import path from "node:path";
// extensions/matrix/src/cli-doctor.ts
function registerMatrixDoctorCommands(params) {
	const accountForRoot = (rootDir, stateDir) => rootDir === path.resolve(stateDir, "matrix") ? "default" : path.basename(path.dirname(path.dirname(rootDir)));
	const doctor = params.program.description("Inspect and recover Matrix crypto storage refusal");
	doctor.command("inspect").description("List accounts blocked by an unsafe crypto final save (read-only)").option("--json", "Output JSON").action(async (options) => {
		const stateDir = params.stateDir;
		const accounts = (await listMatrixCryptoUnsafeState(stateDir, { openKeyedStoreV2: params.context.openPluginStateKeyedStore })).map((rootDir) => ({
			account: accountForRoot(rootDir, stateDir),
			rootDir
		}));
		if (options.json) console.log(JSON.stringify({ blocked: accounts }, null, 2));
		else {
			console.log(accounts.length ? `Matrix crypto refusal: ${accounts.length} account store(s) blocked` : "No blocked Matrix crypto stores found.");
			for (const account of accounts) console.log(`- ${account.account}: ${account.rootDir}`);
		}
	});
	doctor.command("recover").description("Accept rollback to a validated SQLite snapshot and clear one account's refusal").requiredOption("--account <id>", "Blocked account ID").requiredOption("--accept-snapshot-rollback", "Acknowledge that keys from the failed owner may be lost").action(async (options) => {
		const stateDir = params.stateDir;
		const account = sanitizeMatrixPathSegment(normalizeAccountId(options.account));
		const stateRuntime = { openKeyedStoreV2: params.context.openPluginStateKeyedStore };
		const roots = (await listMatrixCryptoUnsafeState(stateDir, stateRuntime)).filter((rootDir) => accountForRoot(rootDir, stateDir) === account);
		if (roots.length !== 1) throw new Error(`Expected exactly one blocked Matrix crypto store for account ${account}; found ${roots.length}. Refusing ambiguous recovery.`);
		await recoverMatrixCryptoUnsafeState({
			storageRootDir: roots[0],
			acceptSnapshotRollback: options.acceptSnapshotRollback === true,
			stateRuntime
		});
		console.log(`Matrix crypto refusal cleared for account ${account}. Run openclaw update repair (or openclaw doctor --fix) to finish pending migrations, then restart the Gateway.`);
	});
}
export { registerMatrixDoctorCommands };
