import * as vscode from 'vscode';
import { BasicAgent } from './agents/BasicAgent';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function activate(context: vscode.ExtensionContext) {
	console.log('AI Coder Pro extension is now active!');

	const helloDisposable = vscode.commands.registerCommand('ai-coder-pro.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from ai-coder-pro!');
	});

	const chatPanelDisposable = vscode.commands.registerCommand('aiCoderPro.openChatPanel', () => {
		const panel = vscode.window.createWebviewPanel(
			'aiCoderProChat',
			'AI Coder Pro Chat',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		panel.webview.html = getChatWebviewContent();

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.type === 'prompt') {
				const config = vscode.workspace.getConfiguration('aiCoderPro');
				let apiKey = config.get<string>('huggingFaceApiKey') || process.env.HUGGINGFACE_API_KEY || process.env.TOGETHER_API_KEY;
				if (!apiKey) {
					panel.webview.postMessage({ type: 'ai', text: 'API Key is required.' });
					return;
				}
				const temperature = config.get<number>('temperature', 0.7);
				const maxTokens = config.get<number>('maxTokens', 512);
				const agent = new BasicAgent(apiKey);
				try {
					const response = await agent.generateCompletion(message.prompt, { temperature, maxTokens });
					panel.webview.postMessage({ type: 'ai', text: response });
				} catch (err: any) {
					panel.webview.postMessage({ type: 'ai', text: 'Error: ' + (err?.message || err) });
				}
			}
			if (message.type === 'editorAction') {
				const config = vscode.workspace.getConfiguration('aiCoderPro');
				let apiKey = config.get<string>('huggingFaceApiKey') || process.env.HUGGINGFACE_API_KEY || process.env.TOGETHER_API_KEY;
				if (!apiKey) {
					panel.webview.postMessage({ type: 'ai', text: 'API Key is required.' });
					return;
				}
				const temperature = config.get<number>('temperature', 0.7);
				const maxTokens = config.get<number>('maxTokens', 512);
				const agent = new BasicAgent(apiKey);
				let prompt = '';
				if (message.action === 'summarize') {
					prompt = `Summarize the following text or code:\n\n${message.text}`;
				} else if (message.action === 'explain') {
					prompt = `Explain the following text or code in detail:\n\n${message.text}`;
				} else if (message.action === 'refactor') {
					prompt = `Refactor the following code to improve readability and maintainability. Only return the refactored code.\n\n${message.text}`;
				} else {
					panel.webview.postMessage({ type: 'ai', text: 'Unknown action.' });
					return;
				}
				try {
					const response = await agent.generateCompletion(prompt, { temperature, maxTokens });
					panel.webview.postMessage({ type: 'ai', text: response });
				} catch (err: any) {
					panel.webview.postMessage({ type: 'ai', text: 'Error: ' + (err?.message || err) });
				}
			}
		});
	});

	const generateCodeDisposable = vscode.commands.registerCommand('aiCoderPro.generateCode', async () => {
		const config = vscode.workspace.getConfiguration('aiCoderPro');
		let apiKey = config.get<string>('huggingFaceApiKey') || process.env.HUGGINGFACE_API_KEY;

		if (!apiKey) {
			apiKey = await vscode.window.showInputBox({ prompt: 'Enter Hugging Face API Key', password: true });
			if (!apiKey) {
				vscode.window.showErrorMessage('API Key is required.');
				return;
			}
		}

		const prompt = await vscode.window.showInputBox({ prompt: 'Enter your code prompt' });
		if (!prompt) {
			vscode.window.showErrorMessage('Prompt is required.');
			return;
		}

		const agent = new BasicAgent(apiKey);
		const temperature = config.get<number>('temperature', 0.7);
		const maxTokens = config.get<number>('maxTokens', 512);

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating code...',
			cancellable: false
		}, async () => {
			try {
				const result = await agent.generateCompletion(prompt, { temperature, maxTokens });
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					editor.edit(editBuilder => {
						editBuilder.insert(editor.selection.active, result);
					});
					vscode.window.showInformationMessage('Code generated and inserted!');
				} else {
					vscode.window.showErrorMessage('No active editor.');
				}
			} catch (err: any) {
				vscode.window.showErrorMessage('Error generating code: ' + (err?.message || err));
			}
		});
	});

	context.subscriptions.push(
		helloDisposable,
		chatPanelDisposable,
		generateCodeDisposable
	);
}

function getChatWebviewContent(): string {
    const htmlPath = path.join(__dirname, '..', 'src', 'chatWebview.html');
    return fs.readFileSync(htmlPath, 'utf8');
}
