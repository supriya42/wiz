import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contact'
})
export class ContactPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
