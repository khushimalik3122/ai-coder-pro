# AI Coder Pro
---
AI Coder Pro is a modern, smart VS Code extension that brings advanced AI coding assistance directly into your editor. It features a Perplexity-inspired chat UI, smart agents, file upload, and more to supercharge your coding workflow.
----
AI-Coder-Pro is a Visual Studio Code extension that leverages AI-powered multi-agent orchestration to enhance your coding productivity. It is designed to automate, assist, and streamline development workflows directly within VS Code.
## UI
<img width="3839" height="2157" alt="image" src="https://github.com/user-attachments/assets/f3e96951-a1c6-4727-8192-e0385464d640" />


---
## Research 

AI-Coder-Pro was developed to explore the integration of open, customizable LLMs (like Together AI's models) into developer workflows, with a focus on transparency, extensibility, and user privacy. Unlike proprietary tools, this extension allows users to select their own models and providers, and is designed for research and experimentation in code generation and multi-agent orchestration.
---
## documentation
[documentation](https://github.com/khushimalik3122/ai-coder-pro/blob/main/AI%20Coder%20Pro.pdf)
---
## Feature Comparison

| Feature                        | ai-coder-pro         | GitHub Copilot | TabNine | OpenAI GPT-3 Playground |
|--------------------------------|:--------------------:|:--------------:|:-------:|:-----------------------:|
| Open-source                    | ✅                   | ❌             | ❌      | ❌                      |
| Custom model support           | ✅                   | ❌             | ❌      | ✅                      |
| Together AI integration        | ✅                   | ❌             | ❌      | ❌                      |
| VS Code integration            | ✅                   | ✅             | ✅      | ❌                      |
| Multi-agent architecture       | (Planned)            | ❌             | ❌      | ❌                      |
| Free to use (with API key)     | ✅                   | ❌             | ❌      | ❌                      |
| User data privacy              | ✅                   | ❌             | ❌      | ❌                      |

## Example Outputs


| Prompt                                        | ai-coder-pro Output (Kimi-K2-Instruct) | Copilot Output |
|-----------------------------------------------|----------------------------------------|----------------|
| "Write a Python function to reverse a string" |  <img width="3139" height="1921" alt="image" src="https://github.com/user-attachments/assets/9aaef219-68e8-4871-ae05-d99f3e8fd156" /> | <img width="2303" height="949" alt="image" src="https://github.com/user-attachments/assets/69fceb7a-4a0f-49d8-be7a-ce0d3f5c2ff3" /> |
---

## Tech Stack

- **Language:** TypeScript (ES2022)
- **Build Tool:** [esbuild](https://esbuild.github.io/) (custom build script)
- **Extension API:** [VS Code Extension API](https://code.visualstudio.com/api)
- **Linting:** ESLint with TypeScript support
- **Testing:** Mocha, @vscode/test-cli, @vscode/test-electron
- **Package Management:** npm
- **Node.js Target:** Node16 (CommonJS)
- **create api** [together api](https://www.together.ai/)


## Features

- **Modern Chat UI**: Clean, Perplexity-style chat interface with sidebar navigation and action buttons.
- **Advanced RAG System**: Free document indexing and retrieval for context-aware responses.
- **Smart Agentic Workflow**: Multi-agent orchestration with specialized agents for different tasks.
- **Context Management**: Intelligent conversation summarization and context window optimization.
- **Workspace Indexing**: Automatically index your project files for enhanced AI assistance.
- **Smart Agents (Home Sidebar)**:
  - **Upload File**: Upload code files for analysis, code generation, or documentation.
  - **Run Code Review Agent**: Instantly review your project for code quality and best practices.
  - **Run Bug Finder**: Scan your codebase for bugs and anti-patterns.
  - **Run Refactor Agent**: Get refactoring suggestions and improvements.
  - **Generate Tests**: Automatically generate unit tests for your code.
  - **Project Summary**: Get a high-level summary of your project structure and contents.
- **File Upload Support**: Upload and analyze code files directly from the sidebar.
- **Persistent Conversation Memory**: Keeps track of your chat and agent history for context-aware responses.
- **Clear Chat**: Easily reset your conversation and context.
- **Action Buttons**: Quick actions like Troubleshoot, Learn, Fact Check, and Plan.
- **Library Section**: (Placeholder) For future features like saved threads and knowledge base.

## How to Run
Follow these steps  in command prompt
and sabse pahale together api set kar lenaa uper link dii hui h [together api](https://www.together.ai/)
1. **Clone the Repository**
   ```sh
   git clone https://github.com/khushimalik3122/ai-coder-pro
   cd ai-coder-pro
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Build the Extension**
   ```sh
   npm run compile
   code .
   ```
4. **Open in VS Code**
   - Open this folder in VS Code.
   - Press `F5` to launch a new Extension Development Host window.

## Usage

1. **Set Your API Key**
   - Go to VS Code settings and set your Together AI API key under `aiCoderPro.togetherApiKey`.

2. **Open the Chat Panel**
   - Run the command: `AI Coder Pro: Open Chat Panel` from the Command Palette (`Ctrl+Shift+P`).

3. **Use Smart Agents and File Upload**
   - Use the Home sidebar to upload files or run smart agents (Code Review, Bug Finder, Refactor, Test Generation, Project Summary).
   - Interact with the AI in the chat panel for code help, explanations, and more.

4. **Clear Chat**
   - Use the "Clear Chat" button to reset the conversation and context.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
