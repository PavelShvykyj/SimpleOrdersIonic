export enum orderactions {
    "SAVE" = "Сохранить",
    "FISKAL" = "Фискал",
    "PRINT" = "Печать",
    "PRECHECK" = "Пречек",
    "DISCOUNT" = "Дисконт",
    "CANCEL_ROW" = "Отмена",
    "PAY" = "Оплата",
    "ANKETA" = "Анкета"
}


// Turn enum into array
export function EnumToArray(enumme) {
    return Object.keys(enumme)
        .map(key => enumme[key]);
}