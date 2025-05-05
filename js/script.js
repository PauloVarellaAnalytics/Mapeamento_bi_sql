VanillaTilt.init(document.querySelectorAll(".js-tilt"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2
});

// Configuração dos confetes
const confettiCount = 20;
const sequinCount = 10;
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
let sequins = [];

const colors = [
  { front: '#7b5cff', back: '#6245e0' }, // Purple
  { front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
  { front: '#5c86ff', back: '#345dd1' }  // Darker Blue
];

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += (Math.random() < .25) ? randomRange(1, 3) : 0;
  }
  return { x: x, y: -y };
};

function Confetto(button) {
  this.randomModifier = randomRange(0, 99);
  this.color = colors[Math.floor(randomRange(0, colors.length))];
  this.dimensions = {
    x: randomRange(5, 9),
    y: randomRange(8, 15),
  };
  const rect = button.getBoundingClientRect();
  this.position = {
    x: randomRange(rect.left - rect.width / 4, rect.left + rect.width / 4),
    y: randomRange(rect.top + rect.height / 2 + 8, rect.top + (1.5 * rect.height) - 8),
  };
  this.rotation = randomRange(0, 2 * Math.PI);
  this.scale = {
    x: 1,
    y: 1,
  };
  this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
}

Confetto.prototype.update = function () {
  this.velocity.x -= this.velocity.x * dragConfetti;
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
};

function Sequin(button) {
  this.color = colors[Math.floor(randomRange(0, colors.length))].back;
  this.radius = randomRange(1, 2);
  const rect = button.getBoundingClientRect();
  this.position = {
    x: randomRange(rect.left - rect.width / 3, rect.left + rect.width / 3),
    y: randomRange(rect.top + rect.height / 2 + 8, rect.top + (1.5 * rect.height) - 8),
  };
  this.velocity = {
    x: randomRange(-6, 6),
    y: randomRange(-8, -12)
  };
}

Sequin.prototype.update = function () {
  this.velocity.x -= this.velocity.x * dragSequins;
  this.velocity.y = this.velocity.y + gravitySequins;
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

initBurst = (button) => {
  console.log('initBurst chamado para botão:', button.id); // Depuração
  const confettiSound = new Audio('sounds/confetti.mp3');
  confettiSound.play().catch(err => console.error('Erro ao tocar som:', err));
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto(button));
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin(button));
  }
};

render = () => {
  const jokeScreen = document.querySelector('.joke-screen');
  if (!jokeScreen || jokeScreen.style.display === 'none') {
    confetti = [];
    sequins = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log('Renderizando, confetti:', confetti.length, 'sequins:', sequins.length); // Depuração
  confetti.forEach((confetto, index) => {
    let width = (confetto.dimensions.x * confetto.scale.x);
    let height = (confetto.dimensions.y * confetto.scale.y);
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);
    confetto.update();
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });
  sequins.forEach((sequin, index) => {
    ctx.translate(sequin.position.x, sequin.position.y);
    sequin.update();
    ctx.fillStyle = sequin.color;
    ctx.beginPath();
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });
  confetti.forEach((confetto, index) => {
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
  });
  sequins.forEach((sequin, index) => {
    if (sequin.position.y >= canvas.height) sequins.splice(index, 1);
  });
  window.requestAnimationFrame(render);
};

resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);

// Função para a brincadeira
const jokeScreen = document.querySelector('.joke-screen');
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const logoBanner = document.querySelector('.logo-banner');
let noButtonAttempts = 0;
let disabledYes = false;
let disabledNo = false;

function proceedToBanner() {
  confetti = [];
  sequins = [];
  jokeScreen.style.display = 'none';
  logoBanner.style.display = 'flex';
  setTimeout(() => {
    logoBanner.remove();
    document.querySelector('header').style.display = 'block';
    document.querySelector('.button-container').style.display = 'flex';
    document.querySelector('.content-container').style.display = 'flex';
    document.querySelector('.back-to-top').style.display = 'block';
    document.querySelector('p').style.display = 'block';
    console.log('Banner removido, conteúdo restaurado'); // Para depuração
  }, 1500);
}

