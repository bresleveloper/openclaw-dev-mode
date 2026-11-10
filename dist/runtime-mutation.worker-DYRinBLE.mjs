//#region src/cron/store/runtime-mutation.worker.ts
function createCronMutationLogger(logs) {
	const record = (level) => (fields, message) => {
		logs.push({
			level,
			fields,
			message
		});
	};
	return {
		debug: record("debug"),
		info: record("info"),
		warn: record("warn"),
		error: record("error")
	};
}
//#endregion
export { createCronMutationLogger as t };
