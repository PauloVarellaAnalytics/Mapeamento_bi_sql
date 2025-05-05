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
if (!ctx) {
  console.error('Contexto do canvas não inicializado');
}
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
    x: rect.left + rect.width / 2, // Centro do botão
    y: rect.top + rect.height / 2,
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
    x: rect.left + rect.width / 2, // Centro do botão
    y: rect.top + rect.height / 2,
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

// Pré-carregar o som
const confettiSound = new Audio('sounds/confetti.wav');
confettiSound.load();
confettiSound.oncanplaythrough = () => console.log('Som confetti.wav carregado com sucesso');
confettiSound.onerror = (err) => console.error('Erro ao carregar som confetti.wav:', err);

initBurst = (button) => {
  console.log('initBurst chamado para botão:', button.id, 'posição:', button.getBoundingClientRect()); // Depuração
  confetti = []; // Limpar confetes anteriores
  sequins = []; // Limpar sequins anteriores
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto(button));
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin(button));
  }
  console.log('Confetes criados:', confetti.length, 'Sequins criados:', sequins.length); // Depuração
  confettiSound.currentTime = 0; // Resetar som
  confettiSound.play().catch(err => console.error('Erro ao tocar som:', err));
  window.requestAnimationFrame(render); // Forçar renderização
};

render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (confetti.length === 0 && sequins.length === 0) {
    console.log('Nenhum confete para renderizar, parando render'); // Depuração
    return;
  }
  console.log('Renderizando, confetti:', confetti.length, 'sequins:', sequins.length); // Depuração
  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;
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
  confetti = confetti.filter(confetto => confetto.position.y < canvas.height);
  sequins = sequins.filter(sequin => sequin.position.y < canvas.height);
  window.requestAnimationFrame(render);
};

resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log('Canvas redimensionado:', canvas.width, 'x', canvas.height); // Depuração
};

window.addEventListener('resize', resizeCanvas);

// Detecção de dispositivo móvel e navegador
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const chromeModal = document.getElementById('chrome-modal');
const openChromeBtn = document.getElementById('open-chrome-btn');
const dismissModalBtn = document.getElementById('dismissModalBtn');

if (isMobile && !isChrome) {
  chromeModal.style.display = 'flex';
  console.log('Dispositivo móvel detectado, não é Chrome:', navigator.userAgent);
} else {
  console.log('Navegador:', isChrome ? 'Chrome' : 'Não Chrome', 'Dispositivo:', isMobile ? 'Móvel' : 'Desktop');
}

openChromeBtn.addEventListener('click', () => {
  if (/Android/.test(navigator.userAgent)) {
    const url = window.location.href;
    window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    console.log('Tentando abrir no Chrome (Android):', url);
  } else {
    alert('Por favor, copie o URL e abra no Google Chrome manualmente.');
    console.log('Instrução para abrir no Chrome (iOS/outros)');
  }
  chromeModal.style.display = 'none';
});

dismissModalBtn.addEventListener('click', () => {
  chromeModal.style.display = 'none';
  console.log('Modal do Chrome fechado');
});

// Função para a brincadeira
const jokeScreen = document.querySelector('.joke-screen');
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const logoBanner = document.querySelector('.logo-banner');
let noButtonAttempts = 0;
let disabledYes = false;
let disabledNo = false;

function proceedToBanner() {
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
    confetti = []; // Limpar confetes ao carregar o site
    sequins = [];
    console.log('Confetes e sequins limpos ao carregar site'); // Depuração
  }, 1500);
}

function moveNoButton(x, y) {
  const isMobileDevice = window.innerWidth <= 480;
  const offset = isMobileDevice ? 50 : 100; // Menor deslocamento em mobile
  const margin = 10; // Margem segura das bordas
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  const maxX = clientWidth - noButton.offsetWidth - margin;
  const maxY = clientHeight - noButton.offsetHeight - margin;
  const newX = Math.max(margin, Math.min(maxX, x + (Math.random() * offset * 2 - offset)));
  const newY = Math.max(margin, Math.min(maxY, y + (Math.random() * offset * 2 - offset)));
  noButton.style.position = 'absolute';
  noButton.style.left = `${newX}px`;
  noButton.style.top = `${newY}px`;
  console.log('Botão Não movido para:', newX, newY, 'Mobile:', isMobileDevice, 'ClientWidth:', clientWidth, 'ClientHeight:', clientHeight); // Depuração
}

function clickButton(button, disabledFlag, callback) {
  if (!disabledFlag) {
    disabledFlag = true;
    button.classList.add('loading');
    button.classList.remove('ready');
    console.log('clickButton iniciado para:', button.id); // Depuração
    setTimeout(() => {
      button.classList.add('complete');
      button.classList.remove('loading');
      setTimeout(() => {
        console.log('Iniciando initBurst para:', button.id); // Depuração
        initBurst(button);
        setTimeout(() => {
          disabledFlag = false;
          button.classList.add('ready');
          button.classList.remove('complete');
          confetti = []; // Limpar confetes após animação
          sequins = []; // Limpar sequins após animação
          console.log('Confetes e sequins limpos após animação'); // Depuração
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
    moveNoButton(e.clientX, e.clientY);
    noButtonAttempts++;
    console.log('Tentativa no botão Não (clique):', noButtonAttempts);
    if (noButtonAttempts >= 3) {
      noButton.querySelector('.submitMessage .emoji').textContent = '🕶️';
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
    moveNoButton(touch.clientX, touch.clientY);
    noButtonAttempts++;
    console.log('Tentativa no botão Não (toque):', noButtonAttempts);
    if (noButtonAttempts >= 3) {
      noButton.querySelector('.submitMessage .emoji').textContent = '🕶️';
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
  console.log('ScrollY:', window.scrollY, 'ButtonContainerBottom:', buttonContainerBottom); // Depuração
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
console.log('Iniciando render inicial'); // Depuração
render();