function moveNoButton(x, y) {
  noButton.classList.add('moving');
  const maxX = window.innerWidth - noButton.offsetWidth - 20;
  const maxY = window.innerHeight - noButton.offsetHeight - 20;
  const yesRect = yesButton.getBoundingClientRect();
  let newX, newY;
  const isLeftSide = x < window.innerWidth / 2;
  if (isLeftSide) {
    newX = randomRange(20, window.innerWidth / 2 - noButton.offsetWidth - 20);
  } else {
    newX = randomRange(window.innerWidth / 2 + 20, maxX);
  }
  newY = randomRange(20, maxY);
  // Evitar sobreposição com yesButton
  const noRect = { left: newX, top: newY, right: newX + noButton.offsetWidth, bottom: newY + noButton.offsetHeight };
  if (
    noRect.left < yesRect.right &&
    noRect.right > yesRect.left &&
    noRect.top < yesRect.bottom &&
    noRect.bottom > yesRect.top
  ) {
    newY = yesRect.top > window.innerHeight / 2 ? randomRange(20, yesRect.top - noButton.offsetHeight - 20) : randomRange(yesRect.bottom + 20, maxY);
  }
  noButton.style.left = `${newX}px`;
  noButton.style.top = `${newY}px`;
  console.log(`Botão Não movido para: x=${newX}, y=${newY}, lado=${isLeftSide ? 'esquerda' : 'direita'}`); // Depuração
}

function clickButton(button, disabledFlag, callback) {
  if (!disabledFlag) {
    disabledFlag = true;
    button.classList.add('loading');
    button.classList.remove('ready');
    setTimeout(() => {
      button.classList.add('complete');
      button.classList.remove('loading');
      button.querySelector('.successMessage .emoji').classList.remove('hidden');
      setTimeout(() => {
        initBurst(button);
        setTimeout(() => {
          disabledFlag = false;
          button.classList.add('ready');
          button.classList.remove('complete');
          button.querySelector('.successMessage .emoji').classList.add('hidden');
          callback();
        }, 4000);
      }, 320);
    }, 1800);
  }
  return disabledFlag;
}

// Configurar animação de texto nos botões
[yesButton, noButton].forEach(button => {
  const textElements = button.querySelectorAll('.button-text');
  textElements.forEach((element) => {
    const characters = element.innerText.split('');
    let characterHTML = '';
    characters.forEach((letter, index) => {
      characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
    });
    element.innerHTML = characterHTML;
  });
});

// Eventos para o botão "Não"
noButton.addEventListener('click', (e) => {
  if (noButtonAttempts < 3) {
    e.preventDefault();
    noButtonAttempts++;
    moveNoButton(e.clientX, e.clientY);
    // Atualizar emoji com base na tentativa
    noButton.querySelector('.submitMessage .emoji').textContent = '👎'.repeat(noButtonAttempts);
    console.log('Tentativa no botão Não (clique):', noButtonAttempts);
    if (noButtonAttempts >= 3) {
      noButton.querySelector('.submitMessage .emoji').textContent = '😛';
      noButton.querySelector('.submitMessage .button-text').textContent = 'Com certeza';
      const textElements = noButton.querySelectorAll('.button-text');
      textElements.forEach((element) => {
        const characters = element.innerText.split('');
        let characterHTML = '';
        characters.forEach((letter, index) => {
          characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
        });
        element.innerHTML = characterHTML;
      });
      noButton.style.cursor = 'pointer';
      noButton.style.pointerEvents = 'auto';
    }
  } else {
    disabledNo = clickButton(noButton, disabledNo, proceedToBanner);
  }
});

noButton.addEventListener('touchend', (e) => {
  if (noButtonAttempts < 3) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    noButtonAttempts++;
    moveNoButton(touch.clientX, touch.clientY);
    // Atualizar emoji com base na tentativa
    noButton.querySelector('.submitMessage .emoji').textContent = '👎'.repeat(noButtonAttempts);
    console.log('Tentativa no botão Não (toque):', noButtonAttempts);
    if (noButtonAttempts >= 3) {
      noButton.querySelector('.submitMessage .emoji').textContent = '😛';
      noButton.querySelector('.submitMessage .button-text').textContent = 'Com certeza';
      const textElements = noButton.querySelectorAll('.button-text');
      textElements.forEach((element) => {
        const characters = element.innerText.split('');
        let characterHTML = '';
        characters.forEach((letter, index) => {
          characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
        });
        element.innerHTML = characterHTML;
      });
      noButton.style.cursor = 'pointer';
      noButton.style.pointerEvents = 'auto';
    }
  } else {
    disabledNo = clickButton(noButton, disabledNo, proceedToBanner);
  }
});

yesButton.addEventListener('click', () => {
  disabledYes = clickButton(yesButton, disabledYes, proceedToBanner);
});

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

// Iniciar renderização dos confetes
render();