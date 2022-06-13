import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';    
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';
import { Step } from 'ionic2-calendar/calendar';
import { EditObjectPage } from '../edit-object/edit-object.page';
import { AuthServiceService } from '../services/auth-service.service';


@Component({
  selector: 'app-object-info',
  templateUrl: './object-info.page.html',
  styleUrls: ['./object-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ObjectInfoPage implements OnInit {

  constructor(public popoverController: PopoverController, public actionSheetController: ActionSheetController, public authService: AuthServiceService, public modalController: ModalController, public db: AngularFirestore, public alertController: AlertController) {
  }

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    step: 30 as Step,
    locale: 'de-DE'
  }
  selectedDate = new Date();

  @Input()
  oid;
  category;

  uid;
  role;

  students = [];
  student = {id: -1, name: "Person auswählen", uid: ""};

  startDate;
  startDateText;
  endDate;
  endDateText;

  object;

  lehrer: any;
  schueler: any;

  async ngOnInit() {
    this.authService.userDetails().subscribe(async (user: any) => {
      this.uid = user.uid
      this.db.collection('users').doc(this.uid).ref.get().then(async (_user: any) => {
        this.role = _user.data().role
      })
    })
    this.getObjectInfos()
    this.getStudents()
    this.loadCalendar();
  }

notes;

  async URLReplacer(e){
    if(e.includes('https://')){
      const count = e.split(' https://').length
      var str = ' ' + e
      for (let index = 0; index < count; index++) {
        if(str.includes(' https://')){
          var urlPos = str.indexOf(' https://')
          var url = str.slice(urlPos + 1)
          var urlLastPos = url.indexOf(' ')
          if(urlLastPos == -1){
            var urlTrunc = url.slice(0)
          }
          else{
            var urlTrunc = url.slice(0, url.indexOf(' '))
          }
          var urlLink = '<a href="' + urlTrunc + '">' + urlTrunc + '</a>'
          str = str.replace(urlTrunc, urlLink)
          this.notes = str
          /* var urlTruncCheck = str.slice(str.indexOf(' https://') - 1).slice(0, 9)

            var urlTrunc = '<a href="' + url + '">' + url + '</a>'
            str = str.replace(url, urlTrunc)
            this.notes = str */
        }
      }
    }
    else{
      this.notes = e
    }
  }

  async getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  async checkToday(){
    var now = new Date();

    this.eventSource.forEach(event => {
      if(now >= event.startTime && now <= event.endTime){
        this.db.collection('users').doc(event.lehrer).ref.get().then((lehrer: any) => {
          this.lehrer = lehrer.data()
        })
        this.db.collection('users').doc(event.schueler).ref.get().then((schueler: any) => {
          this.schueler = schueler.data()
        })
      }
    })
    
  }

  async loadCalendar(){
    this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').snapshotChanges().subscribe(colSnap => {
      this.eventSource = []
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        this.eventSource.push(event);
      })
      this.checkToday()
    })
  }

  async getObjectInfos(){
    this.db.collection('categories').doc(this.category).collection('Objects').ref.where("oid", "==", this.oid).get().then(async (objects: any) => {
      objects.forEach(object => {
        this.object = object.data()
        this.URLReplacer(this.object.notes)
      });
    })
  }

  async getStudents() {
    this.db.collection('users').ref.get().then(async (users: any) => {
      var i = 0
      users.forEach(user => {
        this.students.push({ id: i, name: user.data().name, uid: user.id })
        i++
      });
    })
  }

  formatDateStart(value) {
    this.startDateText = format(parseISO(value), 'dd.MM.yyyy');
    return new Date(value);
  }

  formatDateEnd(value) {
    this.endDateText = format(parseISO(value), 'dd.MM.yyyy');
    return new Date(value);
  }

  catDays: any[] = [];

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async kekek(start, end, loop){
    var alrStart = new Date(start * 1000)
    var alrEnd = new Date(end * 1000)
    alrStart.setHours(0, 0, 0, 0)
    alrEnd.setHours(0, 0, 0, 0)
    loop.setHours(0, 0, 0, 0)
    if(alrStart <= loop && alrEnd >= loop){
      this.valid.push(false)
    }
    else{
      this.valid.push(true)
    }
    
    return true
  }

  valid: any = []

  async addNewEvent() {
    this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').ref.get().then(async (docs: any) => {
      var idx = 1
      if(docs.size == 0){
        let start = this.startDate;
        let end = this.endDate;
        let event = {
        title: 'Reserviert von: ' + this.student.name /* start.getMinutes() */,
        startTime: start,
        endTime: end,
        allDay: true,
        lehrer: this.uid,
        schueler: this.student.uid
      }
        this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').add(event)
      }
      docs.forEach(async doc => {
          let loop = new Date(this.startDate);
          let newloop = loop.setDate(loop.getDate());
          loop = new Date(newloop);
          
          for (let newloop = new Date(loop.setDate(loop.getDate())); newloop <= this.endDate; newloop = new Date(loop.setDate(loop.getDate() + 1))) {
            await this.kekek(doc.data().startTime.seconds, doc.data().endTime.seconds, newloop);
          }
          if (idx === docs.size){ 
            this.gogo()
          }
          idx++

          /* while (loop <= this.endDate) {
            //console.log(loop); EVERY DAY

            var alrStart = new Date(doc.data().startTime.seconds * 1000)
            var alrEnd = new Date(doc.data().endTime.seconds * 1000)

            if(alrStart <= loop && alrEnd >= loop){
              const alert = await this.alertController.create({
                header: "Oopsie",
                message: "Du überschneidest mit einem anderen Termin.",
                buttons: ["RETRY"]
              })
        
              await alert.present();

              valid = false
              return;
            }

            let newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
          } */
      })
    })
  }

  async gogo(){
    if(this.student.id < 0){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte erst Schüler wählen.",
        buttons: ["RETRY"]
      })

      await alert.present();
      this.valid = []
    }
    else if (this.startDate > this.endDate){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Startdatum ist später als das Enddatum.",
        buttons: ["RETRY"]
      })

      await alert.present();
      this.valid = []
    }
    else{
      let start = this.startDate;
      let end = this.endDate;
      end.setMinutes(end.getMinutes() + 60);
  
      let event = {
        title: 'Reserviert von: ' + this.student.name /* start.getMinutes() */,
        startTime: start,
        endTime: end,
        allDay: true,
        lehrer: this.uid,
        schueler: this.student.uid
      }
      if(this.valid.includes(false)){
        const alert = await this.alertController.create({
          header: "Oopsie",
          message: "Du überschneidest mit einem anderen Termin.",
          buttons: ["RETRY"]
        })
        await alert.present();
        this.valid = []
      }
      else{    
        this.valid = []    
        console.log(this.category, this.oid) 
        this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').add(event)
      }
    }
    this.valid = []
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }
  
  async onEventSelected(event){
    /* console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title) */
      const actionSheet = await this.actionSheetController.create({
        header: event.title,
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
            this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').doc(event.id).delete();
          }
        }, {
          text: 'Abbrechen',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            
          }
        }]
      });
      await actionSheet.present();
  }

  async editObject(object){
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: EditObjectPage,
      cssClass: 'my-custom-class',
      componentProps: {
        category: this.category,
        oid: object.oid
      }
    });
    return await modal.present();
  }

  async deactivateObject(){
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung',
      message: 'Willst du <strong>' + this.object.name + '</strong> wirklich deaktivieren?',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).update({
              deactivated: true
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async activateObject(){
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung',
      message: 'Willst du <strong>' + this.object.name + '</strong> wirklich aktivieren?',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).update({
              deactivated: false
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteObject(){
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Achtung',
      message: 'Willst du <strong>' + this.object.name + '</strong> wirklich löschen?',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).delete()
            this.closeModal()
          }
        }
      ]
    });

    await alert.present();
  }

  onTimeSelected(ev){
    /* console.log('Selected time:' + ev.selectedTime + ', has Events: ' + 
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled); */
    this.selectedDate = ev.selectedTime;
  }

  onCurrentDateChanged(event: Date){
    /* console.log('current date change: ' + event) */
  }

  onRangeChanged(ev){
    /* console.log('range changed: start Time: ' + ev.startTime + ', end Time' + ev.endTime) */
  }

  closeModal(){
    this.modalController.dismiss()
  }

}
 