# C# Auto Suggest

Opens the C# completion list as soon as you start typing a new identifier, like Rider does. You no longer have to press <kbd>Ctrl</kbd>+<kbd>Space</kbd> or rely on VS Code's quick suggestions.

```csharp
var p|                   // suggestions open after the first letter
player.t|                // also after member access
Foo(a, b|)               // and inside argument lists
```

## How it works

The extension watches edits in C# documents and runs **Trigger Suggest** when all of these are true:

- A single letter, `_` or `@` was typed (not pasted, not from undo/redo).
- It is the first character of an identifier: the previous character is not part of a word, and no word follows the cursor.
- The cursor is not inside a comment (`//`, `/* */`, ` * ` doc lines) or a string/char literal.
- There is a single cursor.

## Requirements

A C# language extension that provides completions, such as [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) or [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit).

## Related extensions

- [C# Auto Parens](https://github.com/saix93/vscode-auto-parentheses): adds `()` when accepting a method from the completion list.
- [C# Smart Semicolon](https://github.com/saix93/vscode-smart-semicolon): typing `;` inside parentheses moves it to the end of the line.

## Development

```sh
npm install
npm test          # compile, then run the unit and integration tests
npm run package   # build the .vsix
```

The integration tests download a separate copy of VS Code into `.vscode-test/` and run inside it.

Press <kbd>F5</kbd> in VS Code to launch an Extension Development Host.

## License

[MIT](LICENSE)
