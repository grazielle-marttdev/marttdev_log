async function initFeed() {
    const entries = await getEntries();
    renderCards(entries);
    setupSearch(entries);
    setupChips(entries);
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

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();

        const filtered = entries.filter(entry => 
            entry.title.toLowerCase().includes(term) ||
            entry.summary.toLowerCase().includes(term) ||
            entry.tags.some(tag => tag.toLowerCase().includes(term))
        );
        renderCards(filtered);
    });
}

function setupChips(entries) {
    const chips = document.querySelectorAll('.chip');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const category = chip.innerHTML.toLocaleLowerCase().trim();

            if (category === 'todas') {
                renderCards(entries);
            } else {
                const filtered = entries.filter(entry => 
                    entry.tags.some(tag => tag.toLowerCase() === category)
                );
                renderCards(filtered);
            }

            document.getElementById('search-input').value = '';
        })
    })
}

initFeed();