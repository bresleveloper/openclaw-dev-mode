import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/runtime-vitals.ts
/** Process observations shared by health snapshots and host resource polling. */
const GatewayEventLoopHealthSchema = closedObject({
	degraded: Type.Boolean(),
	degradedSinceMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	reasons: Type.Array(Type.Union([
		Type.Literal("event_loop_delay"),
		Type.Literal("event_loop_utilization"),
		Type.Literal("cpu")
	])),
	intervalMs: Type.Number({ minimum: 0 }),
	delayP99Ms: Type.Number({ minimum: 0 }),
	delayMaxMs: Type.Number({ minimum: 0 }),
	utilization: Type.Number({ minimum: 0 }),
	cpuCoreRatio: Type.Number({ minimum: 0 }),
	cpuBreakdown: Type.Optional(closedObject({
		mainThreadCoreRatio: Type.Optional(Type.Number({ minimum: 0 })),
		workerCoreRatio: Type.Optional(Type.Number({ minimum: 0 })),
		/** Estimated process residual after main and tracked worker counters. */
		otherThreadsCoreRatio: Type.Optional(Type.Number({ minimum: 0 })),
		hostUtilization: Type.Optional(Type.Number({
			minimum: 0,
			maximum: 1
		})),
		hostCpuCount: Type.Optional(Type.Integer({ minimum: 1 }))
	}))
});
const GatewayProcessMemorySchema = closedObject({
	rssBytes: Type.Integer({ minimum: 0 }),
	heapUsedBytes: Type.Integer({ minimum: 0 }),
	heapTotalBytes: Type.Integer({ minimum: 0 }),
	externalBytes: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Included in externalBytes, not an additional memory category. */
	arrayBuffersBytes: Type.Optional(Type.Integer({ minimum: 0 }))
});
//#endregion
export { GatewayProcessMemorySchema as n, GatewayEventLoopHealthSchema as t };
