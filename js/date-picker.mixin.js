﻿//для вызова событий календаря
let datepickerCalendar = '';
let weekPicker = '';
let days_view = '';
let iteration = 1;
let col = 1;
let changeWeek = '';
document.addEventListener('airCalendarDateChanged', (event) => {
  if (event.detail && event.detail.date) {
    datepickerCalendar.clear({ silent: true });
    datepickerCalendar.selectDate(event.detail.date);
    datepickerCalendar.update();
    wrap_calendar = document.querySelector('.wrap-calendar');
    if (!wrap_calendar.classList.contains('open')) {
      days_view = datepickerCalendar.getViewDates();
      weekPicker();
    }
    // days_view = datepickerCalendar.getViewDates();
    // col = days_view.length / 7;
    //weekPicker();
  }
  console.log('отработал airCalendarDateChanged');
});

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    let currentDates = [];
    var localeEn = {
      days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      today: 'Today',
      clear: 'Clear',
      dateFormat: 'yyyy-MM-dd',
      timeFormat: 'hh:mm aa',
      firstDay: 1,
    };

    datepickerCalendar = new AirDatepicker('#calendar', {
      locale: localeEn,
      inline: true,
      range: true,
      multipleDatesSeparator: ',',
      toggleSelected: true,
      multipleDates: true,
      dynamicRange: false,
      navTitles: {
        days: 'MMMM <div>yyyy</div>',
        months: 'yyyy',
        years: 'yyyy1 - yyyy2',
      },

      onSelect({ date, formattedDate, datepicker }) {
        if (formattedDate.length > 1) {
          currentDates = formattedDate;
        }
        if (formattedDate.length == 1 && currentDates.length > 1) {
          find_index = currentDates.indexOf(formattedDate[0]);
          if (find_index >= 0) {
            //значит есть такая дата в currentDates
            if (find_index == 0) {
              datepickerCalendar.selectDate(currentDates[1]);
              datepickerCalendar.unselectDate(currentDates[0]);
            } else {
              datepickerCalendar.selectDate(currentDates[0]);
              datepickerCalendar.unselectDate(currentDates[1]);
            }
            currentDates = '';
          } else {
            //нет такой даты в currentDates - удаляем из selectDate
            datepickerCalendar.unselectDate(currentDates[0]);
            datepickerCalendar.unselectDate(currentDates[1]);
            //datepickerCalendar.selectDate(formattedDate[0]);
            //datepickerCalendar.selectDate(formattedDate[0], { silent: true });
            currentDates = formattedDate;
          }
        }

        if (date.length >= 2) {
          let dateFrom = datepicker.rangeDateFrom.getDate();
          let dateMothFrom = datepicker.rangeDateFrom.getMonth();
          let dateYearFrom = datepicker.rangeDateFrom.getFullYear();
          day = datepicker.$datepicker.querySelector(
            '.-days- div[data-date="' +
              dateFrom +
              '"][data-month="' +
              dateMothFrom +
              '"][data-year="' +
              dateYearFrom +
              '"]'
          );
        } else {
          datepicker.$datepicker
            .querySelectorAll('.-days- div')
            .forEach((box) => {
              box.classList.remove('-in-range-', '-range-from-', '-range-to-');
            });
        }
        dispatchEvent(
          new CustomEvent('calendarDateUpdated', { detail: formattedDate })
        );
      },
    });
    //datepickerCalendar.clear(); Очищает все выбранные даты.
    //datepickerCalendar.selectDate(date | date[], opts?);Выбирает одну или сразу несколько дат, если передать массив. пример datepickerCalendar.selectDate('2024-12-12');
    document
      .querySelector('.switch_view_calendar')
      .addEventListener('click', (e) => {
        wrap_calendar = document.querySelector('.wrap-calendar');
        if (wrap_calendar.classList.contains('open')) {
          wrap_calendar.classList.remove('open');
          weekPicker();
        } else {
          wrap_calendar.classList.add('open');
          document.querySelectorAll('.-days- .-day-').forEach((box) => {
            box.classList.remove('fadeIn');
            box.classList.add('fadeOut');
            box.classList.add('d-none');
          });
          j = 1;
          document.querySelectorAll('.-days- .-day-').forEach((box) => {
            setTimeout(() => {
              box.classList.remove('fadeOut', 'd-none');
              box.classList.add('fadeIn');
            }, 12 * j);
            j++;
          });
        }
      });

    weekPicker = () => {
      let i = 0;

      days_view = datepickerCalendar.getViewDates();
      let days_current = datepickerCalendar.viewDate;
      let days_selected = datepickerCalendar.selectedDates;
      console.log('days_selected ' + days_selected);

      col = days_view.length / 7; //кол-во строк

      //найдем текущую дату
      for (i = 0; i < days_view.length; i++) {
        formattedDate =
          days_view[i].getFullYear() +
          '-' +
          days_view[i].getMonth() +
          '-' +
          days_view[i].getDate();
        formattedDate_current =
          days_current.getFullYear() +
          '-' +
          days_current.getMonth() +
          '-' +
          days_current.getDate();
        if (formattedDate == formattedDate_current) {
          b = Math.floor(i / 7);
          ost = i / 7;
          if (ost > 0) {
            iteration = b + 1;
          } else {
            iteration = b;
          }
          break;
        }
      }
      //найдем выбранную дату
      if (days_selected.length > 0) {
        for (i = 0; i < days_view.length; i++) {
          formattedDate =
            days_view[i].getFullYear() +
            '-' +
            days_view[i].getMonth() +
            '-' +
            days_view[i].getDate();
          formattedDate_seleted =
            days_selected[0].getFullYear() +
            '-' +
            days_selected[0].getMonth() +
            '-' +
            days_selected[0].getDate();

          if (formattedDate == formattedDate_seleted) {
            b = Math.floor(i / 7);
            ost = i / 7;
            if (ost > 0) {
              iteration = b + 1;
            } else {
              iteration = b;
            }
            break;
          }
        }
      }

      for (i = 0; i < days_view.length; i++) {
        year = days_view[i].getFullYear();
        month = days_view[i].getMonth();
        day = days_view[i].getDate();
        element_day = document.querySelector(
          '.-day-[data-year="' +
            year +
            '"][data-month="' +
            month +
            '"][data-date="' +
            day +
            '"]'
        );
        element_day.classList.remove('fadeIn');
        element_day.classList.add('fadeOut', 'd-none');
      }
      if (iteration == 1) {
        for (i = 0; i < 7; i++) {
          year = days_view[i].getFullYear();
          month = days_view[i].getMonth();
          day = days_view[i].getDate();
          element_day = document.querySelector(
            '.-day-[data-year="' +
              year +
              '"][data-month="' +
              month +
              '"][data-date="' +
              day +
              '"]'
          );
          element_day.classList.remove('fadeOut', 'd-none');
          element_day.classList.add('fadeIn');
        }
      }

      const updateDisplay = () => {
        // console.log('итерация updateDisplay: ' + iteration);
        // console.log('кол-во строк iupdateDisplay: ' + col);
        for (i = 0; i < days_view.length; i++) {
          year = days_view[i].getFullYear();
          month = days_view[i].getMonth();
          day = days_view[i].getDate();
          element_day = document.querySelector(
            '.-day-[data-year="' +
              year +
              '"][data-month="' +
              month +
              '"][data-date="' +
              day +
              '"]'
          );
          element_day.classList.remove('fadeIn');
          element_day.classList.add('fadeOut');
          element_day.classList.add('d-none');
        }

        for (i = iteration * 7 - 7; i < iteration * 7; i++) {
          year = days_view[i].getFullYear();
          month = days_view[i].getMonth();
          day = days_view[i].getDate();
          element_day = document.querySelector(
            '.-day-[data-year="' +
              year +
              '"][data-month="' +
              month +
              '"][data-date="' +
              day +
              '"]'
          );
          element_day.classList.remove('fadeOut');
          element_day.classList.remove('d-none');
          element_day.classList.add('fadeIn');
        }
      };

      changeWeek = (direction) => {
        console.log(direction);
        console.log('итерация была: ' + iteration);
        iteration = iteration + direction;

        console.log('итерация стала: ' + iteration);

        if (iteration < 1) {
          datepickerCalendar.prev();
          days_view = datepickerCalendar.getViewDates();
          iteration = days_view.length / 7;
          col = days_view.length / 7;
          //---
          console.log('итерация iteration < 1:' + iteration);
          console.log('кол-во строк iteration < 1:' + col);
        }
        if (iteration > col) {
          datepickerCalendar.next();
          days_view = datepickerCalendar.getViewDates();
          iteration = 1;
          col = days_view.length / 7;
          //----
          console.log('итерация iteration > col ' + iteration);
          console.log('кол-во строк  iteration > col ' + col);
        }
        updateDisplay();
      };

      updateDisplay();
    };
    document
      .getElementById('prevWeek')
      .addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => {
      changeWeek(1);
      console.log('nextWeek');
    });
    if (document.querySelector('.wrap-calendar').classList.contains('open')) {
      box.classList.remove('fadeOut', 'd-none');
      box.classList.add('fadeIn');
    } else {
      weekPicker();
    }
  }, 50);
});
