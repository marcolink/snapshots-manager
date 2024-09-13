export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(Math.abs(num));

  const belowTwenty: string[] = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens: string[] = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
  const thousands: string[] = ['', 'thousand', 'million', 'billion', 'trillion'];

  let word: string = '';
  let i = 0;

  while (num > 0) {
    const rem = num % 1000;
    if (rem !== 0) {
      word = helper(rem) + (thousands[i] ? ' ' + thousands[i] : '') + ' ' + word;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return word.trim();

  function helper(n: number): string {
    if (n === 0) return '';
    else if (n < 20) return belowTwenty[n];
    else if (n < 100) {
      let hyphenated = tens[Math.floor(n / 10)];
      if (n % 10 !== 0) {
        hyphenated += '-' + belowTwenty[n % 10];
      }
      return hyphenated;
    } else {
      let result = belowTwenty[Math.floor(n / 100)] + ' hundred';
      const rest = n % 100;
      if (rest !== 0) {
        result += ' ' + helper(rest);
      }
      return result;
    }
  }
}
