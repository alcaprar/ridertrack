import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import {Router} from "@angular/router";
import {EventService} from "../shared/services/event.service";
import {Event} from '../shared/models/event'
declare var $:any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  @ViewChild('searchKeyword') searchKeyword: ElementRef;
  @ViewChild('searchType') searchType: ElementRef;

  private lastEvents: Event[];
  private eventTypes: String[];

  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  private loading = true;

  constructor(private eventService: EventService, private router: Router) {
    // retrieve the event types
    this.eventTypes = this.eventService.getEventTypes();
    // retrive the last 7 events
    this.eventService.getLastEvents(7)
      .then(
        (events) =>{
          console.log('[HomePage][getLastEvents][success]', events);
          this.loading = false;
          this.lastEvents = events;
        }
      )
      .catch(
        (error) =>{
          console.log('[HomePage][getLastEvents][error]', error);
        }
      )
  }

  ngAfterViewInit(){
    $('.selectpicker').selectpicker();

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

  /**
   * It is called when the search button is clicked.
   */
  search(){
    var keyword = (this.searchKeyword.nativeElement.value === '') ? undefined : this.searchKeyword.nativeElement.value;
    var type = (this.searchType.nativeElement.value == -1) ? undefined : this.searchType.nativeElement.value;


    console.log('[HomePage][search]',this.searchType.nativeElement.value, 'keyword ', keyword, 'type: ', type);

    this.router.navigate([ '/events' ], {
      queryParams: {
        keyword: keyword,
        type: type
      }
    });
  }

}

