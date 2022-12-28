import './css/index.css';
import IMask from 'imask';

const ccBgColor01 = document.querySelector(
  '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColor02 = document.querySelector(
  '.cc-bg svg > g g:nth-child(2) path'
);
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const setCardType = (type) => {
  const colors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    rocketseat: ['#0D6F5D', '#C3129C'],
    default: ['black', 'gray'],
  };
  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `cc-${type}.svg`);
};

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: '0000',
};

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardtype: 'visa',
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard',
    },
    {
      mask: '0000 0000 0000 0000',
      cardtype: 'default',
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );
    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addBtn = document.querySelector('#add-btn');
const form = document.querySelector('form');
const cardHolder = document.querySelector('#card-holder');
const name = document.querySelector('.cc-holder .value');

form.addEventListener('submit', (e) => {
  e.preventDefault();
});

addBtn.addEventListener('click', () => {
  alert('Cartão adicionado!!');
  [
    cardHolder,
    securityCodeMasked,
    cardNumberMasked,
    expirationDateMasked,
  ].forEach((el) => (el.value = ''));
  name.innerHTML = 'FULANO DA SILVA';
});

cardHolder.addEventListener('input', () => {
  updateValue(name, cardHolder.value, 'FULANO DA SILVA');
});

securityCodeMasked.on('accept', () => {
  const cvc = document.querySelector('.cc-security .value');
  updateValue(cvc, securityCodeMasked.value, '123');
});

cardNumberMasked.on('accept', () => {
  const ccNumber = document.querySelector('.cc-number');
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateValue(ccNumber, cardNumberMasked.value, '1234 5678 9012 3456');
});

expirationDateMasked.on('accept', () => {
  const expiration = document.querySelector('.cc-expiration .value');
  updateValue(expiration, expirationDateMasked.value, '02/32');
});

const updateValue = (tag, code, txt) => {
  tag.innerHTML = code.length === 0 ? txt : code;
};
