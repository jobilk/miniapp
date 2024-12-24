document.addEventListener('DOMContentLoaded', () => {
    const placeBetButton = document.querySelectorAll('button');
    const quantiaInput = document.getElementById('quantia');
    const colorButtons = document.querySelectorAll('.color-button');

    let userBalance = 20.00;

    document.getElementById('player-balance').textContent = userBalance.toFixed(2);

    const halfButton = document.querySelector('.grey.half');
    const doubleButton = document.querySelector('.grey.double');

    function updateInputValue(value) {
        if (value < 0.50) {
            value = 0.50;
        } else if (value > 50.00) {
            value = 50.00;
        }
        quantiaInput.value = value.toFixed(2);
    }

    halfButton.addEventListener('click', () => {
        let currentValue = parseFloat(quantiaInput.value);
        if (isNaN(currentValue)) currentValue = 1; 
        let newValue = currentValue / 2; 
        updateInputValue(newValue);
    });

    doubleButton.addEventListener('click', () => {
        let currentValue = parseFloat(quantiaInput.value);
        if (isNaN(currentValue)) currentValue = 1;
        let newValue = currentValue * 2;
        updateInputValue(newValue);
    });
    
    function getSelectedButton() {
        const selectedButton = document.querySelector('.color-buttons .selected');
        if (selectedButton) {
            return selectedButton.dataset.color;
        }
        return null;
    }
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');

            let quantia = parseFloat(document.getElementById('quantia').value);

            if (quantia > userBalance) {
                alert("Saldo insuficiente para realizar a aposta.");
            } else {
                userBalance -= quantia;
                document.getElementById('player-balance').textContent = userBalance.toFixed(2);
                spinRoulette();
            }
        });
    });

    quantiaInput.addEventListener('input', function() {
        let value = parseFloat(quantiaInput.value);

        if (quantiaInput.value.trim() === "") {
            const minValue = parseFloat(quantiaInput.getAttribute('min'));
            if (!isNaN(minValue) && minValue > 0) {
                quantiaInput.value = minValue.toFixed(2);
            } else {
                console.error('Valor mínimo não é válido');
            }
        }

        if (value < 0.50 || isNaN(value)) {
            quantiaInput.value = (0.50).toFixed(2);
        }
        else if (value > 50.00) {
            quantiaInput.value = (50.00).toFixed(2);
        }
        else {
            quantiaInput.value = value.toFixed(2);
        }

        colorButtons.forEach(button => {
            if (quantiaInput.value.trim() !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });
    });

    const colors = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'white', 'black', 'red', 'black', 'red', 'black', 'red', 'black'];
    let isSpinning = false;

    const loopedColors = [...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors, ...colors];

    function generateRoulette() {
        const rouletteContainer = document.createElement('div');
        rouletteContainer.classList.add('roulette-container');

        const slider = document.createElement('div');
        slider.classList.add('wrapper');

        const entries = document.createElement('div');
        entries.classList.add('entries');

        loopedColors.forEach((color, index) => {
            const titleWrapper = document.createElement('div');
            titleWrapper.classList.add('title-wrapper', color);
            titleWrapper.classList.add(`title-${index + 1}`);

            const lgBox = document.createElement('div');
            lgBox.classList.add('lg-box');
            if (color === 'white') {
                const img = document.createElement('img');
                img.src = 'flamejante-em-chamas-queimando-dados-brancos_1056-3132-removebg-preview (1).png';
                img.alt = 'Descrição da Imagem';
                img.style.width = '100%'; 
                img.style.height = 'auto'; 
                img.style.position = 'absolute'; 
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%, -50%)';

                titleWrapper.appendChild(img);
            }
            titleWrapper.appendChild(lgBox);
            entries.appendChild(titleWrapper);
        });

        slider.appendChild(entries);
        rouletteContainer.appendChild(slider);

        const timer = document.createElement('div');
        rouletteContainer.appendChild(timer);

        const rouletteTimersContainer = document.getElementById('roulette-timers');
        rouletteTimersContainer.appendChild(rouletteContainer);
    }

    function spinRoulette() {
        if (isSpinning) return;
        isSpinning = true;
        colorButtons.forEach(button => {
            button.disabled = true;
        });

        const selectedColor = document.querySelector('.color-button.selected');
        if (!selectedColor) {
            console.error('Nenhuma cor selecionada.');
            return;
        }

        const randomtitleIndex = Math.floor(Math.random() * (200 - 70 + 1)) + 70;
        const titleElement = document.querySelector(`.title-${randomtitleIndex}`);
        if (!titleElement) {
            console.error(`Div com a classe .title-${randomtitleIndex} não encontrada.`);
            return;
        }

        const entries = document.querySelector('.entries');
        const slider = document.querySelector('.wrapper');
        const sliderCenter = slider.offsetWidth / 2;
        const targetOffset = titleElement.offsetLeft + titleElement.offsetWidth / 2;
        const distance = targetOffset - sliderCenter;

        entries.style.transition = 'transform 6s ease-out';
        entries.style.transform = `translateX(-${distance}px)`;

        setTimeout(() => {
            const classes = titleElement.classList;

            const selectedColor = getSelectedButton(); 

            const betAmount = parseFloat(document.getElementById('quantia').value);
            let quantia = parseFloat(document.getElementById('quantia').value);

            if (classes.contains('red') && (selectedColor === 'red')) {
                userBalance += betAmount * 2;
            } else if (classes.contains('black') && (selectedColor === 'black')) {
                userBalance += betAmount * 2;
            } else if (classes.contains('white') && (selectedColor === 'white')) {
                userBalance += betAmount * 14;
            }
            document.getElementById('player-balance').textContent = userBalance.toFixed(2);

            updateResults(classes.contains('red') ? 'red' : classes.contains('black') ? 'black' : 'white');

            setTimeout(() => {
                resetRoulette();
            }, 2000);

            isSpinning = false;
        }, 6000);
    }

    function resetRoulette() {
        const entries = document.querySelector('.entries');
        const slider = document.querySelector('.wrapper');

        if (!entries) {
            console.error('Elemento .entries não encontrado no DOM.');
            return;
        }

        entries.style.transition = 'transform 2s ease-out';

        const sliderCenter = slider.offsetWidth / 2;
        const entriesWidth = entries.offsetWidth;
        const initialOffset = (sliderCenter - entriesWidth / 2);

        entries.style.transform = `translateX(0px)`;

        setTimeout(() => {
            entries.style.transition = '';
            entries.style.transform = '';
            colorButtons.forEach(button => {
                button.disabled = false;
            });
        }, 3000);
    }

    function updateResults(newResult) {
        const resultsContainer = document.querySelector('.results-balls');

        const newBall = document.createElement('div');
        newBall.classList.add('result-ball', newResult);

        resultsContainer.prepend(newBall);

        if (resultsContainer.children.length > 6) {
            resultsContainer.removeChild(resultsContainer.lastChild);
        }
    }

    generateRoulette();
});
