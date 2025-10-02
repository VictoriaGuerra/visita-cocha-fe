import { Pipe, PipeTransform } from '@angular/core';
import { dayNames } from '../enums/day.enum';

@Pipe({
  name: 'dayNamePipe'
})
export class dayNamePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'monday':
        return dayNames.monday;

      case 'tuesday':
        return dayNames.tuesday;

      case 'wednesday':
        return dayNames.wednesday;

      case 'thursday':
        return dayNames.thursday;

      case 'friday':
          return dayNames.friday;

      case 'saturday':
          return dayNames.saturday;

      case 'sunday':
          return dayNames.sunday;

      default:
        return value;
    }
  }
}
