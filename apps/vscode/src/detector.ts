import * as vscode from "vscode";
import * as path from "path";

export class FrameworkDetector {
  static async detect(workspaceUri?: vscode.Uri): Promise<string> {
    if (!workspaceUri) return "Vanilla";

    try {
      // 1. Check package.json for JS/TS ecosystems
      const packageJsonFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceUri, "package.json"),
        undefined,
        1
      );

      if (packageJsonFiles.length > 0) {
        const content = (await vscode.workspace.fs.readFile(packageJsonFiles[0])).toString();
        const json = JSON.parse(content);
        const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) };

        if (deps["next"]) return "Next.js";
        if (deps["nuxt"]) return "Nuxt";
        if (deps["@nestjs/core"]) return "NestJS";
        if (deps["@remix-run/react"] || deps["@remix-run/node"]) return "Remix";
        if (deps["@angular/core"]) return "Angular";
        if (deps["svelte"] || deps["@sveltejs/kit"]) return "Svelte";
        if (deps["vue"]) return "Vue";
        if (deps["react-native"]) return "React Native";
        if (deps["react"]) return "React";
        if (deps["express"]) return "Express";
        if (deps["fastify"]) return "Fastify";
        if (deps["hono"]) return "Hono";
        if (deps["electron"]) return "Electron";
        return "Node.js";
      }

      // 2. Check composer.json for PHP ecosystems
      const composerFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceUri, "composer.json"),
        undefined,
        1
      );
      if (composerFiles.length > 0) {
        const content = (await vscode.workspace.fs.readFile(composerFiles[0])).toString();
        if (content.includes("laravel/framework")) return "Laravel";
        if (content.includes("symfony/framework-bundle") || content.includes("symfony/symfony")) return "Symfony";
        if (content.includes("codeigniter4/framework")) return "CodeIgniter";
        return "PHP";
      }

      // 3. Check pubspec.yaml for Flutter / Dart
      const pubspecFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceUri, "pubspec.yaml"),
        undefined,
        1
      );
      if (pubspecFiles.length > 0) {
        const content = (await vscode.workspace.fs.readFile(pubspecFiles[0])).toString();
        if (content.includes("flutter:")) return "Flutter";
        return "Dart";
      }

      // 4. Check Python projects
      const pyFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceUri, "{requirements.txt,pyproject.toml,Pipfile}"),
        undefined,
        1
      );
      if (pyFiles.length > 0) {
        const content = (await vscode.workspace.fs.readFile(pyFiles[0])).toString().toLowerCase();
        if (content.includes("django")) return "Django";
        if (content.includes("fastapi")) return "FastAPI";
        if (content.includes("flask")) return "Flask";
        if (content.includes("tornado")) return "Tornado";
        return "Python";
      }

      // 5. Check Go / Rust / Java
      const goFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceUri, "go.mod"), undefined, 1);
      if (goFiles.length > 0) return "Go";

      const cargoFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceUri, "Cargo.toml"), undefined, 1);
      if (cargoFiles.length > 0) return "Rust";

      const gradleFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceUri, "{build.gradle,build.gradle.kts,pom.xml}"), undefined, 1);
      if (gradleFiles.length > 0) return "Spring / Java";
    } catch {
      // Ignored
    }

    return "Vanilla";
  }
}
