import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = form.querySelector('[name="delay"]');

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function showNotification(state, delay) {
  const message =
    state === 'fulfilled'
      ? `✅ Fulfilled promise in ${delay}ms`
      : `❌ Rejected promise in ${delay}ms`;

  if (state === 'fulfilled') {
    iziToast.success({
      title: 'Success',
      message,
      position: 'topRight',
      timeout: 4000,
    });
  } else {
    iziToast.error({
      title: 'Error',
      message,
      position: 'topRight',
      timeout: 4000,
    });
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(delayInput.value);
  const state = form.elements.state.value;

  if (Number.isNaN(delay) || delay < 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid delay in milliseconds.',
      position: 'topRight',
      timeout: 4000,
    });
    return;
  }

  createPromise(delay, state)
    .then(result => {
      showNotification('fulfilled', result);
    })
    .catch(result => {
      showNotification('rejected', result);
    });
});
