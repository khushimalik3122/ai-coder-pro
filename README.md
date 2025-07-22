# AI Coder Pro

AI Coder Pro is a modern, smart VS Code extension that brings advanced AI coding assistance directly into your editor. It features a Perplexity-inspired chat UI, smart agents, file upload, and more to supercharge your coding workflow.
---
# UI 
![Homepage UI](![Uploading AI Coder Pro UI  .jpg…]()



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

[MIT](LICENSE)
