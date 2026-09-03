import * as vscode from "vscode";
import * as path from "path";

export class GitDetector {
  static async getBranch(workspaceUri?: vscode.Uri): Promise<string | undefined> {
    if (!workspaceUri) return undefined;

    try {
      // 1. Try using VS Code built-in Git extension API if available
      const gitExtension = vscode.extensions.getExtension("vscode.git");
      if (gitExtension) {
        const gitApi = gitExtension.exports.getAPI(1);
        const repo = gitApi.getRepository(workspaceUri);
        if (repo?.state?.HEAD?.name) {
          return repo.state.HEAD.name;
        }
      }

      // 2. Fallback: Read .git/HEAD file directly
      const headFileUri = vscode.Uri.file(path.join(workspaceUri.fsPath, ".git", "HEAD"));
      const content = (await vscode.workspace.fs.readFile(headFileUri)).toString().trim();

      if (content.startsWith("ref: refs/heads/")) {
        return content.replace("ref: refs/heads/", "").trim();
      }
      if (content.length === 40) {
        return content.slice(0, 7); // Short commit hash if detached HEAD
      }
    } catch {
      // Not a git repo or inaccessible
    }

    return undefined;
  }
}
