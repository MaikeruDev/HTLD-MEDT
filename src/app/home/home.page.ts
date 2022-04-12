import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
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
        var objects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            objects.push(_object.data())
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
        var objects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            objects.push(_object.data())
          });
        })
        tempCategory.objects = objects
        this.categories.push(tempCategory)
      });
    }).then(res => {
      event.target.complete();
    })
  }

  async openQRCode(){
    const modal = await this.modalController.create({
      component: QrcodePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
