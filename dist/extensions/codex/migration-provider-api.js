import { h as setManagedCodexPluginRoot } from "./.setup/managed-binary-ARII6CR1.mjs";
import { t as buildCodexMigrationProvider } from "./.setup/provider-Bn7SeMbj.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// extensions/codex/migration-provider-api.ts
function buildMigrationProvider(params) {
	setManagedCodexPluginRoot(path.dirname(fileURLToPath(import.meta.url)));
	return buildCodexMigrationProvider(params);
}
export { buildMigrationProvider };
