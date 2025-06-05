# Code Expert (Free & Open-Source)

## 1  Problem Statement
Developers waste hours exploring large GitHub repos. Code Expert lets you ask natural-language questions like “What does `UserService` do?” and get immediate, grounded answers.

## 2  Why RAG?
- Prevents hallucination by retrieving only relevant code chunks.
- Improves speed & accuracy vs. naive generative prompts.

## 3  RAG Pipeline
- **Documents:** Code files → token-based chunks.
- **Retrieval:** ChromaDB (local) vector search on 768-D CodeBERT embeddings.
- **Generation:** DeepSeek V3 (code-specialized) via REST API.
- **Metrics:**  
  - Context Relevance = avg(1/(1+distance)).  
  - Groundedness = fraction of answer tokens present in retrieved chunks.

## 4  Tools & Libraries
- **Vector DB:** ChromaDB  
- **Embeddings:** CodeBERT via SentenceTransformers  
- **LLM:** DeepSeek V3 (free-tier API key)  
- **Web Framework:** Streamlit (combines UI & backend)  
- **Chunking:** tiktoken  

## 5  LLM Model
- Ideal: GPT-4 or Claude 3.
- Prototype: DeepSeek V3 (free/trial).  
- Embeddings: CodeBERT (free).

## 6  Setup & Usage

1. **Clone Repo & Install**  
   ```bash
   git clone https://github.com/yourusername/code-expert-free.git
   cd code-expert-free/app
   pip install -r requirements.txt
