import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { CreateCategoryPage } from '../create-category/create-category.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor(public modalController: ModalController, public db: AngularFirestore) { }

  ngOnInit() {
    this.getCategories();
  }

  categories = []

  getCategories(){
    this.db.collection('categories').ref.onSnapshot(async (snap: any) => {
      this.categories = []
      snap.forEach(doc => {
        this.categories.push(doc.data())
      });
    })
  }

  async newCategory(){
    const modal = await this.modalController.create({
      component: CreateCategoryPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
