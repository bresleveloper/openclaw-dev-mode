import { type TaskSummary } from "../../../packages/gateway-protocol/src/index.js";
import type { TaskRecord } from "../../tasks/task-registry.types.js";
import type { GatewayRequestHandlers } from "./types.js";
declare function mapTaskSummary(task: TaskRecord): TaskSummary;
export declare const tasksHandlers: GatewayRequestHandlers;
export declare const testApi: {
    mapTaskSummary: typeof mapTaskSummary;
};
export { testApi as __test };
