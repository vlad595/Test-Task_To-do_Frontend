import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatPipe',
  standalone: true
})
export class DateFormatPipePipe implements PipeTransform {
  transform(date: string | null | undefined): string {
    if (!date) return '';
    const targetDate = new Date(date);
    const today = new Date();

    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < -8 && diffDays >= -32) return 'Last month'

    if (diffDays < -1 && diffDays >= -8) return 'Last week';

    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === 2) return 'The day after tomorrow';
    
    if (diffDays > 2 && diffDays <= 7){
      return 'Next week';
    }
    if (diffDays > 7 && diffDays <= 31) return 'Next month';

    return targetDate.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
