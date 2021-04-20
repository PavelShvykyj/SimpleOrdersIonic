import { createAction, props } from '@ngrx/store';

export const loadNetcontrols = createAction(
  '[Netcontrol service] set net params',
  props<{  netType : string, isConnected : boolean  }>()
);

export const setIP = createAction(
  '[Netcontrol service] set IP on net change',
  props<{  IP : string  }>()

  );  

  export const setPing = createAction(
    '[onec service] set ping status',
    props<{  status  : boolean , answer : string }>()
    );  
  


  export const setNetCorrect = createAction(
    '[Netcontrol service] set is net correct on net change',
    props<{  onecip : string  }>()
  
    );  
  

