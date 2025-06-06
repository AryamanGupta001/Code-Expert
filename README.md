# Code Expert – Free AI-Powered Codebase Q&A

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/AryamanGupta001/Code-Expert/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/AryamanGupta001/Code-Expert?style=social)](https://github.com/AryamanGupta001/Code-Expert/stargazers)

Code Expert is a free, open-source AI assistant that lets developers input any public GitHub repository URL and instantly ask questions about its code structure, dependencies, and functionality. Powered by advanced RAG (Retrieval Augmented Generation) and Google's Gemini 2.5 Pro, it provides accurate, context-grounded answers to help you explore, understand, and onboard to complex codebases with ease.

## ✨ Key Features & Benefits

*   **Real-Time Chat**: Interact directly with your indexed code and get answers in seconds.
*   **100% Free & Open Source**: No subscription or API keys required—just paste a URL and start asking questions.
*   **Dual RAG Engines**: Compare "Base RAG" (pure semantic similarity) and "Filtered RAG" (semantic similarity with keyword filtering) for optimal answers tailored to your needs.
*   **Supports Multiple Languages**: Automatically chunks and indexes code from various languages including Python, JavaScript, Java, C++, TypeScript, Markdown, and more.
*   **Powered by Gemini 2.5 Pro**: Leverages Google's latest generative AI model for superior code understanding and response generation.
*   **Supabase Integration**: Utilizes Supabase for efficient vector storage and retrieval of code chunks.
*   **Netlify Functions**: Backend logic is deployed as serverless functions on Netlify, ensuring scalability and ease of deployment.
*   **Intuitive UI**: A clean and responsive user interface built with React and Tailwind CSS.

## 🚀 Getting Started

Follow these steps to set up and run Code Expert locally or deploy it.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher.
*   **npm**: Version 8 or higher (comes with Node.js).
*   **Git**: For cloning the repository.
*   **A Supabase Project**: You'll need a Supabase project URL and a `service_role` key.
*   **A Google Cloud Project**: With the Generative AI API enabled and an API Key.

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/AryamanGupta001/Code-Expert.git
    cd Code-Expert
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

### Environment Variables

Code Expert relies on several environment variables for its functionality.

1.  **Create a `.env` file**:
    Copy the `.env.example` file to `.env` in the root of your project:

    ```bash
    cp .env.example .env
    ```

2.  **Populate `.env`**:
    Open the newly created `.env` file and fill in your credentials:

    ```env
    # .env
    GITHUB_TOKEN=your_github_token_here # Optional: For cloning private repositories
    SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
    SUPABASE_SERVICE_KEY=your-supabase-service-role-key
    GOOGLE_API_KEY=your-google-cloud-api-key
    ```

    *   `GITHUB_TOKEN`: (Optional) A GitHub Personal Access Token with `repo` scope if you plan to index private repositories.
    *   `SUPABASE_URL`: Your Supabase project URL, found in your Supabase project settings.
    *   `SUPABASE_SERVICE_KEY`: Your Supabase `service_role` key, found under Project Settings > API Keys in your Supabase dashboard. **Keep this key secure and do not expose it in client-side code.**
    *   `GOOGLE_API_KEY`: Your Google Cloud API Key with access to the Generative AI API.

3.  **Netlify Environment Variables (for deployment)**:
    If deploying to Netlify, you must also configure these environment variables in your Netlify dashboard:
    `Site Settings` > `Build & deploy` > `Environment`. Add each key exactly as above.

### Supabase Database Setup

Code Expert uses a PostgreSQL database with the `pgvector` extension for storing and querying code embeddings.

1.  **Enable `pgvector` extension**:
    In your Supabase project, navigate to `Database` > `Extensions` and enable `pgvector`.

2.  **Create `code_chunks` table and `match_chunks_by_embedding` function**:
    Go to your Supabase SQL Editor and run the following SQL commands:

    ```sql
    create extension if not exists vector;

    create table if not exists code_chunks (
      id uuid primary key default gen_random_uuid(),
      repo_id text not null,
      file_path text not null,
      content text not null,
      embedding vector(1536), -- Adjust dimension if your embedding model changes (CodeBERT uses 768)
      metadata jsonb,
      created_at timestamp with time zone default now()
    );

    create function match_chunks_by_embedding(
      query_embedding vector(1536), -- Adjust dimension to match your embedding model
      repo_filter text,
      k int
    ) returns table (
      id uuid,
      repo_id text,
      file_path text,
      content text,
      embedding vector(1536),
      metadata jsonb,
      created_at timestamp with time zone,
      distance float
    ) as $$
    begin
      return query
      select *, (embedding <=> query_embedding) as distance
      from code_chunks
      where repo_id = repo_filter
      order by embedding <=> query_embedding
      limit k;
    end;
    $$ language plpgsql;
    ```
    **Note**: The `embedding` column type and `query_embedding` parameter in the `match_chunks_by_embedding` function should match the dimension of your embedding model. The current setup uses `vector(1536)` which is common for some models, but `Xenova/microsoft-codebert-base` produces `768` dimensions. Please adjust accordingly if you change the model or if your `code_chunks` table was created with a different dimension.

## 🏃 Usage

### Local Development

To run the application locally, you'll use Netlify CLI to serve both the frontend and the Netlify Functions.

1.  **Install Netlify CLI** (if you haven't already):

    ```bash
    npm install -g netlify-cli
    ```

2.  **Start the development server**:

    ```bash
    netlify dev
    ```

    This will typically start the frontend at `http://localhost:8888` and expose your Netlify Functions at `http://localhost:8888/.netlify/functions/<functionName>`.

### Processing a GitHub Repository

1.  **Open the application** in your browser (e.g., `http://localhost:8888`).
2.  Navigate to the "Live Demo" section.
3.  **Paste a public GitHub repository URL** (e.g., `https://github.com/facebook/react`) into the input field.
4.  Click the "Process Repo" button.
5.  The application will clone the repository, chunk its code files, generate embeddings, and store them in your Supabase database. This process can take some time depending on the size of the repository. A success message will appear once indexing is complete.

### Chatting with Your Codebase

Once a repository has been successfully indexed:

1.  The chat interface will automatically appear below the "Live Demo" section.
2.  **Type your question** about the codebase into the input field (e.g., "What does the `UserService` do?").
3.  Choose between "Base RAG" and "Filtered RAG" variants:
    *   **Base RAG**: Retrieves code chunks purely based on semantic similarity to your question.
    *   **Filtered RAG**: Applies additional keyword filtering to prioritize more specific and relevant chunks, often leading to more precise answers for detailed questions.
4.  Click the "Send" button.
5.  Code Expert will retrieve relevant code snippets, use them as context for Gemini 2.5 Pro, and provide a grounded answer. You can also view the metrics (context relevance, groundedness) and the source files used to generate the answer.

## ⚙️ Configuration Options

All configuration is managed via environment variables as described in the [Environment Variables](#environment-variables) section.

## 📚 API Documentation

Code Expert exposes two primary Netlify Functions as its backend API:

### `POST /.netlify/functions/processRepo`

*   **Description**: Clones a specified GitHub repository, chunks its code files, generates embeddings, and stores them in the Supabase database.
*   **Request Body**:
    ```json
    {
      "githubUrl": "string" // The URL of the GitHub repository to process
    }
    ```
*   **Response**:
    ```json
    {
      "status": "success",
      "repo_id": "string",    // A unique ID (SHA256 hash) for the processed repository
      "total_chunks": number  // The total number of code chunks processed
    }
    ```
*   **Error Response**:
    ```json
    {
      "error": "string" // Description of the error
    }
    ```

### `POST /.netlify/functions/chat`

*   **Description**: Answers a question about an already indexed repository using Retrieval Augmented Generation (RAG).
*   **Request Body**:
    ```json
    {
      "repo_id": "string",          // The unique ID of the indexed repository
      "question": "string",         // The question to ask about the codebase
      "variant": "base" | "filtered" // The RAG variant to use
    }
    ```
*   **Response**:
    ```json
    {
      "answer": "string", // The AI-generated answer
      "metrics": {
        "context_relevance": number,     // How relevant the retrieved context was (0-1)
        "groundedness": number,          // How much of the answer is supported by the context (0-1)
        "num_chunks_retrieved": number   // Number of code chunks used for generation
      },
      "sources": [
        {
          "file_path": "string", // Path to the source file
          "distance": number     // Semantic distance from the question embedding
        }
        // ... more source objects
      ]
    }
    ```
*   **Error Response**:
    ```json
    {
      "error": "string" // Description of the error
    }
    ```

## 🤝 Contributing

We welcome contributions to Code Expert! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository.
2.  **Clone** your forked repository: `git clone https://github.com/YOUR_USERNAME/Code-Expert.git`
3.  **Create a new branch**: `git checkout -b feature/your-feature-name`
4.  **Make your changes** and ensure they adhere to the existing code style.
5.  **Commit your changes**: `git commit -m "feat: Add new feature"`
6.  **Push to your branch**: `git push origin feature/your-feature-name`
7.  **Open a Pull Request** to the `main` branch of the original repository.

Please ensure your code compiles without errors and passes all checks.

## ⚠️ Known Limitations & Bugs

*   **Processing Time**: Indexing large repositories can take a significant amount of time (up to 60 seconds or more) due to cloning, chunking, and embedding processes.
*   **Cold Start Latency**: The embedding model (`Xenova/microsoft-codebert-base`) can incur a cold start delay on Netlify Functions, leading to initial requests being slower.
*   **API Rate Limits**: Heavy usage might hit rate limits on GitHub (for cloning) or Google Gemini API.
*   **Public Repositories Only**: By default, only public GitHub repositories can be processed. Support for private repositories requires a `GITHUB_TOKEN` with appropriate permissions.
*   **File Type Support**: Only specific code file extensions are processed (`.py`, `.js`, `.java`, `.cpp`, `.ts`, `.tsx`, `.md`).

## 🗺️ Roadmap

Here are some planned features and future improvements:

*   **Enhanced Private Repo Support**: More robust authentication for private repositories (e.g., OAuth).
*   **Alternative LLM Integrations**: Support for other generative AI models beyond Gemini.
*   **Advanced Chunking Strategies**: Implement AST-based or semantic chunking for more intelligent code segmentation.
*   **User Authentication & History**: Allow users to log in and persist their chat history and indexed repositories.
*   **Web UI for Repo Management**: A dedicated interface to view, manage, and delete indexed repositories.
*   **Improved Metrics & Analytics**: More detailed insights into RAG performance.
*   **Streaming Responses**: Implement server-sent events for real-time AI response generation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits & Acknowledgments

Code Expert was developed by [Aryaman Gupta](https://github.com/AryamanGupta001).

Special thanks to:

*   **Netlify**: For providing the serverless functions and hosting platform.
*   **Supabase**: For the powerful PostgreSQL database and `pgvector` extension.
*   **Google Gemini**: For the advanced generative AI capabilities.
*   **Hugging Face Transformers.js**: For the client-side embedding models.
*   **All contributors**: Who help make this project better.

## 📧 Contact

For questions, feedback, or support, please open an issue on the [GitHub repository](https://github.com/AryamanGupta001/Code-Expert/issues) or contact the maintainer:

*   **Aryaman Gupta**: [LinkedIn](https://www.linkedin.com/in/gupta-aryaman/)

