import { i as SqlConnection, t as EngineConnection } from "./sql-connection-CSeUqY2a.js";
import { n as DatabaseEngineId, r as DatabaseEngineInput } from "./types-C6Nim0qi.js";
import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { Kysely, RawBuilder, RootOperationNode } from "kysely";
import { Client } from "pg";
type PostgresCatalogFact = {
  table: string;
  kind: string;
  value: unknown;
};
type PortRow = Record<string, SQLInputValue>;
type PortTable = {
  name: string;
  columns: readonly {
    name: string;
    type: string;
  }[];
  pk: readonly string[];
  identities: readonly {
    column: string;
    autoIncrement: boolean;
  }[];
};
type PortSchema = {
  tables: readonly PortTable[];
  sqlite: string;
  preData: string;
  postData: string;
  expectedCatalog: readonly PostgresCatalogFact[];
  triggers?: readonly {
    name: string;
    table: string;
    sql: string;
  }[];
  projections?: readonly {
    tables: readonly string[];
    rebuild(target: PortEndpoint): void | Promise<void>;
  }[];
};
type PortDescriptor = PortSchema & {
  id: string;
  version: number;
  minimumPostgresVersion: number;
  fragments?: readonly (PortSchema & {
    id: string;
    dependencies: readonly string[];
  })[];
  /** Populated from the admitted source, never from the configured feature set. */
  activeFragments?: readonly string[];
  /** Select the exact historical layout before admitting a backup source. */
  selectSourceLayout?: (hasColumn: (table: string, column: string) => boolean) => PortDescriptor;
  /** Retired source tables may be omitted only when empty. */
  retainedSqliteTables?: readonly string[];
  /** Inspection notes bound to this admitted source. */
  notes?: readonly string[];
  /** Engine-owned derived DDL is rendered for the namespace under verification. */
  postgresPostData?: (namespace: string) => string;
  /** Source-only projections are validated against their owner before omission. */
  postgresSourcePostData?: (source: Extract<PortEndpoint, {
    engine: "postgres";
  }>) => Promise<((namespace: string) => string) | undefined>;
  postgresDerivedTables?: readonly string[];
  /** Canonical logical values may have a different physical SQLite encoding. */
  decodeSqlite?: Readonly<Record<string, (row: PortRow) => PortRow>>;
  /** Optional triggers owned by omitted SQLite projections are not installed on the target. */
  omittedSqliteTriggers?: readonly {
    name: string;
    table: string;
    sql: string;
  }[];
  inspectSqliteSource?: (db: DatabaseSync) => {
    version: number;
    migrationRequired: boolean;
    pendingColumns: Readonly<Record<string, readonly string[]>>;
    pendingTables?: readonly string[];
  };
  /** Caller supplies an exclusively owned private copy, never the live source. */
  migrateSqliteSource?: (path: string, sourceVersion: number, assertCurrent: () => void) => void | Promise<void>;
  admit?: (path: string, input?: DatabaseEngineInput) => void | Promise<void>;
  derive?: Readonly<Record<string, (row: PortRow) => PortRow>>;
};
type PortEndpoint = {
  engine: "sqlite";
  db: DatabaseSync;
} | {
  engine: "postgres";
  db: Client;
  namespace: string;
};
/** @experimental Bounded literal search intent; parsing and budgets stay with the feature owner. */
type TextQuery = {
  kind: "term";
  text: string;
} | {
  kind: "phrase";
  text: string;
  prefix?: boolean;
} | {
  kind: "contains";
  text: string;
} | {
  kind: "all" | "any";
  clauses: readonly TextQuery[];
};
/** @experimental Existing derived-index declaration, admitted without catalog probes. */
type TextIndexDefinition = {
  table: string;
  fields: readonly string[];
  alias?: string;
  matchField?: string;
  hiddenRank?: boolean;
  /** PostgreSQL indexes the owner's source/active projection, never immutable history. */
  postgres?: {
    identity: string;
    mode?: "trigram";
  };
};
/** @experimental Index identity bound to one admitted store. */
type TextIndex = TextIndexDefinition & {
  readonly store: object;
};
/** @experimental Native expressions compose with the caller's scoped Kysely statement. */
interface FullTextCapability {
  match(index: TextIndex, query: TextQuery): RawBuilder<boolean>;
  rank(index: TextIndex, query?: TextQuery,
  /** PostgreSQL defaults to cover density and document-length normalization (2). */
  options?: {
    postgres?: {
      normalization?: 0 | 2;
      rank?: "frequency" | "cover-density";
    };
  }): {
    value: RawBuilder<number>;
    order: "asc" | "desc";
    toRank(raw: number): number;
  };
  snippet(index: TextIndex, field: string, maxTokens: number, query?: TextQuery, maxChars?: number): RawBuilder<string>;
  identity(index: TextIndex): RawBuilder<number>;
  allocatedIdentity(index: TextIndex): RawBuilder<number>;
}
/** @experimental Primitive fields expected from an admitted vector query projection. */
type VectorRowShape = Readonly<Record<string, "string" | "number" | "finite-number" | readonly string[]>>;
/** @experimental A vector index bound to its admitted store. */
type VectorIndex = {
  readonly store: object;
  readonly table: string;
  readonly alias: string;
  readonly rowShape: VectorRowShape;
  readonly postgres?: {
    source: string;
    key: string;
    embedding: string;
    dimensions: number;
  };
};
/** @experimental Caller-owned scope and projection around native vector candidates. */
type VectorSearch<Row> = {
  index: VectorIndex;
  vector: readonly number[];
  limit: number;
  textPrefix?: {
    column: string;
    maxChars: number;
  };
  query: (native: {
    match: RawBuilder<boolean>;
    distance: RawBuilder<number>;
  }) => {
    toOperationNode(): RootOperationNode;
  };
  /** Optional scoped prefilter projecting one unique `id`; undefined keeps exact search. */
  candidates?: (native: {
    match: RawBuilder<boolean>;
    distance: RawBuilder<number>;
    limit: number;
  }) => {
    toOperationNode(): RootOperationNode;
  } | undefined;
  scopeCount: {
    toOperationNode(): RootOperationNode;
  };
  isRow: (value: unknown) => value is Row;
  signal?: AbortSignal;
  extensionPath?: string;
};
/** @experimental Engine-native candidates with cosine reranking; feature owners retain exact fallback. */
interface VectorCapability {
  idSet(index: VectorIndex, ids: readonly string[]): RawBuilder<string>;
  prepareExists(index: VectorIndex): (id: string) => boolean;
  nearest<Row>(request: VectorSearch<Row>): Promise<{
    rows: Row[];
    fallbackScanRequired: boolean;
  }>;
  remove(index: VectorIndex, scope: readonly string[] | {
    toOperationNode(): RootOperationNode;
  }): void;
  drop(index: VectorIndex): void;
  create(index: VectorIndex, dimensions: number, ifNotExists?: boolean): void;
  write(index: VectorIndex, rows: readonly {
    id: string;
    embedding: number[];
  }[]): void;
}
/** @experimental Existing admitted native handle or admitted worker-store descriptor. */
type SearchStore = EngineConnection | {
  databasePath: string;
  input?: DatabaseEngineInput;
};
/** @experimental Feature-owned declarations of the existing derived indexes. */
type SearchSchema = {
  text?: Record<string, TextIndexDefinition>;
  vector?: Record<string, Omit<VectorIndex, "store">>;
  /** Selected by the memory owner only for the explicit provider: "none" setting. */
  mode?: "keyword-only";
  /** Schema where the operator installed the required PostgreSQL extensions. */
  extensionSchema?: string;
};
/** @experimental Null means unavailable; diagnostics name the required next step. */
type StoreSearchCapabilities = {
  fullText: FullTextCapability | null;
  vector: VectorCapability | null;
  text: Record<string, TextIndex>;
  vectors: Record<string, VectorIndex>;
  diagnostics: readonly string[];
  /** Rebuild derived PostgreSQL search state inside the owning writer transaction. */
  rebuild?: () => void;
};
type DatabaseErrorKind = "constraint" | "busy" | "connection-lost" | "outcome-unknown" | "other";
type PostgresSchemaFragment = {
  id: string;
  tables: readonly string[];
  sql: string;
  dependencies: readonly string[];
  activation: "first-use" | "version-additive";
};
type PostgresSchemaDefinition = {
  postgres: string;
  postgresFragments?: readonly PostgresSchemaFragment[];
  /** Exact alternate eager DDL for a predecessor built with and without one column. */
  postgresWithoutOptionalColumn?: {
    table: string;
    column: string;
    sql: string;
  };
  /** Historical schemas default to the original vector decoder. */
  postgresVectorDecoderVersion?: 1 | 2;
  /** Version 2 adds the stored binary candidate projection; historical schemas stay exact. */
  postgresVectorSearchVersion?: 1 | 2;
  /** Version 2 splits punctuation-joined tokens like SQLite FTS5; historical schemas stay exact. */
  postgresTextSearchVersion?: 1 | 2;
};
type StoreSchema = {
  id: string;
  version: number;
  sqlite: string;
  postgres?: string;
  /** Consecutive destinations carry generated DDL for both sides of the migration. */
  postgresMigrations?: readonly {
    version: number;
    sql: string;
    fromSchema: PostgresSchemaDefinition;
    schema: PostgresSchemaDefinition;
    /** Exact predecessor export needed before Doctor may advance this family. */
    backup?: PortDescriptor;
  }[];
  postgresFragments?: readonly PostgresSchemaFragment[];
  postgresWithoutOptionalColumn?: PostgresSchemaDefinition["postgresWithoutOptionalColumn"];
  /** Historical schemas default to the original vector decoder. */
  postgresVectorDecoderVersion?: 1 | 2;
  /** Version 2 adds the stored binary candidate projection; historical schemas stay exact. */
  postgresVectorSearchVersion?: 1 | 2;
  /** Version 2 splits punctuation-joined tokens like SQLite FTS5; historical schemas stay exact. */
  postgresTextSearchVersion?: 1 | 2;
  search?: SearchSchema;
  /** Persisted, owner-registered derived search definitions. */
  searchExtensions?: Record<string, SearchSchema>;
};
type AdmittedStore = {
  reusePostgresConnection?: boolean;
  anchor: DatabaseSync;
  schema: StoreSchema;
  input: DatabaseEngineInput;
  openSqlite: () => void;
  storeId?: string;
  namespace?: string;
  /** Source tables are verified inside this transaction, before runtime admission exists. */
  beforeMigrate?: (database: EngineConnection, fromVersion: number, sourceTables: ReadonlySet<string>) => void;
};
type TransactionRecipes<Connection extends SqlConnection> = {
  write<T>(connection: Connection, operation: () => T): T;
  read<T>(connection: Connection, operation: () => T): T;
};
interface DatabaseEngineAdapter<Connection extends SqlConnection = SqlConnection> {
  id: DatabaseEngineId;
  openConnection(store: AdmittedStore): Connection;
  kysely(connection: Connection): Kysely<unknown>;
  transactions: TransactionRecipes<Connection>;
  capabilities: {
    fullText: "fts5" | "tsvector" | null;
    vector: "sqlite-vec" | "pgvector" | null;
  };
  /** @experimental Bind engine search operations to an already admitted store. */
  search?: (store: SearchStore, schema: SearchSchema) => StoreSearchCapabilities;
  schema: {
    bootstrap(store: AdmittedStore, connection: Connection): void;
    migrate(store: AdmittedStore, from: number, connection: Connection): void;
  };
  classifyError(error: unknown): DatabaseErrorKind;
}
export { StoreSchema as a, VectorIndex as c, TextIndex as d, TextIndexDefinition as f, SearchStore as i, VectorSearch as l, PostgresCatalogFact as m, DatabaseEngineAdapter as n, StoreSearchCapabilities as o, TextQuery as p, SearchSchema as r, VectorCapability as s, AdmittedStore as t, FullTextCapability as u };