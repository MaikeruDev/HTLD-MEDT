import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-object',
  templateUrl: './edit-object.page.html',
  styleUrls: ['./edit-object.page.scss'],
})
export class EditObjectPage implements OnInit {

  constructor(public modalController: ModalController, public db: AngularFirestore, public alertController: AlertController) { }

  oid: any;
  category: any;
  statusCodes: any = []

  name;
  notes;
  colorCode;
  status;

  customPopoverOptions: any = {
    cssClass: 'none',
  };

  async ngOnInit() {
    this.statusCodes = []
    
    this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).ref.get().then(async (doc: any) => {
      this.name = doc.data().name;
      this.notes = doc.data().notes;
      this.status = doc.data().status;
    }).then( () => {
      this.db.collection('categories').doc(this.category).ref.get().then(async (cat: any) => {
        var _statusCodes = cat.data().statusCodes;
        var i = 0;
        for (let key in _statusCodes) {
          let value = _statusCodes[key]
          if(this.status == key){
            this.colorCode = i.toString()
          }
          this.statusCodes.push({status: key, color: value}) 
          i++
        }
      })
    })
  }

  async saveObject(){
    if(this.name == "" || !this.name  || this.colorCode == "" || !this.colorCode){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte alle Felder ausfüllen.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else{
      this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).update({
        color: this.statusCodes[this.colorCode].color,
        name: this.name,
        notes: this.notes,
        status: this.statusCodes[this.colorCode].status
      })
      this.modalController.dismiss()
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
