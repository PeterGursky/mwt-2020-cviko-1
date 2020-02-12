import * as _ from "lodash";

export interface Country {
  name: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: Language[];
  currencies: Currency[];
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

class CurrencyOccurence {
  constructor(public currency: string, public countries: string[], public count: number) {}
}

interface Language {
  iso639_1: string;
  iso639_2: string;
  name: string;
  nativeName: string;
}

export class Conversions {
  /*
  Vráťte pole s názvami všetkých krajín.
  */
  static exercise1(countries: Country[]): string[] {
    return countries.map(country => country.name);
  }

  /*
  Vráťte pole s názvami európskych krajín.
  */
  static exercise2(countries: Country[]): string[] {
    return countries.filter(country => country.region === "Europe").map(country => country.name);
  }

  /*
  Vráťte pole objektov s vlastnosťami name a area, popisujúce krajiny s počtom obyvateľov 
  nad 100 miliónov, teda:

  [ { name: 'Bangladesh', area: '147570 km2' },
  { name: 'Brazil', area: '8515767 km2' },
  { name: 'China', area: '9640011 km2' },
  ... ]
  */
  static exercise3(countries: Country[]): { name: string; area: string }[] {
    return countries
      .filter(country => country.population > 100000000)
      .map(({ name, area }) => ({ name, area: area + " km2" }));
  }

  /*
  Vráťte pole všetkých jazykov, ktoré sa používajú Južnej Amerike bez duplicít, teda:

[ { iso639_1: 'es', iso639_2: 'spa', name: 'Spanish', nativeName: 'Español' },
  { iso639_1: 'gn', iso639_2: 'grn', name: 'Guaraní', nativeName: "Avañe'ẽ" },
  { iso639_1: 'ay', iso639_2: 'aym', name: 'Aymara', nativeName: 'aymar aru'},
  ...   ]
  */
  static exercise4(countries: Country[]): Array<Language> {
    return countries
      .filter(country => country.subregion === "South America")
      .map(country => country.languages)
      .flat()
      .reduce((acc, lang) => {
        return acc.some(langFromAcc => lang.name === langFromAcc.name) ? acc : [...acc, lang];
      }, []);
  }

  /*
  Vráťte objekt, kde vlastnosti sú jazyky z Južnej Ameriky a ich hodnotami polia krajín 
  z Južnej Ameriky, v ktorých sa nimi hovorí, teda:

  {
    Spanish: ['Argentina', 'Bolivia (Plurinational State of)', 'Chile',...],
    Portuguese: [ 'Brazil' ],
    English: [ 'Falkland Islands (Malvinas)', 'Guyana',...],
    ...   
  }
  */
  static exercise5(countries: Country[]): { [key: string]: string[] } {
    const addCountry = (languages: Language[], countryName: string) => {
      return languages.map(lang => ({ language: lang.name, country: countryName }));
    };

    return countries
      .filter(country => country.subregion === "South America")
      .map(country => addCountry(country.languages, country.name))
      .flat()
      .reduce((acc, pair) => {
        return { ...acc, [pair.language]: [...(acc[pair.language] || []), pair.country] };
      }, {});
  }

  /*
  Vráťte pole objektov s dvoma vlastnosťami, jazyk z Južnej Ameriky a krajiny z Južnej Ameriky,
  v ktorých sa ním hovorí, teda:

  [  { language: 'Spanish', countries: ['Argentina', 'Bolivia (Plurinational State of)', 'Chile',...]},
     { language: 'Portuguese', countries: [ 'Brazil' ]},
     { language: 'English', countries: [ 'Falkland Islands (Malvinas)', 'Guyana',...]},
     ...   
  ]
  */
  static exercise6(countries: Country[]) {
    return Object.entries(Conversions.exercise5(countries)).map(
      //   pair => ({
      //   language: pair[0],
      //   countries: pair[1]
      // })
      ([language, countries]) => ({ language, countries })
    );
  }

  /*
  [ { currency: 'New Zealand dollar',"
    countries: [ 'Cook Islands', 'New Zealand', 'Niue', 'Pitcairn', 'Tokelau' ],
    count: 5 },
  { currency: 'Central African CFA franc',
    countries: ['Cameroon', 'Central African Republic', 'Chad', 'Congo', 'Equatorial Guinea', 'Gabon'],
    count: 6 },
      ...   ]
  */
  static exercise7(countries: Country[]) {
    const addCountry = (currencies: Currency[], countryName: string) => {
      return currencies.map(currency => ({ currency: currency.name, country: countryName }));
    };

    const getCurrencyAndCountryArray = (
      countries: Country[]
    ): { currency: string; country: string }[] => {
      return countries.flatMap(country => addCountry(country.currencies, country.name));
    };

    const combineCoutries = (
      input: { currency: string; country: string }[]
    ): { [key: string]: string[] } => {
      return input.reduce((acc, { currency, country }) => {
        return {
          ...acc,
          [currency]: acc[currency] ? [...acc[currency], country] : [country]
        };
      }, {});
    };

    const getArrayOfCurrencyOccurence = (input: {
      [key: string]: string[];
    }): CurrencyOccurence[] => {
      return Object.entries(input).map(
        ([currency, countries]) => new CurrencyOccurence(currency, countries, countries.length)
      );
    };

    const filterFivePlus = (input: CurrencyOccurence[]): CurrencyOccurence[] => {
      return input.filter(({ count }) => count >= 5);
    };

    const sortArray = (input: CurrencyOccurence[]): CurrencyOccurence[] => {
      return input.sort((a, b) => a.count - b.count);
    };

    const pipe = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

    return pipe(
      getCurrencyAndCountryArray,
      combineCoutries,
      getArrayOfCurrencyOccurence,
      filterFivePlus,
      sortArray
    )(countries);
    // return _.flow([
    //   getCurrencyAndCoutryArray,
    //   combineCoutries,
    //   getArrayOfCurrencyOccurence,
    //   filterFivePlus,
    //   sortArray
    // ])(countries);
  }
}
