VanillaTilt.init(document.querySelectorAll(".js-tilt"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Remove o banner de entrada após 1,5 segundos
setTimeout(() => {
  const logoBanner = document.querySelector('.logo-banner');
  if (logoBanner) {
    logoBanner.remove();
    console.log('Banner de entrada removido'); // Para depuração
  }
}, 1500);

// Função para rolagem suave ao clicar nos botões
document.querySelectorAll('.js-tilt').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    console.log('Botão clicado, destino:', targetId); // Para depuração
    const targetCard = document.getElementById(targetId);
    if (targetCard) {
      setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1000);
    } else {
      console.error('Cartão não encontrado para o ID:', targetId);
    }
  });
});

// Função para o botão de voltar ao topo
const backToTopButton = document.querySelector('.back-to-top');
const buttonContainer = document.querySelector('.button-container');

window.addEventListener('scroll', () => {
  const buttonContainerBottom = buttonContainer.offsetTop + buttonContainer.offsetHeight;
  console.log('ScrollY:', window.scrollY, 'ButtonContainerBottom:', buttonContainerBottom); // Para depuração
  if (window.scrollY > buttonContainerBottom) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  console.log('Botão de voltar ao topo clicado'); // Para depuração
  window.scrollTo({ top: 0, behavior: 'smooth' });
});