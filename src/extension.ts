import * as vscode from 'vscode';
import { startsIdentifier } from './trigger';

// Opens the completion list as soon as a new identifier starts being typed.
function onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent): void {
    if (e.reason !== undefined || e.document.languageId !== 'csharp' || e.contentChanges.length !== 1) return;

    const change = e.contentChanges[0];
    if (change.rangeLength !== 0) return;

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== e.document || editor.selections.length !== 1) return;

    const line = e.document.lineAt(change.range.start.line).text;
    if (!startsIdentifier(line, change.range.start.character, change.text)) return;

    // Wait for the cursor to move past the typed character.
    setTimeout(() => vscode.commands.executeCommand('editor.action.triggerSuggest'), 0);
}

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument));
}

export function deactivate(): void {}
