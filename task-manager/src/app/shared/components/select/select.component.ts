import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-select',
      templateUrl: './select.component.html',
      styleUrls: ['./select.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [FormsModule, ReactiveFormsModule, NgFor],
      providers: [
            {
                  multi: true,
                  provide: NG_VALUE_ACCESSOR,
                  useExisting: SelectComponent,
            },
      ],
})
export class SelectComponent<T> implements ControlValueAccessor {
      @Input() public values!: T[];
      @Input() public key!: keyof T;
      @Input() public isDisabled: boolean;
      @Input() public displayValues!: (keyof T)[];
      @Input() public emptySelectionLabel?: string;

      public selectedValue: T | null;
      public onTouched?: () => void;
      public onChange?: (selectedValue: T) => void;

      public constructor() {
            this.isDisabled = false;
            this.selectedValue = null;
            this.emptySelectionLabel = 'Select a value';
      }

      public getItemPlaceholder(item: T) {
            let placholder = '';
            for (const key in (item)) {
                  if (this.displayValues.includes(key)) {
                        placholder = `${placholder} ${item[key] as string}`;
                  }
            }
            return placholder.trim();
      }

      public writeValue(newValue: T): void {
            this.selectedValue = newValue;
      }

      public registerOnChange(fn: (selectedValue: T) => void): void {
            this.onChange = fn;
      }

      public registerOnTouched(fn: () => void): void {
            this.onTouched = fn;
      }

      public setDisabledState?(isDisabled: boolean): void {
            this.isDisabled = isDisabled;
      }

      public onSelectChange(value: T) {
            this.selectedValue = value;
            this.onChange?.(value);
      }
}
