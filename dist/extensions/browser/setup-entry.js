import { t as readBrowserHostConfig } from "../../extension-host-config-n0nWqOeB.mjs";
import { n as runBrowserExtensionSetup, r as normalizeExtensionInstallWaitMs, u as NativeHostSetupContextError } from "../../extension-setup-1P4YGVcJ.mjs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import path from "node:path";
//#region extensions/browser/setup-entry.ts
async function main() {
	const { values } = parseArgs({
		options: {
			action: { type: "string" },
			"wait-ms": {
				type: "string",
				default: "1000"
			}
		},
		allowPositionals: false,
		strict: true
	});
	const action = values.action;
	if (action !== "inspect" && action !== "install" && action !== "verify") throw new Error("An explicit Chrome setup action is required");
	const pluginRoot = path.dirname(fileURLToPath(import.meta.url));
	const controller = new AbortController();
	const abort = () => controller.abort();
	process.once("SIGINT", abort);
	process.once("SIGTERM", abort);
	try {
		const result = await runBrowserExtensionSetup({
			action,
			bundledDir: path.join(pluginRoot, "chrome-extension"),
			pluginRoot,
			cfg: await readBrowserHostConfig(),
			waitMs: normalizeExtensionInstallWaitMs(values["wait-ms"]),
			signal: controller.signal
		});
		process.stdout.write(`${JSON.stringify(result)}\n`);
	} finally {
		process.off("SIGINT", abort);
		process.off("SIGTERM", abort);
	}
}
main().catch((error) => {
	process.stderr.write(error instanceof NativeHostSetupContextError ? `${error.message}\n` : "Chrome setup could not finish. Check the local browser runtime.\n");
	process.exitCode = 1;
});
//#endregion
export {};
