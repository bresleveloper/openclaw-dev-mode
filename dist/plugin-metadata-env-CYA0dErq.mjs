import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { l as shouldTrustTestBundledPluginsDirOverride } from "./bundled-dir-BGJkK8G5.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-DEOzYnOP.mjs";
import { P as hashJson } from "./discovery-D_5mAUI7.mjs";
//#region src/plugins/plugin-metadata-env.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"ANDROID_DATA",
	"APPDATA",
	"HOME",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_DEV_SOURCE_ROOT",
	"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
	"OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"OPENCLAW_HOME",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_STATE_DIR",
	"PREFIX",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
/** Compares discovery namespaces without resolving or probing filesystem roots. */
function resolvePluginMetadataEnvFingerprint(env = process.env) {
	return hashJson({
		env: Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
			const value = env[key];
			return value === void 0 ? [] : [[key, value]];
		})),
		installRoots: hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots() : void 0,
		trustBundledPluginsDirOverride: shouldTrustTestBundledPluginsDirOverride(env),
		cwd: tryProcessCwd()
	});
}
//#endregion
export { resolvePluginMetadataEnvFingerprint as t };
