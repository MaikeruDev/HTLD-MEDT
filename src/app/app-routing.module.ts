import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLogin = () => 
  redirectUnauthorizedTo(['/']);

const redirectLoggedInToHome = () =>
  redirectLoggedInTo(['/home']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'qrcode',
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'object-info',
    loadChildren: () => import('./object-info/object-info.module').then( m => m.ObjectInfoPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'create-category',
    loadChildren: () => import('./create-category/create-category.module').then( m => m.CreateCategoryPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'edit-category',
    loadChildren: () => import('./edit-category/edit-category.module').then( m => m.EditCategoryPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'edit-object',
    loadChildren: () => import('./edit-object/edit-object.module').then( m => m.EditObjectPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'new-object',
    loadChildren: () => import('./new-object/new-object.module').then( m => m.NewObjectPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'teachers',
    loadChildren: () => import('./teachers/teachers.module').then( m => m.TeachersPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },  {
    path: 'new-teacher',
    loadChildren: () => import('./new-teacher/new-teacher.module').then( m => m.NewTeacherPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
