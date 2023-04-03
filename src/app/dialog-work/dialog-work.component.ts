import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-work',
  templateUrl: './dialog-work.component.html',
  styleUrls: ['./dialog-work.component.css'],
})
export class DialogWorkComponent implements OnInit {
  confirmButtonText: string = 'ვეთანხმები';
  cancelButtonText: string = 'ვუარყოფ';
  constructor(public dialogRef: MatDialogRef<DialogWorkComponent>) {}

  ngOnInit(): void {}

  onConfirmClick(bool: boolean): void {
    this.dialogRef.close(bool);
  }
}
