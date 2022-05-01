import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-object',
  templateUrl: './new-object.page.html',
  styleUrls: ['./new-object.page.scss'],
})
export class NewObjectPage implements OnInit {

  constructor(public modalController: ModalController, public db: AngularFirestore, public alertController: AlertController) { }

  category: any;
  statusCodes: any = []

  name;
  notes;
  colorCode;

  async ngOnInit() {
    this.statusCodes = []
    this.db.collection('categories').doc(this.category).ref.get().then(async (cat: any) => {
      console.log(cat.data())
      var _statusCodes = cat.data().statusCodes;
      for (let key in _statusCodes) {
        let value = _statusCodes[key]
        this.statusCodes.push({status: key, color: value}) 
      }
    })
  }

  async addItem(){
    if(this.name == "" || !this.name  || this.colorCode == "" || !this.colorCode){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte alle Felder ausfüllen.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else{
      if(this.notes == "" || !this.notes){
        this.notes = " "
      }
      this.db.collection('categories').doc(this.category).collection('Objects').add({
        color: this.statusCodes[this.colorCode].color,
        name: this.name,
        notes: this.notes,
        status: this.statusCodes[this.colorCode].status
      }).then(async(docRef: any) => {
        this.db.collection('categories').doc(this.category).collection('Objects').doc(docRef.id).update({
          oid: docRef.id
        })
      })
      this.modalController.dismiss()
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
