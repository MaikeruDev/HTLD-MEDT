import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
import { CategoriesPage } from '../categories/categories.page';
import { NewObjectPage } from '../new-object/new-object.page';
import { ObjectInfoPage } from '../object-info/object-info.page';
import { ProfilePage } from '../profile/profile.page';
import { QrcodePage } from '../qrcode/qrcode.page';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public afAuth: AngularFireAuth, public modalController: ModalController, private db: AngularFirestore, public loadingController: LoadingController, public authService: AuthServiceService) {}

  categories: any = [];

  async ngOnInit() {
    await this.clearAll();
    await this.activateLoader();
    await this.loadCategories();
  }

  async activateLoader(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Einen Moment...'
    });
    await loading.present();
  }

  async loadCategories(){
    await this.db.collection('categories').ref.get().then(async (_categories: any) => {
      _categories.forEach(async _category => {
        var tempCategory = _category.data();
        tempCategory.cid = _category.id;
        var objects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            var temp = _object.data();
            temp.id = _object.id;
            objects.push(temp)
            objects.sort((a,b) => a.status.localeCompare(b.status));
          });
        })
        tempCategory.objects = objects
        this.categories.push(tempCategory)
      });
    }).then(res => {
      this.loadingController.dismiss()
    })
  }

  async clearAll(){
    this.categories = []
  }

  async refresh(event){
    this.clearAll()
    await this.db.collection('categories').ref.get().then(async (_categories: any) => {
      _categories.forEach(async _category => {
        var tempCategory = _category.data();
        tempCategory.cid = _category.id;
        var objects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            var temp = _object.data();
            temp.id = _object.id;
            objects.push(temp)
            objects.sort((a,b) => a.status.localeCompare(b.status));
          });
        })
        tempCategory.objects = objects
        this.categories.push(tempCategory)
      });
    }).then(res => {
       try {
        event.target.complete();
       } catch (error) {
         
       }
    })
  }

  async openQRCode(){
    const modal = await this.modalController.create({
      component: QrcodePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openProfile(){
    const modal = await this.modalController.create({
      component: ProfilePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openObjectInfo(oid, category){
    console.log(oid, category)
    const modal = await this.modalController.create({
      component: ObjectInfoPage,
      cssClass: 'my-custom-class',
      componentProps: { 
        oid: oid,
        category: category
      }
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

  async addObject(category){
    const modal = await this.modalController.create({
      component: NewObjectPage,
      cssClass: 'my-custom-class',
      componentProps: { 
        category: category
      }
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

  async openCategories() {
    const modal = await this.modalController.create({
      component: CategoriesPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

}
