import { createRoot, hydrateRoot } from 'react-dom/client';
import { Router } from 'waku/router/client';

const rootElement = <Router />;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((globalThis as any).__WAKU_HYDRATE__) {
    hydrateRoot(document, rootElement);
} else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createRoot(document as any).render(rootElement);
}
