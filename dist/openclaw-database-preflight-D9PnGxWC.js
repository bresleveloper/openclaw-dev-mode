import { $ as _enum, At as init_openclaw_state_db_paths, B as init_openclaw_state_db_maintenance, Cn as init_kysely_sync, Ct as init_openclaw_state_db_schema_migration_required, D as init_config_env_vars, Dt as init_sqlite_schema_contract, En as init_error_coercion, F as init_openclaw_state_db_fast_path, Ft as init_state_database_coordinator, Gt as init_runtime_process_entrypoints, H as init_openclaw_state_schema_publication, Ht as init_runtime_worker_url, It as init_sqlite_readonly_worker, L as init_openclaw_state_db_schema_repair, Mt as init_sqlite_snapshot_source, N as init_command_format, O as init_agent_scope_config, Ot as init_openclaw_quarantine_store, P as init_openclaw_state_db, Q as init_zod, Qt as init_deferred, T as init_openclaw_agent_db_registry_read, Yt as init_sqlite_user_version, Z as init_openclaw_state_schema, _ as init_openclaw_agent_db_registry, _n as init_errno, _t as init_sqlite_files, an as init_file_descriptor, at as string, b as init_agent_deletion_journal_read, bt as init_openclaw_state_db_schema_version, c as init_openclaw_database_verify, d as init_session_dirs, dn as createSubsystemLogger, en as init_openclaw_state_db_contract, et as discriminatedUnion, fn as init_subsystem, gt as init_openclaw_state_ownership, h as init_artifacts, it as object, j as init_openclaw_agent_db_contract, kn as __esmMin, ln as init_errors, mt as init_openclaw_state_worker_error, n as init_openclaw_agent_db, nn as init_sqlite_integrity, nt as literal, o as init_agent_database_admission, on as init_node_sqlite, ot as unknown, p as init_session_sqlite_target, pn as init_paths, q as init_openclaw_state_schema_compatibility, qt as init_sqlite_schema_header, rn as init_sqlite_file_generation, rt as number, u as init_targets, un as init_sqlite_error_diagnostics, ut as init_session_key, vt as init_runtime_process_url, xn as init_ansi, y as init_agent_deletion_journal, yn as init_path_guards } from "./state/openclaw-state-read.worker.js";
import { AsyncLocalStorage } from "node:async_hooks";
import "node:path";
import "node:fs";
import "node:os";
import "node:url";
import "node:child_process";
var init_agent_deletion_discovery = __esmMin((() => {
	init_paths();
	init_path_guards();
	init_sqlite_files();
	init_session_key();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_registry();
	init_openclaw_state_db_paths();
})), init_state_migrations_media_persistence_targets = __esmMin((() => {
	init_ansi();
	init_session_dirs();
	init_command_format();
	init_paths();
	init_artifacts();
	init_session_key();
	init_agent_deletion_discovery();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_registry();
	init_errno();
	init_path_guards();
}));
var init_agent_database_startup = __esmMin((() => {
	init_config_env_vars();
	init_errors();
	init_file_descriptor();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_subsystem();
	init_agent_database_admission();
	init_agent_deletion_journal();
	init_openclaw_state_db_paths();
	createSubsystemLogger("state/agent-admission");
	new AsyncLocalStorage();
}));
//#endregion
//#region src/infra/native-error-response-schema.ts
var nativeErrorDetailsSchema, nativeErrorResponseSchema;
var init_native_error_response_schema = __esmMin((() => {
	init_zod();
	nativeErrorDetailsSchema = object({
		message: string(),
		code: string().optional(),
		errcode: number().optional()
	});
	nativeErrorResponseSchema = nativeErrorDetailsSchema.extend({
		name: string(),
		cause: nativeErrorDetailsSchema.optional()
	});
}));
var init_native_error_response = __esmMin((() => {}));
var agentSchemaInspectionErrorSchema;
var init_openclaw_agent_schema_inspection_response = __esmMin((() => {
	init_zod();
	init_native_error_response_schema();
	init_native_error_response();
	init_sqlite_error_diagnostics();
	init_openclaw_state_worker_error();
	agentSchemaInspectionErrorSchema = nativeErrorResponseSchema.extend({ stateError: unknown().optional() });
}));
var init_openclaw_agent_schema_inspection_worker = __esmMin((() => {
	init_error_coercion();
	init_zod();
	init_runtime_process_url();
	init_runtime_worker_url();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_deferred();
	init_openclaw_agent_schema_inspection_response();
	discriminatedUnion("ok", [object({
		requestId: number().int().safe(),
		ok: literal(false),
		error: agentSchemaInspectionErrorSchema
	}), object({
		requestId: number().int().safe(),
		ok: literal(true),
		inspection: object({
			version: number().int().safe(),
			integrityGateOutcome: _enum(["cached", "healthy"]).optional(),
			writerAppVersion: string().optional(),
			reason: string().optional(),
			failure: agentSchemaInspectionErrorSchema.optional(),
			agentSchemaMeta: object({
				agentId: string().nullable(),
				role: string().nullable(),
				schemaVersion: number().nullable()
			}).nullable().optional()
		}).nullable()
	})]);
}));
var init_usingCtx = __esmMin((() => {}));
var init_openclaw_database_preflight_agent_scheduler = __esmMin((() => {
	init_sqlite_readonly_worker();
	init_deferred();
	init_openclaw_agent_schema_inspection_worker();
	init_usingCtx();
}));
var init_openclaw_database_preflight_messages = __esmMin((() => {
	init_sqlite_user_version();
	init_openclaw_state_db_contract();
}));
__esmMin((() => {
	init_error_coercion();
	init_runtime_process_entrypoints();
	init_runtime_worker_url();
	init_subsystem();
	init_openclaw_agent_db();
	init_openclaw_quarantine_store();
	init_openclaw_state_db();
	init_openclaw_state_db_paths();
	createSubsystemLogger("state/database-verify");
}));
__esmMin((() => {
	init_agent_scope_config();
	init_paths();
	init_session_sqlite_target();
	init_targets();
	init_errors();
	init_kysely_sync();
	init_node_sqlite();
	init_path_guards();
	init_sqlite_integrity();
	init_sqlite_schema_contract();
	init_sqlite_schema_header();
	init_sqlite_snapshot_source();
	init_sqlite_user_version();
	init_state_database_coordinator();
	init_state_migrations_media_persistence_targets();
	init_agent_database_admission();
	init_agent_database_startup();
	init_agent_deletion_discovery();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_contract();
	init_openclaw_agent_db_registry();
	init_openclaw_agent_db_registry_read();
	init_openclaw_database_preflight_agent_scheduler();
	init_openclaw_database_preflight_messages();
	init_openclaw_database_verify();
	init_openclaw_state_db_contract();
	init_openclaw_state_db_fast_path();
	init_openclaw_state_db_maintenance();
	init_openclaw_state_db_schema_migration_required();
	init_openclaw_state_db_schema_repair();
	init_openclaw_state_db_schema_version();
	init_openclaw_state_db_paths();
	init_openclaw_state_ownership();
	init_openclaw_state_schema_compatibility();
	init_openclaw_state_schema_publication();
	init_openclaw_state_schema();
	init_openclaw_state_db();
}));
//#endregion
export {};
