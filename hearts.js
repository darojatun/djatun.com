        const follower = document.getElementById('hearts');
        
        // State variables
        let mouseX = window.innerWidth * 0.43 ;
        let mouseY = window.innerHeight * 0.88; // Start at 88% (12% from bottom)
        
        let currentX = window.innerWidth * 0.43;
        let currentY = window.innerHeight * 0.88;
        
        // Speed: 0.05 = slow/heavy, 0.2 = fast/snappy
        const speedFactor = 0.01;

        // Track Mouse Position (Both X and Y)
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation Loop
        function animate() {
            // Calculate distance for X and Y
            const distX = mouseX - currentX;
            const distY = mouseY - currentY;
            
            // Apply LERP (Linear Interpolation)
            currentX += distX * speedFactor;
            currentY += distY * speedFactor;
            
            // Apply positions
            follower.style.left = currentX + 'px';
            follower.style.top = currentY + 'px';
            
            requestAnimationFrame(animate);
        }

        animate();
