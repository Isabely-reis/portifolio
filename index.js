// Procura no HTML a faixa que contém todas as telas do carrossel.
const track = document.querySelector(".carousel-track");
// Busca cada tela e converte a lista encontrada em um array.
const slides = Array.from(document.querySelectorAll(".slide"));
// Busca todos os links do menu de navegação e os guarda em um array.
const navigationLinks = Array.from(document.querySelectorAll("nav a"));
const projectTrack = document.querySelector(".projetos-list");
const projectCards = Array.from(document.querySelectorAll(".projeto-card"));
const previousProjectButton = document.querySelector("#projeto-anterior");
const nextProjectButton = document.querySelector("#proximo-projeto");
const projectCounter = document.querySelector(".projetos-contador");
let activeProjectIndex = 0;

// Mostra o projeto correspondente ao índice recebido.
function showProject(index) {
    activeProjectIndex = index;
    projectTrack.style.transform = `translateX(-${activeProjectIndex * 100}%)`;
    projectCards.forEach((card, cardIndex) => {
        card.setAttribute("aria-hidden", String(cardIndex !== activeProjectIndex));
        card.classList.remove("construindo");
    });

    // Reinicia a animação do projeto ativo.
    const activeProject = projectCards[activeProjectIndex];
    void activeProject.offsetWidth;
    activeProject.classList.add("construindo");

    // Atualiza o estado dos botões de navegação e o contador de projetos.
    previousProjectButton.disabled = activeProjectIndex === 0;
    nextProjectButton.disabled = activeProjectIndex === projectCards.length - 1;
    projectCounter.textContent = `Projeto ${activeProjectIndex + 1} de ${projectCards.length}`;
}

// Mostra a tela correspondente ao identificador recebido, como "#sobre".
function showSlide(hash) {
    // Encontra no HTML o elemento cujo id corresponde ao identificador recebido.
    const target = document.querySelector(hash);
    // Encontra a tela do carrossel que contém o elemento identificado.
    const activeSlide = target && target.closest(".slide");

    // Encerra a função se o identificador não corresponder a uma tela.
    if (!activeSlide) {
        return;
    }

    // Descobre a posição da tela selecionada no array de telas.
    const activeIndex = slides.indexOf(activeSlide);
    // Desloca a faixa para exibir a tela selecionada.
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    // Reinicia a animação dos blocos sempre que a página de projetos é aberta.
    if (activeSlide.id === "projetos") {
        showProject(activeProjectIndex);
    }

    // Percorre todas as telas para informar quais estão ocultas aos leitores de tela.
    slides.forEach((slide, index) => {
        // Marca como oculta qualquer tela que não seja a tela selecionada.
        slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });

    // Percorre os links do menu para indicar qual opção está selecionada.
    navigationLinks.forEach((link) => {
        // Verifica se o link aponta para a tela selecionada.
        if (link.hash === hash) {
            // Informa acessibilidade e navegador que este link é o atual.
            link.setAttribute("aria-current", "page");
        } else {
            // Remove a marcação de atual dos outros links.
            link.removeAttribute("aria-current");
        }
    });
}

// Adiciona uma ação para cada link do menu.
navigationLinks.forEach((link) => {
    // Escuta o clique no link para controlar a troca de tela.
    link.addEventListener("click", (event) => {
        // Impede o navegador de pular diretamente para o elemento da página.
        event.preventDefault();
        // Atualiza o endereço com o identificador da tela selecionada.
        window.history.pushState(null, "", link.hash);
        // Exibe a tela correspondente ao link clicado.
        showSlide(link.hash);
    });
});

previousProjectButton.addEventListener("click", () => {
    if (activeProjectIndex > 0) {
        showProject(activeProjectIndex - 1);
    }
});

nextProjectButton.addEventListener("click", () => {
    if (activeProjectIndex < projectCards.length - 1) {
        showProject(activeProjectIndex + 1);
    }
});

// Escuta os botões voltar/avançar do navegador.
window.addEventListener("popstate", () => {
    // Exibe a tela indicada no endereço ou a tela inicial se não houver identificador.
    showSlide(window.location.hash || "#inicio");
});

// Exibe ao abrir a página a tela indicada no endereço, ou a inicial por padrão.
showProject(activeProjectIndex);
showSlide(window.location.hash || "#inicio");