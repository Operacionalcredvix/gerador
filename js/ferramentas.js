document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Encurtador de URL ---
    const shortenUrlBtn = document.getElementById('shortenUrlBtn');
    const longUrlInput = document.getElementById('longUrl');
    const customAliasInput = document.getElementById('customAlias');
    const shortUrlResult = document.getElementById('shortUrlResult');

    shortenUrlBtn.addEventListener('click', async () => {
        const longUrl = longUrlInput.value;
        const customAlias = customAliasInput.value;

        if (!longUrl || !isValidUrl(longUrl)) {
            alert('Por favor, insira uma URL válida.');
            return;
        }

        try {
            let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;
            if (customAlias) {
                apiUrl += `&shorturl=${encodeURIComponent(customAlias)}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.shorturl) {
                const shortUrl = data.shorturl;
                
                // Extrai o código do link gerado (ex: 'minhalojahelp')
                const shortCode = shortUrl.split('/').pop();
                
                // Cria o texto personalizado 'gg/...' e o link real
                const displayText = `gg/${shortCode}`;
                
                shortUrlResult.innerHTML = `<strong>URL Personalizada:</strong> <a href="${shortUrl}" target="_blank">${displayText}</a>`;
                shortUrlResult.style.display = 'block';

            } else if (data.errorcode) {
                throw new Error(data.errormessage || 'Não foi possível encurtar a URL.');
            } else {
                throw new Error('Ocorreu um erro desconhecido.');
            }

        } catch (error) {
            console.error('Erro ao encurtar URL:', error);
            let userErrorMessage = 'Erro ao encurtar a URL. Tente novamente.';
            if (error.message.includes('already exists')) {
                userErrorMessage = 'Erro: Este alias personalizado já está em uso. Por favor, escolha outro.';
            } else if (error.message) {
                userErrorMessage = `Erro: ${error.message}`;
            }
            shortUrlResult.textContent = userErrorMessage;
            shortUrlResult.style.display = 'block';
        }
    });


    // --- Gerador de Link para WhatsApp ---
    const generateWaLinkBtn = document.getElementById('generateWaLinkBtn');
    const whatsappNumberInput = document.getElementById('whatsappNumber');
    const whatsappMessageInput = document.getElementById('whatsappMessage');
    const waLinkResult = document.getElementById('waLinkResult');

    generateWaLinkBtn.addEventListener('click', () => {
        const number = whatsappNumberInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const message = encodeURIComponent(whatsappMessageInput.value);

        if (!number) {
            alert('Por favor, insira um número de WhatsApp.');
            return;
        }

        const waLink = `https://wa.me/${number}?text=${message}`;
        waLinkResult.innerHTML = `<strong>Link Gerado:</strong> <a href="${waLink}" target="_blank">${waLink}</a>`;
        waLinkResult.style.display = 'block';
    });

    // --- Gerador de QR Code ---
    const generateQrBtn = document.getElementById('generateQrBtn');
    const qrTextInput = document.getElementById('qrText');
    const qrcodeContainer = document.getElementById('qrcode');
    let qrcode = null; // Variável para armazenar a instância do QR Code

    generateQrBtn.addEventListener('click', () => {
        const text = qrTextInput.value;
        if (!text) {
            alert('Por favor, digite um texto ou URL para gerar o QR Code.');
            return;
        }

        qrcodeContainer.innerHTML = '';
        qrcodeContainer.style.display = 'block';

        qrcode = new QRCode(qrcodeContainer, {
            text: text,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    });

    // Função auxiliar para validar URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
});