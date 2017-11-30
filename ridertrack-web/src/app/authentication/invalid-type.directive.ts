import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {InvalidMessageDirective} from "./invalid-message.directive";

@Directive({
  selector: '[invalidType]'
})
export class InvalidTypeDirective implements  OnInit {
  @Input ('invalidType') type: string;
  private hasView = false;

  constructor(
    private invalidmassage: InvalidMessageDirective,
    //to create and remove host element for invalid messages
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ){}

  ngOnInit(): void {
    this.invalidmassage.controlValue$.subscribe(() => {
      this.setVisible();
    });
  }

  /**
   *  Check if error object has the specified error type, if so return true else false
   */
  private setVisible() {
    if(this.invalidmassage.match(this.type)) {
      if(!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        if(this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    }
  }

}
