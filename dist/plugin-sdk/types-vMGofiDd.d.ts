//#region src/tools/types.d.ts
/**
 * Public descriptor contracts for the generic OpenClaw tool planner.
 *
 * These types keep tool ownership, execution, availability, and protocol
 * metadata separate so core, plugins, channels, and MCP servers share one plan.
 */
/** JSON primitive accepted in descriptor schemas and availability context values. */
type JsonPrimitive = string | number | boolean | null;
/** Readonly JSON value accepted by public descriptor metadata. */
type JsonValue = JsonPrimitive | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
/** Readonly JSON object accepted by public descriptor metadata. */
type JsonObject = {
  readonly [key: string]: JsonValue;
};
/** Owner family responsible for defining a tool descriptor. */
type ToolOwnerRef = {
  readonly kind: "core";
} | {
  readonly kind: "plugin";
  readonly pluginId: string;
} | {
  readonly kind: "channel";
  readonly channelId: string;
  readonly pluginId?: string;
} | {
  readonly kind: "mcp";
  readonly serverId: string;
};
/** Runtime executor target used after a tool has passed availability planning. */
type ToolExecutorRef = {
  readonly kind: "core";
  readonly executorId: string;
} | {
  readonly kind: "plugin";
  readonly pluginId: string;
  readonly toolName: string;
} | {
  readonly kind: "channel";
  readonly channelId: string;
  readonly actionId: string;
} | {
  readonly kind: "mcp";
  readonly serverId: string;
  readonly toolName: string;
};
/** Atomic condition used to decide whether a tool is visible. */
type ToolAvailabilitySignal = {
  readonly kind: "always";
} | {
  readonly kind: "auth";
  readonly providerId: string;
} | {
  readonly kind: "config";
  readonly path: readonly string[];
  readonly check?: "exists" | "non-empty" | "available";
} | {
  readonly kind: "env";
  readonly name: string;
} | {
  readonly kind: "plugin-enabled";
  readonly pluginId: string;
} | {
  readonly kind: "context";
  readonly key: string;
  readonly equals?: JsonPrimitive;
};
/** Boolean expression over tool availability signals. */
type ToolAvailabilityExpression = ToolAvailabilitySignal | {
  readonly allOf: readonly ToolAvailabilityExpression[];
} | {
  readonly anyOf: readonly ToolAvailabilityExpression[];
};
/** Public descriptor for a tool before runtime availability planning. */
type ToolDescriptor = {
  readonly name: string;
  readonly title?: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
  readonly outputSchema?: JsonObject;
  readonly owner: ToolOwnerRef;
  readonly executor?: ToolExecutorRef;
  readonly availability?: ToolAvailabilityExpression;
  readonly annotations?: JsonObject;
  readonly sortKey?: string;
};
/** Runtime facts used to evaluate descriptor availability expressions. */
type ToolAvailabilityContext = {
  readonly authProviderIds?: ReadonlySet<string>;
  readonly config?: JsonObject;
  readonly isConfigValueAvailable?: (params: {
    readonly value: JsonValue;
    readonly path: readonly string[];
    readonly signal: Extract<ToolAvailabilitySignal, {
      readonly kind: "config";
    }>;
  }) => boolean;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly enabledPluginIds?: ReadonlySet<string>;
  readonly values?: Readonly<Record<string, JsonPrimitive | undefined>>;
};
/** Stable reason code for an unavailable descriptor. */
type ToolUnavailableReason = "auth-missing" | "config-missing" | "context-mismatch" | "env-missing" | "plugin-disabled" | "unsupported-signal";
/** Diagnostic explaining why a descriptor is hidden from the visible plan. */
type ToolAvailabilityDiagnostic = {
  readonly reason: ToolUnavailableReason;
  readonly signal?: ToolAvailabilitySignal;
  readonly message: string;
};
/** Visible, callable tool entry selected by the planner. */
type ToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly executor: ToolExecutorRef;
};
/** Hidden descriptor plus diagnostics explaining why it is unavailable. */
type HiddenToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly diagnostics: readonly ToolAvailabilityDiagnostic[];
};
/** Complete planner output split into visible and hidden descriptors. */
type ToolPlan = {
  readonly visible: readonly ToolPlanEntry[];
  readonly hidden: readonly HiddenToolPlanEntry[];
};
/** Inputs required to build a tool plan. */
type BuildToolPlanOptions = {
  readonly descriptors: readonly ToolDescriptor[];
  readonly availability?: ToolAvailabilityContext;
};
//#endregion
export { JsonValue as a, ToolAvailabilityExpression as c, ToolExecutorRef as d, ToolOwnerRef as f, ToolUnavailableReason as h, JsonPrimitive as i, ToolAvailabilitySignal as l, ToolPlanEntry as m, HiddenToolPlanEntry as n, ToolAvailabilityContext as o, ToolPlan as p, JsonObject as r, ToolAvailabilityDiagnostic as s, BuildToolPlanOptions as t, ToolDescriptor as u };