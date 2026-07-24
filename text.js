        const audioPlayer = document.getElementById('audioPlayer');
        const textDiv = document.getElementById('text');
        const statusLog = document.getElementById('nowPlayingText');

        const BASE_FONT_SIZE = 24; 
        const MAX_FONT_SIZE = 100;

        let audioContext;
        let analyser;
        let dataArray;
        let bufferLength;
        let isInitialized = false;

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
                
                updateZoomByBass();
            } catch (error) {
                statusLog.textContent = "Error Sistem: " + error.message;
                console.error(error);
            }
        }

        function updateZoomByBass() {
            requestAnimationFrame(updateZoomByBass);

            analyser.getByteFrequencyData(dataArray);

            // Ambil 8 indeks pertama untuk mendeteksi bass murni
            let bassSum = 0;
            let bassCount = 8; 

            for (let i = 0; i < bassCount; i++) {
                bassSum += dataArray[i];
            }

            let averageBass = bassSum / bassCount;

            // Jika lagu Anda bass-nya pelan, turunkan threshold ini ke 20 atau 30
            let threshold = 40; 
            let bassIntensity = 0;

            if (averageBass > threshold) {
                bassIntensity = (averageBass - threshold) / (255 - threshold);
            }

            // Naikkan angka 80 jika ingin pembesaran teks lebih ekstrem
            let zoomMultiplier = 80; 
            let dynamicSize = BASE_FONT_SIZE + (bassIntensity * zoomMultiplier);

            if (dynamicSize > MAX_FONT_SIZE) dynamicSize = MAX_FONT_SIZE;
            if (dynamicSize < BASE_FONT_SIZE) dynamicSize = BASE_FONT_SIZE;

            textDiv.style.fontSize = `${dynamicSize}px`;
        }

      audioPlayer.play().then(() => {
            initAudio();
        });
