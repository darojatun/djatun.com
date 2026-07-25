const textDiv = document.getElementById('text');
// Status log menggunakan  kolom info lagu  jadi dibuat delay 2 detik agak tidak menimpa
const statusLog = document.getElementById('nowPlayingText');
const BASE_FONT_SIZE = 70; 
const MAX_FONT_SIZE = 80;

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let isInitialized = false;
let animationId;

function initAudio() {
    if (isInitialized) return;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Membuat sumber suara dari tag audio
        const source = audioContext.createMediaElementSource(audioPlayer);
        
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512; 
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Alur hubung audio
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        isInitialized = true;
        statusLog.style.color = "#2ed573";
        statusLog.textContent = "Status: Analisis Audio Berhasil Berjalan!";
        
        // Mulai animasi zoom
        updateZoomByBass();
    } catch (error) {
        console.error(error);
        statusLog.textContent = "Error Sistem: " + error.message;
    }
}

let smoothedFontSize = BASE_FONT_SIZE;
let runningBassAvg = 0;

function updateZoomByBass() {
    animationId = requestAnimationFrame(updateZoomByBass);

    if (audioPlayer.paused) {
        textDiv.style.fontSize = `${BASE_FONT_SIZE}px`;
        smoothedFontSize = BASE_FONT_SIZE;
        return;
    }
    if (!isInitialized || !analyser) return;

    analyser.getByteFrequencyData(dataArray);

    let bassSum = 0;
    let bassCount = 8;
    for (let i = 0; i < bassCount; i++) {
        bassSum += dataArray[i];
    }
    let averageBass = bassSum / bassCount;

    // Baseline bass bergerak pelan mengikuti karakter lagu
    runningBassAvg += (averageBass - runningBassAvg) * 0.02;

    // Selisih bass sesaat vs baseline -> mendeteksi hentakan
    let excess = averageBass - runningBassAvg;

    // Sensitivitas lebih kecil karena rentang font lebih sempit (70-80)
    let sensitivity = 18;
    let bassIntensity = 0;
    if (excess > 0) {
        bassIntensity = Math.min(excess / sensitivity, 1);
    }

    // Multiplier sekarang cuma perlu 10 (selisih MAX - BASE)
    let zoomMultiplier = MAX_FONT_SIZE - BASE_FONT_SIZE;
    let targetSize = BASE_FONT_SIZE + (bassIntensity * zoomMultiplier);
    if (targetSize > MAX_FONT_SIZE) targetSize = MAX_FONT_SIZE;
    if (targetSize < BASE_FONT_SIZE) targetSize = BASE_FONT_SIZE;

    // Attack cepat, decay halus
    let easing = targetSize > smoothedFontSize ? 0.45 : 0.07;
    smoothedFontSize += (targetSize - smoothedFontSize) * easing;

    textDiv.style.fontSize = `${smoothedFontSize}px`;
}
// Inisialisasi audio ketika audio dimulai (play)
audioPlayer.addEventListener('play', () => {
    // Resume AudioContext jika suspended
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Inisialisasi jika belum
    if (!isInitialized) {
        initAudio();
    } else {
        // Lanjutkan animasi
        updateZoomByBass();
    }
});

// Hentikan animasi ketika audio di-pause
audioPlayer.addEventListener('pause', () => {
    textDiv.style.fontSize = `${BASE_FONT_SIZE}px`;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Jangan inisialisasi di sini lagi - biarkan event listener 'play' yang handle
