import { map } from 'rxjs/operators';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMenuStore from './menu-store.reducer';

export const selectMenuStoreState = createFeatureSelector<fromMenuStore.MenuStore>(
  fromMenuStore.menuStoreFeatureKey
);

export const selectAllMenuEntities = createSelector(
  selectMenuStoreState,
  fromMenuStore.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectMemuByid = createSelector(
  selectAllMenuEntities,
  (entities,id) => {return entities[id]}
)



export const selectAllMenu = createSelector(
  selectMenuStoreState,
  fromMenuStore.selectAll
)

export const selectMemuByParent = createSelector(
  selectAllMenu,
  (elements: fromMenuStore.Menu[]  ,id:string) => {
    
    return elements.filter(el => el.parentid === id);
  }
)

export const selectMemuByName = createSelector(  selectAllMenu,
  (goods: fromMenuStore.Menu[]  ,props) => {
    const res = goods = goods.filter(element => {return ((!element.isFolder || props.withfolders) && element.name.toUpperCase().search(props.filter)!=-1)}).slice(0,20);
    return res
  
  }
)

