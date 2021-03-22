import { Observable, pipe } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.page.html',
  styleUrls: ['./addons.page.scss'],
})
export class AddonsPage implements OnInit {


  keys$ : Observable<Array<string>>

  constructor(private db : DatabaseService) { }

  ngOnInit() {
    this.keys$ = this.db.GetKeys();
  }

  Clear(key: string) {
    this.db.DellItem(key);
  }

  Wiev(key: string) {
    this.db.GetData(key).pipe(take(1)).subscribe(
      data => {console.log(data)}
    )
  }
}
