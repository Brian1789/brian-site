// Cookie management functions
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
    }
    return "";
}

// Cookie consent banner
window.addEventListener('load', function () {
    if (!getCookie("cookiesAccepted")) {
        const banner = document.getElementById("cookie-banner");
        if (banner) {
            banner.style.display = "block";
        }
    }
    const acceptBtn = document.getElementById("accept-cookies");
    if (acceptBtn) {
        acceptBtn.onclick = function () {
            setCookie("cookiesAccepted", "yes", 365);
            const banner = document.getElementById("cookie-banner");
            if (banner) {
                banner.style.display = "none";
            }
        }
    }
});

// Theme toggle functionality
(function () {
    const THEME_KEY = 'preferredTheme';
    const body = document.body;

    function getPreferredTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }

    function updateToggleIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        if (theme === 'dark') {
            // Show sun icon (suggests switching to light)
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V1h-2v3h2zm6 8h3v-2h-3v2zM4 12H1v-2h3v2zm8 8v3h-2v-3h2zm7.24-2.84l1.8 1.79-1.41 1.41-1.79-1.8 1.4-1.4zM4.22 17.76l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 6a6 6 0 100 12A6 6 0 0012 6z"/></svg>';
        } else {
            // Show moon icon (suggests switching to dark)
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
        }
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
        updateToggleIcon(theme);
    }

    // Initialize theme
    document.addEventListener('DOMContentLoaded', function () {
        const saved = getPreferredTheme();
        applyTheme(saved);

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                const next = body.classList.contains('dark-theme') ? 'light' : 'dark';
                applyTheme(next);
            });
        }
    });

    // Export for global access
    window.themeManager = { applyTheme, getPreferredTheme };
})();

// Animated text functionality
function initializeAnimatedText() {
    const phrases = [
        "Data Science Student 🧠",
        "Creative Developer 🎨",
        "Tech Explorer 🚀",
        "Problem Solver 🔧",
        "Future-Focused 💼"
    ];

    let i = 0;
    let j = 0;
    let currentPhrase = [];
    let isDeleting = false;

    function loop() {
        const textDisplay = document.getElementById('animated-text');
        if (!textDisplay) return;

        textDisplay.innerHTML = currentPhrase.join('');

        if (i < phrases.length) {
            if (!isDeleting && j <= phrases[i].length) {
                currentPhrase.push(phrases[i][j]);
                j++;
            }

            if (isDeleting && j > 0) {
                currentPhrase.pop();
                j--;
            }

            if (j === phrases[i].length) {
                isDeleting = true;
                setTimeout(loop, 1500);
                return;
            }

            if (isDeleting && j === 0) {
                currentPhrase = [];
                isDeleting = false;
                i = (i + 1) % phrases.length;
            }
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(loop, speed);
    }

    loop();
}

// Projects loading functionality
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const specialProjects = {
        'CSS-ART-GALLERY': 'https://brian1789.github.io/CSS-ART-GALLERY/',
        'portfolio_generator': 'https://brian1789.github.io/portfolio_generator/',
        'weather-app': 'https://brian1789.github.io/weather-app/',
        'algorithm-visualizer': 'https://brian1789.github.io/algorithm-visualizer/'
    };

    fetch('https://api.github.com/users/Brian1789/repos?sort=updated')
        .then(response => response.json())
        .then(repos => {
            repos.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'project-card';

                const name = document.createElement('h3');
                name.textContent = repo.name.replace(/[-_]/g, ' ');

                const description = document.createElement('p');
                description.textContent = repo.description || 'No description available.';

                const actions = document.createElement('div');
                actions.className = 'project-actions';

                const repoButton = document.createElement('a');
                repoButton.href = repo.html_url;
                repoButton.textContent = 'View Repository';
                repoButton.className = 'project-btn';
                repoButton.target = '_blank';

                if (specialProjects[repo.name]) {
                    const demoButton = document.createElement('a');
                    demoButton.href = specialProjects[repo.name];
                    demoButton.textContent = 'Live Demo';
                    demoButton.className = 'project-btn secondary';
                    demoButton.target = '_blank';
                    actions.appendChild(demoButton);
                }

                actions.appendChild(repoButton);

                card.appendChild(name);
                card.appendChild(description);
                card.appendChild(actions);

                projectsGrid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            projectsGrid.innerHTML = '<p>Could not load projects. Please try again later.</p>';
        });
}

// Navigation active link highlighting
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if ((currentPage === 'index.html' || currentPage === '') && href === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === href) {
            link.classList.add('active');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeAnimatedText();
    loadProjects();
    updateActiveNavLink();
});