// Pure logic of the extension, kept free of the `vscode` module so it can be unit tested.

/** True if `column` of the line `text` is inside a comment or a string/char literal. */
export function inCommentOrString(text: string, column: number): boolean {
    if (/^\s*\*/.test(text)) return true;

    let quote: string | null = null;
    for (let i = 0; i < column; i++) {
        const c = text[i];
        if (quote) {
            if (c === '\\') i++;
            else if (c === quote) quote = null;
        } else if (c === '/' && text[i + 1] === '/') {
            return true;
        } else if (c === '/' && text[i + 1] === '*') {
            const close = text.indexOf('*/', i + 2);
            if (close === -1 || close + 2 > column) return true;
            i = close + 1;
        } else if (c === '"' || c === '\'') {
            quote = c;
        }
    }
    return quote !== null;
}

/**
 * True if `typed`, just inserted at `column` of `line` (which already contains it),
 * starts a new identifier outside comments and strings.
 */
export function startsIdentifier(line: string, column: number, typed: string): boolean {
    if (!/^[A-Za-z_@]$/.test(typed)) return false;
    if (/[\w@]/.test(line[column - 1] ?? '') || /\w/.test(line[column + 1] ?? '')) return false;
    return !inCommentOrString(line, column);
}
