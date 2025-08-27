document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção dos Elementos ---
  const bioProfilePicInput = document.getElementById("bioProfilePic")
  const bioTitleInput = document.getElementById("bioTitle")
  const bioDescriptionInput = document.getElementById("bioDescription")
  const linksContainer = document.getElementById("linksContainer")
  const addLinkBtn = document.getElementById("addLinkBtn")
  const socialLinksContainer = document.getElementById("socialLinksContainer")
  const addSocialLinkBtn = document.getElementById("addSocialLinkBtn")
  const generatePageBtn = document.getElementById("generatePageBtn")
  const finalLinkResult = document.getElementById("finalLinkResult")
  const previewFrame = document.getElementById("previewFrame")
  const linkCounterElement = document.getElementById("linkCounter")
  const socialLinkCounterElement = document.getElementById("socialLinkCounter")
  const modal = document.getElementById("socialsModal")
  const closeModalBtn = document.getElementById("closeModalBtn")
  const socialsIconGrid = document.getElementById("socialsIconGrid")

  const MAX_LINKS = 5
  const MAX_SOCIAL_LINKS = 5
  let profilePicDataUrl = null

  const socialPlatforms = {
    instagram: { name: "Instagram", icon: "fab fa-instagram" },
    youtube: { name: "YouTube", icon: "fab fa-youtube" },
    facebook: { name: "Facebook", icon: "fab fa-facebook" },
    twitter: { name: "X (Twitter)", icon: "fab fa-twitter" },
    tiktok: { name: "TikTok", icon: "fab fa-tiktok" },
    linkedin: { name: "LinkedIn", icon: "fab fa-linkedin" },
    github: { name: "GitHub", icon: "fab fa-github" },
    whatsapp: { name: "WhatsApp", icon: "fab fa-whatsapp" },
  }

  const collectPageData = () => {
    const links = []
    document.querySelectorAll(".link-item").forEach((item) => {
      const title = item.querySelector(".link-title-input").value
      const url = item.querySelector(".link-url-input").value
      if (title && url) links.push({ title, url })
    })
    const socials = []
    document.querySelectorAll(".social-link-item").forEach((item) => {
      const platform = item.querySelector(".social-url-input").dataset.platform
      const url = item.querySelector(".social-url-input").value
      if (platform && url) socials.push({ platform, url })
    })
    return {
      profilePicture: profilePicDataUrl,
      title: bioTitleInput.value,
      description: bioDescriptionInput.value,
      links: links,
      socials: socials,
      isDark: localStorage.getItem("darkMode") === "true",
    }
  }

  const updatePreview = () => {
    const data = collectPageData()
    previewFrame.contentWindow.postMessage(data, "*")
  }

  const checkLinkLimit = () => {
    const currentLinks = document.querySelectorAll(".link-item").length
    if (linkCounterElement)
      linkCounterElement.textContent = `(${currentLinks}/${MAX_LINKS})`
    addLinkBtn.style.display = currentLinks >= MAX_LINKS ? "none" : "block"
  }

  const createNewLinkItem = () => {
    const linkItem = document.createElement("div")
    linkItem.className = "link-item"
    linkItem.innerHTML = `<div class="form-group"><input type="text" class="link-title-input" placeholder="Título do Botão (Ex: Meu Portfólio)"></div><div class="form-group"><input type="url" class="link-url-input" placeholder="URL do Link (Ex: https://...)"></div><div class="link-item-actions"><button class="remove-link-btn">Remover</button></div>`
    linkItem.querySelector(".remove-link-btn").addEventListener("click", () => {
      linkItem.remove()
      updatePreview()
      checkLinkLimit()
    })
    linkItem
      .querySelectorAll("input")
      .forEach((input) => input.addEventListener("input", updatePreview))
    linksContainer.appendChild(linkItem)
    checkLinkLimit()
  }

  const checkSocialLinkLimit = () => {
    const currentLinks = document.querySelectorAll(".social-link-item").length
    if (socialLinkCounterElement)
      socialLinkCounterElement.textContent = `(${currentLinks}/${MAX_SOCIAL_LINKS})`
    addSocialLinkBtn.style.display =
      currentLinks >= MAX_SOCIAL_LINKS ? "none" : "block"
  }

  const createNewSocialLinkItem = (platform) => {
    const socialItem = document.createElement("div")
    socialItem.className = "social-link-item"
    const platformInfo = socialPlatforms[platform]
    socialItem.innerHTML = `<i class="${platformInfo.icon}" style="font-size: 1.5rem; color: var(--primary-color);"></i><div class="form-group"><input type="url" class="form-control social-url-input" data-platform="${platform}" placeholder="Cole a URL do seu perfil de ${platformInfo.name}"></div><button class="remove-social-btn" title="Remover"><i class="fas fa-trash"></i></button>`
    socialItem
      .querySelector(".remove-social-btn")
      .addEventListener("click", () => {
        socialItem.remove()
        updatePreview()
        checkSocialLinkLimit()
      })
    socialItem
      .querySelector(".social-url-input")
      .addEventListener("input", updatePreview)
    socialLinksContainer.appendChild(socialItem)
    checkSocialLinkLimit()
  }

  const shortenUrl = async (longUrl, alias = "") => {
    try {
      let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(
        longUrl
      )}`
      if (alias) apiUrl += `&shorturl=${encodeURIComponent(alias)}`
      const response = await fetch(apiUrl)
      const data = await response.json()
      return data.shorturl
        ? { success: true, url: data.shorturl }
        : { success: false, message: data.errormessage || "Erro desconhecido." }
    } catch (error) {
      console.error("Erro ao encurtar URL:", error)
      return { success: false, message: "Falha na conexão." }
    }
  }

  // --- Lógica do Modal ---
  const openModal = () => (modal.style.display = "flex")
  const closeModal = () => (modal.style.display = "none")

  addSocialLinkBtn.addEventListener("click", openModal)
  closeModalBtn.addEventListener("click", closeModal)
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal()
  })

  for (const key in socialPlatforms) {
    const platform = socialPlatforms[key]
    const choiceElement = document.createElement("div")
    choiceElement.className = "social-icon-choice"
    choiceElement.dataset.platform = key
    choiceElement.innerHTML = `<i class="${platform.icon}"></i><span>${platform.name}</span>`
    socialsIconGrid.appendChild(choiceElement)
  }

  socialsIconGrid.addEventListener("click", (event) => {
    const choice = event.target.closest(".social-icon-choice")
    if (choice) {
      if (
        document.querySelectorAll(".social-link-item").length < MAX_SOCIAL_LINKS
      ) {
        createNewSocialLinkItem(choice.dataset.platform)
        closeModal()
      } else {
        alert(
          `Você pode adicionar no máximo ${MAX_SOCIAL_LINKS} redes sociais.`
        )
      }
    }
  })

  // --- Outros Event Listeners ---
  addLinkBtn.addEventListener("click", () => {
    if (document.querySelectorAll(".link-item").length < MAX_LINKS)
      createNewLinkItem()
    else alert(`Você pode adicionar no máximo ${MAX_LINKS} links.`)
  })
  bioTitleInput.addEventListener("input", updatePreview)
  bioDescriptionInput.addEventListener("input", updatePreview)
  bioProfilePicInput.addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        profilePicDataUrl = e.target.result
        updatePreview()
      }
      reader.readAsDataURL(file)
    }
  })

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
      .catch((err) => console.error("Falha ao copiar:", err))
  })

  // --- Inicialização ---
  createNewLinkItem()
  checkSocialLinkLimit()
  previewFrame.addEventListener("load", updatePreview)
})
