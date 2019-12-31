import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'design',
    loadChildren: '../app/design-preview/design/design.module#DesignModule'
  },
  {
    path: 'preview',
    loadChildren: '../app/design-preview/preview/preview.module#PreviewModule'
  },
  {
    path: 'review',
    loadChildren: '../app/sample-review/review/review.module#ReviewModule'
  },
  {
    path: 'sample',
    loadChildren: '../app/sample-review/sample/sample.module#SampleModule'
  },
  {
    path: 'test',
    loadChildren: '../app/test/test.module#TestModule'
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
