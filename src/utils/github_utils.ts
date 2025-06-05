import { Octokit } from '@octokit/rest';

export interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}

export async function parseGitHubUrl(url: string): Promise<RepoInfo> {
  const pattern = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(pattern);
  
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  
  return {
    owner: match[1],
    repo: match[2].replace(/\/$/, ''), // Remove trailing slash if present
    branch: 'main' // Default to main, can be updated later
  };
}

export async function fetchRepoContents(repoInfo: RepoInfo): Promise<any[]> {
  const octokit = new Octokit();
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      ref: repoInfo.branch,
      path: ''
    });
    
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if (error.status === 404) {
      throw new Error('Repository not found or is private');
    }
    throw error;
  }
}

export async function fetchFileContent(repoInfo: RepoInfo, path: string): Promise<string> {
  const octokit = new Octokit();
  
  try {
    const { data } = await octokit.repos.getContent({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      path,
      ref: repoInfo.branch
    });
    
    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString();
    }
    
    throw new Error('Not a file');
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
}

export function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.rb', '.java', '.cpp', '.c',
    '.go', '.rs', '.php', '.swift',
    '.kt', '.scala', '.r', '.m',
    '.h', '.cs', '.fs', '.f90',
    '.pl', '.sh', '.bash', '.zsh',
    '.sql', '.html', '.css', '.scss',
    '.less', '.vue', '.svelte'
  ];
  
  return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}