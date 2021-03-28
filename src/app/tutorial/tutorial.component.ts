import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {

  constructor(
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router,
  ) { }

  ngOnInit() {}

  async finish(){
    await this.storeService.localSave(this.localParam.localParam.tutorial, true);
    this.router.navigateByUrl('/login');
  }
}//fin de la class
