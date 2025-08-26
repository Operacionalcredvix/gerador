document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção dos Elementos ---
  const bioTitleInput = document.getElementById("bioTitle")
  const bioDescriptionInput = document.getElementById("bioDescription")
  const linksContainer = document.getElementById("linksContainer")
  const addLinkBtn = document.getElementById("addLinkBtn")
  const generatePageBtn = document.getElementById("generatePageBtn")
  const finalLinkResult = document.getElementById("finalLinkResult")
  const previewFrame = document.getElementById("previewFrame")
  const linkCounterElement = document.getElementById("linkCounter") // Pega o novo elemento

  let linkIdCounter = 0
  const MAX_LINKS = 5

  // --- Funções ---

  const collectPageData = () => {
    const links = []
    document.querySelectorAll(".link-item").forEach((item) => {
      const title = item.querySelector(".link-title-input").value
      const url = item.querySelector(".link-url-input").value
      if (title && url) {
        links.push({ title, url })
      }
    })
    return {
      title: bioTitleInput.value,
      description: bioDescriptionInput.value,
      links: links,
      isDark: localStorage.getItem("darkMode") === "true",
    }
  }

  const updatePreview = () => {
    const data = collectPageData()
    previewFrame.contentWindow.postMessage(data, "*")
  }

  // ATUALIZADO: Função agora também atualiza o texto do contador
  const checkLinkLimit = () => {
    const currentLinks = document.querySelectorAll(".link-item").length

    // Atualiza o texto do contador
    linkCounterElement.textContent = `(${currentLinks}/${MAX_LINKS})`

    if (currentLinks >= MAX_LINKS) {
      addLinkBtn.style.display = "none"
    } else {
      addLinkBtn.style.display = "block"
    }
  }

  const createNewLinkItem = () => {
    linkIdCounter++
    const linkItem = document.createElement("div")
    linkItem.className = "link-item"
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
        `
    linkItem.querySelector(".remove-link-btn").addEventListener("click", () => {
      linkItem.remove()
      updatePreview()
      checkLinkLimit()
    })
    linkItem.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", updatePreview)
    })
    linksContainer.appendChild(linkItem)
    checkLinkLimit()
  }

  const shortenUrl = async (longUrl, alias = "") => {
    try {
      let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(
        longUrl
      )}`
      if (alias) {
        apiUrl += `&shorturl=${encodeURIComponent(alias)}`
      }
      const response = await fetch(apiUrl)
      const data = await response.json()
      if (data.shorturl) {
        return { success: true, url: data.shorturl }
      } else {
        return {
          success: false,
          message: data.errormessage || "Erro desconhecido.",
        }
      }
    } catch (error) {
      console.error("Erro ao encurtar URL:", error)
      return { success: false, message: "Falha na conexão com a API." }
    }
  }

  // --- Event Listeners ---
  addLinkBtn.addEventListener("click", () => {
    const currentLinks = document.querySelectorAll(".link-item").length
    if (currentLinks < MAX_LINKS) {
      createNewLinkItem()
    } else {
      alert(`Você pode adicionar no máximo ${MAX_LINKS} links.`)
    }
  })

  bioTitleInput.addEventListener("input", updatePreview)
  bioDescriptionInput.addEventListener("input", updatePreview)

  generatePageBtn.addEventListener("click", async () => {
    const data = collectPageData()
    if (!data.title || data.links.length === 0) {
      alert("Por favor, preencha o título e adicione pelo menos um link.")
      return
    }
    const jsonString = JSON.stringify(data)
    const base64String = btoa(jsonString)
    const baseUrl =
      window.location.origin +
      window.location.pathname.replace("link-bio.html", "link-page.html")
    const finalUrl = `${baseUrl}?data=${base64String}`
    const longUrlOutput = document.getElementById("longUrlOutput")
    const shortUrlOutput = document.getElementById("shortUrlOutput")
    const bioAliasInput = document.getElementById("bioAlias")
    longUrlOutput.value = finalUrl
    shortUrlOutput.value = "Encurtando..."
    finalLinkResult.style.display = "block"
    const customAlias = bioAliasInput.value
    const result = await shortenUrl(finalUrl, customAlias)
    if (result.success) {
      const shortUrl = result.url
      const shortCode = shortUrl.split("/").pop()
      shortUrlOutput.value = `gg/${shortCode}`
      shortUrlOutput.dataset.realUrl = shortUrl
    } else {
      shortUrlOutput.value = `Erro: ${result.message}`
      shortUrlOutput.dataset.realUrl = ""
    }
  })

  finalLinkResult.addEventListener("click", (event) => {
    const button = event.target.closest(".copy-btn-small")
    if (!button) return
    const targetInputId = button.dataset.target
    const inputToCopy = document.getElementById(targetInputId)
    const textToCopy =
      targetInputId === "shortUrlOutput" && inputToCopy.dataset.realUrl
        ? inputToCopy.dataset.realUrl
        : inputToCopy.value
    if (!textToCopy || textToCopy.startsWith("Erro:")) return
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalIcon = button.innerHTML
        button.innerHTML = '<i class="fa-solid fa-check"></i>'
        setTimeout(() => {
          button.innerHTML = originalIcon
        }, 1500)
      })
      .catch((err) => {
        console.error("Falha ao copiar:", err)
      })
  })

  // --- Inicialização ---
  createNewLinkItem()
  previewFrame.addEventListener("load", updatePreview)
})
