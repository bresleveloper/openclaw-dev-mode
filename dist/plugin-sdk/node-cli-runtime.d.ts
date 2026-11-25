import "../node-list-types-DLpCJFxG.js";
import { Command } from "commander";
/** Return color helpers that degrade to plain text in non-rich terminals. */
export declare function getNodesTheme(): {
  rich: boolean;
  heading: (value: string) => string;
  ok: (value: string) => string;
  warn: (value: string) => string;
  muted: (value: string) => string;
  error: (value: string) => string;
};
/** Run a node CLI action with standard failure text and authorization hints. */
export declare function runNodesCommand(label: string, action: () => Promise<void>): Promise<void>;
/** Attach shared Gateway connection/json options to a node command. */
export declare const nodesCallOpts: (cmd: Command, defaults?: {
  timeoutMs?: number;
}) => Command;
/** Build a node.invoke payload with an idempotency key and optional timeout. */
export declare function buildNodeInvokeParams(params: {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
}): Record<string, unknown>;