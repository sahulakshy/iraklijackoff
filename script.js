document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');
    const clockElement = document.getElementById('taskbar-clock');
    const icons = document.querySelectorAll('.icon');
    let highestZIndex = 10; // Start z-index for windows

    // --- Clock ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    // --- Icon Interaction ---
    icons.forEach(icon => {
        // Double-click to open window
        icon.addEventListener('dblclick', () => {
            const windowId = 'window-' + icon.id.split('-')[1]; // e.g., 'window-about'
            const windowElement = document.getElementById(windowId);
            if (windowElement) {
                openWindow(windowElement);
            }
            // Remove selection from all icons
            icons.forEach(i => i.classList.remove('selected'));
        });

        // Single click to select
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent desktop click from immediately deselecting
            // Remove selection from others, add to this one
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });

    // Click on desktop to deselect icons
    desktop.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('selected'));
    });


    // --- Window Management ---
    function openWindow(windowElement) {
        windowElement.style.display = 'block';
        bringToFront(windowElement);
        // Position randomly or centrally if first time opening
        if (!windowElement.style.top || !windowElement.style.left) {
            const desktopRect = desktop.getBoundingClientRect();
             // Center with some offset
            windowElement.style.top = Math.max(10, (desktopRect.height / 2 - windowElement.offsetHeight / 2) + (Math.random() * 100 - 50)) + 'px';
            windowElement.style.left = Math.max(10, (desktopRect.width / 2 - windowElement.offsetWidth / 2) + (Math.random() * 100 - 50)) + 'px';
        }
    }

    function closeWindow(windowElement) {
        windowElement.style.display = 'none';
    }

    function bringToFront(windowElement) {
        // Remove active class from all windows
        document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
        // Add active class to the current one
        windowElement.classList.add('active');
        // Increase z-index
        highestZIndex++;
        windowElement.style.zIndex = highestZIndex;
    }

    // Add listeners to all windows for dragging, closing, and focus
    document.querySelectorAll('.window').forEach(windowElement => {
        const titleBar = windowElement.querySelector('.title-bar');
        const closeButton = windowElement.querySelector('.close-button');

        // Focus window on click
        windowElement.addEventListener('mousedown', () => {
            bringToFront(windowElement);
        });

        // Close button functionality
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent title bar drag from triggering
            closeWindow(windowElement);
        });

        // Dragging functionality
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', (e) => {
             // Ensure focus on drag start
             bringToFront(windowElement);
             isDragging = true;
             offsetX = e.clientX - windowElement.offsetLeft;
             offsetY = e.clientY - windowElement.offsetTop;
             titleBar.style.cursor = 'grabbing'; // Change cursor while dragging
             // Prevent text selection during drag
             e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const desktopRect = desktop.getBoundingClientRect();
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Constrain window within desktop bounds (approximate)
            newX = Math.max(0, Math.min(newX, desktopRect.width - windowElement.offsetWidth));
            newY = Math.max(0, Math.min(newY, desktopRect.height - windowElement.offsetHeight)); // Adjust for taskbar maybe later

            windowElement.style.left = newX + 'px';
            windowElement.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                titleBar.style.cursor = 'grab'; // Restore cursor
            }
        });
    });

    // Basic Start Menu Toggle (Placeholder)
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        // In a real version, you'd show a menu here.
        // For now, just give visual feedback.
        startButton.style.borderStyle = 'inset';
        setTimeout(() => { startButton.style.borderStyle = 'outset'; }, 150);
        alert("Gaumarjos! Start Menu Under Construction!");
    });

});
