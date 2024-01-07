# Angular Guider Service

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Overview

The Angular Guider Service is a utility service in Angular that provides functionality to create a guided interface experience, helping users navigate through specific elements on your application.

See the code also on [GitHub](https://github.com/Nehorai-Peisach/angular-guider/tree/main).

<img src="https://raw.githubusercontent.com/Nehorai-Peisach/angular-guider/main/src/assets/images/example.gif?token=GHSAT0AAAAAACMNHB2H6NXJJQNSPDJNOJNEZMZ5FVQ" width="9000"/>

## Features

- Guided interface walkthrough with step-by-step instructions.
- Automatic resizing and repositioning based on the target elements.
- Disable scrolling during the guide for a focused experience.

## Installation

To use the Angular Guider Service in your Angular application, follow these steps:

### 1. Install the service using npm:

```bash
npm install --save angular-guider
```

### 2. Inject the `AngularInterfaceGuideService` where you need to use it:

```typescript
import { AngularInterfaceGuideService } from 'angular-guider';

constructor(private interfaceGuideService: AngularInterfaceGuideService) { }
```

### 3. Add the following CSS rule to your global styles (e.g., styles.css or styles.scss) to ensure a focused experience during the guide:

```css
.guide-active {
    height: 100vh;
    width: 100vw;
    overflow: hidden !important;
}
```

This CSS rule will be applied when the guide is active, preventing scrolling and ensuring a focused view for users during the interface walkthrough.

Feel free to customize the CSS rule based on your application's styling needs.

## Usage

### 1. Set up Guide Steps
Before starting the guide, set up an array of guide steps:

```typescript
const guideSteps = [
  { elementId: 'element1', message: 'This is the first step.' },
  // Add more steps as needed
];
```

### 2. Initialize Guide Steps
Set the guide steps using the setSteps method:

```typescript
this.interfaceGuideService.setSteps(guideSteps);
```

### 3. Start the Guide
Start the guide at a specific index or use the default start:

```typescript
// Start the guide at the first step
this.interfaceGuideService.startGuide();

// Start the guide at a specific index
this.interfaceGuideService.startGuideAt(2);
```

### 4. Next and End Guide
Navigate to the next step or end the guide:

```typescript
// Move to the next step
this.interfaceGuideService.nextStep();

// End the guide
this.interfaceGuideService.endGuide();
```
## Angular Guider Step Interface

The `AngularInterfaceGuideStep` interface is used to define the properties of each step in the Angular Guider. Below is a table summarizing the available properties:

| Property          | Type      | Description                                                                                  |
| ----------------- | --------- | -------------------------------------------------------------------------------------------- |
| `elementId`       | `string`  | (Required) The HTML element's ID associated with the step.                                   |
| `message`         | `string`  | (Optional) Message or instructions linked with the step.                                     |
| `clickable`       | `boolean` | (Optional) Indicates whether the element's area is clickable.                                |
| `hideButtons`     | `boolean` | (Optional) Indicates whether to hide the guide buttons.                                      |
| `disableShadedArea`  | `boolean` | (Optional) Indicates whether to disable interaction with the shaded area during this step.   |

### Example Usage:

```typescript
import { AngularInterfaceGuideStep } from 'angular-guider';

const step: AngularInterfaceGuideStep = {
  elementId: 'exampleElement',
  message: 'Click on this element to proceed.',
  clickable: true,
  hideButtons: true,
  disableShadedArea: true
};
```
Feel free to customize the example usage based on your specific implementation.


## Component Examples
```typescript
//app-app-example.component.ts

// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { AngularInterfaceGuideService } from 'angular-guider';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="startGuide()">Start Guide</button>

    <!-- Your application content -->
    <div id="my-example-step1">Element 1</div>
    <div>Some other element</div>
    <div id="my-example-step2">Element 2</div>
  `,
})
export class ExampleComponent implements OnInit {
  constructor(private interfaceGuideService: AngularInterfaceGuideService) {}

  ngOnInit(): void {
    // Set up guide steps
    const guideSteps = [
      { 
        elementId: 'my-example-step1',
        message: `
        <div style="width: 500px">
          <h2 style="color: #dd1b16">Title</h2>
          <p>
            This is the first step.
          </p>
        </div>`
      },
      { 
        elementId: 'my-example-step2',
        message: 'This is the second step.',
        clickable: true, // Enables clickability for the element, making its area interactive
        hideButtons: true // Controls whether the guide buttons should be hidden

      },
      // Add more steps as needed
    ];

    // Initialize guide steps
    this.interfaceGuideService.setSteps(guideSteps);
  }

  // Start the guide
  startGuide(): void {
    this.interfaceGuideService.startGuide();
  }
}
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.

##
Feel free to modify the content based on your specific needs and add more sections if required.




