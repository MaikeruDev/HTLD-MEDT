import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { CreateCategoryPage } from '../create-category/create-category.page';
import { EditCategoryPage } from '../edit-category/edit-category.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor(public modalController: ModalController, public db: AngularFirestore, public alertController: AlertController) { }

  ngOnInit() {
    this.getCategories();
  }

  categories = []

  getCategories(){
    this.db.collection('categories').ref.onSnapshot(async (snap: any) => {
      this.categories = []
      snap.forEach(doc => {
        var temp = doc.data()
        temp.id = doc.id
        this.categories.push(temp)
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

  async editCategory(id){
    const modal = await this.modalController.create({
      component: EditCategoryPage,
      cssClass: 'my-custom-class',
      componentProps: {
        category: id
      }
    });
    return await modal.present();
  }

  async deleteCategory(id, name){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung',
      message: 'Willst du <strong>' + name + '</strong> wirklich löschen?',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.db.collection('categories').doc(id).collection('Objects').ref.get().then(async (objects: any) => {
              objects.forEach(object => {
                this.db.collection('categories').doc(id).collection('Objects').doc(object.id).collection('reservierungen').ref.get().then(async (res: any) => {
                  res.forEach(_res => {
                    this.db.collection('categories').doc(id).collection('Objects').doc(object.id).collection('reservierungen').doc(_res.id).delete();
                  });
                }).then(async () => {
                  this.db.collection('categories').doc(id).collection('Objects').doc(object.id).delete()
                })
              });
            }).then(async () => {
              this.db.collection('categories').doc(id).delete()
            })
          }
        }
      ]
    });

    await alert.present();
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
