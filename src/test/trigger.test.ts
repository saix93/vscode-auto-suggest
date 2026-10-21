import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { inCommentOrString, startsIdentifier } from '../trigger';

// Simulates typing the character right before '|' in `line`.
function typed(line: string): boolean {
    const column = line.indexOf('|') - 1;
    const text = line.replace('|', '');
    return startsIdentifier(text, column, text[column]);
}

describe('startsIdentifier', () => {
    it('triggers on the first letter of an identifier', () => {
        assert.equal(typed('v|'), true);
        assert.equal(typed('    var p|'), true);
        assert.equal(typed('player.t|'), true);
        assert.equal(typed('Foo(a, b|)'), true);
        assert.equal(typed('_|'), true);
        assert.equal(typed('@|'), true);
    });

    it('does not trigger while continuing an identifier', () => {
        assert.equal(typed('pl|'), false);
        assert.equal(typed('@c|'), false);
        assert.equal(typed('x1a|'), false);
    });

    it('does not trigger when typing in front of an identifier', () => {
        assert.equal(typed('p|layer'), false);
    });

    it('does not trigger on non identifier characters', () => {
        assert.equal(typed('x = 1|'), false);
        assert.equal(typed('Foo(|'), false);
        assert.equal(typed('a |'), false);
    });

    it('does not trigger inside comments or strings', () => {
        assert.equal(typed('// h|'), false);
        assert.equal(typed('x = 1; // h|'), false);
        assert.equal(typed('/* h|'), false);
        assert.equal(typed('Debug.Log("h|'), false);
        assert.equal(typed('var c = \'a|'), false);
        assert.equal(typed('     * h|'), false);
    });

    it('triggers after a closed comment or string', () => {
        assert.equal(typed('/* note */ v|'), true);
        assert.equal(typed('Log("a", b|'), true);
        assert.equal(typed('Log("\\"", b|'), true);
    });
});

describe('inCommentOrString', () => {
    it('detects the documentation comment continuation', () => {
        assert.equal(inCommentOrString(' * text', 4), true);
    });

    it('ignores comment markers inside strings', () => {
        assert.equal(inCommentOrString('Log("//") + x', 12), false);
    });
});
