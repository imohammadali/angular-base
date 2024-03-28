import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'summery'
})

export class SummeryPipe implements PipeTransform {
  transform(value: string, limit?: number): any {
    if (!value) {
      return null
    }
    let actualLimit = (limit) ? limit : 15;
    if (value.length > actualLimit) {
      return value.substr(0, actualLimit) + " ...";
    }
    return value
  }
}
