import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Injector, NgZone, Output, RendererFactory2 } from '@angular/core';
import { AngularGuiderStep } from './angular-guider.interface';
import { AngularGuiderComponent } from './angular-guider.component';

@Injectable({
  providedIn: 'root'
})
export class AngularGuiderService {
  private index: number = 0;
  private steps: AngularGuiderStep[] = [];

  private componentRef!: ComponentRef<AngularGuiderComponent>
  private resizeListener: (() => void) | null = null;

  @Output() onNext = new EventEmitter<number>();
  @Output() onPrev = new EventEmitter<number>();
  @Output() onClose = new EventEmitter<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone,
    private rendererFactory: RendererFactory2  // Use RendererFactory2 instead of Renderer2
  ) {
  }

  setSteps(steps: AngularGuiderStep[]): void {
    this.steps = steps;
  }

  startGuideAt(index: number) {
    setTimeout(() => {
      this.index = index;

      if (this.index < 0 || this.index >= this.steps.length) {
        console.error(`Element in index ${this.index} not found.`);
        return;
      }

      const { elementId, message, clickable, hideButtons, disableShadedArea, borderColor } = this.steps[this.index];

      const element = document.getElementById(elementId);

      if (element) {
        const position = this.getElementPosition(element);
        // Dynamically create the Angular component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AngularGuiderComponent);
        this.componentRef = componentFactory.create(this.injector);


        // Set input properties for the component
        this.componentRef.instance.top = `${position.top}px`;
        this.componentRef.instance.left = `${position.left}px`;
        this.componentRef.instance.width = `${element.offsetWidth}px`;
        this.componentRef.instance.height = `${element.offsetHeight}px`;
        this.componentRef.instance.message = message || '';
        this.componentRef.instance.clickable = !!clickable;
        this.componentRef.instance.hideButtons = !!hideButtons;
        this.componentRef.instance.disableShadedArea = !!disableShadedArea;
        this.componentRef.instance.borderColor = borderColor || '#5478f0';

        this.componentRef.instance.isFirst = this.index === 0;
        this.componentRef.instance.isLast = this.index === this.steps.length - 1;
        this.componentRef.instance.next.subscribe(() => this.nextStep());
        this.componentRef.instance.prev.subscribe(() => this.prevStep());
        this.componentRef.instance.close.subscribe(() => this.endGuide(true));

        // Attach the component to the DOM
        this.appRef.attachView(this.componentRef.hostView);

        // Listen for screen size changes and update sizes accordingly
        this.setupResizeListener(element, this.componentRef.instance);
        const domElement = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElement);


        setTimeout(() => {
          // Check if the component is visible on the screen
          const isComponentVisible = !!document.getElementById('angular-guider-message');

          // Add CSS to HTML element if the component is visible
          if (isComponentVisible) {
            this.rendererFactory.createRenderer(null, null).addClass(document.documentElement, 'guider-active');
          }
        });
      } else {
        console.error(`Element with id ${elementId} not found.`);
      }
    });
  }

  startGuide(): void {
    this.startGuideAt(0);
  }

  nextStep(): void {
    if (this.index + 1 < this.steps.length) {
      this.endGuide();
      this.startGuideAt(++this.index);
      this.onNext.emit(this.index);
    }
  };

  prevStep(): void {
    if (this.index - 1 >= 0) {
      this.endGuide();
      this.startGuideAt(--this.index);
      this.onPrev.emit(this.index);
    }
  };

  endGuide(end?: boolean): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Detach and destroy the dynamically created Angular component
    if (this.appRef.components.length > 0) {
      this.rendererFactory.createRenderer(null, null).removeClass(document.documentElement, 'guider-active');

      this.componentRef.destroy();
    }

    if (end)
      this.onClose.emit();
  }


  private getElementPosition(element: HTMLElement): { top: number; left: number } {
    // Function to get the position of the element
    // You can implement this method based on your specific needs
    // This is just a placeholder; replace it with your actual logic
    const rect = element.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }

  private setupResizeListener(element: HTMLElement, componentInstance: AngularGuiderComponent): void {
    // Remove any existing resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Add a new resize listener
    this.resizeListener = this.ngZone.runOutsideAngular(() => {
      return () => {
        const position = this.getElementPosition(element);
        componentInstance.top = `${position.top}px`;
        componentInstance.left = `${position.left}px`;
        componentInstance.width = `${element.offsetWidth}px`;
        componentInstance.height = `${element.offsetHeight}px`;
      };
    });

    window.addEventListener('resize', this.resizeListener);
  }
}
