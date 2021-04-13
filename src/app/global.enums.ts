export enum orderactions {
    "SAVE" = "Сохранить",
    "PRINT" = "Печать",
    "PRECHECK" = "Пречек",
    "DISCOUNT" = "Дисконт",
    "CANCEL_ROW" = "Отмена",
    "PAY" = "Оплата"
}


// Turn enum into array
export function EnumToArray(enumme) {
    return Object.keys(enumme)
        .map(key => enumme[key]);
}