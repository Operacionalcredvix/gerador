document.addEventListener('DOMContentLoaded', () => {
    try {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        // Aplica o tema salvo ao carregar a página
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        darkModeToggle.checked = isDarkMode;

        // Adiciona o listener para a mudança de tema
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', darkModeToggle.checked);
        });
    } catch (error) {
        console.error('Erro ao configurar o modo escuro:', error);
    }
});