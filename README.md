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

| Prompt                                   | ai-coder-pro Output (Kimi-K2-Instruct) | Copilot Output |
|-------------------------------------------|----------------------------------------|----------------|
| "Write a Python function to reverse a string" | ![Uploading image.png…]()
            | <img width="2303" height="949" alt="image" src="https://github.com/user-attachments/assets/33b23c95-1cce-47eb-ba57-d4f0f91150fd" />
|

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

