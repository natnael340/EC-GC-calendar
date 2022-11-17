class CalanderConverter {
  JD_EPOCH_OFFSET_AMETE_ALEM = -285019;
  JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856;
  JD_EPOCH_OFFSET_COPTIC = 1824665;
  JD_EPOCH_OFFSET_GREGORIAN = 1721426;
  JD_EPOCH_OFFSET_UNSET = -1;

  jdOffset = -1;

  year = -1;
  month = -1;
  day = -1;
  dateIsUnset = true;
  constructor() { }

  set(year, month, day, era) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.setEra(era);
    this.dateIsUnset = false;
  }
  set(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.dateIsUnset = false;
  }

  getDay() { return this.day; }
  getMonth() { return this.month; }
  getYear() { return this.year; }
  getEra() { return this.jdOffset; }
  getDate() {
    return [this.year, this.month, this.day, this.jdOffset];
  }
  setEra(era) {
    if ((this.JD_EPOCH_OFFSET_AMETE_ALEM == era)
      || (this.JD_EPOCH_OFFSET_AMETE_MIHRET == era)) {
      this.jdOffset = era;
    }
    else {
      throw "Unknown era: " + era;
    }
  }
  isEraSet() {
    return this.JD_EPOCH_OFFSET_UNSET == this.jdOffset ? false : true;
  }

  unsetEra() {
    jdOffset = this.JD_EPOCH_OFFSET_UNSET;
  }

  unset() {
    unsetEra();
    this.year = -1;
    this.month = -1;
    this.day = -1;
    this.dateIsUnset = true;
  }

  isDateSet() {
    return this.dateIsUnset ? false : true;
  }
  ethiopicToGregorian(era) {
    if (!this.isDateSet()) {
      throw "Unset date.";
    }
    return ethiopicToGregorian(this.year, this.month, this.day, era);
  }
  ethiopicToGregorian(year, month, day, era) {
    this.setEra(era);
    date = this.ethiopicToGregorian(year, month, day);
    this.unsetEra();
    return date;
  }

  ethiopicToGregorian() {
    if (this.dateIsUnset) {
      throw "Unset date.";
    }
    return this.ethiopicToGregorian(this.year, this.month, this.day);
  }
  ethiopicToGregorian(year, month, day) {
    if (!this.isEraSet()) {
      if (year <= 0) {
        this.setEra(this.JD_EPOCH_OFFSET_AMETE_ALEM);
      }
      else {
        this.setEra(this.JD_EPOCH_OFFSET_AMETE_MIHRET);
      }
    }

    let jdn = this.ethiopicToJDN(year, month, day);
    return this.jdnToGregorian(jdn);
  }

  gregorianToEthiopic() {
    if (this.dateIsUnset) {
      throw "Unset date.";
    }
    return this.gregorianToEthiopic(this.year, this.month, this.day);
  }
  gregorianToEthiopic(year, month, day) {
    let jdn = this.gregorianToJDN(year, month, day);

    return this.jdnToEthiopic(jdn, this.guessEraFromJDN(jdn));
  }
  nMonths = 12;

  monthDays = [
    0,
    31, 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31
  ];

  quotient(i, j) {
    return parseInt(Math.floor(parseFloat(i) / j));
  }

  mod(i, j) {
    return parseInt(i - (j * this.quotient(i, j)));
  }

  guessEraFromJDN(jdn) {
    return (jdn >= (this.JD_EPOCH_OFFSET_AMETE_MIHRET + 365))
      ? this.JD_EPOCH_OFFSET_AMETE_MIHRET
      : this.JD_EPOCH_OFFSET_AMETE_ALEM
      ;
  }

  isGregorianLeap(year) {
    return (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0));
  }

  jdnToGregorian(j) {
    let r2000 = this.mod((j - this.JD_EPOCH_OFFSET_GREGORIAN), 730485);
    let r400 = this.mod((j - this.JD_EPOCH_OFFSET_GREGORIAN), 146097);
    let r100 = this.mod(r400, 36524);
    let r4 = this.mod(r100, 1461);

    let n = this.mod(r4, 365) + 365 * this.quotient(r4, 1460);
    let s = this.quotient(r4, 1095);


    let aprime = 400 * this.quotient((j - this.JD_EPOCH_OFFSET_GREGORIAN), 146097)
      + 100 * this.quotient(r400, 36524)
      + 4 * this.quotient(r100, 1461)
      + this.quotient(r4, 365)
      - this.quotient(r4, 1460)
      - this.quotient(r2000, 730484)
      ;
    let year = aprime + 1;
    let t = this.quotient((364 + s - n), 306);
    let month = t * (this.quotient(n, 31) + 1) + (1 - t) * (this.quotient((5 * (n - s) + 13), 153) + 1);
    /*
    int day    = t * ( n - s - 31*month + 32 )
               + ( 1 - t ) * ( n - s - 30*month - this.quotient((3*month - 2), 5) + 33 )
    ;
    */

    // int n2000 = this.quotient( r2000, 730484 );
    n += 1 - this.quotient(r2000, 730484);
    let day = n;


    if ((r100 == 0) && (n == 0) && (r400 != 0)) {
      month = 12;
      day = 31;
    }
    else {
      this.monthDays[2] = (this.isGregorianLeap(year)) ? 29 : 28;
      for (let i = 1; i <= this.nMonths; ++i) {
        if (n <= this.monthDays[i]) {
          day = n;
          break;
        }
        n -= this.monthDays[i];
      }
    }

    let out = [year, month, day];

    return out;
  }

  gregorianToJDN(year, month, day) {
    let s = this.quotient(year, 4)
      - this.quotient(year - 1, 4)
      - this.quotient(year, 100)
      + this.quotient(year - 1, 100)
      + this.quotient(year, 400)
      - this.quotient(year - 1, 400)
      ;

    let t = this.quotient(14 - month, 12);

    let n = 31 * t * (month - 1)
      + (1 - t) * (59 + s + 30 * (month - 3) + this.quotient((3 * month - 7), 5))
      + day - 1
      ;

    let j = this.JD_EPOCH_OFFSET_GREGORIAN
      + 365 * (year - 1)
      + this.quotient(year - 1, 4)
      - this.quotient(year - 1, 100)
      + this.quotient(year - 1, 400)
      + n
      ;

    return j;
  }

  jdnToEthiopic(jdn) {
    return (this.isEraSet())
      ? this.jdnToEthiopic(jdn, jdOffset)
      : this.jdnToEthiopic(jdn, this.guessEraFromJDN(jdn))
      ;
  }
  jdnToEthiopic(jdn, era) {
    let r = this.mod((jdn - era), 1461);
    let n = this.mod(r, 365) + 365 * this.quotient(r, 1460);

    let year = 4 * this.quotient((jdn - era), 1461)
      + this.quotient(r, 365)
      - this.quotient(r, 1460)
      ;
    let month = this.quotient(n, 30) + 1;
    let day = this.mod(n, 30) + 1;

    return [year, month, day];
  }

  ethiopicToJDN() {
    if (dateIsUnset) {
      throw "Unset date.";
    }
    return ethiopicToJDN(this.year, this.month, this.day);
  }
  ethCopticToJDN(year, month, day, era) {
    let jdn = (era + 365)
      + 365 * (year - 1)
      + this.quotient(year, 4)
      + 30 * month
      + day - 31
      ;

    return jdn;
  }
  ethiopicToJDN(year, month, day, era) {
    if (year && !month && !day && !era)
      return this.ethiopicToJDN(this.year, this.month, this.day, year);
    else if (year && month && day && !era) {
      return (this.isEraSet())
        ? this.ethCopticToJDN(year, month, day, this.jdOffset)
        : this.ethCopticToJDN(year, month, day, this.JD_EPOCH_OFFSET_AMETE_MIHRET)
        ;
    }
    else
      return this.ethCopticToJDN(year, month, day, era);
  }


}