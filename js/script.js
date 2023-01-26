window.addEventListener('DOMContentLoaded', function() {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function(event) {
        const target = event.target;
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2023-05-25';

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t <= 0) {
            hours = 0;
            days = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return`0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        window.removeEventListener('scroll', showModalByScroll);
    }

    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 15000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parenSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parenSelector);
            this.transfer = 74;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}
                </div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>          
            `;
            this.parent.append(element);
        }
    }

    const getResourse = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // 1
    // getResourse('http://localhost:3000/menu').then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //
    //     });
    // })

    // 2
    // getResourse('http://localhost:3000/menu')
    //     .then(data => createCard(data))
    //
    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price})=> {
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //              <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}
    //             </div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
    //             </div>
    //         `;
    //
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

    // 3
    axios.get('http://localhost:3000/menu').then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Ошибка! Что то пошло не так'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url,{
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
                .catch(() => {
                showThanksModal(message.failure);
            })
                .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        },4000);
    }

    // fetch('db.json')
    //     .then(data => data.json())
    //     .then(res => console.log(res));

    // Slider 1
    let slideIndex = 1;
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current');

    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');

        slides[slideIndex - 1].style.display = 'block';

        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    }

    function plusSlides (n) {
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', function(){
        plusSlides(-1);
    });

    next.addEventListener('click', function(){
        plusSlides(1);
    });


    // Slider 2
    let offset2 = 0;
    let slideIndex2 = 1;

    const slides2 = document.querySelectorAll('.offer__slide2'),
        prev2 = document.querySelector('.offer__slider-prev2'),
        next2 = document.querySelector('.offer__slider-next2'),
        total2 = document.querySelector('#total2'),
        current2 = document.querySelector('#current2'),
        slidesWrapper2 = document.querySelector('.offer__slider-wrapper2'),
        width2 = window.getComputedStyle(slidesWrapper2).width,
        slidesField2 = document.querySelector('.offer__slider-inner2');

    if (slides2.length < 10) {
        total2.textContent = `0${slides2.length}`;
        current2.textContent =  `0${slideIndex2}`;
    } else {
        total2.textContent = slides2.length;
        current2.textContent =  slideIndex2;
    }

    slidesField2.style.width = 100 * slides2.length + '%';
    slidesField2.style.display = 'flex';
    slidesField2.style.transition = '0.5s all';

    slidesWrapper2.style.overflow = 'hidden';

    slides2.forEach(slide => {
        slide.style.width = width2;
    });

    next2.addEventListener('click', () => {
        if (offset2 === (+width2.slice(0, width2.length - 2) * (slides2.length - 1))) {
            offset2 = 0;
        } else {
            offset2 += +width2.slice(0, width2.length - 2);
        }

        slidesField2.style.transform = `translateX(-${offset2}px)`;

        if (slideIndex2 === slides2.length) {
            slideIndex2 = 1;
        } else {
            slideIndex2++;
        }

        if (slides2.length < 10) {
            current2.textContent =  `0${slideIndex2}`;
        } else {
            current2.textContent =  slideIndex2;
        }
    });

    prev2.addEventListener('click', () => {
        if (offset2 === 0) {
            offset2 = +width2.slice(0, width2.length - 2) * (slides2.length - 1);
        } else {
            offset2 -= +width2.slice(0, width2.length - 2);
        }

        slidesField2.style.transform = `translateX(-${offset2}px)`;

        if (slideIndex2 === 1) {
            slideIndex2 = slides2.length;
        } else {
            slideIndex2--;
        }

        if (slides2.length < 10) {
            current2.textContent =  `0${slideIndex2}`;
        } else {
            current2.textContent =  slideIndex2;
        }
    });

    // Slider 3
    let offset3 = 0;
    let slideIndex3 = 1;

    const slides3 = document.querySelectorAll('.offer__slide3'),
        slider3 = document.querySelector('.offer__slider3'),
        prev3 = document.querySelector('.offer__slider-prev3'),
        next3 = document.querySelector('.offer__slider-next3'),
        total3 = document.querySelector('#total3'),
        current3 = document.querySelector('#current3'),
        slidesWrapper3 = document.querySelector('.offer__slider-wrapper3'),
        width3 = window.getComputedStyle(slidesWrapper3).width,
        slidesField3 = document.querySelector('.offer__slider-inner3');

    if (slides3.length < 10) {
        total3.textContent = `0${slides3.length}`;
        current3.textContent =  `0${slideIndex3}`;
    } else {
        total3.textContent = slides3.length;
        current3.textContent =  slideIndex3;
    }

    slidesField3.style.width = 100 * slides3.length + '%';
    slidesField3.style.display = 'flex';
    slidesField3.style.transition = '0.5s all';

    slidesWrapper3.style.overflow = 'hidden';

    slides3.forEach(slide => {
        slide.style.width = width3;
    });

    slider3.style.position = 'relative';
    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 15;
            display: flex;
            justify-content: center;
            margin-right: 15%;
            margin-left: 15%;
            list-style: none;
        `;
    slider3.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .2;
            transition: opacity .6s ease;
        `;

        if (i === 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }


    next3.addEventListener('click', () => {
        if (offset3 === (+width3.slice(0, width3.length - 2) * (slides3.length - 1))) {
            offset3 = 0;
        } else {
            offset3 += +width3.slice(0, width3.length - 2);
        }

        slidesField3.style.transform = `translateX(-${offset3}px)`;

        if (slideIndex3 === slides3.length) {
            slideIndex3 = 1;
        } else {
            slideIndex3++;
        }

        if (slides3.length < 10) {
            current3.textContent =  `0${slideIndex3}`;
        } else {
            current3.textContent =  slideIndex3;
        }

        dots.forEach(dot => dot.style.opacity = '.2');
        dots[slideIndex3 - 1].style.opacity = 1;
    });

    prev3.addEventListener('click', () => {
        if (offset3 === 0) {
            offset3 = +width3.slice(0, width3.length - 2) * (slides3.length - 1);
        } else {
            offset3 -= +width3.slice(0, width3.length - 2);
        }

        slidesField3.style.transform = `translateX(-${offset3}px)`;

        if (slideIndex3 === 1) {
            slideIndex3 = slides3.length;
        } else {
            slideIndex3--;
        }

        if (slides3.length < 10) {
            current3.textContent =  `0${slideIndex3}`;
        } else {
            current3.textContent =  slideIndex3;
        }

        dots.forEach(dot => dot.style.opacity = '.2');
        dots[slideIndex3 - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex3 = slideTo;
            offset3 = +width3.slice(0, width3.length - 2) * (slideTo - 1);

            slidesField3.style.transform = `translateX(-${offset3}px)`;

            if (slides3.length < 10) {
                current3.textContent =  `0${slideIndex3}`;
            } else {
                current3.textContent =  slideIndex3;
            }

            dots.forEach(dot => dot.style.opacity = '.2');
            dots[slideIndex3 - 1].style.opacity = 1;
        });
    });
});