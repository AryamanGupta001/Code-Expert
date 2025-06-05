interface CodeChunk {
  content: string;
  startLine: number;
  endLine: number;
  path: string;
}

export function chunkCode(content: string, path: string, maxChunkSize: number = 1500): CodeChunk[] {
  const lines = content.split('\n');
  const chunks: CodeChunk[] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;
  let startLine = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineSize = line.length;
    
    if (currentSize + lineSize > maxChunkSize && currentChunk.length > 0) {
      // Store current chunk
      chunks.push({
        content: currentChunk.join('\n'),
        startLine,
        endLine: i,
        path
      });
      
      // Start new chunk
      currentChunk = [line];
      currentSize = lineSize;
      startLine = i + 1;
    } else {
      currentChunk.push(line);
      currentSize += lineSize;
    }
  }
  
  // Add remaining chunk if any
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n'),
      startLine,
      endLine: lines.length,
      path
    });
  }
  
  return chunks;
}

export function extractImports(content: string): string[] {
  const importPattern = /^(?:import|from|require|using|include)\s+.+$/gm;
  const matches = content.match(importPattern) || [];
  return matches;
}

export function extractFunctions(content: string): string[] {
  const functionPattern = /(?:function|class|def|const|let|var)\s+(\w+)\s*[({]/g;
  const matches = [];
  let match;
  
  while ((match = functionPattern.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
}