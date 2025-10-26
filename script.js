// 平滑滚动效果
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏链接点击
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 滚动时导航栏样式变化
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // 动画效果 - Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.mission-card, .character-card, .philosophy-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 淡入动画
    const storyElements = document.querySelectorAll('.story-text p');
    storyElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transition = `opacity 0.8s ease ${index * 0.2}s`;
        setTimeout(() => {
            el.style.opacity = '1';
        }, 100);
    });

    const visionElements = document.querySelectorAll('.vision-text p');
    visionElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transition = `opacity 0.8s ease ${index * 0.2}s`;
        setTimeout(() => {
            el.style.opacity = '1';
        }, 100);
    });

    // 标题打字机效果
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        const words = originalText.split('<br>');
        let wordIndex = 0;
        
        function typeWord() {
            if (wordIndex < words.length) {
                if (wordIndex > 0) {
                    heroTitle.innerHTML += '<br>';
                }
                const word = words[wordIndex];
                let charIndex = 0;
                const typeChar = () => {
                    if (charIndex < word.length) {
                        heroTitle.innerHTML = heroTitle.innerHTML.slice(0, -charIndex) + word.substring(0, charIndex + 1);
                        charIndex++;
                        setTimeout(typeChar, 50);
                    } else {
                        wordIndex++;
                        if (wordIndex < words.length) {
                            setTimeout(typeWord, 200);
                        }
                    }
                };
                typeChar();
            }
        }
        setTimeout(typeWord, 500);
    }

    // 卡片摇摆动画
    const missionCards = document.querySelectorAll('.mission-card');
    missionCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = `cardShake 0.5s ease`;
            }, 10);
        });
    });

    // 添加摇摆动效样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardShake {
            0%, 100% { transform: translateY(-10px) scale(1.02) rotate(0deg); }
            25% { transform: translateY(-10px) scale(1.02) rotate(-2deg); }
            75% { transform: translateY(-10px) scale(1.02) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);
});

// 线性鼠标跟踪效果
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addPoint({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });

            this.updateTrail();
        });
    }

    addPoint(point) {
        this.trail.push(point);
        
        // 限制轨迹长度
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // 移除旧点
        this.trail = this.trail.filter(p => Date.now() - p.time < 300);
    }

    updateTrail() {
        // 移除旧的轨迹线
        document.querySelectorAll('.mouse-trail-line').forEach(el => el.remove());

        if (this.trail.length < 2) return;

        // 创建新的轨迹线
        for (let i = 1; i < this.trail.length; i++) {
            const prev = this.trail[i - 1];
            const curr = this.trail[i];
            
            const line = document.createElement('div');
            line.className = 'mouse-trail-line';
            
            const distance = Math.sqrt(
                Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
            );
            
            const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x) * 180 / Math.PI;
            
            const opacity = (i / this.trail.length) * 0.5;
            
            line.style.cssText = `
                position: fixed;
                left: ${prev.x}px;
                top: ${prev.y}px;
                width: ${distance}px;
                height: 2px;
                background: linear-gradient(90deg, 
                    rgba(168, 197, 176, ${opacity}) 0%, 
                    rgba(168, 197, 176, ${opacity * 0.5}) 100%);
                transform-origin: 0 50%;
                transform: rotate(${angle}deg);
                pointer-events: none;
                z-index: 999;
                transition: opacity 0.1s ease;
            `;
            
            document.body.appendChild(line);
            
            // 自动移除
            setTimeout(() => {
                line.style.opacity = '0';
                setTimeout(() => line.remove(), 100);
            }, 150);
        }
    }
}

// 初始化鼠标轨迹
new MouseTrail();

// 移除图片的视差滚动效果
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroImage = document.querySelector('.hero-image img');
    
//     if (heroImage && scrolled < window.innerHeight) {
//         heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// 添加浮动装饰元素
function createFloatingElements() {
    const colors = ['#A8C5B0', '#B8D5C4', '#95B9A3'];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const dot = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            dot.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: -10px;
                pointer-events: none;
                z-index: 999;
                animation: floatDown 10s linear forwards;
            `;
            
            document.body.appendChild(dot);
            
            setTimeout(() => dot.remove(), 10000);
        }
    }, 2000);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatDown {
            to {
                transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 启动浮动装饰
createFloatingElements();

// 视差滚动增强（只影响背景和标题，不影响图片）
let scrollProgress = 0;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = scrolled / maxScroll;
    
    // 轻微的标题缩放效果
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && scrolled < 300) {
        const scale = 1 - (scrolled / 300) * 0.1; // 减轻缩放程度
        heroTitle.style.transform = `scale(${scale})`;
    }
});

// 添加滚动时的数字递增动画
function animateNumbers() {
    const numberElements = document.querySelectorAll('.philosophy-number');
    
    numberElements.forEach(el => {
        const targetNumber = parseInt(el.textContent);
        let currentNumber = 0;
        const increment = targetNumber / 30;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                el.textContent = targetNumber;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(currentNumber);
            }
        }, 50);
    });
}

// 当哲学部分进入视口时触发动画
const philosophySection = document.querySelector('.philosophy');
if (philosophySection) {
    const philosophyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                philosophyObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    philosophyObserver.observe(philosophySection);
}

// 鼠标悬停时创建涟漪效果
document.querySelectorAll('.mission-card, .character-image, .philosophy-item').forEach(element => {
    element.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--glass-green), transparent);
            left: ${e.clientX - rect.left - size/2}px;
            top: ${e.clientY - rect.top - size/2}px;
            pointer-events: none;
            animation: rippleExpand 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 添加涟漪动画样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes linkExpand {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 导航栏链接悬停波纹效果
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 100%;
            height: 2px;
            background: var(--primary-color);
            bottom: -5px;
            left: 0;
            animation: linkExpand 0.3s ease-out;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 300);
    });
});