/**
 * @type {Map<Number, Object>}
 * 
 */
const INDEX = new Map();
/**
 * @name Gregorian
 * @desc 
 * 
*/
//========================================================================
// #region - GREGOR.
//========================================================================
INDEX.set(0, {
    calendarID: 0,
    name: "Gregorian",
    desc: "The Gregorian calendar is the calendar used in most parts of Terra"
    + " throughout the 2nd and 3rd millennia, issued by Pope Gregory XIII"
    + " in October 1582 A.D.;" 
    + " cit. https://en.wikipedia.org/wiki/Gregorian_calendar 2026",
    days: 365.25,
    months: {
        January: 31,
        February: 28,
        March: 31,
        April: 30,
        May: 30,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31
    },
    leapMonth: 2,
    leapYear: 4,
    dayLength: 24,
    epochYear: 1970
});
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = INDEX;