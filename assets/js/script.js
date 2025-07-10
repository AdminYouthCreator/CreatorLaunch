// --- Google Analytics Tracking Code ---
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CK1GR2RSRB'); 
// --- End of Google Analytics Code ---

document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const loadComponent = (url, placeholder) => {
        if (!placeholder) return Promise.resolve();
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    loadComponent('/assets/includes/header.html', headerPlaceholder).then(() => {
        // Mobile menu logic
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        }
        
        // Announcement banner close button logic
        const banner = document.getElementById('announcement-banner');
        const closeBtn = document.getElementById('announcement-close-btn');
        if(banner && closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.classList.add('hidden');
            });
        }
        
        // Highlight active navigation link
        highlightActiveLink();
    });

    loadComponent('/assets/includes/footer.html', footerPlaceholder);
});

function highlightActiveLink() {
    const currentPath = window.location.pathname; // e.g., "/about/team.html"

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href'); // e.g., "/about/"
        
        if (linkPath === '/') {
            if (currentPath === '/' || currentPath === '/index.html') {
                 link.classList.add('text-primary');
                 link.classList.remove('text-medium');
            }
            return; 
        }

        if (currentPath.startsWith(linkPath)) {
            link.classList.add('text-primary');
            link.classList.remove('text-medium');
            if (link.classList.contains('block')) {
                link.classList.add('font-bold', 'bg-gray-100');
            }
        }
    });
}
