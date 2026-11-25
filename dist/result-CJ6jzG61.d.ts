/** Result of a fallible operation. Expected failures use the `ok: false` arm. */
type Result<TValue, TError> = {
  ok: true;
  value: TValue;
} | {
  ok: false;
  error: TError;
};
export { Result as t };