import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-registro-covid',
  templateUrl: './registro-covid.page.html',
  styleUrls: ['./registro-covid.page.scss'],
})
export class RegistroCovidPage implements OnInit {
  myForm: FormGroup;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder) {
    this.myForm = this.createMyForm();
  }

  ngOnInit() {
  }




  saveData() {
    console.log(this.myForm.value);
  }

  private createMyForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
     cedula: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.maxLength(70),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),Validators.required
      ])],
      dateBirth: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }
}
