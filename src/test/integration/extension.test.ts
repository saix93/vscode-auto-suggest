import * as assert from 'node:assert/strict';
import * as vscode from 'vscode';
import { closeAllEditors, delay, openCSharp } from './helpers';

suite('Auto Suggest', () => {
    let requests = 0;
    let provider: vscode.Disposable;

    suiteSetup(async () => {
        // Only the extension may open the suggestion list during these tests.
        const editorConfig = vscode.workspace.getConfiguration('editor');
        await editorConfig.update('quickSuggestions', { other: false, comments: false, strings: false }, vscode.ConfigurationTarget.Global);
        await editorConfig.update('suggestOnTriggerCharacters', false, vscode.ConfigurationTarget.Global);

        provider = vscode.languages.registerCompletionItemProvider(['csharp', 'javascript'], {
            provideCompletionItems() {
                requests++;
                return [new vscode.CompletionItem('value', vscode.CompletionItemKind.Variable)];
            },
        });
        await vscode.extensions.getExtension('saix93.csharp-auto-suggest')!.activate();
    });

    suiteTeardown(() => provider.dispose());

    setup(() => { requests = 0; });

    teardown(async () => {
        await vscode.commands.executeCommand('hideSuggestWidget');
        await closeAllEditors();
    });

    // Types `text` at the '|' marker of `content` and returns whether completions were requested.
    async function opensSuggestions(content: string, text: string, language?: string): Promise<boolean> {
        await openCSharp(content, language);
        await vscode.commands.executeCommand('type', { text });
        await delay(500);
        return requests > 0;
    }

    test('opens suggestions on the first letter of an identifier', async () => {
        assert.equal(await opensSuggestions('    var |', 'v'), true);
    });

    test('opens suggestions after member access', async () => {
        assert.equal(await opensSuggestions('player.|', 't'), true);
    });

    test('does not open suggestions while continuing an identifier', async () => {
        assert.equal(await opensSuggestions('pla|', 'y'), false);
    });

    test('does not open suggestions inside comments or strings', async () => {
        assert.equal(await opensSuggestions('// |', 'h'), false);
        assert.equal(await opensSuggestions('Log("|")', 'h'), false);
    });

    test('does not open suggestions for non identifier characters', async () => {
        assert.equal(await opensSuggestions('x = |', '1'), false);
    });

    test('ignores other languages', async () => {
        assert.equal(await opensSuggestions('var |', 'v', 'javascript'), false);
    });
});
