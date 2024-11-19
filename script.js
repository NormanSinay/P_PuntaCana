document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://p-puntacanaback.onrender.com/api/etapas'; // Ruta del backend
  const etapasContainer = document.getElementById('stage-info');
  const countdownElement = document.getElementById('countdown');
  const stageImageElement = document.getElementById('stage-image');
  const stageNameElement = document.getElementById('stage-name');
  const progressBar = document.getElementById('progress-bar');

  let etapas = [];
  let currentEtapaIndex = 0;

  // Obtener etapas desde el backend
  async function fetchEtapas() {
    try {
      const response = await fetch(apiUrl);
      etapas = await response.json();
      etapas.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)); // Ordenar por fecha
      setStage(0); // Inicializar con la primera etapa
    } catch (error) {
      console.error('Error al obtener las etapas:', error);
    }
  }

  // Configurar una etapa específica
  function setStage(index) {
    if (index >= etapas.length) {
      countdownElement.textContent = '¡Todas las etapas completadas!';
      stageNameElement.textContent = '¡Fin del Viaje!';
      stageImageElement.src = 'fin-del-viaje.png'; // Imagen final opcional
      progressBar.style.width = '100%';
      return;
    }

    currentEtapaIndex = index;
    const etapa = etapas[index];
    const fechaInicio = new Date(etapa.fechaInicio);
    const duracionMs = etapa.duracion;
    const fechaFin = new Date(fechaInicio.getTime() + duracionMs);

    stageNameElement.textContent = etapa.nombre;
    stageImageElement.src = `images/${etapa.nombre.toLowerCase().replace(/\s+/g, '-')}.png`; // Imagen correspondiente a la etapa
    stageImageElement.alt = etapa.nombre;

    startCountdown(fechaFin);
    updateProgressBar(index);
  }

  // Iniciar cuenta regresiva
  function startCountdown(fechaFin) {
    clearInterval(window.countdownInterval); // Limpiar intervalos previos
    window.countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = fechaFin - now;

      if (timeLeft <= 0) {
        clearInterval(window.countdownInterval);
        setStage(currentEtapaIndex + 1); // Pasar a la siguiente etapa
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
      }
    }, 1000);
  }

  // Actualizar la barra de progreso
  function updateProgressBar(index) {
    const progress = ((index + 1) / etapas.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Inicializar
  fetchEtapas();
});
