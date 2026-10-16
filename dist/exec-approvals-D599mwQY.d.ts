import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/approvals.d.ts
declare const ApprovalDecisionSchema: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>;
declare const ApprovalTerminalReasonSchema: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"timeout">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">, Type.TLiteral<"storage-corrupt">]>;
/**
 * Owner-declared blast-radius facts for a pending approval. Variants are
 * named schemas so native protocol generators emit the discriminated union.
 */
declare const ApprovalScopeSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"message-send">;
  target: Type.TString;
  recipientCount: Type.TInteger;
  recipients: Type.TOptional<Type.TArray<Type.TString>>;
  audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"payment">;
  amount: Type.TString;
  currency: Type.TString;
  target: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"external-post">;
  target: Type.TString;
  visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
}>, Type.TObject<{
  kind: Type.TLiteral<"standing-grant">;
  automation: Type.TString;
  command: Type.TString;
  expiresInDays: Type.TOptional<Type.TInteger>;
}>]>;
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  detail: Type.TOptional<Type.TString>;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  externalResolution: Type.TOptional<Type.TObject<{
    label: Type.TString;
    decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
  }>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
declare const ApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"system-agent">]>;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>;
  reviewer: Type.TOptional<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
    senderId: Type.TString;
  }>>;
  grantExpiresInDays: Type.TOptional<Type.TInteger>;
}>;
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
declare const ApprovalResolveResultSchema: Type.TObject<{
  applied: Type.TBoolean;
  approval: Type.TUnion<[Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    status: Type.TLiteral<"allowed">;
    decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
    reason: Type.TUnion<[Type.TLiteral<"user">]>;
  }>, Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    status: Type.TLiteral<"denied">;
    decision: Type.TLiteral<"deny">;
    reason: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"storage-corrupt">]>;
  }>, Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    status: Type.TLiteral<"expired">;
    reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
  }>, Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    resolvedAtMs: Type.TInteger;
    source: Type.TOptional<Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>>;
    resolver: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"device">, Type.TLiteral<"channel">, Type.TLiteral<"runtime">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
    }>>;
    status: Type.TLiteral<"cancelled">;
    reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
  }>]>;
}>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    status: Type.TLiteral<"pending">;
    /** Canonical raising session when projected into a session-scoped reviewer surface. */
    sourceSessionKey: Type.TOptional<Type.TString>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalDecision = Static<typeof ApprovalDecisionSchema>;
type ApprovalTerminalReason = Static<typeof ApprovalTerminalReasonSchema>;
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type ApprovalResolveParams = Static<typeof ApprovalResolveParamsSchema>;
type ApprovalResolveResult = Static<typeof ApprovalResolveResultSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.d.ts
/** Local exec approval policy write request with optional base hash guard. */
declare const ExecApprovalsSetParamsSchema: Type.TObject<{
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
      path: Type.TOptional<Type.TString>;
      token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
      allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TNumber>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
      }>>>;
      mcpTools: Type.TOptional<Type.TArray<Type.TObject<{
        server: Type.TString;
        tool: Type.TString;
        source: Type.TLiteral<"allow-always">;
        addedAt: Type.TNumber;
        lastUsedAt: Type.TOptional<Type.TNumber>;
      }>>>;
    }>>>;
  }>;
  baseHash: Type.TOptional<Type.TString>;
  expectedOwnerId: Type.TOptional<Type.TString>;
}>;
/** Pending command execution approval request shown to reviewers. */
declare const ExecApprovalRequestParamsSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  command: Type.TOptional<Type.TString>;
  commandArgv: Type.TOptional<Type.TArray<Type.TString>>;
  systemRunPlan: Type.TOptional<Type.TObject<{
    argv: Type.TArray<Type.TString>;
    cwd: Type.TUnion<[Type.TString, Type.TNull]>;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TUnion<[Type.TString, Type.TNull]>;
    sessionKey: Type.TUnion<[Type.TString, Type.TNull]>;
    policySnapshot: Type.TOptional<Type.TObject<{
      security: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      ask: Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]>;
      askFallback: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      autoAllowSkills: Type.TBoolean;
      allowlistRules: Type.TArray<Type.TObject<{
        pattern: Type.TString;
        argPattern: Type.TOptional<Type.TString>;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
      }>>;
    }>>;
    mutableFileOperand: Type.TOptional<Type.TUnion<[Type.TObject<{
      argvIndex: Type.TInteger;
      path: Type.TString;
      sha256: Type.TString;
    }>, Type.TNull]>>;
  }>>;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  cwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  security: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ask: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
  commandSpans: Type.TOptional<Type.TArray<Type.TObject<{
    startIndex: Type.TInteger;
    endIndex: Type.TInteger;
  }>>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  runId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolCallId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
  approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
  requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
  suppressDelivery: Type.TOptional<Type.TBoolean>;
  deliverToApprovalClientsOnly: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  twoPhase: Type.TOptional<Type.TBoolean>;
}>;
type ExecApprovalsSetParams = Static<typeof ExecApprovalsSetParamsSchema>;
type ExecApprovalRequestParams = Static<typeof ExecApprovalRequestParamsSchema>;
//#endregion
export { ApprovalResolveParams as a, ApprovalScopeSchema as c, ApprovalPresentation as i, ApprovalTerminalReason as l, ExecApprovalsSetParams as n, ApprovalResolveResult as o, ApprovalDecision as r, ApprovalScope as s, ExecApprovalRequestParams as t, SessionApprovalReplay as u };