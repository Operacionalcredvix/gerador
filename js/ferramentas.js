document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Encurtador de URL ---
    const shortenUrlBtn = document.getElementById('shortenUrlBtn');
    const longUrlInput = document.getElementById('longUrl');
    const shortUrlResult = document.getElementById('shortUrlResult');

    shortenUrlBtn.addEventListener('click', async () => {
        const longUrl = longUrlInput.value;
        if (!longUrl || !isValidUrl(longUrl)) {
            alert('Por favor, insira uma URL válida.');
            return;
        }

        try {
            // Usando a API gratuita do TinyURL (não precisa de chave)
            const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('A resposta da rede não foi bem-sucedida.');
            }

            const shortUrl = await response.text();
            shortUrlResult.innerHTML = `<strong>URL Encurtada:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
            shortUrlResult.style.display = 'block';

        } catch (error) {
            console.error('Erro ao encurtar URL:', error);
            shortUrlResult.textContent = 'Erro ao encurtar a URL. Tente novamente.';
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

        // Limpa o contêiner antes de gerar um novo QR Code
        qrcodeContainer.innerHTML = '';
        qrcodeContainer.style.display = 'block';

        // Cria o QR Code
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