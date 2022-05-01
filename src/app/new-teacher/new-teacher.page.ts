import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.page.html',
  styleUrls: ['./new-teacher.page.scss'],
})
export class NewTeacherPage implements OnInit {

  constructor(public db: AngularFirestore, public modalController: ModalController) { }

  vname;
  nname;

  ngOnInit() {
  }

  async addTeacher(){
    this.db.collection('teachers').add({
      vname: this.vname,
      nname: this.nname,
      email: this.vname.toLowerCase() + "." + this.nname.toLowerCase() + "@htldornbirn.at"
    }).then( () => {
      this.closeModal()
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
