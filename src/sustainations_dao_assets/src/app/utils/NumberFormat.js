import { replace } from 'lodash';
import numeral from 'numeral';
import moment from "moment";
import NumberFormat from 'react-number-format';

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

export function fDate(number, format) {
  return moment.unix(parseInt(number / BigInt(1e9))).format(format)
}

export function fICP(amount) {
  return (
    <NumberFormat
      value={parseInt(amount) / 1e8} displayType={'text'}
      thousandSeparator={true} suffix={' ICP'}
    />
  );
}