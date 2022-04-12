import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-object-info',
  templateUrl: './object-info.page.html',
  styleUrls: ['./object-info.page.scss'],
})
export class ObjectInfoPage implements OnInit {

  constructor(public modalController: ModalController) { }

  @Input()
  oid;

  ngOnInit() {
  }

  closeModal(){
    this.modalController.dismiss()
  }

}
