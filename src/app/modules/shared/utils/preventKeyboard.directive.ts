import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[preventKeyboard]'
})
export class PreventKeyboardDirective {
  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
