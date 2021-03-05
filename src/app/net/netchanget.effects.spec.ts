import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { NetchangetEffects } from './netchanget.effects';

describe('NetchangetEffects', () => {
  let actions$: Observable<any>;
  let effects: NetchangetEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetchangetEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(NetchangetEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
