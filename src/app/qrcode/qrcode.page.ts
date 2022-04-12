import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  constructor(public modalController: ModalController, public authService: AuthServiceService, public db: AngularFirestore) { }
  
  token: any;
  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  async ngOnInit() {
    this.authService.userDetails().subscribe(user => {
      this.db.collection('users').doc(user.uid).ref.get().then(async (doc:any) => {
        this.token = doc.data().loginToken;
      })
    })
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
