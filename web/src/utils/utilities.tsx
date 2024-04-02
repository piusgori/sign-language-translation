import numeral from 'numeral';

export const formatNumber = (input: number) => {
    return `KSH ${input.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function result(format?: any, key = '.00') {
    const isInteger = format.includes(key);
    return isInteger ? format.replace(key, '') : format;
  }

export function fData(number: number) {
    const format = number ? numeral(number).format('0.0 b') : '';
    return result(format, '.0');
};

export const noOfDays = (first: Date, second: Date) => {        
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}