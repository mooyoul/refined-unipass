import * as dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export { dayjs };

export function format(date: Date, template: string): string {
  return dayjs(date).format(template);
}
