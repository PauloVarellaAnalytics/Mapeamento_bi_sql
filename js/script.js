VanillaTilt.init(document.querySelectorAll(".js-tilt"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Função para rolagem suave ao clicar nos botões
document.querySelectorAll('.js-tilt').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
      // Atraso de 1 segundo antes da rolagem
      setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  });
});
