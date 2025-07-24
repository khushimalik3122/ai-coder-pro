import * as vscode from 'vscode';
import { BasicAgent } from './agents/BasicAgent';
import { GrokAgent } from './agents/GrokAgent';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export function activate(context: vscode.ExtensionContext) {
	console.log('AI Coder Pro extension is now active!');

	// Initialize conversation memory
	let conversationMemory: { role: string; content: string; timestamp: number }[] = [];
	let projectAnalysis: { files: string[]; summary: string; lastAnalysis: number } | null = null;

	// Load previous conversation from extension context
	const savedMemory = context.globalState.get('conversationMemory', []);
	conversationMemory = savedMemory;
	const savedAnalysis = context.globalState.get('projectAnalysis', null);
	projectAnalysis = savedAnalysis;

	// Function to save conversation memory
	const saveMemory = () => {
		context.globalState.update('conversationMemory', conversationMemory);
		context.globalState.update('projectAnalysis', projectAnalysis);
	};

	const helloDisposable = vscode.commands.registerCommand('ai-coder-pro.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from ai-coder-pro!');
	});

	const chatPanelDisposable = vscode.commands.registerCommand('aiCoderPro.openChatPanel', () => {
		console.log('Debug: Creating chat panel');
		const panel = vscode.window.createWebviewPanel(
			'aiCoderProChat',
			'AI Coder Pro Chat',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		console.log('Debug: Loading webview HTML');
		panel.webview.html = getChatWebviewContent();
		console.log('Debug: Webview HTML loaded');

		let togetherKeyOverride: string | undefined = undefined;

		// Test the webview communication
		setTimeout(() => {
			console.log('Debug: Testing webview communication');
			panel.webview.postMessage({ type: 'ai', text: '🔧 Webview communication test successful! If you see this message, the extension is working.' });
		}, 2000);

		panel.webview.onDidReceiveMessage(async (message) => {
			console.log('Debug: Backend received message:', message.type);
			if (message.type === 'test') {
				console.log('Debug: Test message received:', message.message);
				panel.webview.postMessage({ type: 'ai', text: '✅ Test successful! Backend communication working.' });
				return;
			}
			if (message.type === 'setApiKeys') {
				if (typeof message.togetherKey === 'string') {
					togetherKeyOverride = message.togetherKey;
				}
				return;
			}
			if (message.type === 'prompt') {
				const config = vscode.workspace.getConfiguration('aiCoderPro');
				let apiKey = togetherKeyOverride || config.get<string>('togetherApiKey') || process.env.TOGETHER_API_KEY;
				let grokApiKey = config.get<string>('grokApiKey') || process.env.GROQ_API_KEY;
				console.log('Debug: API Key available:', !!apiKey);
				const temperature = config.get<number>('temperature', 0.7);
				const maxTokens = config.get<number>('maxTokens', 4096);
				let response = '';
				try {
					conversationMemory.push({ role: 'user', content: message.prompt, timestamp: Date.now() });
					// Filter context: only last 6 messages, skip code/HTML, max 500 chars each, and skip user analysis messages
					const analysisKeywords = /analysis|breakdown|summary|semantics|structure|refactor|in short/i;
					const recentMessages = conversationMemory.slice(-12)
						.filter(m => m.content.length < 500 && !/^\s*<|^\s*\{|^\s*\/\//.test(m.content))
						.filter(m => !(m.role === 'user' && analysisKeywords.test(m.content)))
						.slice(-6);
					let contextPrompt = '';
					const systemPrompt = 'You are AI Coder Pro, a helpful coding assistant. Only return code if the user specifically asks for it. If the user provides their own analysis, do not repeat or summarize it. Always provide your own independent, original analysis.';
					if (recentMessages.length > 0) {
						contextPrompt = `${systemPrompt}\n\nPrevious conversation context:\n${recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nCurrent request: ${message.prompt}`;
					} else {
						contextPrompt = `${systemPrompt}\n\nUser: ${message.prompt}`;
					}
					// --- Groq model mapping ---
					const groqModelMap: Record<string, string> = {
						'grok-llama3-70b-8192': 'llama-3.3-70b-versatile',
						'grok-llama3-8b-8192': 'llama-3.3-8b-instant',
						'grok-mixtral-8x7b-32768': 'mixtral-8x7b-32768',
						'grok-gemma-7b-it': 'gemma-7b-it'
					};
					let model = message.model || 'together';
					if (model.startsWith('grok-')) {
						if (!grokApiKey) {
							panel.webview.postMessage({ type: 'ai', text: '❌ Grok API Key is required. Please set your Grok API key in settings.' });
							return;
						}
						const groqModelName = groqModelMap[model] || 'llama-3.3-70b-versatile';
						const agent = new GrokAgent(grokApiKey, groqModelName);
						// Convert conversationMemory to AIMessage[] (role, content)
						const grokMessages = recentMessages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }));
						// Add current user prompt
						grokMessages.push({ role: 'user', content: message.prompt });
						response = await agent.generateCompletionWithContext(grokMessages, { temperature, maxTokens });
					} else {
				if (!apiKey) {
							panel.webview.postMessage({ type: 'ai', text: '❌ Together AI API Key is required. Please set your API key in settings (gear icon).' });
							return;
						}
						const agent = new BasicAgent(apiKey!);
						response = await agent.generateCompletion(contextPrompt, { temperature, maxTokens });
					}
					console.log('Debug: AI response received, length:', response.length);
					conversationMemory.push({ role: 'assistant', content: response, timestamp: Date.now() });
					saveMemory();
					console.log('Debug: Sending response to frontend, length:', response.length);
					panel.webview.postMessage({ type: 'ai', text: response });
					console.log('Debug: Response sent to frontend');
				} catch (err: any) {
					console.error('Debug: Error in chat:', err);
					panel.webview.postMessage({ type: 'ai', text: '❌ Error: ' + (err?.message || err) + '\n\nPlease check your API key and internet connection.' });
				}
			}
			if (message.type === 'editorAction') {
				const config = vscode.workspace.getConfiguration('aiCoderPro');
				let apiKey = togetherKeyOverride || config.get<string>('togetherApiKey') || process.env.TOGETHER_API_KEY;
				if (!apiKey) {
					panel.webview.postMessage({ type: 'ai', text: 'API Key is required.' });
					return;
				}
				const temperature = config.get<number>('temperature', 0.7);
				const maxTokens = config.get<number>('maxTokens', 4096);
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
					const agent = new BasicAgent(apiKey!);
					const response = await agent.generateCompletion(prompt, { temperature, maxTokens });
					panel.webview.postMessage({ type: 'ai', text: response });
				} catch (err: any) {
					panel.webview.postMessage({ type: 'ai', text: 'Error: ' + (err?.message || err) });
				}
			}
			if (message.type === 'fileUpload') {
				// Store uploaded files in memory for agent analysis
				conversationMemory.push({ 
					role: 'user', 
					content: `Uploaded files: ${message.files.join(', ')}\n\nContent:\n${message.content}`, 
					timestamp: Date.now() 
				});
				saveMemory();
				panel.webview.postMessage({ type: 'ai', text: `Files uploaded successfully. You can now use Agent: Start to analyze these files along with your project.` });
			}
			if (message.type === 'agentStart') {
				panel.webview.postMessage({ type: 'ai', text: '🤖 Agent is starting autonomous analysis...\n\n🔍 Step 1: Scanning project structure...' });
				const config = vscode.workspace.getConfiguration('aiCoderPro');
				let model = message.model || 'together';
				let apiKey = togetherKeyOverride || config.get<string>('togetherApiKey') || process.env.TOGETHER_API_KEY;
				let grokApiKey = config.get<string>('grokApiKey') || process.env.GROK_API_KEY;
				const temperature = config.get<number>('temperature', 0.3);
				const maxTokens = config.get<number>('maxTokens', 16384);
				
				// Step 1: Gather all project files
				panel.webview.postMessage({ type: 'ai', text: '📁 Scanning for code files...' });
				const uris = await vscode.workspace.findFiles('**/*.{js,ts,py,java,cpp,c,cs,go,rb,php,rs,swift,kt,m,scala,sh,pl,lua,json,yaml,yml}', '**/node_modules/**', 100);
				
				// Step 2: Analyze project structure
				panel.webview.postMessage({ type: 'ai', text: '🧠 Analyzing project structure and dependencies...' });
				let projectStructure = '';
				let codeChunks: { path: string; content: string; type: string }[] = [];
				
				for (const uri of uris) {
					const doc = await vscode.workspace.openTextDocument(uri);
					let content = doc.getText();
					const relativePath = vscode.workspace.asRelativePath(uri);
					
					// Determine file type
					const ext = relativePath.split('.').pop() || '';
					let fileType = 'code';
					if (['json', 'yaml', 'yml'].includes(ext)) {
						fileType = 'config';
					} else if (['md', 'txt'].includes(ext)) {
						fileType = 'docs';
					}
					
					// Compress and analyze code
					let compressedContent = content
						.replace(/\/\*.*?\*\//gs, '') // Remove block comments
						.replace(/\/\/.*$/gm, '') // Remove line comments
						.replace(/#.*$/gm, '') // Remove hash comments
						.replace(/\n{2,}/g, '\n') // Remove extra blank lines
						.trim();
					
					if (compressedContent.length > 3000) {
						compressedContent = compressedContent.slice(0, 3000) + '\n... (truncated)';
					}
					
					codeChunks.push({ 
						path: relativePath, 
						content: compressedContent, 
						type: fileType 
					});
					
					projectStructure += `${relativePath} (${fileType})\n`;
				}
				
				// Step 3: Build comprehensive analysis prompt
				panel.webview.postMessage({ type: 'ai', text: '🔍 Step 2: Performing deep code analysis...' });
				let analysisPrompt = `You are an autonomous AI coding agent like Cursor AI. Your task is to:

1. THINK: Analyze the entire project structure and identify issues
2. ANALYZE: Find bugs, performance issues, code quality problems, and improvement opportunities
3. DEBUG: Identify and fix issues automatically
4. IMPROVE: Refactor code for better maintainability, performance, and readability
5. APPLY: Automatically apply all fixes to the files

PROJECT STRUCTURE:
${projectStructure}

ANALYSIS CONTEXT:
- Previous conversations: ${conversationMemory.length > 0 ? 'Available' : 'None'}
- Focus on: Code quality, bugs, performance, security, best practices
- Apply fixes: Yes, automatically
- Be thorough: Yes, comprehensive analysis

FILES TO ANALYZE:
`;

				// Add code chunks with smart selection
				let totalLength = 0;
				const maxLength = 15000; // Increased for comprehensive analysis
				const selectedChunks = codeChunks.slice(0, 20); // Take first 20 files for analysis
				
				for (const chunk of selectedChunks) {
					if (totalLength + chunk.content.length > maxLength) {
						break;
					}
					analysisPrompt += `\n--- FILE: ${chunk.path} (${chunk.type}) ---\n${chunk.content}\n`;
					totalLength += chunk.content.length;
				}
				
				analysisPrompt += `\n\nINSTRUCTIONS:
1. Analyze each file thoroughly
2. Identify ALL issues: bugs, performance problems, code quality issues, security vulnerabilities
3. Provide improved code for each file that needs changes
4. Format your response as:
   File: [filename]
   Issues: [list of issues found]
   Code: [improved code]
   ---
5. Only return the improved code blocks, no explanations in the response
6. Be comprehensive - don't miss any issues
7. Apply modern best practices and patterns`;

				// Step 4: Call AI with enhanced parameters
				panel.webview.postMessage({ type: 'ai', text: '🤖 Step 3: AI is analyzing and generating fixes...' });
				
				try {
					let response = '';
					if (model === 'grok') {
						if (!grokApiKey) {
							panel.webview.postMessage({ type: 'ai', text: 'Grok API Key is required for agentic workflow.' });
							return;
						}
						const agent = new GrokAgent(grokApiKey);
						// Build messages for agentic workflow
						const agenticMessages = [
							{ role: 'user' as 'user', content: 'Agent autonomous analysis request' },
							{ role: 'user' as 'user', content: analysisPrompt }
						];
						const workflowInstructions = 'You are an autonomous AI coding agent. Follow the instructions and perform multi-step reasoning and code improvement.';
						response = await agent.runAgenticWorkflow(agenticMessages, workflowInstructions, { temperature, maxTokens });
					} else {
						if (!apiKey) {
							panel.webview.postMessage({ type: 'ai', text: 'API Key is required for the selected model.' });
							return;
						}
						const agent = new BasicAgent(apiKey!);
						response = await agent.generateCompletion(analysisPrompt, { temperature, maxTokens });
					}
					
					// Step 5: Parse and apply changes
					panel.webview.postMessage({ type: 'ai', text: '🔧 Step 4: Applying fixes automatically...' });
					
					const fileBlocks = response.split(/File: (.+?)\nIssues: (.+?)\nCode:\n([\s\S]*?)(?=\n---|\nFile:|$)/g);
					let appliedCount = 0;
					let totalIssues = 0;
					
					for (let i = 0; i < fileBlocks.length; i += 4) {
						if (fileBlocks[i] && fileBlocks[i + 1] && fileBlocks[i + 2] && fileBlocks[i + 3]) {
							const fileName = fileBlocks[i + 1].trim();
							const issues = fileBlocks[i + 2].trim();
							let code = fileBlocks[i + 3].trim();
							
							// Clean up code
							code = code.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1').trim();
							
							try {
								// Find the file in workspace
								const fileUri = uris.find(u => vscode.workspace.asRelativePath(u) === fileName);
								if (fileUri) {
									const doc = await vscode.workspace.openTextDocument(fileUri);
									const edit = new vscode.WorkspaceEdit();
									const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
									edit.replace(fileUri, fullRange, code);
									await vscode.workspace.applyEdit(edit);
									appliedCount++;
									totalIssues += issues.split('\n').length;
								}
							} catch (e) {
								panel.webview.postMessage({ type: 'ai', text: `⚠️ Could not apply changes to ${fileName}: ${e}` });
							}
						}
					}
					
					// Step 6: Report results
					const summary = `✅ Agent Analysis Complete!

📊 Results:
- Files analyzed: ${selectedChunks.length}
- Files improved: ${appliedCount}
- Total issues fixed: ${totalIssues}
- Analysis time: ${new Date().toLocaleTimeString()}

🔧 Changes applied automatically to your project.
💡 The agent has improved code quality, fixed bugs, and applied best practices.

Full Analysis Report:
${response}`;
					
					// Add to conversation memory
					conversationMemory.push({ 
						role: 'user', 
						content: 'Agent autonomous analysis request', 
						timestamp: Date.now() 
					});
					conversationMemory.push({ 
						role: 'assistant', 
						content: summary, 
						timestamp: Date.now() 
					});
					saveMemory();
					
					panel.webview.postMessage({ type: 'ai', text: summary });
					
				} catch (err: any) {
					panel.webview.postMessage({ type: 'ai', text: '❌ Agent error: ' + (err?.message || err) });
				}
			}
			if (message.type === 'clearMemory') {
				conversationMemory = [];
				projectAnalysis = null;
				saveMemory();
				panel.webview.postMessage({ type: 'ai', text: 'Conversation memory cleared.' });
			}
		});
	});

	const generateCodeDisposable = vscode.commands.registerCommand('aiCoderPro.generateCode', async () => {
		const config = vscode.workspace.getConfiguration('aiCoderPro');
		let apiKey = config.get<string>('togetherApiKey') || process.env.TOGETHER_API_KEY;
		
		if (!apiKey) {
			apiKey = await vscode.window.showInputBox({ prompt: 'Enter Together AI API Key', password: true });
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
