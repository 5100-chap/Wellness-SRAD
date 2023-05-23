import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import your routing modules here
import { SharedModuleRoutingModule } from './Shared/shared-routing.module';
import { AlumnoRoutingModule } from './Alumno/alumno-routing.module';
import { AdminRoutingModule } from './Admin/admin-routing.module';

const routes: Routes = [
    // your top-level routes go here
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        AlumnoRoutingModule, // import your Alumno routing module
        AdminRoutingModule, // import your Admin routing module
        SharedModuleRoutingModule  // import your shared routing module
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

