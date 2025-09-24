function loadSelect(select) {
    const selectBox = select.content.querySelector('.button-box.select');

    const title = selectBox.querySelector('.title');
    title.classList.add('placeholder');
    title.textContent = select.placeholder;

    selectBox.addEventListener('click', () => loadSuggestions(select));
}

function loadSuggestions(select) {
    const selectBox = select.content.querySelector('.button-box.select');
    const suggestions = selectBox.querySelector('.select-suggestions');
    const results = select.data();

    if (results) {
        results.classList.add('hidden');
        suggestions.style.display = 'none';
    } else {
        suggestions.style.display = 'block';
    }

    for (let i = 0; i < results.length; i++) {
        const option = results[i];
        const div = document.createElement('div');
        div.className = 'select-option';
        div.textContent = option.title;
        div.onclick = () => {
            option.action();
            suggestions.style.display = 'none';
        };
        suggestions.appendChild(div);
    }
    // Hide when clicking outside
    document.addEventListener("click", function hideOnClickOutsideSelect(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
            document.removeEventListener("click", hideOnClickOutsideSelect); // cleanup
        }
    });
}