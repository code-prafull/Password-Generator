const inputSlider = document.querySelector('.password-Output');
const copymsgg = document.querySelector('.copy-btn');
const SliderValue = document.querySelector('.Changble-slider-value');
const Slider = document.querySelector('#password-length-slider');
const Upper = document.querySelector('.include-uppercase');
const lower = document.querySelector('.include-lowercase');
const numberss = document.querySelector('.include-numbers');
const symbolsCheck = document.querySelector('.include-symbols');
const dataColor = document.querySelector('.data-ind');
const Generatebtn = document.querySelector('.ganerate-btn');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolss = '~!@#$%^&*';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

function handleSlider(){
    Slider.value = passwordLength;
    SliderValue.innerText = passwordLength;
}

function setIndicator(color) {
    dataColor.style.background = color;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNum(){
    return getRndInteger(0, 10);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol(){
    const randomNum = getRndInteger(0, symbolss.length);
    return symbolss.charAt(randomNum);
}

function calcStrength(){
    let hasUpper = Upper.checked;
    let hasLower = lower.checked;
    let hasNum = numberss.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0"); // green
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // yellow
    } else {
        setIndicator("#f00"); // red
    }
}

function shufflePassword(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

async function copyClipboard(){
    try {
        await navigator.clipboard.writeText(inputSlider.value);
        copymsgg.innerText = "Copied";
    } catch(e) {
        copymsgg.innerText = "Failed";
    }
    copymsgg.classList.add("active");
    setTimeout(() => {
        copymsgg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if(checkbox.checked) checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

Slider.addEventListener('input', e => {
    passwordLength = e.target.value;
    handleSlider();
});

copymsgg.addEventListener('click', () => {
    if(inputSlider.value) copyClipboard();
});

Generatebtn.addEventListener('click', () => {
    if(checkCount === 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";

    let funArr = [];
    if(Upper.checked) funArr.push(generateUppercase);
    if(lower.checked) funArr.push(generateLowercase);
    if(numberss.checked) funArr.push(generateRandomNum);
    if(symbolsCheck.checked) funArr.push(generateSymbol);

    // Ensure each selected type appears at least once
    funArr.forEach(func => password += func());

    // Fill the rest
    for(let i = 0; i < passwordLength - funArr.length; i++){
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // Shuffle & set
    password = shufflePassword(Array.from(password));
    inputSlider.value = password;
    calcStrength();
});

