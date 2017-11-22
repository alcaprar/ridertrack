import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroup, FormGroupDirective} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Directive({
  selector: '[invalidMessage]'
})
export class InvalidMessageDirective implements  OnInit, OnDestroy{

  @Input() invalidMessage: string;
  control: AbstractControl;
  controlValue$: Observable<any>;
  controlSubscription: Subscription;
  hasSubmitted: boolean;

  constructor(private formGroup: ControlContainer, private elem: ElementRef,
              private render: Renderer2) { }


  ngOnInit(): void {
    this.control = this.form.get(this.invalidMessage);
    let formSubmit$ = (<FormGroupDirective>this.formGroup).ngSubmit.map(() => {
      this.hasSubmitted = true;
    });
    this.controlValue$ = Observable.merge(this.control.valueChanges, Observable.of(''), formSubmit$);
    this.controlSubscription = this.controlValue$.subscribe(() => {
      this.setVisible();
    });
  }

  /**
   *  Set the hosted elements as visible when the control is valid otherwise it sets them as hidden.
   *  This method is called when the value control is changed
   */
  private setVisible() {
    if(this.control.invalid && (this.control.dirty )) {
      this.render.removeStyle(this.elem.nativeElement, 'display');
    } else {
      this.render.setStyle(this.elem.nativeElement, 'display', 'none');
    }
  }

  //invalid type directives
  match(error: string) {
    if(this.control && this.control.errors) {
      if(Object.keys(this.control.errors).indexOf(error) > -1) {
        return true;
      }
    }
    return false;
  }

 // Return the form group
  get form() {
    return this.formGroup.formDirective ? (this.formGroup.formDirective as FormGroupDirective).form : null;
  }

  ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
  }

}



