import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirService } from './service/air.service';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { DialogWorkComponent } from './dialog-work/dialog-work.component';
import { Markers } from './interface/markers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subscription();

  warrningBool!: boolean;
  season!: string;

  ls = localStorage.getItem('theme');
  darkLight: boolean = false;

  options!: EChartsOption;
  mergeOptions!: EChartsOption;

  zoom: number = 3;

  items: any = [];
  overall!: number;

  constructor(private airService: AirService, public dialog: MatDialog) {}

  toggleDarkTheme(): void {
    if (localStorage.getItem('theme')) {
      document.body.classList.remove('dark-theme');
      localStorage.removeItem('theme');
      this.darkLight = false;
    } else {
      localStorage.setItem('theme', 'dark-mode');
      document.body.classList.add('dark-theme');
      this.darkLight = true;
    }
  }

  ngOnInit() {
    this.setCurrentLocation();
    this.getSeason();
    this.destroy$ = this.airService
      .getData(this.markers[0].lat, this.markers[0].lng)
      .subscribe((x) => {
        this.items = Object.entries(x);

        if (x.NO2.aqi > 0) {
          this.openDialog();
        } else {
          this.warrningBool = false;
        }

        this.overall = this.items[this.items.length - 1][1];

        this.options = {
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              ['product', ...this.items.map((item: AirArray) => item[0])],
              [
                'AQI',
                ...this.items
                  .slice(0, this.items.length - 1)
                  .map((item: AirArray) => item[1].aqi),
              ],
              [
                'Concentration',
                ...this.items
                  .slice(0, this.items.length - 1)
                  .map((item: AirArray) => item[1].concentration),
              ],
            ],
          },

          xAxis: { type: 'category' },
          yAxis: {},

          series: [
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
            { type: 'bar' },
          ],
        };
      });

    this.ls
      ? document.body.classList.add('dark-theme')
      : document.body.classList.remove('dark-theme');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogWorkComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.warrningBool = confirmed;
    });
  }

  setDate() {
    this.mergeOptions = {
      dataset: {
        source: [
          ['product', ...this.items.map((item: AirArray) => item[0])],
          [
            'AQI',
            ...this.items
              .slice(0, this.items.length - 1)
              .map((item: AirArray) => item[1].aqi),
          ],
          [
            'Concentration',
            ...this.items
              .slice(0, this.items.length - 1)
              .map((item: AirArray) => item[1].concentration),
          ],
        ],
      },
    };
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  markerDragEnd(m: Markers, $event: google.maps.MouseEvent) {
    this.markers[0].lat = $event.latLng.lat();
    this.markers[0].lng = $event.latLng.lng();
    this.airService
      .getData(this.markers[0].lat, this.markers[0].lng)
      .subscribe((x) => {
        if (x.NO2.aqi > 0) {
          this.openDialog();
        } else {
          this.warrningBool = false;
        }
        this.items = Object.entries(x);
        this.setDate();
      });
  }

  setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.markers[1].lat = position.coords.latitude;
      this.markers[1].lng = position.coords.longitude;
    });
  }

  getSeason() {
    const month = new Date().getMonth() + 1;

    const springStart = 3;
    const springEnd = 5;
    const summerStart = 6;
    const summerEnd = 8;
    const autumnStart = 9;
    const autumnEnd = 11;

    if (month >= springStart && month <= springEnd) {
      this.season = 'spring';
    } else if (month >= summerStart && month <= summerEnd) {
      this.season = 'summer';
    } else if (month >= autumnStart && month <= autumnEnd) {
      this.season = 'autumn';
    } else {
      this.season = 'winter';
    }
  }

  markers: Markers[] = [
    {
      lat: Math.random() * 10,
      lng: Math.random() * 10,
      label: 'A',
      draggable: true,
    },
    {
      lat: 0,
      lng: 0,
      label: 'შენ',
      draggable: false,
    },
  ];
}

type AirArray = [string, { aqi: number; concentration: number }];
