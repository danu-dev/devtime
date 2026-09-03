import * as vscode from "vscode";

export interface HeartbeatPayload {
  entity: string;
  project?: string;
  language?: string;
  framework?: string;
  editor: string;
  timestamp: number;
  isWrite: boolean;
  branch?: string;
  operatingSystem?: string;
  machine?: string;
}

export class HeartbeatQueue {
  private readonly storageKey = "devtime_offline_queue";

  constructor(private context: vscode.ExtensionContext) {}

  add(heartbeat: HeartbeatPayload): void {
    const items = this.getAll();
    items.push(heartbeat);
    this.context.globalState.update(this.storageKey, items);
  }

  getAll(): HeartbeatPayload[] {
    return this.context.globalState.get<HeartbeatPayload[]>(this.storageKey, []);
  }

  clear(): void {
    this.context.globalState.update(this.storageKey, []);
  }

  get size(): number {
    return this.getAll().length;
  }
}
