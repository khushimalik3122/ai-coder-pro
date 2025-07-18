# ai-coder-pro

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
| Prompt                                   | ai-coder-pro Output (Kimi-K2-Instruct) | Copilot Output |
|-------------------------------------------|----------------------------------------|----------------|
| "Write a Python function to reverse a string" | image.png               | image.png |
=======
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

## Features

- Multi-agent orchestration for code generation and automation (planned)
- Command palette integration ("Hello World" sample command included)
- AI-powered code generation using Together AI API and the moonshotai/Kimi-K2-Instruct model
- Extensible architecture for future AI-powered features
- **Project-Wide Refactor**: Use the command palette to run 'AI Coder: Project-Wide Refactor', describe your goal (e.g., "Convert all var to let/const"), and select which files to include. The extension will apply the AI's changes to all matching files. (Warning: This can make large changes—review with git or backups!)

## Requirements

- Visual Studio Code v1.102.0 or higher
- Node.js (for development/build)
- Together AI API key (for code generation)

## Getting Started

1. Clone the repository and install dependencies:
   ```sh
   npm install
   ```
2. Build the extension:
   ```sh
   npm run compile
   ```
3. Launch the extension in the Extension Development Host:
   ```sh
   code .
   # Press F5 to start debugging
   ```

## Usage

1. **Get your Together AI API key:**
   - Sign up at [Together AI](https://www.together.ai/) and create an API key from your dashboard.
2. **Set your Together AI API key** (choose one):
   - **Recommended:** In VS Code, open Settings and set `aiCoderPro.huggingFaceApiKey` (or `TOGETHER_API_KEY` in your `.env` file).
   - Or, you will be prompted for your API key the first time you use the command.
3. Open a file and place your cursor where you want to insert generated code.
4. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), run `AI Coder: Generate Code from Prompt`.
5. Enter your code prompt and wait for the completion to be inserted at your cursor.

## Extension Settings

- `aiCoderPro.huggingFaceApiKey`: Your Together AI API Key for code generation.

## Limitations

- Requires a valid Together AI API key with access to the moonshotai/Kimi-K2-Instruct model.
- Subject to Together AI API rate limits and usage quotas.
- Network connectivity is required for code generation.
- Generated code quality depends on the underlying model and prompt.

## Known Issues

- No known issues at this time.

## Release Notes

### 0.0.1
- Initial project scaffolding and setup.
- Sample "Hello World" command.
- AI code generation command with Together AI integration.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or suggestions.

## License

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
   git clone <your-repo-url>
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
