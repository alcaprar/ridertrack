import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  public myDatePickerOptions: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    height: '40px',
    disableUntil: {year: 2016, month: 8, day: 10},
    minYear: 2017,
    showClearDateBtn:false,
    editableDateField:false,
    openSelectorOnInputClick: true,
    ariaLabelInputField: 'Choose date',


  };

  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor() { }

}

