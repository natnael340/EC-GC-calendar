const date = new Date();
let month = date.getMonth() + 1, year = date.getFullYear(), week = date.getDay() == 0 ? 7 : date.getDay(), day = date.getDate();

const year_e = document.getElementById('year_e').children[0];
const months_e = document.getElementById('months');
const years_e = document.getElementById('years');
const month_e = document.getElementById('month_e');
const weeks_e = document.getElementsByClassName('weekdays')[0];
const days_e = document.getElementsByClassName('days')[0];
const EC_months = {
  1: "Meskerem ",
  2: "Tikimt ",
  3: "Hidar ",
  4: "Tahsas ",
  5: "Tir ",
  6: "Yekatit ",
  7: "Megabit ",
  8: "Meyazya ",
  9: "Ginbot ",
  10: "Sene ",
  11: "Hamle ",
  12: "Nehase ",
  13: "Pagume "
}
const EC_days = {
  1: "ሰኞ",
  2: "ማክሰኞ",
  3: "ሮብ",
  4: "ኀሙስ",
  5: "ዐርብ",
  6: "ቅዳሜ",
  7: "እሑድ"
}

const GC_days = {
  1: "Mo",
  2: "Tu",
  3: "We",
  4: "Th",
  5: "Fr",
  6: "Sa",
  7: "Su"
}
const GC_years = [2022, 2023];
const GC_dates = {
  1: {
    name: "January",
    days: 31
  },
  2: {
    name: "February",
    days: date.getFullYear() % 4 == 0 ? 29 : 28
  },
  3: {
    name: "March",
    days: 31
  },
  4: {
    name: "April",
    days: 30
  },
  5: {
    name: "May",
    days: 31
  },
  6: {
    name: "June",
    days: 30
  },
  7: {
    name: "July",
    days: 31
  },
  8: {
    name: "August",
    days: 31
  },
  9: {
    name: "September",
    days: 31
  },
  10: {
    name: "October",
    days: 31
  },
  11: {
    name: "November",
    days: 30
  },
  12: {
    name: "December",
    days: 31
  },
}
const set_date = (day, month, year) => {
  const input = document.getElementsByTagName("input")[0];
  input.value = `${day}/${month}/${year}`;
}
set_date(day, month, year);
const fill_date = () => {
  days_e.innerHTML = '';
  weeks_e.innerHTML = '';
  months_e.innerHTML = '';
  years_e.innerHTML = '';
  for (i in GC_years) {
    let y = document.createElement('li');
    y.onclick = (e) => selectYear(1, e.target.innerText);
    y.innerText = GC_years[i];
    years_e.appendChild(y);
  }
  year_e.innerText = year
  month_e.innerText = GC_dates[month].name
  for (i in GC_dates) {
    let m = document.createElement('li');
    if(i < date.getMonth()+1){
      m.style.cursor = 'auto'
    }
    m.onclick = function(e) { selectMonth(1, e.target.innerText) }
    m.innerText = GC_dates[i].name
    months_e.appendChild(m);
  }
  for (i in GC_days) {
    let n = document.createElement('li');
    n.innerText = GC_days[i]
    weeks_e.appendChild(n);
  }
  let days_start = (new Date(`${GC_dates[date.getMonth()].name} 1`)).getDay()
  days_start = days_start == 0 ? 7 : days_start;
  let j = 1;
  while (j <= GC_dates[date.getMonth() + 1].days + days_start) {
    let node = document.createElement('li')
    if (j <= days_start) {
      days_e.append(node)
      j++;
    }
    else {
      if (j - days_start < date.getDate()) {
        node.style.color = "#bbb"
        node.style.cursor = "auto"
      }
      else {
        node.style.cursor = "pointer"
        node.onclick = (e) => selectDay(e.target.innerText)
      }
      if (j - days_start == day) {
        node.classList.add('active')
      }
      node.innerText = j - days_start
      days_e.append(node)
      j++;
    }
  }

}
const enableMonth = (c) => {
  const calander = document.getElementById('calander');
  if (c) {
    fill_date()
    calander.style.display = 'block'
  }
  else {
    calander.style.display = 'none';
    months_e.style.display = 'none';
    years_e.style.display = 'none';
  }

}
const selectMonth = (e, c) => {
  if (c) {
    for (i in GC_dates) {
      if (GC_dates[i].name == c) {
        month = i;
        month_e.innerText = c;
      };
    }
    months_e.style.display = 'none';
    return;
  }
  if (e) {
    selectYear();
    months_e.style.display = 'block';
  }
  else
    months_e.style.display = 'none';

}
const selectYear = (e, c) => {
  if (c) {
    year = c;
    year_e.innerHTML = c;
    years_e.style.display = 'none';
    return;
  }
  if (e) {
    selectMonth();
    years_e.style.display = 'block';
  }
  else
    years_e.style.display = 'none';
}
const selectDay = (d) => {
  day = d;
  set_date(day, month, year);
  enableMonth(false)
}
