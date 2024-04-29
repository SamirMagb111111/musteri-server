const apiUrl = `https://api.exchangerate-api.com/v4/latest/`;

function valyutaMezennesi(base, target) {
    return fetch(`${apiUrl}${base}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Sebeke cavabı duzgun deyildi');
            }
            return response.json();
        })
        .then(data => {
            return data.rates[target];
        })
        .catch(error => {
            console.error('fetchde problem yarandi:', error);
        });
}

function hesablama_neticesi (base, target) {
    const leftInput = document.querySelector('.left .mebleg');
    const rightInput = document.querySelector('.right .sonuc');
    const amount = parseFloat(leftInput.value);
    if (!isNaN(amount)) {
        valyutaMezennesi(base, target)
            .then(rate => {
                const result = amount * rate;
                rightInput.value = result.toFixed(4);
                document.getElementById('rubToUsd').innerText = `1 ${base} = ${rate.toFixed(4)} ${target}`;
                valyutaMezennesi(target, base)
                    .then(invertedRate => {
                        document.getElementById('usdToRub').innerText = `1 ${target} = ${invertedRate.toFixed(4)} ${base}`;
                    });
            });
    } else {
        rightInput.value = '';
    }
}

// Sol terefdeki düymelere kliklendikde islemi yerine yetirir (Klikleyen zaman aktiv sinifi elave edirik)
const leftButtons = document.querySelectorAll('.left .btn');
leftButtons.forEach(button => {
    button.addEventListener('click', () => {
        leftButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
        });
        button.classList.add('active');
        button.style.backgroundColor = '#833AE0';
        const base = button.value;
        const targetButton = document.querySelector('.right .btn.active');
        const target = targetButton ? targetButton.value : ''; 
        hesablama_neticesi (base, target);
    });
});

// Sag terefdeki düymelere kliklendikde islemi yerine yetirir
const rightButtons = document.querySelectorAll('.right .btn');
rightButtons.forEach(button => {
    button.addEventListener('click', () => {
        rightButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
        });
        button.classList.add('active');
        button.style.backgroundColor = '#833AE0';
        const target = button.value;
        const baseButton = document.querySelector('.left .btn.active');
        const base = baseButton ? baseButton.value : ''; 
        hesablama_neticesi (base, target);
    });
});

const leftInput = document.querySelector('.left .mebleg');
leftInput.addEventListener('input', () => {
    const baseButton = document.querySelector('.left .btn.active');
    const targetButton = document.querySelector('.right .btn.active');
    const base = baseButton ? baseButton.value : ''; 
    const target = targetButton ? targetButton.value : '';
    hesablama_neticesi (base, target);
});

//her iki buttonda rub secili olsun deye
document.querySelector('.left .btn.rub1').click();
document.querySelector('.right .btn.rub2').click();
