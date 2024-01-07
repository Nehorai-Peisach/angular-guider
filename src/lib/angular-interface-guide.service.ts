import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgZone, RendererFactory2 } from '@angular/core';
import { AngularInterfaceGuideStep } from './angular-guider.interface';
import { AngularInterfaceGuideComponent } from './angular-guider.component';

@Injectable({
  providedIn: 'root'
})
export class AngularInterfaceGuideService {
  private index: number = 0;
  private steps: AngularInterfaceGuideStep[] = [];

  private componentRef!: ComponentRef<AngularInterfaceGuideComponent>
  private resizeListener: (() => void) | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone,
    private rendererFactory: RendererFactory2  // Use RendererFactory2 instead of Renderer2
  ) {
  }

  setSteps(steps: AngularInterfaceGuideStep[]): void {
    this.steps = steps;
  }

  startGuideAt(index: number) {
    setTimeout(() => {

      this.index = index;

      if (this.index < 0 || this.index >= this.steps.length) {
        console.error(`Element in index ${this.index} not found.`);
        return;
      }

      const { elementId, message, clickable, hideButtons, disableShadedArea } = this.steps[this.index];

      const element = document.getElementById(elementId);

      if (element) {
        const position = this.getElementPosition(element);
        // Dynamically create the Angular component
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AngularInterfaceGuideComponent);
        this.componentRef = componentFactory.create(this.injector);


        // Set input properties for the component
        this.componentRef.instance.top = `${position.top}px`;
        this.componentRef.instance.width = `${element.offsetWidth}px`;
        this.componentRef.instance.height = `${element.offsetHeight}px`;
        this.componentRef.instance.message = message || '';
        this.componentRef.instance.clickable = !!clickable;
        this.componentRef.instance.hideButtons = !!hideButtons;
        this.componentRef.instance.disableShadedArea = !!disableShadedArea;

        this.componentRef.instance.isFirst = this.index === 0;
        this.componentRef.instance.isLast = this.index === this.steps.length - 1;
        this.componentRef.instance.next.subscribe(() => this.nextStep());
        this.componentRef.instance.prev.subscribe(() => this.prevStep());
        this.componentRef.instance.close.subscribe(() => this.endGuide());

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
            this.rendererFactory.createRenderer(null, null).addClass(document.documentElement, 'guide-active');
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
    this.endGuide();
    if (this.index + 1 < this.steps.length) {
      this.startGuideAt(++this.index);
    }
  };

  prevStep(): void {
    this.endGuide();
    if (this.index - 1 >= 0) {
      this.startGuideAt(--this.index);
    }
  };

  endGuide(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Detach and destroy the dynamically created Angular component
    if (this.appRef.components.length > 0) {
      this.rendererFactory.createRenderer(null, null).removeClass(document.documentElement, 'guide-active');

      this.componentRef.destroy();
    }
  }


  private getElementPosition(element: HTMLElement): { top: number; left: number } {
    // Function to get the position of the element
    // You can implement this method based on your specific needs
    // This is just a placeholder; replace it with your actual logic
    const rect = element.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }

  private setupResizeListener(element: HTMLElement, componentInstance: AngularInterfaceGuideComponent): void {
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
