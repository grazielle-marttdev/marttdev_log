async function initFeed() {
    const entries = await getEntries();
    renderCards(entries);
    setupSearch(entries);
    setupFilter(entries);
}

function renderCards(entries) {
    const container = document.getElementById('entries-container');
    container.innerHTML  = entries.map(entry => `
        <a href="post.html?id=${entry.id}" class="card-link">
            <div class="card">
                <span class="date">${entry.date}</span>
                <h2>${entry.title}</h2>
                <div class="tags">
                    ${entry.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <p class="summary">${entry.summary}</p>
            </div>
        </a>
    `).join('');
}

function setupSearch(entries) {
    const searchInput = document.getElementById('search-input');
    const selectElement = document.getElementById('tag-filter');

    searchInput.addEventListener('input', () => {
        if (selectElement) selectElement.value = 'todas';

        const term = searchInput.value.toLowerCase().trim();

        const filtered = entries.filter(entry => 
            entry.title.toLowerCase().includes(term) ||
            entry.summary.toLowerCase().includes(term) ||
            entry.tags.some(tag => tag.toLowerCase().includes(term))
        );
        renderCards(filtered);
    });
}

function setupFilter(entries) {
    const selectElement = document.getElementById('tag-filter');

    const allTags = entries.flatMap(entry => entry.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    selectElement.innerHTML = `<option value="todas">Todas as categorias</option>`;
    uniqueTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.toLowerCase();
        option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        selectElement.appendChild(option);
    })
    
    selectElement.addEventListener('change', () => {
        const category = selectElement.value.toLowerCase();

        if (category === 'todas') {
            renderCards(entries);
        } else {
            const filtered = entries.filter(entry => 
                entry.tags.some(tag => tag.toLowerCase() === category)
            );
            renderCards(filtered);
        }
    });
}

initFeed();