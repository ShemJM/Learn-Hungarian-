import { describe, it, expect } from 'vitest';
import { parseHash } from './router.js';

describe('parseHash', () => {
  it('defaults to home', () => {
    expect(parseHash('')).toEqual({ page: 'home', param: null });
    expect(parseHash('#/')).toEqual({ page: 'home', param: null });
    expect(parseHash('#')).toEqual({ page: 'home', param: null });
  });

  it('parses a simple page', () => {
    expect(parseHash('#/lessons')).toEqual({ page: 'lessons', param: null });
  });

  it('parses a page with a parameter', () => {
    expect(parseHash('#/lessons/food')).toEqual({ page: 'lessons', param: 'food' });
    expect(parseHash('#/grammar/vowel-harmony')).toEqual({ page: 'grammar', param: 'vowel-harmony' });
  });

  it('decodes URI-encoded params', () => {
    expect(parseHash('#/lessons/k%C3%A1v%C3%A9')).toEqual({ page: 'lessons', param: 'kávé' });
  });
});
