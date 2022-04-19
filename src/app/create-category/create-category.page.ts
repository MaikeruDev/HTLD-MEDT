import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { relativeTimeThreshold } from 'moment';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {

  constructor(public modalController: ModalController, public alertController: AlertController, public db: AngularFirestore) { }

  ngOnInit() {
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
      this.db.collection('categories').add({
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
