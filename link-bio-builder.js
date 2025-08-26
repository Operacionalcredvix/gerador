document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção dos Elementos ---
    const bioTitleInput = document.getElementById('bioTitle');
    const bioDescriptionInput = document.getElementById('bioDescription');
    const linksContainer = document.getElementById('linksContainer');
    const addLinkBtn = document.getElementById('addLinkBtn');
    const generatePageBtn = document.getElementById('generatePageBtn');
    const finalLinkResult = document.getElementById('finalLinkResult');
    const previewFrame = document.getElementById('previewFrame');

    let linkIdCounter = 0;

    // --- Funções ---

    // Função para coletar todos os dados dos formulários
    const collectPageData = () => {
        const links = [];
        document.querySelectorAll('.link-item').forEach(item => {
            const title = item.querySelector('.link-title-input').value;
            const url = item.querySelector('.link-url-input').value;
            links.push({ title, url });
        });
        return {
            title: bioTitleInput.value,
            description: bioDescriptionInput.value,
            links: links
        };
    };

    // Função para atualizar a pré-visualização
    const updatePreview = () => {
        const data = collectPageData();
        previewFrame.contentWindow.postMessage(data, '*');
    };

    // Função para criar os campos de um novo link
    const createNewLinkItem = () => {
        linkIdCounter++;
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <div class="form-group">
                <input type="text" class="link-title-input" placeholder="Título do Botão (Ex: Meu Portfólio)">
            </div>
            <div class="form-group">
                <input type="url" class="link-url-input" placeholder="URL do Link (Ex: https://...)">
            </div>
            <div class="link-item-actions">
                <button class="remove-link-btn">Remover</button>
            </div>
        `;

        // Adiciona evento para remover o link
        linkItem.querySelector('.remove-link-btn').addEventListener('click', () => {
            linkItem.remove();
            updatePreview();
        });

        // Adiciona evento para atualizar a pré-visualização ao digitar
        linkItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updatePreview);
        });

        linksContainer.appendChild(linkItem);
    };

    // --- Event Listeners ---

    // Adicionar novo link
    addLinkBtn.addEventListener('click', () => {
        createNewLinkItem();
    });

    // Atualizar pré-visualização ao digitar no título/descrição
    bioTitleInput.addEventListener('input', updatePreview);
    bioDescriptionInput.addEventListener('input', updatePreview);

    // Gerar a URL final da página
    generatePageBtn.addEventListener('click', () => {
        const data = collectPageData();

        // Converte o objeto de dados para JSON, depois para Base64
        const jsonString = JSON.stringify(data);
        const base64String = btoa(jsonString);

        // Cria a URL final
        const baseUrl = window.location.origin + window.location.pathname.replace('link-bio.html', 'link-page.html');
        const finalUrl = `${baseUrl}?data=${base64String}`;

        // Mostra o resultado
        finalLinkResult.innerHTML = `
            <strong>Link da sua página gerado!</strong><br>
            <p>Copie e cole no seu navegador para ver o resultado. Você pode usar nosso <a href="ferramentas.html#url-shortener">encurtador de URL</a> para personalizá-lo!</p>
            <textarea rows="3" readonly style="width:100%; margin-top:0.5rem; resize:none;">${finalUrl}</textarea>
        `;
        finalLinkResult.style.display = 'block';
    });

    // --- Inicialização ---
    createNewLinkItem(); // Começa com um item de link
    previewFrame.addEventListener('load', updatePreview); // Garante que a pré-visualização seja atualizada após o carregamento
});