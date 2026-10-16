import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/agents/cli-runner/log.ts
const cliBackendLog = createSubsystemLogger("agent/cli-backend");
const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
function formatCliBackendOutputDigest(text) {
	return `outBytes=${Buffer.byteLength(text, "utf8")} outHash=${sha256Hex(text).slice(0, 12)}`;
}
//#endregion
export { cliBackendLog as n, formatCliBackendOutputDigest as r, CLI_BACKEND_LOG_OUTPUT_ENV as t };
