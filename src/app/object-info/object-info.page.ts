import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';    
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';
import { AuthServiceService } from '../services/auth-service.service';


@Component({
  selector: 'app-object-info',
  templateUrl: './object-info.page.html',
  styleUrls: ['./object-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ObjectInfoPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, public authService: AuthServiceService, public modalController: ModalController, private db: AngularFirestore, public alertController: AlertController) {
  }

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    step: '30'
  }
  selectedDate = new Date();

  @Input()
  oid;
  category;

  uid;

  students = [];
  student = {id: -1, name: "Schüler auswählen", uid: ""};

  startDate;
  startDateText;
  endDate;
  endDateText;

  object;

  lehrer: any;
  schueler: any;

  async ngOnInit() {
    this.authService.userDetails().subscribe((user: any) => {
      this.uid = user.uid
    })
    this.getObjectInfos()
    this.getStudents()
    this.loadCalendar();
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
      });
    })
  }

  async getStudents() {
    this.db.collection('users').ref.where("role", "==", "student").get().then(async (users: any) => {
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

  async addNewEvent() {
    if(this.student.id < 0){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Bitte erst Schüler wählen.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else if (this.startDate > this.endDate){
      const alert = await this.alertController.create({
        header: "Oopsie",
        message: "Startdatum ist später als das Enddatum.",
        buttons: ["RETRY"]
      })

      await alert.present();
    }
    else{
      let start = this.startDate;
      let end = this.endDate;
      end.setMinutes(end.getMinutes() + 60);
  
      let event = {
        title: 'Ausgeliehen von: ' + this.student.name /* start.getMinutes() */,
        startTime: start,
        endTime: end,
        allDay: true,
        lehrer: this.uid,
        schueler: this.student.uid
      }
  
      this.db.collection('categories').doc(this.category).collection('Objects').doc(this.oid).collection('reservierungen').add(event)
      /* var loop = new Date(start);
      while(loop <= end){
        alert(loop);           

        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      } */
    }
  }

  onViewTitleChanged(title){
    /* console.log(title) */
    this.viewTitle = title;
  }
  
  async onEventSelected(event){
    /* console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title) */
      const actionSheet = await this.actionSheetController.create({
        header: 'Reservierung',
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
            console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
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
 