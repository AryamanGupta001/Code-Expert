// src/utils/github_utils.ts
import os from "os";
import path from "path";
import fs from "fs-extra";
import simpleGit, { SimpleGit } from "simple-git";

export async function cloneRepo(githubUrl: string, token?: string): Promise<string> {
  /**
   * Clones a GitHub repo into a temp folder.
   * Returns the absolute path to the cloned directory.
   */
  if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(githubUrl)) {
    throw new Error("Invalid GitHub URL");
  }

  // Make a temp folder under OS temp directory
  const repoName = path.basename(githubUrl).replace(/\.git$/, "");
  const tmpDir = path.join(os.tmpdir(), `code_expert_${Date.now()}_${repoName}`);
  await fs.mkdirp(tmpDir);

  // If token is provided for private repos, inject it into URL
  let cloneUrl = githubUrl;
  if (token && token.length > 0) {
    // e.g., https://<token>@github.com/username/repo.git
    cloneUrl = githubUrl.replace(
      "https://",
      `https://${token}@`
    );
  }
  const git: SimpleGit = simpleGit();
  await git.clone(cloneUrl, tmpDir);
  return tmpDir;
}

export async function listCodeFiles(repoPath: string): Promise<string[]> {
  /**
   * Walks the cloned directory and returns absolute paths for all
   * files ending in .py, .js, .java, .cpp, .md (you can add more).
   */
  const exts = [".py", ".js", ".java", ".cpp", ".ts", ".tsx", ".md"];
  const results: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        // Skip .git directory and node_modules
        if (entry === '.git' || entry === 'node_modules') {
          continue;
        }
        await walk(fullPath);
      } else {
        if (exts.some(e => fullPath.toLowerCase().endsWith(e))) {
          results.push(fullPath);
        }
      }
    }
  }
  await walk(repoPath);
  return results;
}

export async function cleanupRepo(repoPath: string): Promise<void> {
  // Recursively delete the cloned directory
  await fs.remove(repoPath);
}
