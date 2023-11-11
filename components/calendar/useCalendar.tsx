export const useCalendar = () => {
  // Função para obter os dias de um determinado mês
  function getDaysInMonth(year: any, month: any) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Função para obter um array de objetos com os dias de cada mês
  function getCalendarData() {
    var today: any = new Date();
    var currentYear: any = today.getFullYear();
    var currentMonth: any = today.getMonth();

    var calendarData = [];

    // Mês anterior
    var previousMonth = currentMonth - 1;
    var previousMonthYear = currentYear;
    if (previousMonth < 0) {
      previousMonth = 11; // Dezembro
      previousMonthYear--;
    }
    var previousMonthDays: any = getDaysInMonth(
      previousMonthYear,
      previousMonth
    );
    var previousMonthData: any = {
      month: getMonthName(previousMonth),
      year: previousMonthYear,
      days: [],
    };
    for (var i = 1; i <= previousMonthDays; i++) {
      previousMonthData.days.push(
        new Date(previousMonthYear, previousMonth, i)
      );
    }
    calendarData.push(previousMonthData);

    // Mês atual
    var currentMonthDays: any = getDaysInMonth(currentYear, currentMonth);
    var currentMonthData: any = {
      month: getMonthName(currentMonth),
      year: currentYear,
      days: [],
    };
    for (var j = 1; j <= currentMonthDays; j++) {
      currentMonthData.days.push(new Date(currentYear, currentMonth, j));
    }
    calendarData.push(currentMonthData);

    // Mês seguinte
    var nextMonth = currentMonth + 1;
    var nextMonthYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0; // Janeiro
      nextMonthYear++;
    }
    var nextMonthDays: any = getDaysInMonth(nextMonthYear, nextMonth);
    var nextMonthData: any = {
      month: getMonthName(nextMonth),
      year: nextMonthYear,
      days: [],
    };
    for (var k = 1; k <= nextMonthDays; k++) {
      nextMonthData.days.push(new Date(nextMonthYear, nextMonth, k));
    }
    calendarData.push(nextMonthData);

    return calendarData;
  }

  // Função para obter o nome do mês
  function getMonthName(monthIndex: any) {
    var monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return monthNames[monthIndex];
  }

  // Uso da função para obter os dados do calendário
  var calendarData = getCalendarData();

  // Exemplo de como acessar os dados do calendário
  // calendarData.forEach(function (monthData) {
  //   monthData.days.forEach(function (day: any) {
  //     console.log(day.toDateString());
  //   });
  // });

  // // Função para criar a timeline com as horas
  // function createTimeline() {
  //     var hoursList = document.querySelector('.hours');

  //     for (var i = 0; i < 24; i++) {
  //         var hour = i < 10 ? '0' + i : i; // Formata a hora com dois dígitos
  //         var li = document.createElement('li');
  //         li.textContent = hour + ':00';
  //         hoursList.appendChild(li);
  //     }
  // }

  // // Chamada da função para criar a timeline
  // createTimeline();

  return {
    calendarData,
    getMonthName,
    getCalendarData,
    getDaysInMonth,
  };
};
