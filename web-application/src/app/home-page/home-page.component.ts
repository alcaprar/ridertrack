import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
declare var $:any;

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

  ngAfterViewInit(){
    $('.selectpicker').selectpicker()

    setTimeout(function () {
      $('#counter').text('0');
      $('#counter1').text('0');
      $('#counter2').text('0');
      $('#counter3').text('0');
      setInterval(function () {
        var curval = parseInt($('#counter').text());
        var curval1 = parseInt($('#counter1').text().replace(' ', ''));
        var curval2 = parseInt($('#counter2').text());
        var curval3 = parseInt($('#counter3').text());
        if (curval <= 1007) {
          $('#counter').text(curval + 1);
        }
        if (curval1 <= 1280) {
          $('#counter1').text(sdf_FTS((curval1 + 20), 0, ' '));
        }
        if (curval2 <= 145) {
          $('#counter2').text(curval2 + 1);
        }
        if (curval3 <= 1022) {
          $('#counter3').text(curval3 + 1);
        }
      }, 2);
    }, 500);

    function sdf_FTS(_number, _decimal, _separator) {
      var decimal = (typeof (_decimal) != 'undefined') ? _decimal : 2;
      var separator = (typeof (_separator) != 'undefined') ? _separator : '';
      var r : any = parseFloat(_number);
      var exp10 = Math.pow(10, decimal);
      r = Math.round(r * exp10) / exp10;
      var rr = Number(r).toFixed(decimal).toString().split('.');
      var b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);
      r = (rr[1] ? b + '.' + rr[1] : b);

      return r;
    }
  }

}

