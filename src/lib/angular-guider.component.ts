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
  @Input({ required: true }) borderColor!: string;

  @Input({ required: true }) isFirst!: boolean;
  @Input({ required: true }) isLast!: boolean;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  innerHTML: SafeHtml = '';

  borderWidth: string = "0px";
  borderHeight: string = "0px";

  constructor(private sanitizer: DomSanitizer) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    setTimeout(() => {
      this.updateMessagePosition();
      this.updateBorder();
    });
  }

  ngOnInit() {
    this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(this.message);
    setTimeout(() => {
      this.updateMessagePosition();
      this.updateBorder();
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

  updateBorder() {
    this.borderWidth = `${(parseInt(this.width, 10) - 5)}px`;
    this.borderHeight = `${(parseInt(this.height, 10) - 5)}px`;
  }

  updateMessagePosition(): void {
    const messageElement = document.getElementById('angular-guider-message');
    const parentElement = messageElement?.parentElement;

    if (messageElement && parentElement) {
      parentElement.style.top = '0px';
      parentElement.style.left = '0px';
      messageElement.style.borderRadius = '0 10px 10px 10px';

      const messageSizes: any = this.getElementPosition(messageElement);
      messageSizes.height = messageElement.clientHeight;

      messageSizes.width = messageElement.clientWidth;

      const screen = {
        height: window.innerHeight || document.documentElement.clientHeight,
        width: window.innerWidth || document.documentElement.clientWidth
      };
      parentElement.style.top = `${parseInt(this.height, 10)}px`;

      const isElementOutOfScreenDown = messageSizes.top + messageSizes.height + parseInt(this.height, 10) > screen.height;
      const isElementOutOfScreenUp = messageSizes.top - messageSizes.height < 10;
      if (isElementOutOfScreenDown && !isElementOutOfScreenUp)
        parentElement.style.top = `-${messageSizes.height + 20}px`;

      const isElementOutOfScreenRight = messageSizes.left + messageSizes.width + parseInt(this.width, 10) > screen.width;
      const isElementOutOfScreenLeft = messageSizes.left - messageSizes.width < 10;

      if (isElementOutOfScreenRight && !isElementOutOfScreenLeft)
        parentElement.style.left = `-${messageSizes.width - parseInt(this.width, 10) + 20}px`;


      if ((isElementOutOfScreenDown && !isElementOutOfScreenUp)) {
        if (isElementOutOfScreenRight && !isElementOutOfScreenLeft) {
          messageElement.style.borderRadius = `10px 10px 0 10px`
        } else {
          messageElement.style.borderRadius = `10px 10px 10px 0`
        }
      }
      else if (!isElementOutOfScreenDown && isElementOutOfScreenUp) {
        if (isElementOutOfScreenRight && !isElementOutOfScreenLeft) {
          messageElement.style.borderRadius = `10px 0 10px 10px`
        }
      }
      else if (isElementOutOfScreenRight && !isElementOutOfScreenLeft) {
        messageElement.style.borderRadius = `10px 0 10px 10px`
      }
    }
  }

  private getElementPosition(messageSizes: HTMLElement): { top: number; left: number } {
    // Function to get the position of the messageSizes
    const rect = messageSizes.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }

}
