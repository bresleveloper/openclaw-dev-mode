export { isCurrentProcessLaunchdServiceLabel } from "./launchd-current-service.js";
type LaunchdRestartHandoffMode = "kickstart" | "reload" | "start-after-exit";
type LaunchdRestartHandoffResult = {
    ok: boolean;
    pid?: number;
    detail?: string;
};
export declare function scheduleDetachedLaunchdRestartHandoff(params: {
    env?: Record<string, string | undefined>;
    mode: LaunchdRestartHandoffMode;
    waitForPid?: number;
}): LaunchdRestartHandoffResult;
