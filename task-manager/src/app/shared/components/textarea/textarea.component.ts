import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, Injector, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-textarea',
      templateUrl: './textarea.component.html',
      styleUrls: ['./textarea.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [FormsModule, ReactiveFormsModule, NgIf],
      providers: [
            {
                  multi: true,
                  provide: NG_VALUE_ACCESSOR,
                  useExisting: TextareaComponent,
            },
      ],
})
export class TextareaComponent implements ControlValueAccessor, OnInit {
      @Input() public label!: string;
      @Input() public disabled!: boolean;
      @Input() public placeholder!: string;

      private control?: NgControl;
      private internalValue!: string;
      private onTouched?: () => void;
      private onChange?: (value: string) => void;

      private readonly injector: Injector;

      public constructor() {
            this.injector = inject(Injector);
      }

      public ngOnInit(): void {
            this.control = this.injector.get(NgControl);
            if (this.control) {
                  this.control.valueAccessor = this;
            }
      }

      public get formControl() {
            return this.control;
      }

      public get value(): string {
            return this.internalValue;
      }

      public set value(value: string) {
            this.internalValue = value;
            this.onChange?.(value);
            this.onTouched?.();
      }

      public writeValue(text: string): void {
            this.internalValue = text;
      }

      public registerOnChange(fn: (value: string) => void): void {
            this.onChange = fn;
      }

      public registerOnTouched(fn: () => void): void {
            this.onTouched = fn;
      }

      public setDisabledState?(isDisabled: boolean): void {
            this.disabled = isDisabled;
      }
}
