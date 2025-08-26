document.addEventListener("DOMContentLoaded", () => {
  const pageTitleElement = document.getElementById("pageTitle")
  const pageDescriptionElement = document.getElementById("pageDescription")
  const pageLinksElement = document.getElementById("pageLinks")

  // Função para aplicar o tema
  const applyTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  // Função para renderizar a página com base nos dados recebidos
  const renderPage = (data) => {
    if (!data || !data.title || !data.links) {
      pageTitleElement.textContent = "Página não encontrada"
      pageDescriptionElement.textContent =
        "Os dados para esta página não foram encontrados ou estão corrompidos."
      return
    }

    // Aplica o tema e renderiza o conteúdo
    applyTheme(data.isDark)
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

  // Tenta carregar os dados da URL
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const dataParam = urlParams.get("data")

    if (dataParam) {
      const decodedJson = atob(dataParam)
      const pageData = JSON.parse(decodedJson)
      renderPage(pageData)
    }
  } catch (error) {
    console.error("Erro ao carregar dados da URL:", error)
    renderPage(null)
  }

  // Listener para a pré-visualização em tempo real
  window.addEventListener("message", (event) => {
    if (event.data) {
      renderPage(event.data)
    }
  })
})
