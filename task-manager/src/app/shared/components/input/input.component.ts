import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-input',
      templateUrl: './input.component.html',
      styleUrls: ['./input.component.css'],
      imports: [FormsModule, ReactiveFormsModule, NgIf],
      providers: [
            {
                  provide: NG_VALUE_ACCESSOR,
                  multi: true,
                  useExisting: InputComponent,
            },
      ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
      private internalValue: string;
      private touched: boolean;
      private dirty: boolean;

      private onTouched?: () => void;
      private onChange?: (value: string) => void;

      public control?: NgControl;

      @Input() public type!: string;
      @Input() public name!: string;
      @Input() public label!: string;
      @Input() public disabled: boolean;
      @Input() public placeholder?: string;

      public constructor(private readonly injector: Injector) {
            this.dirty = false;
            this.touched = false;
            this.disabled = false;
            this.internalValue = '';
      }

      public ngOnInit(): void {
            this.control = this.injector.get(NgControl);
            if (this.control) {
                  this.control.valueAccessor = this;
            }
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

      public get isDirty() {
            return this.dirty;
      }

      public get isTouched() {
            return this.touched;
      }

      public set value(value: string) {
            this.internalValue = value;
            this.onChange?.(value);
            this.onTouched?.();
      }
}
