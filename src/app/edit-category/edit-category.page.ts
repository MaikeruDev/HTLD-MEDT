import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { KeyObject } from 'crypto';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  constructor(public modalController: ModalController, public alertController: AlertController, public db: AngularFirestore) { }

  @Input()
  category

  async ngOnInit() {
    this.getCategories()
  }

  async getCategories(){
    this.db.collection('categories').doc(this.category).ref.get().then(async(doc: any) => {
      this.name = doc.data().name;
      var _statusCodes = doc.data().statusCodes;
      for (let key in _statusCodes) {
        let value = _statusCodes[key]
        console.log(key, value)
        this.statusCodes.push({status: key, color: value}) 
      }
    })
  }

  name;
  statusCodes = [];
  status;
  colorCode;
  color = "#ffffff";

  customPopoverOptions: any = {
    cssClass: 'my-custom-interface',
  };

  async addStatusCodes(){
    if(!this.colorCode || !this.status){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte alle Felder ausfüllen.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else if(this.colorCode != "own"){
      this.statusCodes.push({status: this.status, color: this.colorCode})
      this.status = "";
      this.colorCode = "";
    }
    else{
      this.statusCodes.push({status: this.status, color: this.color})
      this.status = "";
      this.colorCode = "";
    }
  }

  removeStatus(pos){
    this.statusCodes.splice(pos, 1)
  }

  async addCategory(){
    if(this.statusCodes.length < 1 || !this.name){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte alle Felder ausfüllen.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else{
      var result = this.statusCodes.reduce(function(map, obj) {
        map[obj.status] = obj.color;
        return map;
    }, {});
      this.db.collection('categories').doc(this.category).update({
        name: this.name,
        statusCodes: result
      }).then(res => {
        this.closeModal(); 
      })
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
