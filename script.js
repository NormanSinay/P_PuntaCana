// Variables
let fechaInicio;
const countdownDisplay = document.getElementById('timer');
const stages = [
  document.getElementById('stage1'),
  document.getElementById('stage2'),
  document.getElementById('stage3'),
];
const thumbnails = document.querySelectorAll('.thumbnail');
let currentStage = 0;
let interval;

// Obtener fecha de inicio desde el backend
fetch('http://localhost:3000/api/fecha-inicio')
  .then(response => response.json())
  .then(data => {
    fechaInicio = new Date(data.fechaInicio);
    initializeStages();
  })
  .catch(err => console.error('Error al obtener fecha de inicio:', err));

// Inicializar etapas
function initializeStages() {
  const now = new Date();
  if (now >= fechaInicio) {
    moveToNextStage();
  } else {
    updateCountdown(fechaInicio);
  }
}

// Convertir hora a Guatemala
function convertToGuatemalaTime(date) {
  const guatemalaOffset = -6; // UTC -6
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcTime + guatemalaOffset * 3600000);
}

// Actualizar cuenta regresiva
function updateCountdown(targetDate) {
  clearInterval(interval);
  interval = setInterval(() => {
    const now = convertToGuatemalaTime(new Date());
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(interval);
      moveToNextStage();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownDisplay.innerHTML = `
      <span id="days">${days}</span>d : 
      <span id="hours">${hours}</span>h : 
      <span id="minutes">${minutes}</span>m : 
      <span id="seconds">${seconds}</span>s
    `;
  }, 1000);
}

// Mover a la siguiente etapa
function moveToNextStage() {
  if (currentStage < stages.length - 1) {
    stages[currentStage].classList.add('hidden');
    thumbnails[currentStage].classList.remove('active');

    currentStage++;
    stages[currentStage].classList.remove('hidden');
    thumbnails[currentStage].classList.add('active');

    if (currentStage === 1) startProgressBar();
  } else {
    alert('Trip Completed!');
  }
}

// Animar barra de progreso
function startProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = '0'; // Reinicia la barra
  progressBar.style.animation = 'loading 5s linear forwards';

  // Avanzar a la siguiente etapa después de que la barra se llene
  setTimeout(() => {
    moveToNextStage();
  }, 5000); // Duración de la barra de carga
}
