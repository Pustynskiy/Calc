function updateForm() {
    const form = document.querySelector('input[name="form"]:checked').value;
    const modulusLabel = document.querySelector('label[for="modulus"]');
    const argumentLabel = document.querySelector('label[for="argument"]');
    if (form === 'exponential') {
        modulusLabel.textContent = 'Модуль (r):';
        argumentLabel.textContent = 'Аргумент (φ):';
    } else if (form === 'trigonometric') {
        modulusLabel.textContent = 'Модуль (r):';
        argumentLabel.textContent = 'Угол (θ):';
    }
}
function clearInputs() {
    document.getElementById('modulus').value = '';
    document.getElementById('argument').value = '';
    document.getElementById('operations').selectedIndex = -1;
    document.getElementById('results').innerHTML = '';
    clearErrors();
}
function clearErrors() {
    document.getElementById('modulusError').textContent = '';
    document.getElementById('argumentError').textContent = '';
    document.getElementById('operationsError').textContent = '';
    document.getElementById('modulus').classList.remove('error-border');
    document.getElementById('argument').classList.remove('error-border');
}
function validateInput(modulus, argument, operations) {
    const errors = {};
    let hasErrors = false;
    if (!isPositiveNumber(modulus)) {
        errors.modulus = 'Модуль должен быть положительным числом.';
        document.getElementById('modulus').style = "outline: 2px solid red;";
        hasErrors = true;
    } else {
        document.getElementById('modulus').style = "outline: 0px solid red;";
    }
    if (!isNumeric(argument)) {
        errors.argument = 'Аргумент/угол должен быть числом.';
        document.getElementById('argument').style = "outline: 2px solid red;";
        hasErrors = true;
    } else {
        document.getElementById('argument').style = "outline: 0px solid red;";
    }
    if (operations.length === 0) {
        document.getElementById('operations').classList.add('error-border');
        errors.operations = 'Выберите хотя бы одну операцию.';
        hasErrors = true;
    } else {
        document.getElementById('operations').classList.remove('error-border');
    }

    return { errors, hasErrors };
}
function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
function isPositiveNumber(value) {
    return isNumeric(value) && parseFloat(value) > 0;
}
function calculate() {

    const modulus = document.getElementById('modulus').value.trim();
    const argument = document.getElementById('argument').value.trim();
    const unit = document.getElementById('unit').value;
    const operations = Array.from(document.getElementById('operations').selectedOptions).map(option => option.value);
    const { errors, hasErrors } = validateInput(modulus, argument, operations);
    clearErrors();
    if (hasErrors) {
        if (errors.modulus) document.getElementById('modulusError').textContent = errors.modulus;
        if (errors.argument) document.getElementById('argumentError').textContent = errors.argument;
        if (errors.operations) document.getElementById('operationsError').textContent = errors.operations;
        document.getElementById('results').textContent = '';
        return;
    }

    const r = parseFloat(modulus);
    let phi = parseFloat(argument);
    if (unit === 'degrees') {
        phi = phi * (Math.PI / 180);
    }
    let results = [];
    operations.forEach(operation => {
        switch (operation) {
            case 'realPart':
                results.push(`Действительная часть: ${(r * Math.cos(phi)).toFixed(2)}`);
                break;
            case 'imaginaryPart':
                results.push(`Мнимая часть: ${(r * Math.sin(phi)).toFixed(2)}`);
                break;
            case 'argumentCalc':
                results.push(`Аргумент: ${(unit === 'degrees' ? (phi * (180 / Math.PI)).toFixed(4) : phi.toFixed(4))} ${unit}`);
                break;
            case 'otherForms':
                const real = r * Math.cos(phi);
                const imaginary = r * Math.sin(phi);
                results.push(`Тригонометрическая форма: ${r} * (cos(${phi.toFixed(2)}) + i*sin(${phi.toFixed(2)}))`);
                results.push(`Показательная форма: ${r} * e^(i*${phi.toFixed(2)})`);
                results.push(`Алгебраическая форма: ${real.toFixed(2)} + ${imaginary.toFixed(2)}i`);
                break;
        }
    });
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `<p>${results.join('<br>')}</p>`;
}