import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
      standalone: true,
      selector: 'tm-input',
      templateUrl: './input.component.html',
      styleUrls: ['./input.component.css'],
      imports: [FormsModule],
      providers: [
            {
                  provide: NG_VALUE_ACCESSOR,
                  multi: true,
                  useExisting: InputComponent,
            },
      ],
})
export class InputComponent implements ControlValueAccessor {
      private internalValue: string;
      private onTouched?: () => void;
      private onChange?: (value: string) => void;

      @Input() public type!: string;
      @Input() public name!: string;
      @Input() public label!: string;
      @Input() public disabled: boolean;
      @Input() public placeholder?: string;

      public constructor() {
            this.disabled = false;
            this.internalValue = '';
      }

      public writeValue(value: string): void {
            this.internalValue = value;
      }

      public registerOnChange(onChange: (value: string) => void): void {
            this.onChange = onChange;
      }

      public registerOnTouched(onTouched: any): void {
            this.onTouched = onTouched;
      }

      public setDisabledState?(isDisabled: boolean): void {
            this.disabled = isDisabled;
      }

      public get value() {
            return this.internalValue;
      }

      public set value(value: string) {
            this.internalValue = value;
            this.onChange?.(value);
            this.onTouched?.();
      }
}
