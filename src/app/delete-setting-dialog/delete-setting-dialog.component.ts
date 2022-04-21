import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-setting-dialog',
  templateUrl: './delete-setting-dialog.component.html',
  styleUrls: ['./delete-setting-dialog.component.scss']
})
export class DeleteSettingDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteSettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { settingName: string }) { }

  ngOnInit(): void {
  }

  removeFromCard() {
    this.dialogRef.close({ button: 'removeFromCard' });
  }

  cancel() {
    this.dialogRef.close({ button: 'cancel' });
  }
}
