// Archive data
const archiveItems = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initArchive();
});

// Archive Gallery
function initArchive() {
    const gallery = document.getElementById('gallery');
    
    const message = document.createElement('div');
    message.className = 'archive-message';
    message.textContent = 'stuff will soon be added here';
    gallery.appendChild(message);
}

