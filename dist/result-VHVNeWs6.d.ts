//#region packages/normalization-core/src/result.d.ts
/** Result of a fallible operation. Expected failures use the `ok: false` arm. */
type Result<TValue, TError> = {
  ok: true;
  value: TValue;
} | {
  ok: false;
  error: TError;
};
//#endregion
export { Result as t };