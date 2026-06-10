import { readable } from 'svelte/store';

/** Parse a location hash like "#/lessons/2" into { page: 'lessons', param: '2' }. */
export function parseHash(hash) {
  const path = (hash || '').replace(/^#\/?/, '');
  const [page, ...rest] = path.split('/');
  return {
    page: page || 'home',
    param: rest.length ? decodeURIComponent(rest.join('/')) : null
  };
}

export const route = readable(parseHash(typeof location !== 'undefined' ? location.hash : ''), (set) => {
  const update = () => set(parseHash(location.hash));
  window.addEventListener('hashchange', update);
  update();
  return () => window.removeEventListener('hashchange', update);
});

export function navigate(path) {
  location.hash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
}
