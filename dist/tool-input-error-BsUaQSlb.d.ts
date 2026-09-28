//#region src/agents/tool-input-error.d.ts
declare class ToolInputError extends Error {
  readonly status: number;
  constructor(message: string);
}
declare class ToolAuthorizationError extends ToolInputError {
  readonly status = 403;
  constructor(message: string);
}
//#endregion
export { ToolInputError as n, ToolAuthorizationError as t };