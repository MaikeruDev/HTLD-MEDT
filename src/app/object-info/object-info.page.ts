import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';    

@Component({
  selector: 'app-object-info',
  templateUrl: './object-info.page.html',
  styleUrls: ['./object-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ObjectInfoPage implements OnInit {

  constructor(public modalController: ModalController, private db: AngularFirestore,) {
    this.db.collection('test').snapshotChanges().subscribe(colSnap => {
      this.eventSource = []
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        this.eventSource.push(event);
      })
    })
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

  ngOnInit() {

  }

  nextSlide(){
  }

  addNewEvent() {
    let start = this.selectedDate;
    let end = this.selectedDate;
    end.setMinutes(end.getMinutes() + 60);

    let event = {
      title: 'Event # - ' + start.getMinutes(),
      startTime: start,
      endTime: end,
      allDay: false
    }

    this.db.collection('test').add(event)
  }

  onViewTitleChanged(title){
    console.log(title)
    this.viewTitle = title;
  }
  
  onEventSelected(event){
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title)
  }

  onTimeSelected(ev){
    console.log('Selected time:' + ev.selectedTime + ', has Events: ' + 
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    this.selectedDate = ev.selectedTime;
  }

  onCurrentDateChanged(event: Date){
    console.log('current date change: ' + event)
  }

  onRangeChanged(ev){
    console.log('range changed: start Time: ' + ev.startTime + ', end Time' + ev.endTime)
  }

  closeModal(){
    this.modalController.dismiss()
  }

}
 