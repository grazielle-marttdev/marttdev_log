// Estado global - Controla a lógica de paginação
let currentPage = 1;
const itemsPerPage = 12;
let currentEntries = [];

async function initFeed() {
    const entries = await getEntries();
    currentEntries = entries;
    setupSearch(entries);
    setupFilter(entries);
    renderPage();
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

        currentEntries = entries.filter(entry => 
            entry.title.toLowerCase().includes(term) ||
            entry.summary.toLowerCase().includes(term) ||
            entry.tags.some(tag => tag.toLowerCase().includes(term))
        );

        // Reseta para a primeira página porque os resultados mudaram
        currentPage = 1;
        renderPage();
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
            currentEntries = entries;
        } else {
            currentEntries = entries.filter(entry => 
                entry.tags.some(tag => tag.toLowerCase() === category)
            );
        }

        currentPage = 1;
        renderPage();
    });
}

function renderPage() {
    // Calcula os índices baseados na página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Corta o array para pegar só os items desta página
    const paginatedItems = currentEntries.slice(startIndex, endIndex);

    // Renderiza os cards dessa página
    renderCards(paginatedItems);

    // Cria os botões de página
    renderPaginationControls();
}

function renderPaginationControls() {
    const container = document.getElementById('pagination-container');
    container.innerHTML = '';

    // Calcula o total de páginas
    const totalPages = Math.ceil(currentEntries.length / itemsPerPage);

    // Se tiver 1 página (ou zero resultados), não precisa mostrar os botões
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;

        // Destaca o botão da página atual
        if (i === currentPage) {
            btn.classList.add('active');
        }

        // Evento de click para mudar de página
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPage();

            // Faz o scrool voltar para o topo dos post suavemente
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        container.appendChild(btn);
    }

}

initFeed();