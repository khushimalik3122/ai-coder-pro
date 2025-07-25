# AI Coder Pro

<<<<<<< HEAD
AI Coder Pro is a modern, smart VS Code extension that brings advanced AI coding assistance directly into your editor. It features a Perplexity-inspired chat UI, smart agents, file upload, and more to supercharge your coding workflow.
---
# UI 
![AI Coder Pro](<img width="2356" height="1304" alt="image" src="https://github.com/user-attachments/assets/0917b54e-3f63-4a22-9ad6-8e213d43cd36" />
=======
AI-Coder-Pro is a Visual Studio Code extension that leverages AI-powered multi-agent orchestration to enhance your coding productivity. It is designed to automate, assist, and streamline development workflows directly within VS Code.

## Research Motivation

AI-Coder-Pro was developed to explore the integration of open, customizable LLMs (like Together AI's models) into developer workflows, with a focus on transparency, extensibility, and user privacy. Unlike proprietary tools, this extension allows users to select their own models and providers, and is designed for research and experimentation in code generation and multi-agent orchestration.

## Feature Comparison

| Feature                        | ai-coder-pro (Yours) | GitHub Copilot | TabNine | OpenAI GPT-3 Playground |
|--------------------------------|:--------------------:|:--------------:|:-------:|:-----------------------:|
| Open-source                    | ✅                   | ❌             | ❌      | ❌                      |
| Custom model support           | ✅                   | ❌             | ❌      | ✅                      |
| Together AI integration        | ✅                   | ❌             | ❌      | ❌                      |
| VS Code integration            | ✅                   | ✅             | ✅      | ❌                      |
| Multi-agent architecture       | (Planned)            | ❌             | ❌      | ❌                      |
| Free to use (with API key)     | ✅                   | ❌             | ❌      | ❌                      |
| User data privacy              | ✅                   | ❌             | ❌      | ❌                      |

## Example Outputs

<<<<<<< HEAD
| Prompt                                        | ai-coder-pro Output (Kimi-K2-Instruct) | Copilot Output |
|-----------------------------------------------|----------------------------------------|----------------|
| "Write a Python function to reverse a string" |  <img width="3139" height="1921" alt="image" src="https://github.com/user-attachments/assets/9aaef219-68e8-4871-ae05-d99f3e8fd156" /> | <img width="2303" height="949" alt="image" src="https://github.com/user-attachments/assets/69fceb7a-4a0f-49d8-be7a-ce0d3f5c2ff3" /> |
>>>>>>> a851507a4e6aefedafdd97fefe4ec62c34395aef

## Tech Stack

- **Language:** TypeScript (ES2022)
- **Build Tool:** [esbuild](https://esbuild.github.io/) (custom build script)
- **Extension API:** [VS Code Extension API](https://code.visualstudio.com/api)
- **Linting:** ESLint with TypeScript support
- **Testing:** Mocha, @vscode/test-cli, @vscode/test-electron
- **Package Management:** npm
- **Node.js Target:** Node16 (CommonJS)
>>>>>>> d5507e8 (Update README.md)

)
---
## Features

- **Modern Chat UI**: Clean, Perplexity-style chat interface with sidebar navigation and action buttons.
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
   npm run build
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

<<<<<<< HEAD
[MIT](LICENSE)
=======
MIT

---

*This project follows the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines).*

<<<<<<< HEAD
## New Features (vNext)

- **Enhanced Chat UI**: Conversation history, code formatting (Markdown/code blocks), and export chat as Markdown.
- **Configurable Settings**: Set temperature and max tokens for completions in VS Code settings.
- **New Commands**:
  - `AI Coder: Summarize Selected Code` — Summarizes the selected code and inserts a summary comment.
  - `AI Coder: Explain Selected Code` — Explains the selected code and inserts an explanation comment.
  - `AI Coder: Refactor Selected Code` — Refactors the selected code and replaces it with the improved version.

## Settings

- `aiCoderPro.huggingFaceApiKey`: Your Together AI API Key for code generation.
- `aiCoderPro.temperature`: Sampling temperature for AI completions (0.0-2.0, default: 0.7).
- `aiCoderPro.maxTokens`: Maximum number of tokens for AI completions (default: 512).

## Step-by-Step: How to Use in Any VS Code

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/) and install.
2. **Clone the Repository**:
   ```sh
   git clone <(https://github.com/khushimalik3122/ai-coder-pro)>
   cd ai-coder-pro
   ```
3. **Install Dependencies**:
   ```sh
   npm install
   ```
4. **Build the Extension**:
   ```sh
   npm run compile
   ```
5. **Open in VS Code**:
   ```sh
   code .
   # Press F5 to launch the Extension Development Host
   ```
6. **Set Your API Key**:
   - Open VS Code Settings and set `aiCoderPro.huggingFaceApiKey` (or use a `.env` file with `TOGETHER_API_KEY`).
7. **Configure Settings (Optional)**:
   - Adjust `aiCoderPro.temperature` and `aiCoderPro.maxTokens` in Settings as desired.
8. **Use the Extension**:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Run `AI Coder: Generate Code from Prompt`, `AI Coder: Open Chat Panel`, or the new commands for summarizing, explaining, or refactoring code.
   - In the chat panel, enjoy conversation history, code formatting, and export your chat as Markdown.

## Step-by-Step: How to Use Project-Wide Refactor

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Run `AI Coder: Project-Wide Refactor`.
3. Enter your refactoring or linting goal (e.g., "Convert all var to let/const").
4. Enter a file glob pattern (default: `**/*.{js,ts}`) to select which files to include.
5. Confirm if prompted about large changes.
6. The extension will process each file and apply the AI's changes.
7. Review your changes (use git or backups for safety).
=======
>>>>>>> a851507a4e6aefedafdd97fefe4ec62c34395aef
>>>>>>> d5507e8 (Update README.md)
