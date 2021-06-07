import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public ballCount: number;
  public queue: any[] = [];
  public minuteTrack: any[] = [];
  public fiveMinuteTrack: any[] = [];
  public hourTrack: any[] = [];
  public halfDaysPassed: number = 0;
  public daysToCompletion: number = 0;
  public queueHasChanged: boolean;
  public showCalculation: boolean;
  public startTime: any;
  public endTime: any;
  public computationDuration: any;
  public pattern: any[];
  public calculating: boolean;


  setBallCount() {
    this.startTime = moment();
    this.calculating = true;
    this.setupQueue()
    this.minuteTrack = [];
    this.fiveMinuteTrack = [];
    this.hourTrack = [];
    this.lapseMinutesTill12Hours();
  }

  setupQueue() {
    for (let i = 0; i < this.ballCount; i++) {
      this.queue.push(`Ball${i}`)
    }
  }

  queueIsInOriginalOrder() {
    if (!this.queueHasChanged) {
      return false;
    }
    
    let queueIsInOrder = true;
    let index = 0;
    for (let ball of this.queue) {
      if (ball != `Ball${index}`) {
        queueIsInOrder = false;
        break;
      }
    }
    return queueIsInOrder;
  }

  lapseMinutesTill12Hours() {
    while(!(this.queueHasChanged && this.minuteTrack.length == 0 && this.fiveMinuteTrack.length == 0 && this.hourTrack.length == 0)) {
      this.dropMinuteBall();
    }

    this.set12HourPattern();
    this.repeat12HourPattern();

    // const interval = setInterval(() => {
    //   if (this.queueHasChanged && this.minuteTrack.length == 0 && this.fiveMinuteTrack.length == 0 && this.hourTrack.length == 0) {
    //     clearInterval(interval);
    //     this.set12HourPattern();
    //     this.repeat12HourPattern();
    //   }
    //   else {
    //     this.dropMinuteBall();
    //   }
    // }, 1)
  }

  dropMinuteBall() {
    const ball = this.queue.shift();
    if (this.minuteTrack.length < 4) {
      this.minuteTrack.push(ball)
    }
    else {
      this.queue = this.queue.concat(this.minuteTrack.reverse())
      this.minuteTrack = [];
      this.dropFiveMinuteBall(ball);
    }

    this.queueHasChanged = true;
  }

  dropFiveMinuteBall(ball: any) {    
    if (this.fiveMinuteTrack.length < 11){
      this.fiveMinuteTrack.push(ball);
    } 
    else {
      this.queue = this.queue.concat(this.fiveMinuteTrack.reverse())
      this.fiveMinuteTrack = [];
      this.dropHourBall(ball);    
    }
  }

  dropHourBall(ball: any) {
    if (this.hourTrack.length < 11) {
      this.hourTrack.push(ball);
    }
    else {
      this.queue = this.queue.concat(this.hourTrack.reverse())
      this.hourTrack = [];
      this.queue.push(ball);

      this.halfDaysPassed ++;
      console.log('queue after 12 hours', this.queue)
    }
  }

  repeat12HourPattern() {
    while (!this.queueIsInOriginalOrder()) {
      this.apply12HourPattern();
    }

    this.calculateDaysToCompletion();
    this.endTime = moment();
    this.computationDuration = moment(this.endTime.diff(this.startTime)).format("m[m] s[s]")
    this.calculating = false;

    // const patternInterval = setInterval(() => {
    //   if (this.queueIsInOriginalOrder()) {
    //     this.calculateDaysToCompletion();
    //     this.endTime = moment();
    //     this.computationDuration = moment(this.endTime.diff(this.startTime)).format("m[m] s[s]")
    //     this.calculating = false;
    //     clearInterval(patternInterval);
    //   }
    //   else {
    //     this.apply12HourPattern();
    //   }
    // }, 1)
  }

  set12HourPattern() {
    const pattern = [];
    for (let i = 0; i < this.ballCount; i++) {
      const originalIndex = i;
      const newIndex = this.queue.findIndex((ball) => ball === `Ball${i}`);
      pattern.push({originalIndex, newIndex});
    }
    this.pattern = pattern.sort((a,b) => a.newIndex > b.newIndex ? -1 : 1);
    console.log('here is pattern', this.pattern)
  }

  apply12HourPattern() {
    const newQueue = [];
    for (let i of this.pattern) {
      newQueue.push(`Ball${i.originalIndex}`)
    }

    this.queue = newQueue;
  }

  calculateDaysToCompletion() {
    this.daysToCompletion = this.halfDaysPassed * 2;
    this.showCalculation = true;
  }

}
