import * as path from "path";

// Standard file extensions mapping
const EXTENSION_MAP: Record<string, string> = {
  // TypeScript / JavaScript
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".mts": "TypeScript",
  ".cts": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",

  // Mobile / Systems
  ".dart": "Dart",
  ".rs": "Rust",
  ".go": "Go",
  ".java": "Java",
  ".kt": "Kotlin",
  ".kts": "Kotlin",
  ".swift": "Swift",
  ".c": "C",
  ".h": "C",
  ".cpp": "C++",
  ".hpp": "C++",
  ".cc": "C++",
  ".cs": "C#",

  // Web & Backend
  ".py": "Python",
  ".php": "PHP",
  ".rb": "Ruby",
  ".html": "HTML",
  ".htm": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".astro": "Astro",

  // Data & Config
  ".json": "JSON",
  ".jsonc": "JSON",
  ".json5": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".toml": "TOML",
  ".xml": "XML",
  ".csv": "CSV",
  ".tsv": "TSV",
  ".sql": "SQL",
  ".prisma": "Prisma",
  ".graphql": "GraphQL",
  ".gql": "GraphQL",

  // Shell & Scripts
  ".sh": "Shell",
  ".bash": "Shell",
  ".zsh": "Shell",
  ".fish": "Shell",
  ".bat": "Batch",
  ".cmd": "Batch",
  ".ps1": "PowerShell",

  // Docs
  ".md": "Markdown",
  ".mdx": "MDX",
  ".tex": "LaTeX",
  ".txt": "Plain Text",
  ".pdf": "PDF",

  // Build / Packages
  ".vsix": "VSIX Package",
  ".lock": "Lockfile",
  ".map": "Source Map",
  ".wasm": "WebAssembly",
};

const FILENAME_MAP: Record<string, string> = {
  dockerfile: "Docker",
  "dockerfile.dev": "Docker",
  "dockerfile.prod": "Docker",
  "docker-compose.yml": "Docker",
  "docker-compose.yaml": "Docker",
  makefile: "Makefile",
  "cmakelists.txt": "CMake",
  gemfile: "Ruby",
  rakefile: "Ruby",
  procfile: "Config",
  "cargo.lock": "Lockfile",
  "package-lock.json": "Lockfile",
  "pnpm-lock.yaml": "Lockfile",
  "yarn.lock": "Lockfile",
  ".gitignore": "Git Config",
  ".gitattributes": "Git Config",
  ".editorconfig": "Config",
  ".eslintrc": "ESLint Config",
  ".eslintrc.json": "ESLint Config",
  ".eslintrc.js": "ESLint Config",
  ".prettierrc": "Prettier Config",
  "tsconfig.json": "TypeScript Config",
  "package.json": "JSON",
};

const VSCODE_ID_MAP: Record<string, string> = {
  typescript: "TypeScript",
  typescriptreact: "TypeScript",
  javascript: "JavaScript",
  javascriptreact: "JavaScript",
  python: "Python",
  php: "PHP",
  dart: "Dart",
  rust: "Rust",
  go: "Go",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  ruby: "Ruby",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  less: "Less",
  vue: "Vue",
  svelte: "Svelte",
  astro: "Astro",
  json: "JSON",
  jsonc: "JSON",
  yaml: "YAML",
  dockerfile: "Docker",
  shellscript: "Shell",
  bat: "Batch",
  powershell: "PowerShell",
  sql: "SQL",
  prisma: "Prisma",
  graphql: "GraphQL",
  markdown: "Markdown",
};

export function resolveLanguage(filePath: string, vscodeLangId?: string): string {
  const base = path.basename(filePath).toLowerCase();

  // 1. Exact file name match
  if (FILENAME_MAP[base]) {
    return FILENAME_MAP[base];
  }

  // 2. Exact extension match
  const ext = path.extname(filePath).toLowerCase();
  if (EXTENSION_MAP[ext]) {
    return EXTENSION_MAP[ext];
  }

  // 3. VS Code Language ID match
  if (vscodeLangId && vscodeLangId !== "plaintext" && vscodeLangId !== "unknown" && vscodeLangId !== "ignore") {
    const normalized = vscodeLangId.toLowerCase();
    if (VSCODE_ID_MAP[normalized]) {
      return VSCODE_ID_MAP[normalized];
    }
    return vscodeLangId.charAt(0).toUpperCase() + vscodeLangId.slice(1);
  }

  return "Plain Text";
}
