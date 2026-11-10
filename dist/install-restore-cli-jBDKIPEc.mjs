import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { Jn as string, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { r as isRegularFile } from "./executable-path-hXcbMo0b.mjs";
import { n as resolveStableNodePath } from "./stable-node-path-CijB3tz6.mjs";
import { o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-Ddw1lcTH.mjs";
import { n as buildGatewayInstallEntrypointCandidates } from "./gateway-entrypoint-CiE2knkN.mjs";
import "./schtasks-Cm91eO2_.mjs";
import { s as resolvePinnedDaemonRuntimePath } from "./runtime-paths-v6m7qRRF.mjs";
import path from "node:path";
//#region src/cli/daemon-cli/install-restore-cli.ts
const expectedRuntimePinSchema = strictObject({
	revision: string(),
	definition: string().nullable()
});
function assertExpectedRuntimePin(raw, current, service) {
	const expected = safeParseJsonWithSchema(expectedRuntimePinSchema, raw);
	if (!expected) throw new Error("Invalid expected runtime pin snapshot.");
	if (expected.revision !== current.revision || expected.definition !== (current.definition ?? null)) throw new Error(`${service} service or runtime pin changed before installation. The newer selection was preserved; inspect it before retrying.`);
}
const serviceFile = string().refine((file) => path.isAbsolute(file) && !/[\0\r\n]/.test(file) && isRegularFile(file));
const restoreServiceCliSchema = strictObject({
	executable: string(),
	entrypoint: serviceFile.refine((entry) => path.basename(entry) === "openclaw.mjs" || buildGatewayInstallEntrypointCandidates(path.dirname(path.dirname(entry))).includes(path.normalize(entry))),
	sqliteLibrary: serviceFile.nullable()
});
/** Validate recovery before config preparation; SQLite selection changes only the service env. */
async function resolveRestoreServiceCli(raw, opts, installEnv) {
	const serviceCli = safeParseJsonWithSchema(restoreServiceCliSchema, raw);
	if (!serviceCli) throw new Error("Invalid restore service CLI.");
	const { runtime, runtimePath: pin, wrapper, expectedRuntimePin } = opts;
	const { executable, sqliteLibrary } = serviceCli;
	try {
		if (expectedRuntimePin === void 0) throw new Error("requires --expected-runtime-pin.");
		if (runtime !== "node" && runtime !== "bun") throw new Error("requires an explicit --runtime (\"node\" or \"bun\").");
		if (wrapper !== void 0 || installEnv["OPENCLAW_WRAPPER"]?.trim()) throw new Error("cannot be combined with a wrapper.");
		if (pin !== void 0 && path.normalize(pin) !== path.normalize(executable)) throw new Error("executable must match --runtime-path.");
		if (isUpdateOwnedGatewayServiceCommand() || isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS)) throw new Error("cannot be combined with update-owned reconciliation.");
		if (sqliteLibrary === null) delete installEnv.OPENCLAW_SQLITE_LIBRARY;
		else installEnv.OPENCLAW_SQLITE_LIBRARY = sqliteLibrary;
		let runtimePath = await resolvePinnedDaemonRuntimePath(executable, runtime, installEnv);
		if (runtime === "node" && pin === void 0 && runtimePath) runtimePath = await resolveStableNodePath(runtimePath);
		return {
			serviceCli,
			runtimePath
		};
	} catch (error) {
		throw new Error(`--restore-service-cli ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
}
//#endregion
export { resolveRestoreServiceCli as n, assertExpectedRuntimePin as t };
