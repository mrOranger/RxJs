import { Directive, HostListener, Input } from '@angular/core';
import { StoreUserTypeService } from '../services';
import { UserType } from '../enums';

@Directive({ selector: '[appTmRadio]' })
export class UserTypeDirective {
      @Input() public type!: UserType;

      public constructor(
            private readonly storeUserTypeService: StoreUserTypeService
      ) {}

      @HostListener('click', ['$event'])
      public onClick() {
            this.storeUserTypeService.value = this.type;
      }
}
