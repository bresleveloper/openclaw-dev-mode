import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { createHash } from "node:crypto";
//#region src/claws/agent-config-digest.ts
function digestClawAgentConfig(agent) {
	return `sha256:${createHash("sha256").update(stableStringify(agent)).digest("hex")}`;
}
//#endregion
export { digestClawAgentConfig as t };
