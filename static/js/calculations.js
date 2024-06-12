const CALCULATE_TYPE_BY_DAY = 'by-day';
const CALCULATE_TYPE_BY_MONTH = 'by-month';
const CALCULATE_TYPE_BY_YEAR = 'by-year';
const CALCULATE_TYPE_BY_CUSTOM = 'by-custom';

const DAY = "day";
const MONTH = "month";
const YEAR = "year";
const CUSTOM = "custom";

const STYLE_BLOCK = "block";
const STYLE_NONE = "none";


const errorMessage = document.getElementById('error-message');

// Добавляем файл
let file = null;
document.getElementById('load-csv-button')
    .addEventListener('change', function () {
        file = this.files[0];
    });

// Событие обрабатываемое, при смене положения radio-button
document.querySelectorAll('input[name="calculation-type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        switchButtonDo('calculation-type',
            () => {
                blockStyle(STYLE_BLOCK, STYLE_NONE, STYLE_NONE, STYLE_NONE)
            },
            () => {
                blockStyle(STYLE_NONE, STYLE_BLOCK, STYLE_NONE, STYLE_NONE)
            },
            () => {
                blockStyle(STYLE_NONE, STYLE_NONE, STYLE_BLOCK, STYLE_NONE)
            },
            () => {
                blockStyle(STYLE_NONE, STYLE_NONE, STYLE_NONE, STYLE_BLOCK)
            }
        );
    });
});

// Обработка нажатия на кнопку "Рассчитать"
document.querySelector('#calculate-button')
    .addEventListener('click', () => {

        let err = validateFields()
        if (err !== "") {
            wrapError(err)
            return;
        } else {
            errorMessage.style.display = STYLE_NONE;
        }

        switchButtonDo('calculation-type',
            () => {
                createRequest(CALCULATE_TYPE_BY_DAY, 'by-day-day', 'by-day-month')
            },
            () => {
                createRequest(CALCULATE_TYPE_BY_MONTH, 'calculation-type-month', 'by-month-month')
            },
            () => {
                createRequest(CALCULATE_TYPE_BY_YEAR, 'calculation-type-year')
            },
            () => {
                createRequest(CALCULATE_TYPE_BY_CUSTOM, 'num-month-start', 'num-month-end', 'num-day-m-start', 'num-day-m-end')
            }
        );
    });

function wrapError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = STYLE_BLOCK;
}

function getRadioButtonValue(radioButtonName) {
    const radioButtons = document.getElementsByName(radioButtonName);
    let selectedValue = '';
    for (const button of radioButtons) {
        if (button.checked) {
            selectedValue = button.value;
            break;
        }
    }
    return selectedValue
}

function getMaxAngleState() {
    return !!document.getElementById('calculate-max-angle').checked;
}

function sendRequest(formData, endpoint) {
    let url = window.location.origin + '/api/calc/' + endpoint + '/csv';

    formData.append('file', file);
    if (getMaxAngleState() === false) {
        formData.append('max-angle', 'false');
        formData.append('tilt-angle', document.getElementById('tilt-angle').value);
    } else {
        formData.append('max-angle', 'true');
    }
    formData.append('latitude', document.getElementById('latitude').value);
    formData.append('azimuth', document.getElementById('azimuth').value);

    fetch(url,
        {
            method: 'POST',
            body: formData
        }
    )
        .then(response => {
            const filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');
            return response.blob().then(blob => ({filename, blob}));
        })
        .then(data => {
            const url = window.URL.createObjectURL(data.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            wrapError('Формат csv некорректен.');
        });
}

function blockStyle(style1, style2, style3, style4) {
    document.getElementById(CALCULATE_TYPE_BY_DAY).style.display = style1;
    document.getElementById(CALCULATE_TYPE_BY_MONTH).style.display = style2;
    document.getElementById(CALCULATE_TYPE_BY_YEAR).style.display = style3;
    document.getElementById(CALCULATE_TYPE_BY_CUSTOM).style.display = style4;
}

function createRequest(calcType) {
    let formData = new FormData();
    for (let i = 1; i < arguments.length; i++) {
        let value = arguments[i];
        if (value === "calculation-type-month" || value === "calculation-type-year") {
            formData.append(value, getRadioButtonValue(value));
        } else {
            formData.append(value, document.getElementById(value).value);
        }
    }
    sendRequest(formData, calcType);
}

function switchButtonDo(radioButtonName, ...funcs) {
    switch (getRadioButtonValue(radioButtonName)) {
        case DAY:
            funcs[0]()
            break;
        case MONTH:
            funcs[1]()
            break;
        case YEAR:
            funcs[2]()
            break;
        case CUSTOM:
            funcs[3]()
            break;
    }
}

function validateFields() {
    let validationError = "";
    if (!file) {
        validationError += 'Файл не выбран.\n';
    } else if (file.type !== "text/csv") {
        validationError += 'Неверный формат файла: выберете ".csv".\n';
    }

    let tiltAngleField = document.getElementById('tilt-angle').value;
    if (tiltAngleField === "" || tiltAngleField < 0 || tiltAngleField > 90) {
        validationError += "Значение угла наклона должно лежать в пределах от 0 до 90.\n";
    }

    let latitudeField = document.getElementById('latitude').value;
    if (latitudeField === "" || latitudeField < 0 || latitudeField > 90) {
        validationError += "Значение широты должно лежать в пределах от 0 до 90.\n";
    }

    let azimuthField = document.getElementById('azimuth').value;
    if (azimuthField === "" || azimuthField < 0 || azimuthField > 360) {
        validationError += "Значение азимута должно лежать в пределах от 0 до 360.\n";
    }

    switchButtonDo('calculation-type',
        () => {
            let dayDayField = document.getElementById('by-day-day').value;
            if (dayDayField === "" || dayDayField < 1 || dayDayField > 31) {
                validationError += "Значение дня должно лежать в пределах от 1 до 31.\n";
            }

            let dayMonthField = document.getElementById('by-day-month').value;
            if (dayMonthField === "" || dayMonthField < 1 || dayMonthField > 12) {
                validationError += "Значение месяца должно лежать в пределах от 1 до 12.\n";
            }
        },
        () => {
            let monthMonthField = document.getElementById('by-month-month').value;
            if (monthMonthField === "" || monthMonthField < 1 || monthMonthField > 12) {
                validationError += "Значение месяца должно лежать в пределах от 1 до 12.\n";
            }
        },
        () => {

        }, () => {
            let numMonthStart = document.getElementById('num-month-start').value;
            if (numMonthStart === "" || numMonthStart < 1 || numMonthStart > 12) {
                validationError += "Значение месяца начала периода должно лежать в пределах от 1 до 12.\n";
            }

            let numMonthEnd = document.getElementById('num-month-end').value;
            if (numMonthEnd === "" || numMonthEnd < 1 || numMonthEnd > 12) {
                validationError += "Значение месяца конца периода должно лежать в пределах от 1 до 12.\n";
            }

            let numDayStart = document.getElementById('num-day-m-start').value;
            if (numDayStart === "" || numDayStart < 1 || numDayStart > 31) {
                validationError += "Значение дня начала периода должно лежать в пределах от 1 до 31.\n";
            }

            let numDayEnd = document.getElementById('num-day-m-start').value;
            if (numDayEnd === "" || numDayEnd < 1 || numDayEnd > 31) {
                validationError += "Значение дня конца периода должно лежать в пределах от 1 до 31.\n";
            }
        }
    )

    return validationError
}