export function parseFinnishDate(str) {
  const finnishMonths = {
    tammikuuta: 0,
    helmikuuta: 1,
    maaliskuuta: 2,
    huhtikuuta: 3,
    toukokuuta: 4,
    kesäkuuta: 5,
    heinäkuuta: 6,
    elokuuta: 7,
    syyskuuta: 8,
    lokakuuta: 9,
    marraskuuta: 10,
    joulukuuta: 11,
  };

  const regex = /(\d{1,2})\.\s+(\w+)/;
  const match = str.match(regex);

  if (!match) return null;

  const day = parseInt(match[1], 10);
  const monthName = match[2];
  const month = finnishMonths[monthName];
  const year = new Date().getFullYear(); // Or specify a year

  if (month === undefined) return null;

  return new Date(year, month, day);
}
