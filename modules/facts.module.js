import axios from 'axios';
export async function getInterestingFact() {
  const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=ru');
  return response.data;
}
