import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
import { CategoriesPage } from '../categories/categories.page';
import { NewObjectPage } from '../new-object/new-object.page';
import { ObjectInfoPage } from '../object-info/object-info.page';
import { ProfilePage } from '../profile/profile.page';
import { QrcodePage } from '../qrcode/qrcode.page';
import { AuthServiceService } from '../services/auth-service.service';
import { TeachersPage } from '../teachers/teachers.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public afAuth: AngularFireAuth, public modalController: ModalController, private db: AngularFirestore, public loadingController: LoadingController, public authService: AuthServiceService) {}

  categories: any = [];
  myCategories: any = [];

  role;

  async ngOnInit() {
    this.authService.userDetails().subscribe(async (user: any) => {
      this.uid = user.uid
      this.db.collection('users').doc(this.uid).ref.get().then(async (_user: any) => {
        this.role = _user.data().role
      })
    })
    await this.clearAll();
    await this.activateLoader();
    await this.loadCategories();
  }

  all: any = "All";

  uid: any;

  segmentChanged(event){
      this.all = event.detail.value;
  }

  async activateLoader(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Einen Moment...'
    });
    await loading.present();
  }

  async loadCategories(){
    await this.db.collection('categories').ref.get().then(async (_categories: any) => {
      _categories.forEach(async _category => {
        var tempCategory = _category.data();
        tempCategory.cid = _category.id;
        
        var _tempCategory = _category.data();
        _tempCategory.cid = _category.id;
        var objects = [];
        var myObjects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            var temp = _object.data();
            temp.id = _object.id;
            if(this.role == 'teacher'){
              this.db.collection('categories').doc(_category.id).collection('Objects').doc(_object.id).collection('reservierungen').ref.where("lehrer", "==", this.uid).get().then(async (_docs: any) => {
                _docs.forEach(_doc => {
                  var now = new Date()
                  var startTime = _doc.data().startTime
                  var endTime = _doc.data().endTime
                  if(startTime.toDate() < now && endTime.toDate() > now){
                    var _temp = _doc.data()
                    _temp.oid = _doc.id
                    myObjects.push(temp)
                    myObjects.sort((a,b) => a.status.localeCompare(b.status));
                  }
                });
              })
            }
            else{
              if(this.role == 'student'){
                this.db.collection('categories').doc(_category.id).collection('Objects').doc(_object.id).collection('reservierungen').ref.where("schueler", "==", this.uid).get().then(async (_docs: any) => {
                  _docs.forEach(_doc => {
                    var now = new Date()
                    var startTime = _doc.data().startTime
                    var endTime = _doc.data().endTime
                    if(startTime.toDate() < now && endTime.toDate() > now){
                      var _temp = _doc.data()
                      _temp.oid = _doc.id
                      myObjects.push(temp)
                      myObjects.sort((a,b) => a.status.localeCompare(b.status));
                    }
                  });
                })
              }
            }
            objects.push(temp)
            objects.sort((a,b) => a.status.localeCompare(b.status));
          });
        })
        tempCategory.objects = objects
        this.categories.push(tempCategory)
        this.categories.sort((a,b) => a.name.localeCompare(b.name));
        
        _tempCategory.objects = myObjects
        this.myCategories.push(_tempCategory)
        this.myCategories.sort((a,b) => a.name.localeCompare(b.name));
      });
    }).then(res => {
      this.loadingController.dismiss()
    })
  }

  async clearAll(){
    this.categories = []
    this.myCategories = []
  }

  async refresh(event){
    this.clearAll()
    await this.db.collection('categories').ref.get().then(async (_categories: any) => {
      _categories.forEach(async _category => {
        var tempCategory = _category.data();
        tempCategory.cid = _category.id;

        var _tempCategory = _category.data();
        _tempCategory.cid = _category.id;
        var objects = [];
        var myObjects = [];
        await this.db.collection('categories').doc(_category.id).collection('Objects').ref.get().then(async (_objects: any) =>{
          _objects.forEach(async _object => {
            var temp = _object.data();
            temp.id = _object.id;
            if(this.role == 'teacher'){
              this.db.collection('categories').doc(_category.id).collection('Objects').doc(_object.id).collection('reservierungen').ref.where("lehrer", "==", this.uid).get().then(async (_docs: any) => {
                _docs.forEach(_doc => {
                  var now = new Date()
                  var startTime = _doc.data().startTime
                  var endTime = _doc.data().endTime
                  if(startTime.toDate() < now && endTime.toDate() > now){
                    var _temp = _doc.data()
                    _temp.oid = _doc.id
                    myObjects.push(temp)
                    myObjects.sort((a,b) => a.status.localeCompare(b.status));
                  }
                });
              })
            }
            else{
              if(this.role == 'student'){
                this.db.collection('categories').doc(_category.id).collection('Objects').doc(_object.id).collection('reservierungen').ref.where("schueler", "==", this.uid).get().then(async (_docs: any) => {
                  _docs.forEach(_doc => {
                    var now = new Date()
                    var startTime = _doc.data().startTime
                    var endTime = _doc.data().endTime
                    if(startTime.toDate() < now && endTime.toDate() > now){
                      var _temp = _doc.data()
                      _temp.oid = _doc.id
                      myObjects.push(temp)
                      myObjects.sort((a,b) => a.status.localeCompare(b.status));
                    }
                  });
                })
              }
            }
            objects.push(temp)
            objects.sort((a,b) => a.status.localeCompare(b.status));
          });
        })
        tempCategory.objects = objects
        this.categories.push(tempCategory)
        this.categories.sort((a,b) => a.name.localeCompare(b.name));
        
        _tempCategory.objects = myObjects
        this.myCategories.push(_tempCategory)
        this.myCategories.sort((a,b) => a.name.localeCompare(b.name));
      });
    }).then(res => {
       try {
        event.target.complete();
       } catch (error) {
         
       }
    })
  }

  myObjects: any = []

  async openQRCode(){
    const modal = await this.modalController.create({
      component: QrcodePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openProfile(){
    const modal = await this.modalController.create({
      component: ProfilePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openObjectInfo(oid, category){
    const modal = await this.modalController.create({
      component: ObjectInfoPage,
      cssClass: 'my-custom-class',
      componentProps: { 
        oid: oid,
        category: category
      }
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

  async addObject(category){
    const modal = await this.modalController.create({
      component: NewObjectPage,
      cssClass: 'my-custom-class',
      componentProps: { 
        category: category
      }
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

  async openCategories() {
    const modal = await this.modalController.create({
      component: CategoriesPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      this.refresh("")
    });
    return await modal.present();
  }

  async openTeachers(){
    const modal = await this.modalController.create({
      component: TeachersPage,
      cssClass: 'my-custom-class'
    });

    return await modal.present();
  }

}
