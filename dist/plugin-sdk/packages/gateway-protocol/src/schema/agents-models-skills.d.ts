import { Type } from "typebox";
/**
 * Agent, model, skill, and tool catalog schemas.
 *
 * These contracts back dashboard selectors, agent management, model catalogs,
 * skill upload/install flows, skill workshop proposals, and effective tool
 * discovery. Keep public request/result schemas documented because they are
 * shared by gateway RPC, CLI, and UI clients.
 */
/** Model option shown in selectors and model catalog results. */
export declare const ModelChoiceSchema: Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    provider: Type.TString;
    alias: Type.TOptional<Type.TString>;
    available: Type.TOptional<Type.TBoolean>;
    contextWindow: Type.TOptional<Type.TInteger>;
    reasoning: Type.TOptional<Type.TBoolean>;
}>;
/** Condensed agent record returned by list APIs. */
export declare const AgentSummarySchema: Type.TObject<{
    id: Type.TString;
    name: Type.TOptional<Type.TString>;
    identity: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        theme: Type.TOptional<Type.TString>;
        emoji: Type.TOptional<Type.TString>;
        avatar: Type.TOptional<Type.TString>;
        avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    workspace: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TObject<{
        primary: Type.TOptional<Type.TString>;
        fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    agentRuntime: Type.TOptional<Type.TObject<{
        id: Type.TString;
        fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
        source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">]>;
    }>>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
    }>>>;
    thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
    thinkingDefault: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing configured agents. */
export declare const AgentsListParamsSchema: Type.TObject<{}>;
/** Agent list result including the default agent and session scoping mode. */
export declare const AgentsListResultSchema: Type.TObject<{
    defaultId: Type.TString;
    mainKey: Type.TString;
    scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
    agents: Type.TArray<Type.TObject<{
        id: Type.TString;
        name: Type.TOptional<Type.TString>;
        identity: Type.TOptional<Type.TObject<{
            name: Type.TOptional<Type.TString>;
            theme: Type.TOptional<Type.TString>;
            emoji: Type.TOptional<Type.TString>;
            avatar: Type.TOptional<Type.TString>;
            avatarUrl: Type.TOptional<Type.TString>;
        }>>;
        workspace: Type.TOptional<Type.TString>;
        model: Type.TOptional<Type.TObject<{
            primary: Type.TOptional<Type.TString>;
            fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
        }>>;
        agentRuntime: Type.TOptional<Type.TObject<{
            id: Type.TString;
            fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
            source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">]>;
        }>>;
        thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
        }>>>;
        thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
        thinkingDefault: Type.TOptional<Type.TString>;
    }>>;
}>;
/** Creates a configured agent with workspace, identity, and optional model. */
export declare const AgentsCreateParamsSchema: Type.TObject<{
    name: Type.TString;
    workspace: Type.TString;
    model: Type.TOptional<Type.TString>;
    emoji: Type.TOptional<Type.TString>;
    avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after creating an agent. */
export declare const AgentsCreateResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    agentId: Type.TString;
    name: Type.TString;
    workspace: Type.TString;
    model: Type.TOptional<Type.TString>;
}>;
/** Updates mutable agent identity, workspace, and model fields. */
export declare const AgentsUpdateParamsSchema: Type.TObject<{
    agentId: Type.TString;
    name: Type.TOptional<Type.TString>;
    workspace: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    emoji: Type.TOptional<Type.TString>;
    avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after updating an agent. */
export declare const AgentsUpdateResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    agentId: Type.TString;
}>;
/** Deletes an agent and optionally its workspace/config files. */
export declare const AgentsDeleteParamsSchema: Type.TObject<{
    agentId: Type.TString;
    deleteFiles: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after deleting an agent and unbinding sessions. */
export declare const AgentsDeleteResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    agentId: Type.TString;
    removedBindings: Type.TInteger;
}>;
/** File metadata and optional content for agent-local editable files. */
export declare const AgentsFileEntrySchema: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
}>;
/** Lists editable files for one agent. */
export declare const AgentsFilesListParamsSchema: Type.TObject<{
    agentId: Type.TString;
}>;
/** Editable file list for an agent workspace. */
export declare const AgentsFilesListResultSchema: Type.TObject<{
    agentId: Type.TString;
    workspace: Type.TString;
    files: Type.TArray<Type.TObject<{
        name: Type.TString;
        path: Type.TString;
        missing: Type.TBoolean;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
        content: Type.TOptional<Type.TString>;
    }>>;
}>;
/** Reads one editable agent file by name. */
export declare const AgentsFilesGetParamsSchema: Type.TObject<{
    agentId: Type.TString;
    name: Type.TString;
}>;
/** Result for reading one editable agent file. */
export declare const AgentsFilesGetResultSchema: Type.TObject<{
    agentId: Type.TString;
    workspace: Type.TString;
    file: Type.TObject<{
        name: Type.TString;
        path: Type.TString;
        missing: Type.TBoolean;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
        content: Type.TOptional<Type.TString>;
    }>;
}>;
/** Writes one editable agent file. */
export declare const AgentsFilesSetParamsSchema: Type.TObject<{
    agentId: Type.TString;
    name: Type.TString;
    content: Type.TString;
}>;
/** Result returned after writing an editable agent file. */
export declare const AgentsFilesSetResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    agentId: Type.TString;
    workspace: Type.TString;
    file: Type.TObject<{
        name: Type.TString;
        path: Type.TString;
        missing: Type.TBoolean;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
        content: Type.TOptional<Type.TString>;
    }>;
}>;
/** Model catalog request with optional visibility scope. */
export declare const ModelsListParamsSchema: Type.TObject<{
    view: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"configured">, Type.TLiteral<"all">]>>;
}>;
/** Model catalog result. */
export declare const ModelsListResultSchema: Type.TObject<{
    models: Type.TArray<Type.TObject<{
        id: Type.TString;
        name: Type.TString;
        provider: Type.TString;
        alias: Type.TOptional<Type.TString>;
        available: Type.TOptional<Type.TBoolean>;
        contextWindow: Type.TOptional<Type.TInteger>;
        reasoning: Type.TOptional<Type.TBoolean>;
    }>>;
}>;
/** Reads installed skill status, optionally for a selected agent. */
export declare const SkillsStatusParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing available skill bins. */
export declare const SkillsBinsParamsSchema: Type.TObject<{}>;
/** Skill bin names available to the gateway. */
export declare const SkillsBinsResultSchema: Type.TObject<{
    bins: Type.TArray<Type.TString>;
}>;
/** Starts a chunked skill archive upload. */
export declare const SkillsUploadBeginParamsSchema: Type.TObject<{
    kind: Type.TLiteral<"skill-archive">;
    slug: Type.TString;
    sizeBytes: Type.TInteger;
    sha256: Type.TOptional<Type.TString>;
    force: Type.TOptional<Type.TBoolean>;
    idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Uploads one base64-encoded chunk for a skill archive. */
export declare const SkillsUploadChunkParamsSchema: Type.TObject<{
    uploadId: Type.TString;
    offset: Type.TInteger;
    dataBase64: Type.TString;
}>;
/** Commits a completed skill archive upload. */
export declare const SkillsUploadCommitParamsSchema: Type.TObject<{
    uploadId: Type.TString;
    sha256: Type.TOptional<Type.TString>;
}>;
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
export declare const SkillsInstallParamsSchema: Type.TUnion<[Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    name: Type.TString;
    installId: Type.TString;
    dangerouslyForceUnsafeInstall: Type.TOptional<Type.TBoolean>;
    timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    source: Type.TLiteral<"clawhub">;
    slug: Type.TString;
    version: Type.TOptional<Type.TString>;
    force: Type.TOptional<Type.TBoolean>;
    timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    source: Type.TLiteral<"upload">;
    uploadId: Type.TString;
    slug: Type.TString;
    force: Type.TOptional<Type.TBoolean>;
    sha256: Type.TOptional<Type.TString>;
    timeoutMs: Type.TOptional<Type.TInteger>;
}>]>;
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
export declare const SkillsUpdateParamsSchema: Type.TUnion<[Type.TObject<{
    skillKey: Type.TString;
    enabled: Type.TOptional<Type.TBoolean>;
    apiKey: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>, Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    source: Type.TLiteral<"clawhub">;
    slug: Type.TOptional<Type.TString>;
    all: Type.TOptional<Type.TBoolean>;
}>]>;
/** Searches the skill registry. */
export declare const SkillsSearchParamsSchema: Type.TObject<{
    query: Type.TOptional<Type.TString>;
    limit: Type.TOptional<Type.TInteger>;
}>;
/** Ranked skill registry search results. */
export declare const SkillsSearchResultSchema: Type.TObject<{
    results: Type.TArray<Type.TObject<{
        score: Type.TNumber;
        slug: Type.TString;
        displayName: Type.TString;
        summary: Type.TOptional<Type.TString>;
        version: Type.TOptional<Type.TString>;
        updatedAt: Type.TOptional<Type.TInteger>;
    }>>;
}>;
/** Reads registry detail for one skill slug. */
export declare const SkillsDetailParamsSchema: Type.TObject<{
    slug: Type.TString;
}>;
/** Reads current security verdicts for configured skills. */
export declare const SkillsSecurityVerdictsParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
}>;
/** Skill registry detail, latest version, metadata, and owner info. */
export declare const SkillsDetailResultSchema: Type.TObject<{
    skill: Type.TUnion<[Type.TObject<{
        slug: Type.TString;
        displayName: Type.TString;
        summary: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        createdAt: Type.TInteger;
        updatedAt: Type.TInteger;
    }>, Type.TNull]>;
    latestVersion: Type.TOptional<Type.TUnion<[Type.TObject<{
        version: Type.TString;
        createdAt: Type.TInteger;
        changelog: Type.TOptional<Type.TString>;
    }>, Type.TNull]>>;
    metadata: Type.TOptional<Type.TUnion<[Type.TObject<{
        os: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
        systems: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    }>, Type.TNull]>>;
    owner: Type.TOptional<Type.TUnion<[Type.TObject<{
        handle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        image: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>, Type.TNull]>>;
}>;
/** Security verdict report for installed/requested skills. */
export declare const SkillsSecurityVerdictsResultSchema: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skills.security-verdicts.v1">;
    items: Type.TArray<Type.TObject<{
        registry: Type.TString;
        ok: Type.TBoolean;
        decision: Type.TString;
        reasons: Type.TArray<Type.TString>;
        requestedSlug: Type.TString;
        requestedVersion: Type.TString;
        slug: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        version: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        publisherHandle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        publisherDisplayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        createdAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        checkedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        skillUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        securityAuditUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        securityStatus: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        securityPassed: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
        error: Type.TOptional<Type.TObject<{
            code: Type.TOptional<Type.TString>;
            message: Type.TOptional<Type.TString>;
        }>>;
    }>>;
}>;
/** Reads the rendered skill card for one installed skill. */
export declare const SkillsSkillCardParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    skillKey: Type.TString;
}>;
/** Rendered skill card content and file metadata. */
export declare const SkillsSkillCardResultSchema: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skills.skill-card.v1">;
    skillKey: Type.TString;
    path: Type.TString;
    sizeBytes: Type.TInteger;
    content: Type.TString;
}>;
/** Lists skill-workshop proposals for the selected agent scope. */
export declare const SkillsProposalsListParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
}>;
/** Proposal manifest response for dashboard/workshop list views. */
export declare const SkillsProposalsListResultSchema: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposals-manifest.v1">;
    updatedAt: Type.TString;
    proposals: Type.TArray<Type.TObject<{
        id: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
        status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
        title: Type.TString;
        description: Type.TString;
        skillName: Type.TString;
        skillKey: Type.TString;
        createdAt: Type.TString;
        updatedAt: Type.TString;
        scanState: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
    }>>;
}>;
/** Reads a proposal record plus editable draft/support content. */
export declare const SkillsProposalInspectParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    proposalId: Type.TString;
}>;
/** Full proposal inspection result used before apply/revise decisions. */
export declare const SkillsProposalInspectResultSchema: Type.TObject<{
    record: Type.TObject<{
        schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
        id: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
        status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
        title: Type.TString;
        description: Type.TString;
        createdAt: Type.TString;
        updatedAt: Type.TString;
        createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
        origin: Type.TOptional<Type.TObject<{
            agentId: Type.TOptional<Type.TString>;
            sessionKey: Type.TOptional<Type.TString>;
            runId: Type.TOptional<Type.TString>;
            messageId: Type.TOptional<Type.TString>;
        }>>;
        proposedVersion: Type.TString;
        draftFile: Type.TLiteral<"PROPOSAL.md">;
        draftHash: Type.TString;
        supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
            path: Type.TString;
            sizeBytes: Type.TInteger;
            hash: Type.TString;
            targetExisted: Type.TOptional<Type.TBoolean>;
            targetContentHash: Type.TOptional<Type.TString>;
        }>>>;
        target: Type.TObject<{
            skillName: Type.TString;
            skillKey: Type.TString;
            skillDir: Type.TString;
            skillFile: Type.TString;
            source: Type.TOptional<Type.TString>;
            currentContentHash: Type.TOptional<Type.TString>;
        }>;
        scan: Type.TObject<{
            state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
            scannedAt: Type.TString;
            critical: Type.TInteger;
            warn: Type.TInteger;
            info: Type.TInteger;
            findings: Type.TArray<Type.TObject<{
                ruleId: Type.TString;
                severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
                file: Type.TString;
                line: Type.TInteger;
                message: Type.TString;
                evidence: Type.TString;
            }>>;
        }>;
        goal: Type.TOptional<Type.TString>;
        evidence: Type.TOptional<Type.TString>;
        appliedAt: Type.TOptional<Type.TString>;
        rejectedAt: Type.TOptional<Type.TString>;
        quarantinedAt: Type.TOptional<Type.TString>;
        staleAt: Type.TOptional<Type.TString>;
        statusReason: Type.TOptional<Type.TString>;
    }>;
    content: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TString;
        content: Type.TString;
    }>>>;
}>;
/** Creates a proposal for a new skill. */
export declare const SkillsProposalCreateParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    name: Type.TString;
    description: Type.TString;
    content: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TString;
        content: Type.TString;
    }>>>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
}>;
/** Creates a proposal to update an existing skill. */
export declare const SkillsProposalUpdateParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    skillName: Type.TString;
    description: Type.TOptional<Type.TString>;
    content: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TString;
        content: Type.TString;
    }>>>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
}>;
/** Replaces draft content/support files for an existing proposal. */
export declare const SkillsProposalReviseParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    proposalId: Type.TString;
    content: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TString;
        content: Type.TString;
    }>>>;
    description: Type.TOptional<Type.TString>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
}>;
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
export declare const SkillsProposalRequestRevisionParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    targetAgentId: Type.TOptional<Type.TString>;
    proposalId: Type.TString;
    instructions: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TOptional<Type.TString>;
    idempotencyKey: Type.TString;
}>;
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
export declare const SkillsProposalRequestRevisionResultSchema: Type.TObject<{
    runId: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"in_flight">, Type.TLiteral<"ok">, Type.TLiteral<"timeout">, Type.TLiteral<"error">]>;
}>;
/** Shared approve/reject/quarantine action payload for one proposal. */
export declare const SkillsProposalActionParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    proposalId: Type.TString;
    reason: Type.TOptional<Type.TString>;
}>;
/** Result returned after applying a skill proposal to disk. */
export declare const SkillsProposalApplyResultSchema: Type.TObject<{
    record: Type.TObject<{
        schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
        id: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
        status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
        title: Type.TString;
        description: Type.TString;
        createdAt: Type.TString;
        updatedAt: Type.TString;
        createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
        origin: Type.TOptional<Type.TObject<{
            agentId: Type.TOptional<Type.TString>;
            sessionKey: Type.TOptional<Type.TString>;
            runId: Type.TOptional<Type.TString>;
            messageId: Type.TOptional<Type.TString>;
        }>>;
        proposedVersion: Type.TString;
        draftFile: Type.TLiteral<"PROPOSAL.md">;
        draftHash: Type.TString;
        supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
            path: Type.TString;
            sizeBytes: Type.TInteger;
            hash: Type.TString;
            targetExisted: Type.TOptional<Type.TBoolean>;
            targetContentHash: Type.TOptional<Type.TString>;
        }>>>;
        target: Type.TObject<{
            skillName: Type.TString;
            skillKey: Type.TString;
            skillDir: Type.TString;
            skillFile: Type.TString;
            source: Type.TOptional<Type.TString>;
            currentContentHash: Type.TOptional<Type.TString>;
        }>;
        scan: Type.TObject<{
            state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
            scannedAt: Type.TString;
            critical: Type.TInteger;
            warn: Type.TInteger;
            info: Type.TInteger;
            findings: Type.TArray<Type.TObject<{
                ruleId: Type.TString;
                severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
                file: Type.TString;
                line: Type.TInteger;
                message: Type.TString;
                evidence: Type.TString;
            }>>;
        }>;
        goal: Type.TOptional<Type.TString>;
        evidence: Type.TOptional<Type.TString>;
        appliedAt: Type.TOptional<Type.TString>;
        rejectedAt: Type.TOptional<Type.TString>;
        quarantinedAt: Type.TOptional<Type.TString>;
        staleAt: Type.TOptional<Type.TString>;
        statusReason: Type.TOptional<Type.TString>;
    }>;
    targetSkillFile: Type.TString;
}>;
/** Proposal record result returned after non-apply proposal actions. */
export declare const SkillsProposalRecordResultSchema: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
    title: Type.TString;
    description: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
    origin: Type.TOptional<Type.TObject<{
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        messageId: Type.TOptional<Type.TString>;
    }>>;
    proposedVersion: Type.TString;
    draftFile: Type.TLiteral<"PROPOSAL.md">;
    draftHash: Type.TString;
    supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
        path: Type.TString;
        sizeBytes: Type.TInteger;
        hash: Type.TString;
        targetExisted: Type.TOptional<Type.TBoolean>;
        targetContentHash: Type.TOptional<Type.TString>;
    }>>>;
    target: Type.TObject<{
        skillName: Type.TString;
        skillKey: Type.TString;
        skillDir: Type.TString;
        skillFile: Type.TString;
        source: Type.TOptional<Type.TString>;
        currentContentHash: Type.TOptional<Type.TString>;
    }>;
    scan: Type.TObject<{
        state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
        scannedAt: Type.TString;
        critical: Type.TInteger;
        warn: Type.TInteger;
        info: Type.TInteger;
        findings: Type.TArray<Type.TObject<{
            ruleId: Type.TString;
            severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
            file: Type.TString;
            line: Type.TInteger;
            message: Type.TString;
            evidence: Type.TString;
        }>>;
    }>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
    appliedAt: Type.TOptional<Type.TString>;
    rejectedAt: Type.TOptional<Type.TString>;
    quarantinedAt: Type.TOptional<Type.TString>;
    staleAt: Type.TOptional<Type.TString>;
    statusReason: Type.TOptional<Type.TString>;
}>;
/** Reads the configured tool catalog for an agent. */
export declare const ToolsCatalogParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    includePlugins: Type.TOptional<Type.TBoolean>;
}>;
/** Reads the effective tool set for one session. */
export declare const ToolsEffectiveParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TString;
}>;
/** Invokes one tool through the gateway tool dispatcher. */
export declare const ToolsInvokeParamsSchema: Type.TObject<{
    name: Type.TString;
    args: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    sessionKey: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    confirm: Type.TOptional<Type.TBoolean>;
    idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Tool profile shown in catalog views. */
export declare const ToolCatalogProfileSchema: Type.TObject<{
    id: Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>;
    label: Type.TString;
}>;
/** Tool catalog entry before session-specific filtering is applied. */
export declare const ToolCatalogEntrySchema: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    description: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
    pluginId: Type.TOptional<Type.TString>;
    optional: Type.TOptional<Type.TBoolean>;
    risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    defaultProfiles: Type.TArray<Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>>;
}>;
/** Group of related catalog tools from core or a plugin. */
export declare const ToolCatalogGroupSchema: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
    pluginId: Type.TOptional<Type.TString>;
    tools: Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        description: Type.TString;
        source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
        pluginId: Type.TOptional<Type.TString>;
        optional: Type.TOptional<Type.TBoolean>;
        risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
        defaultProfiles: Type.TArray<Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>>;
    }>>;
}>;
/** Tool catalog result for agent configuration UI. */
export declare const ToolsCatalogResultSchema: Type.TObject<{
    agentId: Type.TString;
    profiles: Type.TArray<Type.TObject<{
        id: Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>;
        label: Type.TString;
    }>>;
    groups: Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
        pluginId: Type.TOptional<Type.TString>;
        tools: Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
            description: Type.TString;
            source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
            pluginId: Type.TOptional<Type.TString>;
            optional: Type.TOptional<Type.TBoolean>;
            risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
            tags: Type.TOptional<Type.TArray<Type.TString>>;
            defaultProfiles: Type.TArray<Type.TUnion<[Type.TLiteral<"minimal">, Type.TLiteral<"coding">, Type.TLiteral<"messaging">, Type.TLiteral<"full">]>>;
        }>>;
    }>>;
}>;
/** Effective tool entry after session/profile/channel/plugin filtering. */
export declare const ToolsEffectiveEntrySchema: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    description: Type.TString;
    rawDescription: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
    pluginId: Type.TOptional<Type.TString>;
    channelId: Type.TOptional<Type.TString>;
    risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Effective tool group shown to runtime/session callers. */
