document.addEventListener("DOMContentLoaded", () => {

    // 1. АНИМАЦИЯ ГРАФИКОВ ПРИ СКРОЛЛЕ
    const bars = document.querySelectorAll('.chart-fill');

    const animateCharts = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = bar.getAttribute('data-value');
                bar.style.width = value + '%';
                observer.unobserve(bar);
            }
        });
    };

    const chartObserver = new IntersectionObserver(animateCharts, {
        threshold: 0.5
    });

    bars.forEach(bar => {
        chartObserver.observe(bar);
    });

    // 2. МОБИЛЬНОЕ МЕНЮ (ПРОСТАЯ РЕАЛИЗАЦИЯ)
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#fff';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
        }
    });

    // 3. ИНТЕРАКТИВНЫЙ ТЕСТ (QUIZ)
    // Вопросы взяты из твоей анкеты
    const quizData = [
        {
            question: "Кто, по вашему мнению, должен быть главным финансовым обеспечителем в семье?",
            options: [
                { text: "Исключительно мужчина", score: 0 },
                { text: "Исключительно женщина", score: 0 },
                { text: "Оба партнёра по мере возможностей", score: 2 },
                { text: "Тот, у кого это лучше получается", score: 2 }
            ]
        },
        {
            question: "Как должны распределяться бытовые обязанности по дому?",
            options: [
                { text: "Это прямая обязанность женщины", score: 0 },
                { text: "Должны делиться строго поровну", score: 2 },
                { text: "Каждый занимается тем, что умеет лучше", score: 1 }
            ]
        },
        {
            question: "Существуют ли исключительно «мужские» и «женские» профессии?",
            options: [
                { text: "Да, физиология предопределяет выбор", score: 0 },
                { text: "Затрудняюсь ответить", score: 1 },
                { text: "Нет, любой может работать в любой сфере", score: 2 }
            ]
        },
        {
            question: "Допустимо ли для мужчины открыто проявлять свои эмоции (плакать)?",
            options: [
                { text: "Нет, мужчина должен сохранять жёсткость", score: 0 },
                { text: "Допустимо, но только в кругу близких", score: 1 },
                { text: "Да, мужчины такие же люди", score: 2 }
            ]
        },
        {
            question: "Согласны ли вы, что руководитель-мужчина эффективнее женщины?",
            options: [
                { text: "Полностью согласен", score: 0 },
                { text: "Скорее согласен", score: 0 },
                { text: "Нет разницы, всё зависит от качеств", score: 2 },
                { text: "Не согласен", score: 2 }
            ]
        }
    ];

    let currentQuestion = 0;
    let totalScore = 0;

    const qText = document.getElementById('q-text');
    const qOptions = document.getElementById('q-options');
    const progressBar = document.querySelector('.quiz-progress-fill');
    const progressText = document.querySelector('.quiz-counter');
    const resultBox = document.querySelector('.quiz-result');

    function loadQuestion() {
        const q = quizData[currentQuestion];
        qText.textContent = q.question;
        qOptions.innerHTML = '';

        // Обновляем прогресс-бар
        const progress = ((currentQuestion) / quizData.length) * 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = `Вопрос ${currentQuestion + 1} из ${quizData.length}`;

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt.text;
            btn.onclick = () => selectOption(opt.score);
            qOptions.appendChild(btn);
        });
    }

    function selectOption(score) {
        totalScore += score;
        currentQuestion++;

        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        document.querySelector('.quiz-question').style.display = 'none';
        document.querySelector('.quiz-progress').style.display = 'none';
        resultBox.style.display = 'block';

        const maxScore = quizData.length * 2; // Максимально 10 баллов
        const resultTitle = document.getElementById('result-title');
        const resultText = document.getElementById('result-text');
        const resultIcon = document.getElementById('result-icon');

        if (totalScore >= 8) {
            resultIcon.textContent = "🚀";
            resultTitle.textContent = "Свободный мыслитель";
            resultText.textContent = "У тебя полностью эгалитарные взгляды! Ты оцениваешь людей по их личным качествам, а не по биологическому полу. Именно такие взгляды разделяет большинство современной молодёжи из нашего исследования.";
        } else if (totalScore >= 4) {
            resultIcon.textContent = "⚖️";
            resultTitle.textContent = "На пути к балансу";
            resultText.textContent = "Твои взгляды — это микс современных ценностей и традиционных установок. Ты признаешь равноправие во многих сферах, но в некоторых вопросах всё ещё опираешься на классические гендерные роли.";
        } else {
            resultIcon.textContent = "🏛️";
            resultTitle.textContent = "Хранитель традиций";
            resultText.textContent = "Ты сторонник классического, патриархального уклада жизни. Ты считаешь, что у мужчин и женщин есть свои четко определенные природой и обществом роли, которые не стоит смешивать.";
        }
    }

    window.restartQuiz = function() {
        currentQuestion = 0;
        totalScore = 0;
        document.querySelector('.quiz-question').style.display = 'block';
        document.querySelector('.quiz-progress').style.display = 'block';
        resultBox.style.display = 'none';
        loadQuestion();
    }

    // Инициализация теста при загрузке
    if(qText) {
        loadQuestion();
    }

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let slideIndex = 0;
    let sliderTimer;

    function showSlide(index) {
        // Зацикливание слайдов вперед/назад
        if (index >= slides.length) slideIndex = 0;
        if (index < 0) slideIndex = slides.length - 1;

        // Переключение активного класса у слайдов и точек
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function nextSlide() {
        slideIndex++;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex--;
        showSlide(slideIndex);
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        // Обработчики кликов на стрелки
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSliderTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSliderTimer();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                slideIndex = parseInt(e.target.getAttribute('data-index'));
                showSlide(slideIndex);
                resetSliderTimer();
            });
        });

        // Функции автопрокрутки
        function startSliderTimer() {
            sliderTimer = setInterval(nextSlide, 8000);
        }

        function resetSliderTimer() {
            clearInterval(sliderTimer);
            startSliderTimer();
        }

        // Запуск автопрокрутки
        startSliderTimer();
    }
});