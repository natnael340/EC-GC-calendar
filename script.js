const date = new Date();
let month = date.getMonth() + 1,
  year = date.getFullYear(),
  week = date.getDay() == 0 ? 7 : date.getDay(),
  day = date.getDate();
document.getElementsByTagName("input")[1].checked = false;
const year_e = document.getElementById("year_e").children[0];
const months_e = document.getElementById("months");
const years_e = document.getElementById("years");
const month_e = document.getElementById("month_e");
const weeks_e = document.getElementsByClassName("weekdays")[0];
const days_e = document.getElementsByClassName("days")[0];
let ctype = "GC";
const EC_months = {
  1: "Meskerem",
  2: "Tikimt",
  3: "Hidar",
  4: "Tahsas",
  5: "Tir",
  6: "Yekatit",
  7: "Megabit",
  8: "Meyazya",
  9: "Ginbot",
  10: "Sene",
  11: "Hamle",
  12: "Nehase",
  13: "Pagume",
};
const EC_days = {
  1: "ሰኞ",
  2: "ማክሰኞ",
  3: "ሮብ",
  4: "ኀሙስ",
  5: "ዐርብ",
  6: "ቅዳሜ",
  7: "እሑድ",
};

const GC_days = {
  1: "Mo",
  2: "Tu",
  3: "We",
  4: "Th",
  5: "Fr",
  6: "Sa",
  7: "Su",
};

const GC_years = [2022, 2023];
const EC_years = [2015, 2016];

const GC_dates = {
  1: {
    name: "January",
    days: 31,
  },
  2: {
    name: "February",
    days: date.getFullYear() % 4 == 0 ? 29 : 28,
  },
  3: {
    name: "March",
    days: 31,
  },
  4: {
    name: "April",
    days: 30,
  },
  5: {
    name: "May",
    days: 31,
  },
  6: {
    name: "June",
    days: 30,
  },
  7: {
    name: "July",
    days: 31,
  },
  8: {
    name: "August",
    days: 31,
  },
  9: {
    name: "September",
    days: 31,
  },
  10: {
    name: "October",
    days: 31,
  },
  11: {
    name: "November",
    days: 30,
  },
  12: {
    name: "December",
    days: 31,
  },
};
const month_diff = [10, 10, 9, 9, 8, 7, 9, 8, 8, 7, 7, 9];
const set_date = (day, month, year) => {
  const input = document.getElementsByTagName("input")[0];
  input.value = `${day}/${month}/${year}`;
};
set_date(day, month, year);

