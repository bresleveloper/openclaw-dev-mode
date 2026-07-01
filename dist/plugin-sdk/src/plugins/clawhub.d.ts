import type { RuntimeVersionEnv } from "../version.js";
import { CLAWHUB_INSTALL_ERROR_CODE, type ClawHubInstallErrorCode } from "./clawhub-error-codes.js";
import type { ClawHubPluginInstallRecordFields } from "./clawhub-install-records.js";
import type { InstallSafetyOverrides } from "./install-security-scan.js";
import { type InstallPluginResult } from "./install.js";
export { CLAWHUB_INSTALL_ERROR_CODE };
export type { ClawHubInstallErrorCode };
type PluginInstallLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
type ClawHubInstallFailure = {
    ok: false;
    error: string;
    code?: ClawHubInstallErrorCode;
};
export declare function formatClawHubSpecifier(params: {
    name: string;
    version?: string;
}): string;
export declare function installPluginFromClawHub(params: InstallSafetyOverrides & {
    spec: string;
    baseUrl?: string;
    token?: string;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    extensionsDir?: string;
    timeoutMs?: number;
    dryRun?: boolean;
    expectedPluginId?: string;
    env?: RuntimeVersionEnv;
}): Promise<({
    ok: true;
} & Extract<InstallPluginResult, {
    ok: true;
}> & {
    clawhub: ClawHubPluginInstallRecordFields;
    packageName: string;
}) | ClawHubInstallFailure | Extract<InstallPluginResult, {
    ok: false;
}>>;
