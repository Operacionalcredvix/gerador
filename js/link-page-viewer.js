document.addEventListener('DOMContentLoaded', () => {
    const pageTitleElement = document.getElementById('pageTitle');
    const pageDescriptionElement = document.getElementById('pageDescription');
    const pageLinksElement = document.getElementById('pageLinks');

    // Função para renderizar a página com base nos dados recebidos
    const renderPage = (data) => {
        // Valida se os dados existem
        if (!data || !data.title || !data.links) {
            pageTitleElement.textContent = "Página não encontrada";
            pageDescriptionElement.textContent = "Os dados para esta página não foram encontrados ou estão corrompidos.";
            return;
        }

        // Atualiza o título da aba e da página
        document.title = data.title;
        pageTitleElement.textContent = data.title;
        pageDescriptionElement.textContent = data.description;

        // Limpa os links antigos
        pageLinksElement.innerHTML = '';

        // Cria e adiciona os novos links
        data.links.forEach(link => {
            if (link.title && link.url) {
                const linkAnchor = document.createElement('a');
                linkAnchor.href = link.url;
                linkAnchor.textContent = link.title;
                linkAnchor.target = '_blank'; // Abrir em nova aba
                linkAnchor.rel = 'noopener noreferrer';
                pageLinksElement.appendChild(linkAnchor);
            }
        });
    };

    // Tenta carregar os dados da URL
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');

        if (dataParam) {
            // Decodifica de Base64 e converte de JSON para objeto
            const decodedJson = atob(dataParam);
            const pageData = JSON.parse(decodedJson);
            renderPage(pageData);
        }
    } catch (error) {
        console.error("Erro ao carregar dados da URL:", error);
        renderPage(null); // Mostra uma mensagem de erro
    }

    // Listener para a pré-visualização em tempo real
    window.addEventListener('message', (event) => {
        // Adiciona uma verificação de segurança, se necessário, para a origem
        // if (event.origin !== 'URL_DA_FERRAMENTA') return;
        
        if (event.data) {
            renderPage(event.data);
        }
    });
});