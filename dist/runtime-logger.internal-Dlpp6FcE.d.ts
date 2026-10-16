import { n as RuntimeEnv, t as OutputRuntimeEnv } from "./runtime-DlqUc5_p.js";
//#region src/plugin-sdk/runtime-logger.internal.d.ts
type LoggerLike = {
  info: (message: string) => void;
  error: (message: string) => void;
};
declare function createLoggerBackedRuntime(params: {
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv;
declare function resolveRuntimeEnv(params: {
  runtime: RuntimeEnv;
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): RuntimeEnv;
declare function resolveRuntimeEnv(params: {
  runtime?: undefined;
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv;
//#endregion
export { resolveRuntimeEnv as n, createLoggerBackedRuntime as t };