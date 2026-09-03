import * as vscode from "vscode";
import { TrackerService } from "./tracker";

let tracker: TrackerService | null = null;

export function activate(context: vscode.ExtensionContext) {
  tracker = new TrackerService(context);
}

export function deactivate() {
  tracker = null;
}
