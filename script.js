const navOptions = document.querySelectorAll('.category-rows');
const container = document.getElementById('contentContainer');

const contentMap = {
    'home': { file: '../index.html' },
    'about': { file: 'about.html' },
    'awards': { file: 'awards.html' },
    'certifications': { file: 'certifications.html' },
    'video portfolio': { file: 'videoport.html' },
    'website portfolio': { file: 'websiteport.html' },
    'contact me!': { file: 'contact.html' }
};

function normalize(str) {
    return str.toLowerCase().trim();
}

function loadContent(contentLink, updateURL = true) {
    const key = normalize(contentLink);
    const pageInfo = contentMap[key];

    if (!pageInfo) {
        container.innerHTML = `<p>Content not available for "${key}"</p>`;
        return;
    }

    const fullPath = `./contents/${pageInfo.file}`;

    fetch(fullPath)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const inner = doc.querySelector('.content-container');
            container.innerHTML = inner ? inner.outerHTML : html;

            if (updateURL) {
                history.pushState(null, '', `?content=${encodeURIComponent(key)}`);
            }
        })
        .catch(err => {
            container.innerHTML = `<p>Error loading content: ${err.message}</p>`;
        });
}

navOptions.forEach(nav => {
    nav.addEventListener('click', () => {
        const text = nav.textContent.trim(); 

        if (!text) return;
        loadContent(text);


    });
});


const params = new URLSearchParams(window.location.search);
const initialContent = params.get('content');

if (initialContent === 'home') {
    window.location.href = '../index.html';
} else if (contentMap[initialContent]) {
    loadContent(initialContent, false);
}

const rows = document.querySelectorAll('.category-rows');

rows.forEach(r => {
    r.addEventListener('click', () => {
        const dropdown = r.nextElementSibling; 

        if (dropdown && dropdown.classList.contains('category-dropdown')) {
            if (dropdown.style.maxHeight === '0px' || dropdown.style.maxHeight === '') {
                dropdown.style.maxHeight = '100px';
                dropdown.style.padding = '1% 0';
            } else {
                dropdown.style.maxHeight = '0px';
                dropdown.style.padding = '0';
            }
        }
    });
});
