document.addEventListener("DOMContentLoaded", () => {
  const pageProfilePicElement = document.getElementById("pageProfilePic")
  const pageTitleElement = document.getElementById("pageTitle")
  const pageDescriptionElement = document.getElementById("pageDescription")
  const pageLinksElement = document.getElementById("pageLinks")
  const pageSocialsElement = document.getElementById("pageSocials")

  const socialPlatforms = {
    instagram: { icon: "fab fa-instagram" },
    youtube: { icon: "fab fa-youtube" },
    facebook: { icon: "fab fa-facebook" },
    twitter: { icon: "fab fa-twitter" },
    tiktok: { icon: "fab fa-tiktok" },
    linkedin: { icon: "fab fa-linkedin" },
    github: { icon: "fab fa-github" },
    whatsapp: { icon: "fab fa-whatsapp" },
  }

  const renderPage = (data) => {
    const hasContent =
      data &&
      (data.title ||
        (data.links && data.links.some((link) => link.title && link.url)))
    if (!hasContent) {
      showWelcomeMessage()
      return
    }

    document.body.classList.toggle("dark-mode", data.isDark)
    document.title = data.title
    pageTitleElement.textContent = data.title
    pageDescriptionElement.textContent = data.description
    pageLinksElement.innerHTML = ""
    pageSocialsElement.innerHTML = ""

    if (data.profilePicture) {
      pageProfilePicElement.src = data.profilePicture
      pageProfilePicElement.style.display = "block"
    } else {
      pageProfilePicElement.style.display = "none"
    }

    if (data.links) {
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

    if (data.socials) {
      data.socials.forEach((social) => {
        if (social.platform && social.url && socialPlatforms[social.platform]) {
          const info = socialPlatforms[social.platform]
          const socialLink = document.createElement("a")
          socialLink.href = social.url
          socialLink.target = "_blank"
          socialLink.rel = "noopener noreferrer"
          socialLink.innerHTML = `<i class="${info.icon}"></i>`
          pageSocialsElement.appendChild(socialLink)
        }
      })
    }
  }

  const showWelcomeMessage = () => {
    /* ... código mantido ... */
  }
  const showErrorMessage = () => {
    /* ... código mantido ... */
  }

  // --- Lógica Principal ---
  const urlParams = new URLSearchParams(window.location.search)
  const dataParam = urlParams.get("data")
  if (dataParam) {
    try {
      const decodedJson = atob(dataParam)
      const pageData = JSON.parse(decodedJson)
      renderPage(pageData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      showErrorMessage()
    }
  } else {
    if (window.self !== window.top) showWelcomeMessage()
    else showErrorMessage()
  }

  window.addEventListener("message", (event) => {
    if (event.data) renderPage(event.data)
  })
})
