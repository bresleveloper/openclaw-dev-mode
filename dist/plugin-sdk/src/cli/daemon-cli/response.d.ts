import { Writable } from "node:stream";
import type { GatewayService } from "../../daemon/service.js";
/** Gateway service action emitted by lifecycle commands. */
export type DaemonAction = "install" | "uninstall" | "start" | "stop" | "restart";
/** Stable hint category for machine-readable daemon command output. */
export type DaemonHintKind = "install" | "container-restart" | "container-foreground" | "systemd-unavailable" | "systemd-headless" | "wsl-systemd" | "generic";
/** Classified daemon recovery hint item. */
export type DaemonHintItem = {
    kind: DaemonHintKind;
    text: string;
};
/** Machine-readable response shape for service lifecycle commands. */
export type DaemonActionResponse = {
    ok: boolean;
    action: DaemonAction;
    result?: string;
    message?: string;
    error?: string;
    hints?: string[];
    hintItems?: DaemonHintItem[];
    warnings?: string[];
    service?: {
        label: string;
        loaded: boolean;
        loadedText: string;
        notLoadedText: string;
    };
};
/** Classify plain-text hints for JSON daemon responses. */
export declare function buildDaemonHintItems(hints: string[] | undefined): DaemonHintItem[] | undefined;
/** Build the service metadata snapshot embedded in JSON action responses. */
export declare function buildDaemonServiceSnapshot(service: GatewayService, loaded: boolean): {
    label: string;
    loaded: boolean;
    loadedText: string;
    notLoadedText: string;
};
/** Writable sink used when JSON output should suppress service command stdout. */
export declare function createNullWriter(): Writable;
/** Create stdout/warning/emit/fail helpers for one daemon lifecycle action. */
export declare function createDaemonActionContext(params: {
    action: DaemonAction;
    json: boolean;
}): {
    stdout: Writable;
    warnings: string[];
    emit: (payload: Omit<DaemonActionResponse, "action">) => void;
    fail: (message: string, hints?: string[]) => void;
};
/** Install a service, convert platform install failures to hints, and emit the final response. */
export declare function installDaemonServiceAndEmit(params: {
    serviceNoun: string;
    service: GatewayService;
    warnings: string[];
    emit: (payload: Omit<DaemonActionResponse, "action">) => void;
    fail: (message: string, hints?: string[]) => void;
    install: () => Promise<void>;
}): Promise<void>;
