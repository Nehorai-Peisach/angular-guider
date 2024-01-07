import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-angular-guider',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './angular-guider.component.html',
  styleUrls: ['./angular-guider.component.scss']
})
export class AngularGuiderComponent {
  @Input({ required: true }) top!: string;
  @Input({ required: true }) left!: string;
  @Input({ required: true }) width!: string;
  @Input({ required: true }) height!: string;
  @Input({ required: true }) message!: string;
  @Input({ required: true }) clickable!: boolean;
  @Input({ required: true }) hideButtons!: boolean;
  @Input({ required: true }) disableShadedArea!: boolean;

  @Input({ required: true }) isFirst!: boolean;
  @Input({ required: true }) isLast!: boolean;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  innerHTML: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    setTimeout(() => {
      this.updateMessagePosition();
    });
  }

  ngOnInit() {
    this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(this.message);
    setTimeout(() => {
      this.updateMessagePosition();
    });
  }


  emitNext(isFromBtn?: boolean): void {
    if (!this.disableShadedArea || isFromBtn)
      this.next.emit();
  }
  emitPrev(): void {
    this.prev.emit();
  }
  emitClose(): void {
    this.close.emit();
  }

  updateMessagePosition(): void {
    const messageElement = document.getElementById('angular-guider-message');
    const parentElement = messageElement?.parentElement;

    if (messageElement && parentElement) {
      parentElement.style.top = '0px'
      parentElement.style.left = '0px'
      messageElement.style.borderRadius = `10px`

      const elementSizes: any = this.getElementPosition(messageElement);
      elementSizes.height = messageElement.clientHeight;

      elementSizes.width = messageElement.clientWidth;

      const screen = {
        height: window.innerHeight || document.documentElement.clientHeight,
        width: window.innerWidth || document.documentElement.clientWidth
      };

      const isElementOutOfScreenDown = elementSizes.top + elementSizes.height + 120 > screen.height;
      const isElementOutOfScreenRight = elementSizes.left + elementSizes.width > screen.width;

      if (isElementOutOfScreenDown) {
        parentElement.style.top = `-${elementSizes.height + 20}px`;
        messageElement.style.borderRadius = `10px 10px 10px 0px`
      } else {
        parentElement.style.top = this.height;
        messageElement.style.borderRadius = `0px 10px 10px 10px`
      }

      if (isElementOutOfScreenRight) {
        parentElement.style.left = `-${elementSizes.width - parseInt(this.width, 10) + 20}px`;
        if (isElementOutOfScreenDown) {
          messageElement.style.borderRadius = `10px 10px 0px 10px`
        }
        else {
          messageElement.style.borderRadius = `10px 0px 10px 10px`
        }
      }

    }
  }

  private getElementPosition(elementSizes: HTMLElement): { top: number; left: number } {
    // Function to get the position of the elementSizes
    const rect = elementSizes.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }

}
