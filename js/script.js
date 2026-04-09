const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const cards = document.querySelectorAll('.game-card');
const langBtn = document.getElementById('lang-switch');

// 1. СЛОВАРЬ ПЕРЕВОДОВ
const translations = {
    'en': {
        'nav_home': 'Home',
        'nav_archive': 'The Archive',
        'nav_credits': 'Credits',
        'hero_title': 'Cinematic <span>Shadows</span>',
        'hero_subtitle': 'Worlds forged in digital. Stories written in blood and light. Explore the masterpieces that changed the industry forever.',
        'archive_title': 'The <span>Archive</span>',
        'credits_title': 'Credits',
        're_desc': 'The story unfolds in Raccoon City, consumed by a zombie virus leak from Umbrella Corp labs. You play as survivors fighting to escape the city.',
        'tlou_desc': 'The journey of Joel and Ellie across post-pandemic America. A deep personal drama about loss and finding hope in a broken world.',
        'cp_desc': 'You take on the role of V, a mercenary in Night City, whose mind is being erased by the digital ghost of Johnny Silverhand.',
        'got_desc': 'Set in 1274 on Tsushima Island. Samurai Jin Sakai must abandon his code of honor to become the Ghost and save his home.',
        'metro_desc': 'Nuclear war forced survivors into the Metro. Follow Artyom on a perilous journey across the surface and tunnels.',
        'elden_desc': 'In the Lands Between, the destruction of the Elden Ring sparked a war. As a Tarnished, you must rise to become the Elden Lord.',
        'c_lead': 'Lead Developer',
        'c_stack': 'Tech Stack',
        'c_type': 'Project Type',
        'c_work': 'Practical Work №4',
        'c_partner': 'Dev Partner'
    },
    'uk': {
        'nav_home': 'Головна',
        'nav_archive': 'Архів',
        'nav_credits': 'Титри',
        'hero_title': 'Cinematic <span>Shadows</span>',
        'hero_subtitle': 'Кожна гра - це подорож у невідоме. Поглянь крізь тіні на шедеври, які змінили індустрію назавжди.',
        'archive_title': 'Архів <span>Ігор</span>',
        'credits_title': 'Автор',
        're_desc': 'Сюжет розгортається в Раккун-Сіті, охопленому зомбі-вірусом після витоку з Umbrella. Ви граєте за героїв, що рятуються з міста.',
        'tlou_desc': 'Історія Джоела та Еллі у постапокаліптичних Штатах. Глибока драма про втрату та пошук сенсу життя у зруйнованому світі.',
        'cp_desc': 'Ви берете на себе роль Ві, найманця з Найт-Сіті, чия свідомість стирається цифровим привидом Джонні Сільверхенда.',
        'got_desc': '1274 рік, острів Цусіма. Самурай Дзін Сакай змушений порушити кодекс честі, щоб стати Привидом і врятувати свій дім.',
        'metro_desc': 'Ядерна війна змусила людей піти в метро. Історія Артема, який вирушає в небезпечну подорож тунелями та поверхнею.',
        'elden_desc': 'У Міжзем’ї після руйнування Кільця Елден почалася війна. Ви — Погаслий, що має стати новим повелителем цих земель.',
        'c_lead': 'Головний розробник',
        'c_stack': 'Технології',
        'c_type': 'Тип проєкту',
        'c_work': 'Практична робота №4',
        'c_partner': 'Партнер'
    }
};

// 2. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ
let currentLang = localStorage.getItem('selectedLang') || 'uk';

function updateContent() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
    langBtn.textContent = currentLang === 'uk' ? 'ENG' : 'UKR';
}

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'uk' ? 'en' : 'uk';
    localStorage.setItem('selectedLang', currentLang);
    updateContent();
});

// Инициализация при загрузке
updateContent();

// 3. КУРСОР И АНИМАЦИИ (Твой старый код)
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
});

function animate() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    follower.style.transform = `translate3d(${followerX - 11}px, ${followerY - 11}px, 0)`;
    requestAnimationFrame(animate);
}
animate();

// Цвета при наведении
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        follower.style.transform += ' scale(1.5)';
        if(card.classList.contains('re')) { follower.style.borderColor = '#dc2626'; cursor.style.backgroundColor = '#dc2626'; }
        else if(card.classList.contains('tlou')) { follower.style.borderColor = '#22c55e'; cursor.style.backgroundColor = '#22c55e'; }
        else if(card.classList.contains('metro')) { follower.style.borderColor = '#f97316'; cursor.style.backgroundColor = '#f97316'; }
        else if(card.classList.contains('cyberpunk')) { follower.style.borderColor = '#facc15'; cursor.style.backgroundColor = '#facc15'; }
        else if(card.classList.contains('ghost')) { follower.style.borderColor = '#f8fafc'; cursor.style.backgroundColor = '#f8fafc'; }
        else if(card.classList.contains('elden')) { follower.style.borderColor = '#fbbf24'; cursor.style.backgroundColor = '#fbbf24'; }
    });
    card.addEventListener('mouseleave', () => {
        follower.style.borderColor = 'var(--accent-red)';
        cursor.style.backgroundColor = 'var(--accent-red)';
    });
});

// Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => revealObserver.observe(card));