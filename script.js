const projects = [
    {
        id: 'project-1',
        title: 'Pinoy Plus',
        subtitle: 'Identity Design',
        thumbnail: 'PinoyPlus/PinoyPlus-Intro.mp4', // Video thumbnail
        page: 'projects/pinoy-plus.html'
    },
    {
        id: 'project-5',
        title: 'Self Declaration',
        subtitle: 'Print Design',
        thumbnail: null,
        thumbnailImages: [
            'SelfDeclaration/DS3UNIT17_23.jpg',
            'SelfDeclaration/DS3UNIT17_22.jpg',
            'SelfDeclaration/DS3UNIT17_20.jpg',
            'SelfDeclaration/DS3UNIT17_19.jpg'
        ],
        page: 'projects/self-declaration.html'
    },
    {
        id: 'project-3',
        title: 'Breakout Games',
        subtitle: 'Motion Design',
        thumbnail: 'Breakout/Breakout-Transition.mp4',
        page: 'projects/breakout-games.html'
    },
    {
        id: 'project-4',
        title: 'bounce museum of rubber',
        subtitle: 'Identity Design',
        thumbnail: 'BounceMuseum/bouncemuseum.mp4',
        page: 'projects/bounce-museum.html'
    },
    {
        id: 'project-6',
        title: 'American Dream Series: Part 0',
        subtitle: 'Motion Design, Video',
        thumbnail: 'AmericanDream/American Dream Series Part 0.mp4',
        thumbnailStartTime: 2,
        thumbnailEndTime: 4,
        page: 'projects/american-dream-series.html'
    },
    {
        id: 'motion',
        title: 'More Motion',
        subtitle: 'Motion Collection',
        thumbnail: '',
        page: 'motion.html'
    },
    {
        id: 'illustrations',
        title: 'Illustrations',
        subtitle: 'Illustration Collection',
        thumbnail: null,
        thumbnailImages: [
            'Illustrations/frogs.jpg',
            'Illustrations/mountain_and_tree_and_car_friends.jpg',
            'Illustrations/astronaut_forest jpg.jpg',
            'Illustrations/beetle3.jpg',
            'Illustrations/mockup.jpg',
            'Illustrations/IMG_7604.PNG'
        ],
        page: 'illustrations.html'
    },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initMotionThumbnail();
});

function initMotionThumbnail() {
    const motionThumb = document.querySelector('.motion-thumb');
    if (!motionThumb) return;
    
    setTimeout(() => {
        if (typeof motionVideos !== 'undefined' && motionVideos.length > 0) {
            const shuffledVideos = [...motionVideos].sort(() => Math.random() - 0.5);
            let currentVideoIndex = 0;
            
            const video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.preload = 'none';
            video.setAttribute('playsinline', '');
            video.setAttribute('loop', '');
            video.setAttribute('muted', '');
            video.className = 'motion-thumb-video';
            
            motionThumb.classList.remove('placeholder');
            motionThumb.classList.add('has-video');
            motionThumb.innerHTML = '';
            motionThumb.appendChild(video);
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        function loadRandomVideo() {
                            const videoData = shuffledVideos[currentVideoIndex];
                            const videoFile = typeof videoData === 'string' ? videoData : videoData.file;
                            video.src = `Motion/${videoFile}`;
                            video.load();
                            
                            const handleLoadedMetadata = () => {
                                const duration = video.duration;
                                if (duration > 3) {
                                    const maxStartTime = Math.max(0, duration - 3);
                                    const randomStart = Math.random() * maxStartTime;
                                    video.currentTime = randomStart;
                                    setTimeout(() => {
                                        if (currentVideoIndex < shuffledVideos.length - 1 || shuffledVideos.length > 1) {
                                            currentVideoIndex = (currentVideoIndex + 1) % shuffledVideos.length;
                                            loadRandomVideo();
                                        }
                                    }, 2000 + Math.random() * 1000);
                                }
                                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                            };
                            
                            video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
                        }
                        
                        loadRandomVideo();
                        
                        thumbObserver.unobserve(motionThumb);
                    }
                });
            }, {
                rootMargin: '200px'
            });
            
            thumbObserver.observe(motionThumb);
        }
    }, 100);
}

function initGallery() {
    const gallery = document.getElementById('gallery');
    const tooltip = document.createElement('div');
    tooltip.className = 'project-tooltip';
    document.body.appendChild(tooltip);
    
    projects.forEach((project, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'project-thumb';
        thumb.onclick = () => window.location.href = project.page;
        
        if (project.thumbnail && project.thumbnail.trim() !== '') {
            const isVideo = project.thumbnail.toLowerCase().endsWith('.mp4') || 
                           project.thumbnail.toLowerCase().endsWith('.webm') || 
                           project.thumbnail.toLowerCase().endsWith('.mov');
            
            if (isVideo) {
                const video = document.createElement('video');
                video.src = project.thumbnail;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.autoplay = true;
                video.preload = 'metadata';
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.setAttribute('muted', '');
                
                if (project.id === 'project-2') {
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = Math.max(0, video.duration - 3);
                    });
                } else if (project.id === 'project-6' && project.thumbnailStartTime !== undefined) {
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = project.thumbnailStartTime;
                        const loopClip = () => {
                            if (video.currentTime >= project.thumbnailEndTime) {
                                video.currentTime = project.thumbnailStartTime;
                            }
                        };
                        video.addEventListener('timeupdate', loopClip);
                    });
                }
                
                const thumbObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const vid = entry.target;
                            vid.load();
                            // Safari autoplay fix
                            vid.addEventListener('loadeddata', () => {
                                vid.play().catch(() => {
                                    // Autoplay blocked
                                });
                            }, { once: true });
                            thumbObserver.unobserve(vid);
                        }
                    });
                }, {
                    rootMargin: '200px'
                });
                
                thumbObserver.observe(video);
                
                thumb.classList.add('has-video');
                thumb.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = project.thumbnail;
                img.alt = project.title;
                thumb.appendChild(img);
            }
        } else if (project.thumbnailImages && project.thumbnailImages.length > 0) {
            const img = document.createElement('img');
            img.alt = project.title;
            img.className = 'cycling-thumbnail';
            
            let currentImageIndex = 0;
            let cycleInterval = null;
            
            function cycleThumbnail() {
                if (project.thumbnailImages && project.thumbnailImages.length > 0) {
                    img.src = project.thumbnailImages[currentImageIndex];
                    currentImageIndex = (currentImageIndex + 1) % project.thumbnailImages.length;
                }
            }
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!img.src) {
                            cycleThumbnail();
                            cycleInterval = setInterval(cycleThumbnail, 2000);
                        }
                    } else {
                        if (cycleInterval) {
                            clearInterval(cycleInterval);
                            cycleInterval = null;
                        }
                    }
                });
            }, {
                rootMargin: '200px'
            });
            
            thumbObserver.observe(img);
            thumb.appendChild(img);
        } else if (project.id === 'motion') {
            thumb.classList.add('placeholder');
            thumb.classList.add('motion-thumb');
            thumb.setAttribute('data-project-index', 'motion');
        }
        
        thumb.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `
                <div class="project-tooltip-title">${project.title}</div>
                <div class="project-tooltip-subtitle">${project.subtitle}</div>
            `;
            tooltip.style.opacity = '1';
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        thumb.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        thumb.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        gallery.appendChild(thumb);
    });
}
