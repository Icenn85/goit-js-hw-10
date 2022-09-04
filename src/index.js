import './css/styles.css';
import { fetchCountries } from './fetchCountries.js'
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function clearMarkup () {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
};

function onSearchInput(evt) {
    clearMarkup();

    const textInput = evt.target.value.trim();
    if (!textInput) {
        return;
    }

    fetchCountries(textInput)
      .then(countries => {
        console.log(countries);
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          return;
        }
        renderMarkup(countries);
      })
      .catch(() => {
        clearMarkup(listEl);
        clearMarkup(infoEl);
        Notify.failure('Oops, there is no country with that name');
      });
}

function renderMarkup (countries) {
  if (countries.length === 1) {
    clearMarkup(listEl);
    const markupInfo = createMarkupInfo(countries);
    infoEl.innerHTML = markupInfo;
  } else {
    clearMarkup(infoEl);
    const markupList = createMarkupList(countries);
    listEl.innerHTML = markupList;
  }
};

function createMarkupList (countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="40" height="40">${name.official}</li>`
    )
    .join('');
};

function createMarkupInfo (country) {
  return country.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};