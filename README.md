# VetclinicUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

#  VetClinic – Frontend

User interface of the VetClinic platform, a modular management system for veterinary clinics.  
This module is built with Angular and provides a responsive, role-based experience integrated with Keycloak for secure access control.

---

##  Technologies Used

-  Angular
-  RxJS, Angular Router, Angular Material
-  Keycloak (SSO, role-based access control)
-  Responsive UI with component-based architecture
-  Data visualization and PDF reporting

---

##  Key Features

- Secure login and logout via Keycloak
- Dashboard with role-based views (Admin, Head of Department, Vet, Assistant, Client)
- Full CRUD operations for:
  - Patients
  - Appointments
  - Medical administrations
  - Staff shifts
  - Departments and rooms
  - Payments and invoices
- PDF reports and exportable data
- Integrated calendar and notifications

---

##  How to Run the Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/chiaraapastore/vetclinic-ui.git


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
