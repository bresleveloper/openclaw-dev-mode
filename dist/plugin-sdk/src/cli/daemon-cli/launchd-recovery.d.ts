declare const LAUNCH_AGENT_RECOVERY_MESSAGE = "Gateway LaunchAgent was installed but not loaded; re-bootstrapped launchd service.";
type LaunchAgentRecoveryAction = "started" | "restarted";
type LaunchAgentRecoveryResult = {
    result: LaunchAgentRecoveryAction;
    loaded: true;
    message: string;
};
/** Re-bootstrap an installed but unloaded LaunchAgent after a daemon start/restart command. */
export declare function recoverInstalledLaunchAgent(params: {
    result: LaunchAgentRecoveryAction;
    env?: Record<string, string | undefined>;
}): Promise<LaunchAgentRecoveryResult | null>;
/** User-facing recovery message for successful LaunchAgent bootstrap repair. */
export { LAUNCH_AGENT_RECOVERY_MESSAGE };
