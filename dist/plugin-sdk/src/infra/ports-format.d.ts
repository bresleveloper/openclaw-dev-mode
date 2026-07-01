import type { PortListener, PortListenerKind, PortUsage } from "./ports-types.js";
/** Classifies a listener as OpenClaw Gateway, SSH tunnel, known non-gateway, or unknown. */
export declare function classifyPortListener(listener: PortListener, _port: number): PortListenerKind;
/** Returns true for one Gateway listener bound to an expected loopback or wildcard address. */
export declare function isSingleExpectedGatewayListener(listeners: PortListener[], port: number): boolean;
/** Returns true for one Gateway process represented by separate IPv4 and IPv6 loopback rows. */
export declare function isDualStackLoopbackGatewayListeners(listeners: PortListener[], port: number): boolean;
/** Returns true when listener rows describe a benign Gateway bind pattern. */
export declare function isExpectedGatewayListeners(listeners: PortListener[], port: number): boolean;
/** Builds user-facing remediation hints for processes occupying a port. */
export declare function buildPortHints(listeners: PortListener[], port: number): string[];
/** Formats one listener row for CLI diagnostics. */
export declare function formatPortListener(listener: PortListener): string;
/** Formats free/busy port diagnostics into CLI output lines. */
export declare function formatPortDiagnostics(diagnostics: PortUsage): string[];
