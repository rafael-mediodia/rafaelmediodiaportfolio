const motionVideos = [
    { file: 'LOGO1-FULL.mp4', tooltip: 'Cortis Fan Motion' },
    { file: 'LOGO2-FULL.mp4', tooltip: 'Cortis Fan Motion' },
    { file: 'Whats at the core.mp4', tooltip: 'Whats At The Core' },
    { file: 'Comp 2.mp4', tooltip: 'Bracketfly' },
    { file: 'Comp 3.mp4', tooltip: 'Face To Face' },
    { file: 'RAFAELMEDIODIA_FORMINMOTION.mp4', tooltip: 'Graphic Design Show' },
    { file: '2nd Ad.mp4', tooltip: 'Jazz TV Ad' },
    { file: 'Bubbles (2).mp4', tooltip: 'Particles' },
    { file: 'RAFAELMEDIODIA_ASSIGNMENT4_COLORLIGHTSHADOW.mp4', tooltip: 'RISD Museum Show' },
    { file: 'girldinneranimation2-gs-color-addedtext.mp4', tooltip: 'Girl Dinner Titlecard' }
];

function getMotionVideoFile(videoData) {
    return typeof videoData === 'string' ? videoData : videoData.file;
}

document.addEventListener('DOMContentLoaded', () => {
    initMotionFeatured();
    initMotionGallery();
    initVideoZoom();
});

let currentFeaturedIndex = 0;
let featuredVideo = null;
let shuffledVideos = [];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initMotionFeatured() {
    const featuredContainer = document.getElementById('motionFeatured');
    const videosToUse = motionVideos.length > 0 ? motionVideos : [];
    if (videosToUse.length === 0) return;
    
    // Shuffle videos for random order
    shuffledVideos = shuffleArray(videosToUse.map(v => typeof v === 'string' ? v : v.file));
    currentFeaturedIndex = 0;
    
    featuredVideo = document.createElement('video');
    featuredVideo.src = `Motion/${shuffledVideos[0]}`;
    featuredVideo.muted = true;
    featuredVideo.loop = true;
    featuredVideo.playsInline = true;
    featuredVideo.autoplay = true;
    featuredVideo.preload = 'metadata';
    featuredVideo.setAttribute('playsinline', '');
    featuredVideo.setAttribute('loop', '');
    featuredVideo.setAttribute('muted', '');
    featuredVideo.className = 'motion-featured-video';
    
    const featuredObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                featuredVideo.load();
            }
        });
    }, { rootMargin: '50px' });
    
    featuredObserver.observe(featuredContainer);
    
    featuredContainer.appendChild(featuredVideo);
    
    if (shuffledVideos.length > 1) {
        setInterval(() => {
            currentFeaturedIndex = (currentFeaturedIndex + 1) % shuffledVideos.length;
            featuredVideo.src = `Motion/${shuffledVideos[currentFeaturedIndex]}`;
        }, 5000);
    }
}

function initMotionGallery() {
    const gallery = document.getElementById('motionGallery');
    const tooltip = document.createElement('div');
    tooltip.className = 'project-tooltip';
    document.body.appendChild(tooltip);
    
    const videosToLoad = motionVideos.length > 0 ? motionVideos : [];
    
    if (videosToLoad.length === 0) {
        return;
    }
    
    videosToLoad.forEach((videoData, index) => {
        const videoFile = typeof videoData === 'string' ? videoData : videoData.file;
        const tooltipText = typeof videoData === 'string' ? 'More Motion' : (videoData.tooltip || 'More Motion');
        
        const videoContainer = document.createElement('div');
        videoContainer.className = 'motion-video-item';
        videoContainer.setAttribute('data-video-src', `Motion/${videoFile}`);
        
        const video = document.createElement('video');
        video.setAttribute('data-src', `Motion/${videoFile}`);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'none';
        video.setAttribute('playsinline', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        
        videoContainer.appendChild(video);
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const vid = entry.target;
                    if (vid.getAttribute('data-src')) {
                        vid.src = vid.getAttribute('data-src');
                        vid.removeAttribute('data-src');
                        vid.load();
                        
                        vid.addEventListener('loadedmetadata', () => {
                            const duration = vid.duration;
                            if (duration > 3) {
                                const maxStartTime = Math.max(0, duration - 3);
                                const randomStart = Math.random() * maxStartTime;
                                vid.currentTime = randomStart;
                            }
                        }, { once: true });
                        
                        videoObserver.unobserve(vid);
                    }
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        videoObserver.observe(video);
        
        videoContainer.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `
                <div class="project-tooltip-title">${tooltipText}</div>
            `;
            tooltip.style.opacity = '1';
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        videoContainer.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        videoContainer.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        videoContainer.addEventListener('click', () => {
            openVideoZoom(`Motion/${videoFile}`);
        });
        
        gallery.appendChild(videoContainer);
    });
}

let currentVideoIndex = 0;
let videoZoomArray = [];

function initVideoZoom() {
    const modal = document.getElementById('videoZoomModal');
    const closeBtn = document.getElementById('videoZoomClose');
    const video = document.getElementById('zoomedVideo');
    
    const closeModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        document.removeEventListener('keydown', handleVideoKeydown);
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.video-zoom-container') === null) {
            closeModal();
        }
    });
}

function handleVideoKeydown(e) {
    if (e.key === 'ArrowLeft') {
        navigateVideo(-1);
    } else if (e.key === 'ArrowRight') {
        navigateVideo(1);
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('videoZoomModal');
        const video = document.getElementById('zoomedVideo');
        modal.style.display = 'none';
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        document.removeEventListener('keydown', handleVideoKeydown);
    }
}

function navigateVideo(direction) {
    if (videoZoomArray.length === 0) return;
    
    currentVideoIndex = (currentVideoIndex + direction + videoZoomArray.length) % videoZoomArray.length;
    const video = document.getElementById('zoomedVideo');
    const videoFile = typeof videoZoomArray[currentVideoIndex] === 'string' 
        ? videoZoomArray[currentVideoIndex] 
        : videoZoomArray[currentVideoIndex].file;
    
    video.src = `Motion/${videoFile}`;
    video.load();
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }, { once: true });
}

function openVideoZoom(videoSrc) {
    const modal = document.getElementById('videoZoomModal');
    const video = document.getElementById('zoomedVideo');
    
    videoZoomArray = motionVideos;
    const videoFile = videoSrc.split('/').pop();
    currentVideoIndex = motionVideos.findIndex(v => {
        const file = typeof v === 'string' ? v : v.file;
        return file === videoFile;
    });
    
    if (currentVideoIndex === -1) {
        currentVideoIndex = 0;
    }
    
    video.src = videoSrc;
    video.load();
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    document.addEventListener('keydown', handleVideoKeydown);
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }, { once: true });
}


