export interface Country {
  name: string;
  region: string;
  population: number;
  area: number;
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
}
