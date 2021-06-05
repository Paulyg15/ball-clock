import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public ballCount: any = 27;
  public minuteTrack: any[];
  public fiveMinuteTrack: any[];
  public hourTrack: any[];
  public clockHour: string = '00';
  public clockMinute: string = '00';


  setClockHour() {
    
  }
}
