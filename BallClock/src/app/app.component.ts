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
    this.reset();
    this.startTime = moment();
    this.calculating = true;
    this.setupQueue()
    
    this.lapseMinutesTill12Hours();
  }

  setupQueue() {
    for (let i = 0; i < this.ballCount; i++) {
      this.queue.push(i)
    }
  }

  queueIsInOriginalOrder() {    
    let queueIsInOrder = true;
    let index = 0;
    for (let ball of this.queue) {
      if (ball != index) {
        queueIsInOrder = false;
        break;
      }
      index ++;
    }
    return queueIsInOrder;
  }

  lapseMinutesTill12Hours() {
    let keepLooping = true;

    while(keepLooping) {
      if (this.queueHasChanged && this.minuteTrack.length == 0 && this.fiveMinuteTrack.length == 0 && this.hourTrack.length == 0) {
        keepLooping = false;
        this.set12HourPattern();
        this.repeat12HourPattern();
      }
      else {
        this.dropMinuteBall();
      }
    }    
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
    let keepLooping = true;
    while (keepLooping) {
      if (!this.queueIsInOriginalOrder()) {
        this.apply12HourPattern();
      }
      else {
        keepLooping = false;
        this.calculateDaysToCompletion();
        this.endTime = moment();
        this.computationDuration = moment(this.endTime.diff(this.startTime)).format("m[m] s[s] SSS[ms]")
        this.calculating = false;
      }
    }
  }

  set12HourPattern() {
    const pattern = [];
    for (let i = 0; i < this.ballCount; i++) {
      let originalIndex = i;
      let newIndex = this.queue.findIndex((ball) => ball === i);
      pattern.push({originalIndex, newIndex});
    }
    this.pattern = pattern;
    console.log('here is pattern', this.pattern)
  }

  apply12HourPattern() {
    const newQueue = [];
    for (let i = 0; i < this.pattern.length; i++) {
      const patternIndex = this.pattern.find((p) => p.newIndex == i);
      newQueue.push(this.queue[patternIndex.originalIndex])
    }

    this.queue = newQueue;
    this.halfDaysPassed ++;
  }

  calculateDaysToCompletion() {
    this.daysToCompletion = this.halfDaysPassed / 2;
    this.showCalculation = true;
  }

  reset() {
    this.queue = [];
    this.minuteTrack = [];
    this.fiveMinuteTrack = [];
    this.hourTrack = [];
    this.halfDaysPassed = 0;
    this.daysToCompletion = 0;
    this.queueHasChanged = false;
    this.showCalculation = false;
    this.startTime = null;
    this.endTime = null;
    this.computationDuration = null;
    this.pattern = [];
  }

}
