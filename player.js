    // DAFTAR LAGU (Ganti nama file di sini) 
    const playlist = [
      "mp3/Brothers Forever (1).mp3",
      "mp3/Brothers Forever.mp3",
      "mp3/Rumah Gadang.mp3",
      "mp3/Rumah Gadang (1).mp3",
      "mp3/Uwais Uwais Uwais.mp3",
      "mp3/Kaali Crow.mp3",
      "mp3/Dawn Over Open Water (1).mp3",
      "mp3/Desert Cat Dash (1).mp3",
      "mp3/Desert Cat Dash.mp3",
      "mp3/Cinta Tiga Dunia.mp3"
    ];

    let currentIndex = 0;
    const audioPlayer = document.getElementById('audioPlayer');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const nowPlayingText = document.getElementById('nowPlayingText');
    let isPlaying = false;

    // Fungsi untuk memuat dan memutar lagu
    function loadSong(index) {
      // Pastikan index tidak keluar batas
      if (index >= playlist.length) {
        currentIndex = 0; // Kembali ke awal (Loop Playlist)
      } else if (index < 0) {
        currentIndex = playlist.length - 1;
      } else {
        currentIndex = index;
      }

      audioPlayer.src = playlist[currentIndex];
      
      // Update teks indikator (opsional)
      nowPlayingText.textContent = `Music  ${currentIndex + 1} : ${decodeURI(audioPlayer.src.split('mp3/').pop())}`;
      nowPlayingText.classList.add('show');
      setTimeout(() => nowPlayingText.classList.remove('show'), 3000);

      audioPlayer.play().then(() => {
        isPlaying = true;
        updateIcon();
      }).catch(error => {
        console.log("Autoplay dicegah browser. Klik tombol untuk mulai.");
        isPlaying = false;
        updateIcon();
      });
    }

    // Fungsi Toggle Play/Pause
    function togglePlay() {
      if (audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
      } else {
        audioPlayer.pause();
        isPlaying = false;
      }
      updateIcon();
    }

    // Update Ikon berdasarkan status
    function updateIcon() {
      if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    }

    // Event Listener: Saat lagu selesai, ganti ke berikutnya
    audioPlayer.addEventListener('ended', () => {
      loadSong(currentIndex + 1);
    });

    // Mulai lagu pertama saat halaman dimuat
    window.addEventListener('load', () => {
      loadSong(0);
    });
    // --- BAGIAN ACAK ---
    // Saat halaman dimuat, pilih index acak dari playlist
    window.addEventListener('load', () => {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      loadSong(randomIndex);
    });
