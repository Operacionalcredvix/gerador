document.addEventListener("DOMContentLoaded", () => {
  const pageTitleElement = document.getElementById("pageTitle")
  const pageDescriptionElement = document.getElementById("pageDescription")
  const pageLinksElement = document.getElementById("pageLinks")

  // Função para renderizar a página com base nos dados recebidos
  const renderPage = (data) => {
    // Verifica se os dados são válidos (título existe e há pelo menos um link com título e url)
    const hasContent =
      data && data.title && data.links.some((link) => link.title && link.url)

    if (!hasContent) {
      // Se não tiver conteúdo, mostra a mensagem de boas-vindas na pré-visualização
      showWelcomeMessage()
      return
    }

    // Aplica o tema e renderiza o conteúdo
    document.body.classList.toggle("dark-mode", data.isDark)
    document.title = data.title
    pageTitleElement.textContent = data.title
    pageDescriptionElement.textContent = data.description
    pageLinksElement.innerHTML = ""

    data.links.forEach((link) => {
      if (link.title && link.url) {
        const linkAnchor = document.createElement("a")
        linkAnchor.href = link.url
        linkAnchor.textContent = link.title
        linkAnchor.target = "_blank"
        linkAnchor.rel = "noopener noreferrer"
        pageLinksElement.appendChild(linkAnchor)
      }
    })
  }

  // Nova função para a mensagem de boas-vindas/inicial
  const showWelcomeMessage = () => {
    pageTitleElement.textContent = "Sua Página de Links"
    pageDescriptionElement.textContent =
      "Comece a preencher os campos ao lado para ver a mágica acontecer em tempo real!"
    pageLinksElement.innerHTML = ""
  }

  // Nova função para a mensagem de erro pública
  const showErrorMessage = () => {
    pageTitleElement.textContent = "Oops! Link Quebrado"
    pageDescriptionElement.textContent =
      "Não foi possível carregar o conteúdo desta página. Que tal criar sua própria página de links gratuitamente em nosso site?"
    pageLinksElement.innerHTML = ""
  }

  // --- Lógica Principal ---
  const urlParams = new URLSearchParams(window.location.search)
  const dataParam = urlParams.get("data")

  if (dataParam) {
    // Se existe um link, tenta decodificá-lo
    try {
      const decodedJson = atob(dataParam)
      const pageData = JSON.parse(decodedJson)
      renderPage(pageData)
    } catch (error) {
      console.error("Erro ao carregar dados da URL:", error)
      showErrorMessage() // Mostra a mensagem de erro se a decodificação falhar
    }
  } else {
    // Se não há dados na URL, verifica se está na pré-visualização ou se é um erro
    const isInsideIframe = window.self !== window.top
    if (isInsideIframe) {
      showWelcomeMessage() // Mostra a mensagem de boas-vindas na pré-visualização
    } else {
      showErrorMessage() // Mostra a mensagem de erro para visitantes
    }
  }

  // Listener para a pré-visualização em tempo real
  window.addEventListener("message", (event) => {
    if (event.data) {
      renderPage(event.data)
    }
  })
})
