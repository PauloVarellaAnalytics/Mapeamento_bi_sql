VanillaTilt.init(document.querySelectorAll(".js-tilt"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Função para a brincadeira
const jokeScreen = document.querySelector('.joke-screen');
const yesButton = document.querySelector('.yes-button');
const noButton = document.querySelector('.no-button');
const logoBanner = document.querySelector('.logo-banner');
let noButtonAttempts = 0;

function proceedToBanner() {
  jokeScreen.style.display = 'none';
  logoBanner.style.display = 'flex';
  setTimeout(() => {
    logoBanner.remove();
    // Restaurar conteúdo principal
    document.querySelector('header').style.display = 'block';
    document.querySelector('.button-container').style.display = 'flex';
    document.querySelector('.content-container').style.display = 'flex';
    document.querySelector('.back-to-top').style.display = 'block';
    document.querySelector('p').style.display = 'block';
    console.log('Banner removido, conteúdo restaurado'); // Para depuração
  }, 1500);
}

function moveNoButton(x, y) {
  const maxX = window.innerWidth - noButton.offsetWidth - 20;
  const maxY = window.innerHeight - noButton.offsetHeight - 20;
  const newX = Math.max(0, Math.min(maxX, x + (Math.random() * 200 - 100)));
  const newY = Math.max(0, Math.min(maxY, y + (Math.random() * 200 - 100)));
  noButton.style.position = 'absolute';
  noButton.style.left = `${newX}px`;
  noButton.style.top = `${newY}px`;
}

// Eventos para desktop (clique)
noButton.addEventListener('click', (e) => {
  if (noButtonAttempts < 3) {
    e.preventDefault(); // Evita clique prematuro
    moveNoButton(e.clientX, e.clientY);
    noButtonAttempts++;
    console.log('Tentativa no botão Não (clique):', noButtonAttempts); // Para depuração
    if (noButtonAttempts >= 3) {
      noButton.textContent = 'Com certeza';
      noButton.style.cursor = 'pointer';
      noButton.style.pointerEvents = 'auto';
    }
  } else {
    proceedToBanner();
  }
});

// Eventos para mobile (toque)
noButton.addEventListener('touchend', (e) => {
  if (noButtonAttempts < 3) {
    e.preventDefault(); // Evita comportamentos padrão
    const touch = e.changedTouches[0];
    moveNoButton(touch.clientX, touch.clientY);
    noButtonAttempts++;
    console.log('Tentativa no botão Não (toque):', noButtonAttempts); // Para depuração
    if (noButtonAttempts >= 3) {
      noButton.textContent = 'Com certeza';
      noButton.style.cursor = 'pointer';
      noButton.style.pointerEvents = 'auto';
    }
  } else {
    proceedToBanner();
  }
});

yesButton.addEventListener('click', proceedToBanner);

// Inicialmente, esconde o banner e o conteúdo
logoBanner.style.display = 'none';
document.querySelector('header').style.display = 'none';
document.querySelector('p').style.display = 'none';
document.querySelector('.button-container').style.display = 'none';
document.querySelector('.content-container').style.display = 'none';
document.querySelector('.back-to-top').style.display = 'none';

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