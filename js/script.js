VanillaTilt.init(document.querySelectorAll(".js-tilt"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Função para rolagem suave ao clicar nos botões
document.querySelectorAll('.js-tilt').forEach((button, index) => {
  button.addEventListener('click', () => {
    // Atraso de 1 segundo antes da rolagem
    setTimeout(() => {
      const targetCard = document.querySelector(`.content-card:nth-child(${index + 2})`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  });
});
