import './css/style.css';
import Notiflix from 'notiflix';

import { fetchImage } from './fetchForm';
import { createMarkup } from './createMarcup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const refs = {
  form: document.querySelector('.search-form'),
  myInput: document.querySelector('.search-input'),
  wraperGalery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.loadMore'),
};

const { form, myInput, wraperGalery, loadMore } = refs;

let myPage = 1;

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', addImage);

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

async function onSubmit(event) {
  event.preventDefault();
  wraperGalery.innerHTML = '';
  myPage = 1;

  const myInputValue = myInput.value;
  const myValue = myInputValue.trim();

  if (!myValue) {
    loadMore.hidden = true;
    return;
  }

  return await fetchThen(myValue);
}

loadMore.hidden = true;

async function fetchThen(value) {
  try {
    const resp = await fetchImage(value);
    const myArr = resp.data.hits;
    const myNumber = resp.data.total;

    if (myArr.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.hidden = true;
      return;
    }

    if (myNumber > 0) {
      Notiflix.Notify.info(`Hooray! We found ${myNumber} images.`);
    }

    createMarkup(myArr, wraperGalery);
    lightbox.refresh();
    loadMore.hidden = false;

    if (myArr.length < 20) {
      loadMore.hidden = true;
    }
    loadMore.hidden = false;

    if (resp.data.total <= 40 * myPage) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      loadMore.hidden = true;
    }
  } catch (error) {
    console.log(error);
    loadMore.hidden = false;
  }
}

async function addImage() {
  const value2 = myInput.value;
  let limitAdd;
  myPage += 1;
  try {
    const resp = await fetchImage(value2, myPage, limitAdd);
    createMarkup(resp.data.hits, wraperGalery);
    onPageScrolling();
    lightbox.refresh();

    if (resp.data.hits.length < limitAdd) {
      loadMore.hidden = true;
    }

    if (resp.data.total <= 40 * myPage) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      loadMore.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

function onPageScrolling() {
  const { height: cardHeight } =
    wraperGalery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
