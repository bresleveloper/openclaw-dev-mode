//#region extensions/workboard/src/sqlite-store-errors.ts
function encodeWorkboardSqliteFailure(error, seen = /* @__PURE__ */ new Map()) {
	const failure = error instanceof Error ? error : new Error(String(error));
	const existing = seen.get(failure);
	if (existing) return existing;
	const encoded = {
		error: failure,
		name: failure.name,
		..."code" in failure && (typeof failure.code === "string" || typeof failure.code === "number") ? { code: failure.code } : {},
		..."errcode" in failure && typeof failure.errcode === "number" ? { errcode: failure.errcode } : {},
		..."errstr" in failure && typeof failure.errstr === "string" ? { errstr: failure.errstr } : {}
	};
	seen.set(failure, encoded);
	if (failure instanceof AggregateError) encoded.aggregate = failure.errors.map((entry) => encodeWorkboardSqliteFailure(entry, seen));
	if (failure.cause instanceof Error) encoded.cause = encodeWorkboardSqliteFailure(failure.cause, seen);
	return encoded;
}
function decodeWorkboardSqliteFailure(failure, seen = /* @__PURE__ */ new Map()) {
	const existing = seen.get(failure);
	if (existing) return existing;
	const error = failure.aggregate ? new AggregateError([], failure.error.message) : failure.error;
	seen.set(failure, error);
	if (failure.name !== void 0) error.name = failure.name;
	if (failure.error.stack !== void 0) error.stack = failure.error.stack;
	Object.assign(error, {
		...failure.code === void 0 ? {} : { code: failure.code },
		...failure.errcode === void 0 ? {} : { errcode: failure.errcode },
		...failure.errstr === void 0 ? {} : { errstr: failure.errstr }
	});
	if (failure.cause) error.cause = decodeWorkboardSqliteFailure(failure.cause, seen);
	if (failure.aggregate) Object.assign(error, { errors: failure.aggregate.map((entry) => decodeWorkboardSqliteFailure(entry, seen)) });
	return error;
}
function unwrapWorkboardSqliteResult(result) {
	if (result.ok) return result.value;
	throw decodeWorkboardSqliteFailure(result.failure);
}
//#endregion
export { unwrapWorkboardSqliteResult as n, encodeWorkboardSqliteFailure as t };