export declare const ToolsEffectiveGroupSchema: Type.TObject<{
    id: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
    label: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
    tools: Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        description: Type.TString;
        rawDescription: Type.TString;
        source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
        pluginId: Type.TOptional<Type.TString>;
        channelId: Type.TOptional<Type.TString>;
        risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
}>;
/** Notice explaining runtime filtering such as quarantined tool schemas. */
export declare const ToolsEffectiveNoticeSchema: Type.TObject<{
    id: Type.TString;
    severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">]>;
    message: Type.TString;
}>;
/** Effective tool set for a session, including profile and filtering notices. */
export declare const ToolsEffectiveResultSchema: Type.TObject<{
    agentId: Type.TString;
    profile: Type.TString;
    groups: Type.TArray<Type.TObject<{
        id: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
        label: Type.TString;
        source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
        tools: Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
            description: Type.TString;
            rawDescription: Type.TString;
            source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"channel">, Type.TLiteral<"mcp">]>;
            pluginId: Type.TOptional<Type.TString>;
            channelId: Type.TOptional<Type.TString>;
            risk: Type.TOptional<Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>>;
            tags: Type.TOptional<Type.TArray<Type.TString>>;
        }>>;
    }>>;
    notices: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">]>;
        message: Type.TString;
    }>>>;
}>;
/** Normalized error shape for tool invocation failures. */
export declare const ToolsInvokeErrorSchema: Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
}>;
/** Tool invocation result, including approval handoff when required. */
export declare const ToolsInvokeResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    toolName: Type.TString;
    output: Type.TOptional<Type.TUnknown>;
    requiresApproval: Type.TOptional<Type.TBoolean>;
    approvalId: Type.TOptional<Type.TString>;
    source: Type.TOptional<Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">, Type.TLiteral<"mcp">, Type.TLiteral<"channel">, Type.TString]>>;
    error: Type.TOptional<Type.TObject<{
        code: Type.TString;
        message: Type.TString;
        details: Type.TOptional<Type.TUnknown>;
    }>>;
}>;
