import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActionSheetButton, ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isThisISOWeek } from 'date-fns';
import { NewTeacherPage } from '../new-teacher/new-teacher.page';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, public afAuth: AngularFireAuth, public modalController: ModalController, private db: AngularFirestore, public loadingController: LoadingController, public authService: AuthServiceService) {}

  ngOnInit() {
    this.db.collection('teachers').ref.get().then(async (_teachers: any) => {
      _teachers.forEach(_teacher => {
        var temp = _teacher.data()
        temp.id = _teacher.id
        this.teachers.push(temp)
      });
    })
  }

  teachers: any = []

  async newTeacher(){
    const modal = await this.modalController.create({
      component: NewTeacherPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      this.refresh()
    });
    return await modal.present();
  }

  async refresh(){
    this.teachers = []
    this.ngOnInit();
  }

  async openMenu(id, name){
    const actionSheet = await this.actionSheetController.create({
      header: name,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Löschen',
        role: 'destructive',
        icon: 'trash',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          this.db.collection('teachers').doc(id).delete().then( () => {
            this.refresh()
          })
        } }, {
          text: 'Schließen',
          icon: 'close',
          data: 10,
          handler: () => {
          }
      }]
    });
    await actionSheet.present();
  }

  closeModal(){
    this.modalController.dismiss();
  }
}
