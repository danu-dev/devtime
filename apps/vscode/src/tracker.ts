import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import { FrameworkDetector } from "./detector";
import { GitDetector } from "./git";
import { HeartbeatQueue, HeartbeatPayload } from "./queue";
import { DevTimeClient } from "./client";
import { resolveLanguage } from "./languages";

export class TrackerService {
  private lastHeartbeatTime: number = 0;
  private readonly minIntervalMs: number = 20000; // 20s
  private statusBarItem: vscode.StatusBarItem;
  private queue: HeartbeatQueue;

  constructor(private context: vscode.ExtensionContext) {
    this.queue = new HeartbeatQueue(context);
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = "devtime.showStatus";
    this.statusBarItem.show();
    this.statusBarItem.text = "$(sync) DevTime";

    context.subscriptions.push(this.statusBarItem);
    this.registerCommands();
    this.registerListeners();
  }

  private registerCommands(): void {
    this.context.subscriptions.push(
      vscode.commands.registerCommand("devtime.setApiKey", async () => {
        const key = await vscode.window.showInputBox({
          prompt: "Enter your DevTime API Key",
          password: true,
          placeHolder: "devtime_...",
        });

        if (key) {
          await vscode.workspace.getConfiguration("devtime").update("apiKey", key.trim(), true);
          vscode.window.showInformationMessage("DevTime: API Key saved successfully.");
          this.triggerHeartbeat(true);
        }
      }),

      vscode.commands.registerCommand("devtime.setApiUrl", async () => {
        const currentUrl = vscode.workspace.getConfiguration("devtime").get<string>("apiUrl");
        const url = await vscode.window.showInputBox({
          prompt: "Enter DevTime API URL",
          value: currentUrl || "https://wakatime-devtime.vercel.app",
        });

        if (url) {
          await vscode.workspace.getConfiguration("devtime").update("apiUrl", url.trim(), true);
          vscode.window.showInformationMessage(`DevTime: API URL set to ${url}`);
        }
      }),

      vscode.commands.registerCommand("devtime.showStatus", async () => {
        const config = vscode.workspace.getConfiguration("devtime");
        const apiKey = config.get<string>("apiKey");
        const apiUrl = config.get<string>("apiUrl");
        const queueSize = this.queue.size;

        const action = await vscode.window.showQuickPick(
          [
            `Status: ${apiKey ? "Configured" : "No API Key"}`,
            `Endpoint: ${apiUrl || "https://wakatime-devtime.vercel.app"}`,
            `Offline Queue: ${queueSize} pending heartbeats`,
            "DevTime: Send Test Heartbeat",
            "DevTime: Set API Key",
            "DevTime: Set API URL",
            "DevTime: Open Web Dashboard",
          ],
          { placeHolder: "DevTime Status & Actions" }
        );

        if (action === "DevTime: Send Test Heartbeat") {
          await this.triggerHeartbeat(true);
          vscode.window.showInformationMessage("DevTime: Test heartbeat sent.");
        } else if (action === "DevTime: Set API Key") {
          vscode.commands.executeCommand("devtime.setApiKey");
        } else if (action === "DevTime: Set API URL") {
          vscode.commands.executeCommand("devtime.setApiUrl");
        } else if (action === "DevTime: Open Web Dashboard") {
          vscode.env.openExternal(vscode.Uri.parse(apiUrl || "https://wakatime-devtime.vercel.app"));
        }
      }),

      vscode.commands.registerCommand("devtime.sendTestHeartbeat", () => {
        this.triggerHeartbeat(true);
      }),

      vscode.commands.registerCommand("devtime.toggleTracking", async () => {
        const config = vscode.workspace.getConfiguration("devtime");
        const current = config.get<boolean>("enabled", true);
        await config.update("enabled", !current, true);
        vscode.window.showInformationMessage(`DevTime tracking is now ${!current ? "Enabled" : "Disabled"}.`);
      })
    );
  }

  private registerListeners(): void {
    // 1. Text changes
    this.context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((e) => this.triggerHeartbeat(false, e.document.uri)),
      vscode.workspace.onDidSaveTextDocument((e) => this.triggerHeartbeat(true, e.uri)),
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) this.triggerHeartbeat(false, editor.document.uri);
      })
    );

    // 2. AI agent file system modifications
    const watcher = vscode.workspace.createFileSystemWatcher("**/*");
    watcher.onDidChange((uri) => this.triggerHeartbeat(true, uri));
    watcher.onDidCreate((uri) => this.triggerHeartbeat(true, uri));
    this.context.subscriptions.push(watcher);

    // 3. Periodic focus heartbeat & duration sync
    const interval = setInterval(() => {
      if (vscode.window.state.focused) {
        this.triggerHeartbeat(false);
      }
    }, this.minIntervalMs);

    this.context.subscriptions.push({ dispose: () => clearInterval(interval) });
  }

  private async triggerHeartbeat(isWrite: boolean = false, uri?: vscode.Uri): Promise<void> {
    const config = vscode.workspace.getConfiguration("devtime");
    if (!config.get<boolean>("enabled", true)) {
      this.statusBarItem.text = "$(circle-slash) DevTime: Disabled";
      return;
    }

    let targetUri = uri;
    let languageId: string | undefined;

    if (!targetUri) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        targetUri = editor.document.uri;
        languageId = editor.document.languageId;
      } else if (vscode.workspace.workspaceFolders?.length) {
        targetUri = vscode.workspace.workspaceFolders[0].uri;
      }
    }

    if (!targetUri) return;

    const now = Date.now();
    if (!isWrite && now - this.lastHeartbeatTime < this.minIntervalMs) {
      return;
    }

    const workspace = vscode.workspace.getWorkspaceFolder(targetUri) || vscode.workspace.workspaceFolders?.[0];
    const framework = await FrameworkDetector.detect(workspace?.uri);
    const branch = await GitDetector.getBranch(workspace?.uri);
    const language = resolveLanguage(targetUri.fsPath, languageId);
    const projectName = workspace?.name || path.basename(path.dirname(targetUri.fsPath)) || "DevTime";

    const payload: HeartbeatPayload = {
      entity: targetUri.fsPath,
      project: projectName,
      language: language,
      framework: framework,
      branch: branch,
      editor: "VS Code",
      timestamp: Math.floor(now / 1000),
      isWrite,
      operatingSystem: os.platform(),
      machine: os.hostname(),
    };

    this.queue.add(payload);
    this.lastHeartbeatTime = now;
    await DevTimeClient.flush(this.queue, this.statusBarItem);
  }
}
