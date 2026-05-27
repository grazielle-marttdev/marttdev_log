async function initPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    const entries = await getEntries();
    const post = entries.find(p => p.id === postId);

    if (post) {
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('page-title').textContent = post.title;
        document.getElementById('post-date').textContent = post.date;
        document.getElementById('post-body').innerHTML = post.content;

        const tagsContainer = document.getElementById('post-tags');
        tagsContainer.innerHTML = post.tags.map(tag => `<span>${tag}</span>`).join('');
    } else {
        document.getElementById("post-body").innerHTML = "<h1>Post não encontrado :(</h1>";
    }
}

initPost();