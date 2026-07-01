/**
 * Install telemetry switch.
 *
 * Environment overrides win over persisted settings for CI and packaged launcher control.
 */
import type { SettingsManager } from "./settings-manager.js";
/** Resolves whether install telemetry is enabled from env override or settings. */
export declare function isInstallTelemetryEnabled(settingsManager: SettingsManager, telemetryEnv?: string | undefined): boolean;
