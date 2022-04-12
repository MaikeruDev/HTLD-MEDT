import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private modalController: ModalController, public authService: AuthServiceService, public db: AngularFirestore) { }

  pfp: any = "https://www.caribbeangamezone.com/wp-content/uploads/2018/03/avatar-placeholder.png"

  ngOnInit() {
    this.authService.userDetails().subscribe(user => {
      this.db.collection('users').doc(user.uid).ref.get().then(async (doc: any) => {
        this.pfp = doc.data().pfp
      })
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
