// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BasicAgent } from './agents/BasicAgent';
import * as dotenv from 'dotenv';
dotenv.config();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ai-coder-pro" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloDisposable = vscode.commands.registerCommand('ai-coder-pro.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ai-coder-pro!');
	});

	const generateCodeDisposable = vscode.commands.registerCommand('aiCoderPro.generateCode', async () => {
		console.log('Command aiCoderPro.generateCode started');
		
		const config = vscode.workspace.getConfiguration('aiCoderPro');
		let apiKey = config.get<string>('huggingFaceApiKey');
		console.log('API Key from config:', apiKey ? 'Set' : 'Not set');
		
		if (!apiKey) {
			apiKey = process.env.HUGGINGFACE_API_KEY;
			console.log('API Key from env:', apiKey ? 'Set' : 'Not set');
		}
		if (!apiKey) {
			apiKey = await vscode.window.showInputBox({
				prompt: 'Enter your Hugging Face API Key',
				ignoreFocusOut: true,
				password: true
			});
			console.log('API Key from prompt:', apiKey ? 'Set' : 'Not set');
			if (!apiKey) {
				vscode.window.showErrorMessage('API Key is required.');
				return;
			}
		}

		const prompt = await vscode.window.showInputBox({
			prompt: 'Enter your code prompt',
			ignoreFocusOut: true
		});
		console.log('Prompt received:', prompt);
		
		if (!prompt) {
			vscode.window.showErrorMessage('Prompt is required.');
			return;
		}

		console.log('Creating BasicAgent...');
		const agent = new BasicAgent(apiKey!);
		
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating code with Hugging Face...',
			cancellable: false
		}, async () => {
			console.log('Starting API call...');
			let completion: string;
			try {
				completion = await agent.generateCompletion(prompt!);
				console.log('API response received, length:', completion?.length);
				console.log('First 100 chars:', completion?.substring(0, 100));
			} catch (err: any) {
				console.error('API Error:', err);
				vscode.window.showErrorMessage('Error generating code: ' + (err?.message || err));
				return;
			}

			const editor = vscode.window.activeTextEditor;
			if (editor) {
				console.log('Inserting completion into editor...');
				editor.edit(editBuilder => {
					editBuilder.insert(editor.selection.active, completion);
				});
				vscode.window.showInformationMessage('Code generated and inserted!');
			} else {
				vscode.window.showErrorMessage('No active editor found.');
			}
		});
	});

	context.subscriptions.push(helloDisposable, generateCodeDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
