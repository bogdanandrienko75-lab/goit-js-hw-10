import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let selectedDate = null;
let intervalId = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function resetCountdown() {
  clearInterval(intervalId);
  intervalId = null;
  selectedDate = null;
  refs.startBtn.disabled = true;
  refs.input.disabled = false;
  updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function showAlert(message) {
  iziToast.error({
    title: 'Error',
    message,
    position: 'topRight',
    timeout: 3000,
  });
}

function onStartClick() {
  if (!selectedDate) {
    showAlert('Please choose a date in the future');
    return;
  }

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  const update = () => {
    const delta = selectedDate.getTime() - Date.now();

    if (delta <= 0) {
      resetCountdown();
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    updateTimer(convertMs(delta));
  };

  update();
  intervalId = setInterval(update, 1000);
}

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (!pickedDate || pickedDate.getTime() <= Date.now()) {
      refs.startBtn.disabled = true;
      showAlert('Please choose a date in the future');
      return;
    }

    selectedDate = pickedDate;
    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', onStartClick);
updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
