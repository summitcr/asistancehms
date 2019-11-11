import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';



@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  points: any;
  platfrom: any;
  scanSub: any;
  constructor(private services: CrudService, private params: UtilsService, private qrScanner: QRScanner,private toast: Toast)
   {

   }

  ngOnInit() {
    //this.getPoints();
  }
  alert(msg: string){
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );    
  }
  getPoints() {

    this.services.get(this.params.params.pointsurl).subscribe((resp) => {
      this.points = resp;
      console.log(this.points);
    }, (err) => {
      alert("error");
      console.error(err);
    });
  }

  QR() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          document.getElementsByTagName("body")[0].style.opacity = "0";
          this.qrScanner.show();
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            document.getElementsByTagName("body")[0].style.opacity = "1";
           this.alert('Scanned something'+ text);

            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }


}//fin de la classs tab2
