document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Encurtador de URL (código anterior mantido) ---
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
                const shortCode = shortUrl.split('/').pop();
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
    
    });

    // --- Gerador de Link para WhatsApp (código anterior mantido) ---
    const generateWaLinkBtn = document.getElementById('generateWaLinkBtn');
    const whatsappNumberInput = document.getElementById('whatsappNumber');
    const whatsappMessageInput = document.getElementById('whatsappMessage');
    const waLinkResult = document.getElementById('waLinkResult');

    generateWaLinkBtn.addEventListener('click', () => {
        const number = whatsappNumberInput.value.replace(/\D/g, '');
        const message = encodeURIComponent(whatsappMessageInput.value);
        if (!number) {
            alert('Por favor, insira um número de WhatsApp.');
            return;
        }
        const waLink = `https://wa.me/${number}?text=${message}`;
        waLinkResult.innerHTML = `<strong>Link Gerado:</strong> <a href="${waLink}" target="_blank">${waLink}</a>`;
        waLinkResult.style.display = 'block';
    });

    // --- Gerador de QR Code (LÓGICA NOVA E ATUALIZADA) ---
    const generateQrBtn = document.getElementById('generateQrBtn');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const qrTextInput = document.getElementById('qrText');
    const qrColorInput = document.getElementById('qrColor');
    const qrBgColorInput = document.getElementById('qrBgColor');
    const qrDotStyleInput = document.getElementById('qrDotStyle');
    const qrLogoInput = document.getElementById('qrLogo');
    const removeLogoBtn = document.getElementById('removeLogoBtn');
    const qrFileNameInput = document.getElementById('qrFileName');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrDownloadSection = document.getElementById('qrDownloadSection');

    let qrCodeInstance = null;
    let logoUrl = null; // Variável para armazenar a URL do logo

    // Função para gerar ou atualizar o QR Code
    const renderQRCode = () => {
        const text = qrTextInput.value;
        if (!text) {
            // Limpa tudo se não houver texto
            if (qrCodeInstance) {
                qrcodeContainer.innerHTML = '';
                qrcodeContainer.style.display = 'none';
                qrDownloadSection.style.display = 'none';
                qrCodeInstance = null;
            }
            return;
        }

        const options = {
            width: 256,
            height: 256,
            data: text,
            margin: 10,
            dotsOptions: {
                color: qrColorInput.value,
                type: qrDotStyleInput.value
            },
            backgroundOptions: {
                color: qrBgColorInput.value,
            },
            image: logoUrl, // Adiciona o logo aqui
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: 0.3 // O logo ocupará 30% do espaço
            }
        };

        if (qrCodeInstance) {
            qrCodeInstance.update(options);
        } else {
            qrCodeInstance = new QRCodeStyling(options);
            qrcodeContainer.innerHTML = '';
            qrCodeInstance.append(qrcodeContainer);
        }
        
        qrcodeContainer.style.display = 'flex';
        qrDownloadSection.style.display = 'block';
    };

    generateQrBtn.addEventListener('click', () => {
        if (!qrTextInput.value) {
            alert('Por favor, digite um texto ou URL para gerar o QR Code.');
            return;
        }
        renderQRCode();
    });
    
    // Listeners para atualização em tempo real
    qrColorInput.addEventListener('input', renderQRCode);
    qrBgColorInput.addEventListener('input', renderQRCode);
    qrDotStyleInput.addEventListener('change', renderQRCode);

    // Listener para o upload do logo
    qrLogoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            logoUrl = URL.createObjectURL(file);
            removeLogoBtn.style.display = 'flex';
            renderQRCode();
        }
    });

    // Listener para remover o logo
    removeLogoBtn.addEventListener('click', () => {
        logoUrl = null;
        qrLogoInput.value = ''; // Limpa o input de arquivo
        removeLogoBtn.style.display = 'none';
        renderQRCode();
    });

    // Função de Download
    downloadQrBtn.addEventListener('click', () => {
        if (qrCodeInstance) {
            const fileName = qrFileNameInput.value || 'qrcode';
            qrCodeInstance.download({
                name: fileName,
                extension: "png"
            });
        }
    });