const gc_to_ec = (d, m, y) => {
  let month_et, year_et;
  let diff = month_diff[m + 4 >= 12 ? m + 4 - 12 : m + 4];
  let day_et = d - diff;
  if (day_et < 0) {
    month_et = m - 7;
    day_et = 30 + day_et;
  } else month_et = m - 8;
  if (month_et < 0) {
    month_et = month_et + 13;
    year_et = y - 8;
  } else year_et = y - 7;
  return [day_et, month_et, year_et];
};
const ec_to_gc = (d, m, y) => {
  let mg, yg, dg;
  let diff = month_diff[m];
  console.log(diff);
  dg = d + diff;
  if (m + 8 > 12) {
    if (dg > GC_dates[m - 4].days) {
      mg = m - 3;
      dg = dg - GC_dates[m - 4].days;
    } else {
      mg = m - 4;
    }
    yg = y + 8;
  } else if (m + 8 == 12) {
    if (dg > GC_dates[m + 8].days) {
      mg = 1;
      dg = dg - GC_dates[12].days;
      yg = y + 8;
    } else {
      mg = m + 8;
      yg = y + 7;
    }
  } else {
    if (dg > GC_dates[m + 8].days) {
      mg = m + 9;
      dg = dg - GC_dates[m + 8].days;
    } else mg = m + 8;
    yg = y + 7;
  }

  return [dg, mg, yg];
};
const fill_date = () => {
  days_e.innerHTML = "";
  weeks_e.innerHTML = "";
  months_e.innerHTML = "";
  years_e.innerHTML = "";
  if (ctype == "GC") {
    for (i in GC_years) {
      let y = document.createElement("li");
      y.onclick = (e) => selectYear(1, e.target.innerText);
      y.innerText = GC_years[i];
      years_e.appendChild(y);
    }
    year_e.innerText = year;
    month_e.innerText = GC_dates[month].name;
    for (i in GC_dates) {
      let m = document.createElement("li");
      if (i < date.getMonth() + 1) {
        m.style.cursor = "auto";
      }
      m.onclick = function (e) {
        selectMonth(1, e.target.innerText);
      };
      m.innerText = GC_dates[i].name;
      months_e.appendChild(m);
    }
    for (i in GC_days) {
      let n = document.createElement("li");
      n.innerText = GC_days[i];
      weeks_e.appendChild(n);
    }
    console.log(year, month);
    let days_start = new Date(year, month - 1, 1).getDay();
    days_start = days_start == 0 ? 7 : days_start;
    let j = 1;
    console.log(days_start);
    while (j <= GC_dates[date.getMonth() + 1].days + days_start) {
      console.log("here");
      let node = document.createElement("li");
      if (j < days_start) {
        days_e.append(node);
        j++;
      } else {
        if (j - days_start + 1 < date.getDate()) {
          node.style.color = "#bbb";
          node.style.cursor = "auto";
        } else {
          node.style.cursor = "pointer";
          node.onclick = (e) => selectDay(e.target.innerText);
        }
        if (j - days_start + 1 == day) {
          node.classList.add("active");
        }
        node.innerText = j - days_start + 1;
        days_e.append(node);
        j++;
      }
    }
  } else {
    //let day_et, month_et, year_et = gc_to_ec();
    for (i in EC_years) {
      let y = document.createElement("li");
      y.onclick = (e) => selectYear(1, e.target.innerText);
      y.innerText = EC_years[i];
      years_e.appendChild(y);
    }
    year_e.innerText = year;
    console.log(month);
    month_e.innerText = EC_months[month];
    for (i in EC_months) {
      let m = document.createElement("li");
      if (
        i < gc_to_ec(date.getDate(), date.getMonth() + 1, date.getFullYear())[1]
      ) {
        m.style.cursor = "auto";
      }
      m.onclick = function (e) {
        selectMonth(1, e.target.innerText);
      };
      m.innerText = EC_months[i];
      months_e.appendChild(m);
    }
    for (i in EC_days) {
      let n = document.createElement("li");
      n.innerText = EC_days[i];
      weeks_e.appendChild(n);
    }
    let [gd, gm, gy] = ec_to_gc(1, month, year);
    let days_start = new Date(gy, gm - 1, gd).getDay();
    days_start = days_start == 0 ? 7 : days_start;
    let j = 1;
    console.log(days_start);
    while (j <= 30 + days_start) {
      console.log("here");
      let node = document.createElement("li");
      if (j < days_start) {
        days_e.append(node);
        j++;
      } else {
        if (
          j - days_start + 1 <
          gc_to_ec(date.getDate(), date.getMonth() + 1, date.getFullYear())[0]
        ) {
          node.style.color = "#bbb";
          node.style.cursor = "auto";
        } else {
          node.style.cursor = "pointer";
          node.onclick = (e) => selectDay(e.target.innerText);
        }
        if (j - days_start + 1 == day) {
          node.classList.add("active");
        }
        node.innerText = j - days_start + 1;
        days_e.append(node);
        j++;
      }
    }
  }
};
const enableMonth = (c) => {
  const calander = document.getElementById("calander");
  if (c) {
    fill_date();
    calander.style.display = "block";
  } else {
    calander.style.display = "none";
    months_e.style.display = "none";
    years_e.style.display = "none";
  }
};
const selectMonth = (e, c) => {
  if (c) {
    if (ctype == "GC") {
      for (i in GC_dates) {
        if (GC_dates[i].name == c) {
          month = i;
          month_e.innerText = c;
          fill_date();
        }
      }
    } else {
      for (i in EC_months) {
        console.log(c, EC_months[i], EC_months[i] == c);
        if (EC_months[i] == c) {
          month = i;
          month_e.innerText = c;
          fill_date();
        }
      }
    }

    months_e.style.display = "none";
    return;
  }
  if (e) {
    selectYear();
    months_e.style.display = "block";
  } else months_e.style.display = "none";
};
const selectYear = (e, c) => {
  if (c) {
    fill_date();
    year = c;
    year_e.innerHTML = c;
    years_e.style.display = "none";
    return;
  }
  if (e) {
    selectMonth();
    years_e.style.display = "block";
  } else years_e.style.display = "none";
};
const selectDay = (d) => {
  day = d;
  set_date(day, month, year);
  enableMonth(false);
};
const toggleCalander = (a) => {
  if (a.checked) {
    let [d, m, y] = gc_to_ec(day, month, year);
    day = d;
    month = m;
    year = y;
    ctype = "EC";
    fill_date();
  } else {
    let [d, m, y] = ec_to_gc(day, month, year);
    day = d;
    month = m;
    year = y;
    ctype = "GC";
    fill_date();
  }
};
