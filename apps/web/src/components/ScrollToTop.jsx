import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (hash) {
            // Wait a tick for the target page/section to render, then scroll to it.
            const id = hash.replace('#', '');
            requestAnimationFrame(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            });
            return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;