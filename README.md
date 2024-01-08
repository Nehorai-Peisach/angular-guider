# Angular Guider Service

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Overview

The Angular Guider Service is a utility service in Angular that provides functionality to create a guided interface experience, helping users navigate through specific elements on your application.

See the code also on [GitHub](https://github.com/Nehorai-Peisach/angular-guider).

<img src="https://raw.githubusercontent.com/Nehorai-Peisach/angular-guider/main/src/assets/images/example.gif" width="9000"/>

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

### 2. Import the `AngularGuiderService` and provide it in your module:

```typescript
import { AngularGuiderService } from 'angular-guider';

@NgModule({
  providers: [AngularGuiderService]
})
```


### 3. Inject the `AngularGuiderService` where you need to use it:

```typescript
import { AngularGuiderService } from 'angular-guider';

constructor(private guiderService: AngularGuiderService) { }
```

### 4. Add the following CSS rule to your global styles (e.g., styles.css or styles.scss) to ensure a focused experience during the guide:

```css
.guider-active {
    height: 100vh;
    width: 100vw;
    overflow: hidden !important;
}
```

This CSS rule will be applied when the guide is active, preventing scrolling and ensuring a focused view for users during the interface walkthrough.

Feel free to customize the CSS rule based on your application's styling needs.

## Usage

### 1. Set up Guider Steps
Before starting the guider, set up an array of guider steps:

```typescript
const guiderSteps = [
  { elementId: 'element1', message: 'This is the first step.' },
  // Add more steps as needed
];
```

### 2. Initialize Guider Steps
Set the guider steps using the setSteps method:

```typescript
this.guideService.setSteps(guideSteps);
```

### 3. Start the Guider
Start the guider at a specific index or use the default start:

```typescript
// Start the guider at the first step
this.guideService.startGuide();

// Start the guider at a specific index
this.guideService.startGuideAt(2);
```

### 4. Next and End Guider
Navigate to the next step or end the guider:

```typescript
// Move to the next step
this.guideService.nextStep();

// End the guider
this.guideService.endGuide();
```
## Angular Guider Step Interface

The `AngularGuiderStep` interface is used to define the properties of each step in the Angular Guider. Below is a table summarizing the available properties:

| Property          | Type      | Description                                                                                  |
| ----------------- | --------- | -------------------------------------------------------------------------------------------- |
| `elementId`       | `string`  | (Required) The HTML element's ID associated with the step.                                   |
| `message`         | `string`  | (Optional) Message or instructions linked with the step.                                     |
| `clickable`       | `boolean` | (Optional) Indicates whether the element's area is clickable.                                |
| `hideButtons`     | `boolean` | (Optional) Indicates whether to hide the guider buttons.                                      |
| `disableShadedArea`  | `boolean` | (Optional) Indicates whether to disable interaction with the shaded area during this step.   |

### Example Usage:

```typescript
import { AngularGuiderStep } from 'angular-guider';

const step: AngularGuiderStep = {
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
import { AngularGuiderService } from 'angular-guider';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="startGuide()">Start Guider</button>

    <!-- Your application content -->
    <div id="my-example-step1">Element 1</div>
    <div>Some other element</div>
    <div id="my-example-step2">Element 2</div>
  `,
})
export class ExampleComponent implements OnInit {
  constructor(private guideService: AngularGuiderService) {}

  ngOnInit(): void {
    // Set up guider steps
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
        hideButtons: true // Controls whether the guider buttons should be hidden

      },
      // Add more steps as needed
    ];

    // Initialize guider steps
    this.guideService.setSteps(guideSteps);
  }

  // Start the guider
  startGuide(): void {
    this.guideService.startGuide();
  }
}
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.

##
Feel free to modify the content based on your specific needs and add more sections if required.




