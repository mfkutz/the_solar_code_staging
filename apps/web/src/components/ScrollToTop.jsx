import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            // The discover form lives at the top of the hero, so these hashes
            // should land at the very top (title + form together), not jump down
            // to the form and leave the title clipped.
            if (id === 'discover' || id === 'home') {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                return;
            }
            // Wait a tick for the target page/section to render, then scroll to it.
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