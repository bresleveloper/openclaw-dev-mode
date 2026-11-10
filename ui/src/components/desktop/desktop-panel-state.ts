import type { WorkerDesktopAppId } from "@openclaw/gateway-protocol";

export type DesktopPanelState =
  | "picker"
  | "inventory-error"
  | "credentials"
  | "connecting"
  | "connected"
  | "disconnected";

export type DesktopSourceSelection = "pending" | "resolved" | "explicit" | "picker";

/** Reset the connection-owned fields together before the picker publishes again. */
function desktopPickerReset() {
  const desktopApps: WorkerDesktopAppId[] = [];
  return {
    state: "picker" as const,
    environmentId: null,
    source: null,
    credentials: undefined,
    credentialAuth: undefined,
    desktopApps,
    controlling: false,
    sizingMode: "fit" as const,
    canResize: false,
    disconnectedReason: null,
  };
}

type DesktopPanelSelectionHost = {
  disconnect: () => void;
  applyPickerState: (state: ReturnType<typeof desktopPickerReset>) => void;
  clearHostSetup: () => void;
  invalidate: () => void;
  clearSessionSource: () => void;
  closeDock: () => void;
};

/** Owns automatic/explicit selection and resets its coupled connection state atomically. */
export class DesktopPanelSelectionController {
  value: DesktopSourceSelection = "pending";

  constructor(private readonly host: DesktopPanelSelectionHost) {}

  get automatic(): boolean {
    return this.value === "pending" || this.value === "resolved";
  }

  isAutomaticPicker(embedded: boolean, sessionKey: string | null): boolean {
    return this.automatic && embedded && sessionKey !== null;
  }

  reset(value: DesktopSourceSelection = "picker"): void {
    this.host.disconnect();
    this.value = value;
    this.host.applyPickerState(desktopPickerReset());
    this.host.clearHostSetup();
    this.host.invalidate();
    this.host.clearSessionSource();
  }

  close(embedded: boolean): void {
    this.reset();
    if (!embedded) {
      this.host.closeDock();
    }
  }
}
