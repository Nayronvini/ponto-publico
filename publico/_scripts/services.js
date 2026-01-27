function toggleDetails(element) {
    // Sobe para o elemento pai (.service-item)
    const item = element.parentElement;

    // Toggle da classe 'active'
    item.classList.toggle('active');

    const allItems = document.querySelectorAll('.service-item');
    allItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
}