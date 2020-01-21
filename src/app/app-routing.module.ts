import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { HomePageModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'diary', loadChildren: './pages/diary/diary.module#DiaryPageModule' },
  { path: 'gallary', loadChildren: './pages/gallary/gallary.module#GallaryPageModule' },
  { path: 'profile/:uname', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'billboard', loadChildren: './pages/billboard/billboard.module#BillboardPageModule' },
  { path: 'post-job', loadChildren: './pages/post-job/post-job.module#PostJobPageModule' },
  { path: 'messages', loadChildren: './pages/messages/messages.module#MessagesPageModule' },
  { path: 'setting', loadChildren: './pages/setting/setting.module#SettingPageModule' },
  { path: 'logout', loadChildren: './pages/logout/logout.module#LogoutPageModule' },
  { path: 'cookies', loadChildren: './pages/cookies/cookies.module#CookiesPageModule' },
  { path: 'privacy-policy', loadChildren: './pages/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'aboutus', loadChildren: './pages/abouus/abouus.module#AbouusPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  { path: 'private-profile/:uname', loadChildren: './pages/private-profile/private-profile.module#PrivateProfilePageModule' },
  { path: 'own-profile', loadChildren: './pages/own-profile/own-profile.module#OwnProfilePageModule' },
  { path: 'single-chat', loadChildren: './pages/single-chat/single-chat.module#SingleChatPageModule' },
  { path: 'group-chat', loadChildren: './pages/group-chat/group-chat.module#GroupChatPageModule' },
  { path: 'crate-group-chat', loadChildren: './pages/crate-group-chat/crate-group-chat.module#CrateGroupChatPageModule' },
  { path: 'edit-group-page', loadChildren: './pages/edit-group-page/edit-group-page.module#EditGroupPagePageModule' },
  { path: 'chat/:chatid/:chatuname', loadChildren: './pages/chat/chat.module#ChatPageModule' },
  { path: 'contact', loadChildren: './pages/contact/contact.module#ContactPageModule' },
  { path: 'subject', loadChildren: './pages/subject/subject.module#SubjectPageModule' },
  { path: 'post-bill', loadChildren: './pages/post-bill/post-bill.module#PostBillPageModule' },
  { path: 'notify', loadChildren: './pages/notify/notify.module#NotifyPageModule' },
  { path: 'gallaryimage/:alid', loadChildren: './pages/gallaryimage/gallaryimage.module#GallaryimagePageModule' },
];

@NgModule({
  imports: [
    HomePageModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(routes)
      // , { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
   providers:[ImagePicker, ]
})
export class AppRoutingModule { }
