import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/preact';
import { createElement } from 'preact';
import { NotFoundComponent } from '../not-found';

vi.mock('@/i18n', () => ({
  useI18n: vi.fn().mockReturnValue({
    t: vi.fn((key: string) => key),
  }),
}));

describe('NotFoundComponent', () => {
  it('should render not found message', () => {
    const r = render(createElement(NotFoundComponent, {}));

    expect(r.container.innerHTML)
      .toMatchInlineSnapshot(`"<div class="qc-not-found"><svg class="qc-icon" width="48" height="48" aria-hidden="true"><use href="#icon-image-broken"></use></svg><div>common.Presentation not found</div></div>"`);
  });
});
