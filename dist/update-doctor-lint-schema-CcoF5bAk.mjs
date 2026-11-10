import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
//#region src/infra/update-doctor-lint-schema.ts
const UpdateDoctorLintFindingSchema = object({
	checkId: string().refine((value) => value.trim().length > 0),
	message: string(),
	source: string().optional(),
	errorCode: string().optional(),
	fixHint: string().optional(),
	severity: string().optional(),
	path: string().optional(),
	requirement: string().optional()
});
//#endregion
export { UpdateDoctorLintFindingSchema as t };
