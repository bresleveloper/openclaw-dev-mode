import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as DARWIN_SYSTEM_PROBE_TIMEOUT_MS } from "./os-summary-B-12bRQs.mjs";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
//#region src/infra/machine-model.ts
const models = /* @__PURE__ */ new Map();
function resolveMachineModelIdentifier(platform = os.platform()) {
	if (models.has(platform)) return models.get(platform);
	let model;
	if (platform === "darwin") {
		const res = spawnSync("sysctl", ["-n", "hw.model"], {
			encoding: "utf-8",
			timeout: DARWIN_SYSTEM_PROBE_TIMEOUT_MS,
			killSignal: "SIGKILL"
		});
		model = normalizeOptionalString(res.stdout);
	} else if (platform === "linux") for (const file of ["/sys/devices/virtual/dmi/id/product_name", "/proc/device-tree/model"]) try {
		const value = readFileSync(file, "utf-8");
		model = normalizeOptionalString(value.trim().replace(/\0+$/, ""));
		if (model) {
			model = truncateUtf16Safe(model, 64);
			break;
		}
	} catch {}
	models.set(platform, model);
	return model;
}
//#endregion
export { resolveMachineModelIdentifier as t };
