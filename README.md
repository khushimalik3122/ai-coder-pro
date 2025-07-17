# ai-coder-pro

AI-Coder-Pro is a Visual Studio Code extension that leverages AI-powered multi-agent orchestration to enhance your coding productivity. It is designed to automate, assist, and streamline development workflows directly within VS Code.

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
- AI-powered code generation using Hugging Face StarCoder
- Extensible architecture for future AI-powered features

## Requirements

- Visual Studio Code v1.102.0 or higher
- Node.js (for development/build)
- Hugging Face API key (for code generation)

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

1. **Set your Hugging Face API key** (choose one):
   - **Recommended:** In VS Code, open Settings and set `AI Coder Pro: Hugging Face Api Key` (`aiCoderPro.huggingFaceApiKey`).
   - Or, create a `.env` file in your project root:
     ```env
     HUGGINGFACE_API_KEY=your_huggingface_api_key_here
     ```
   - Or, you will be prompted for your API key the first time you use the command.
2. Open a file and place your cursor where you want to insert generated code.
3. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), run `AI Coder: Generate Code from Prompt`.
4. Enter your code prompt and wait for the completion to be inserted at your cursor.

## Extension Settings

- `aiCoderPro.huggingFaceApiKey`: Your Hugging Face API Key for code generation.

## Limitations

- Requires a valid Hugging Face API key with access to the StarCoder model.
- Subject to Hugging Face API rate limits and usage quotas.
- Network connectivity is required for code generation.
- Generated code quality depends on the underlying model and prompt.

## Known Issues

- No known issues at this time.

## Release Notes

### 0.0.1
- Initial project scaffolding and setup.
- Sample "Hello World" command.
- AI code generation command with Hugging Face integration.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or suggestions.

## License

MIT

---

*This project follows the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines).*
