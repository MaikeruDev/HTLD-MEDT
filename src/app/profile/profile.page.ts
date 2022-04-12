import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private loadingController: LoadingController, private toastController: ToastController, private modalController: ModalController, public authService: AuthServiceService, public db: AngularFirestore) { }

  pfp: any = "https://www.caribbeangamezone.com/wp-content/uploads/2018/03/avatar-placeholder.png"
  imageChangedEvent: any = '';
  croppedImage: any = '';
  uid: any;
  editpfp: boolean = false;
  name: any;

  async ngOnInit() {
    this.authService.userDetails().subscribe(user => {
      this.uid = user.uid
      this.db.collection('users').doc(user.uid).ref.get().then(async (doc: any) => {
        this.pfp = doc.data().pfp
        this.name = doc.data().name
      })
    })
    this.loadingController.dismiss()
  }

  closeModal(){
    this.modalController.dismiss();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.editpfp = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed(event: any){
    console.log(event)
  }

  async cancelCrop(){
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.editpfp = false;
  }

  async activateLoader(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Einen Moment...'
    });
    await loading.present();
  }

  async uploadPic(){
    this.db.collection('users').doc(this.uid).update({
      pfp: this.croppedImage
    }).then(async res => {
      this.imageChangedEvent = '';
      this.croppedImage = '';
      this.pfp = "https://www.caribbeangamezone.com/wp-content/uploads/2018/03/avatar-placeholder.png"
      await this.activateLoader();
      this.ngOnInit();
    })
    this.editpfp = false;
    const toast = await this.toastController.create({
      message: 'Your profile picture has been saved.',
      color: 'primary',
      icon: 'person',
      position: 'bottom',
      duration: 2000
    });
    await toast.present();
  }

}
