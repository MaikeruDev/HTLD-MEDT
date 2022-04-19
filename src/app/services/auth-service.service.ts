import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  uid: any;
  secretKey = "Q762ePTF8MxALDJH25FaNABJt48EeJPq2npsRLyzmQrb3BfkY5";

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private alertController: AlertController) {
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async createUserWithEmailAndPassword(email, password, passwordConfirm){
    if(password === passwordConfirm && password && passwordConfirm){
      var unformatted_name = email.substring(0, email.indexOf("@"));
      var first_name = unformatted_name.substring(0, unformatted_name.indexOf("."))
      var last_name = unformatted_name.substring(unformatted_name.indexOf(".") + 1)
      var name = this.capitalizeFirstLetter(first_name) + " " + this.capitalizeFirstLetter(last_name);
      var mailProvider = email.substring(email.length - 23);
      if(mailProvider == "@student.htldornbirn.at" && first_name && last_name){
        return new Promise<any>((resolve, reject) => {
          this.afAuth.createUserWithEmailAndPassword(email, password).then(credential => {
            credential.user.updateProfile({
              displayName: name,
            })
          }).then(
            async res => {
              await this.afAuth.user.subscribe(user => {

                this.db.collection("users/").doc(user.uid).set({
                  name: name,
                  pfp: "https://avatars.dicebear.com/api/initials/" + name + ".svg",
                  email: email.toLowerCase(),
                  uid: user.uid,
                  role: "student",
                  loginToken: this.encrypt(email.toLowerCase() + "&" + password)
                }).then( res => {
                  location.reload();
                })
              })
            },
            async err => {
              const alert = await this.alertController.create({
                header: "Oopsie",
                message: err.message,
                buttons: ["RETRY"]
              })

              await alert.present();
            }
          )
        })
      }
      else{
        this.alert("Fehler", "Die eingegebene E-Mail stimmt nicht mit der Schulmail überein.", "Bitte überprüfe deine Eingaben.", "OK");
      } 
    }
    else{
      this.alert("Fehler", "Passwörter stimmen nicht überein", "Bitte überprüfe deine Eingaben.", "OK");
    }
  }

  async signInWithEmailAndPassword(email, password){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then(
        res => {
          location.reload();
        },
        async err => {
          const alert = await this.alertController.create({
            header: "Oopsie",
            message: err.message,
            buttons: ["RETRY"]
          })

          await alert.present();
        }
      )
    })
  }

  async signOut(){
    return new Promise<void>((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            resolve();
            location.reload();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  async resetPW(email){
    if(email){
    this.afAuth.sendPasswordResetEmail(email)
    .then(async (res: any) =>{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Geschafft!',
        message: "Eine E-Mail zum Zurücksetzen Ihres Passworts wurde gesendet.",
        buttons: ['OK']
      });
  
      await alert.present();
    })
    .catch(async (err: any) =>{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
  
      await alert.present();
      })
    }
    else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Bitte geben Sie eine gültige E-Mail ein.',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  userDetails(){
    return this.afAuth.user;
  }

  async alert(header: any, subHeader: any, message: any, buttons: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [buttons]
    });

    await alert.present();
  }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
