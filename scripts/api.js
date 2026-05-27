async function getEntries() {
    try {
        const response = await fetch('data/entries.json');
        if (!response.ok) throw new Error('Erro ao carregar os dados');
        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        return [];
    }
}