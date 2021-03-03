import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
})
export class BottomSheetComponent implements OnInit {

  currentPosition;

  height;

  minimunThreshold;

  startPosition;

  bottomSheet:HTMLElement;
  bg:HTMLElement;

  constructor() { }

  ngOnInit() {
    this.bottomSheet = document.querySelector(".bottomSheet");
    this.bg = document.querySelector(".bg");
    this.height = this.bottomSheet.clientHeight;
    this.close()
  }

  open() {
    this.bottomSheet.style.bottom = "0px";
    this.bg.style.display = "block";
  }

  close() {
    this.currentPosition = 0;
    this.startPosition= 0;

    this.bottomSheet.style.bottom = "-1000px";

    this.bottomSheet.style.transform = "translate3d(0px,0px,0px)";
    
    this.bg.style.display = "none";
  }

  touchMove(evt: TouchEvent) {
    if(this.startPosition == 0){
      this.startPosition = evt.touches[0].clientY;
    }
    
    this.height = this.bottomSheet.clientHeight;
    
    let y = evt.touches[0].clientY;
    
    this.currentPosition = y - this.startPosition;
    
    if (this.currentPosition > 0 && this.startPosition > 0) {
      this.bottomSheet.style.transform = `translate3d(0px,${this.currentPosition}px,0px)`;
    }
  }

  touchEnd() {
    this.minimunThreshold = this.height - (this.height/1.5);
    this.minimunThreshold = this.minimunThreshold == 0 ? 150 : this.minimunThreshold;

    if (this.currentPosition < this.minimunThreshold) {
      this.bottomSheet.style.transform = "translate3d(0px,0px,0px)";
    } else {
      this.close();
    }
  }

}
