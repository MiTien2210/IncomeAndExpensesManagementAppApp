export const ICON = {
    INCOME: '💵',
    EXPENSE: '💸',
    MONEY: '💰',
    CALENDAR: '📅',
    CATEGORY: '📂',
    FATHER_CATEGORY:'🗂️',
    DETAIL_CATEGORY:'📑',
    NOTE: '📝',
    REWARD: '🎁',
    TRAVEL: '🚗',
    BUY: '🛒',
    BILL: '🧾',
    MARK: '🏬',
    EDIT:'✏️',
    DELETE:'🗑️',
    ADD:'➕',
    FINISH:'✅',
    CLOSE:'❌',
    CHART:'📊',
    CHART_INCREASE:'📈',
    CHART_DECREASE:'📉',
    OTHER: '...'
}
export const categoryList = {
    income: [
        {
            id: 1,
            text: 'Lương',
            type: 'other',
            highlight: true,
            color: 'pink',
            typeColor: 'blue',
            emoji: '💰',
        },
        {
            id: 2,
            text: 'Thưởng',
            type: 'other',
            highlight: true,
            color: 'blue',
            typeColor: 'blue',
            emoji: '🎁',
        },
        {
            id: 3,
            text: 'Khác',
            type: 'other',
            highlight: true,
            color: 'yellow',
            typeColor: 'blue',
            emoji: '⋯',
        },
    ],
    expense: [
        {
            id: 1,
            text: 'Ăn uống',
            type: 'Chi tiêu - Sinh hoạt',
            highlight: true,
            color: 'blue',
            typeColor: 'blue',
            emoji: '🍽️',
        },
        {
            id: 2,
            text: 'Mua sắm',
            type: 'Chi phí phát sinh',
            highlight: true,
            color: 'red',
            typeColor: 'green',
            emoji: '🛒',
        },
        {
            id: 3,
            text: 'Đi lại',
            type: 'Chi tiêu - Sinh hoạt',
            highlight: true,
            color: 'pink',
            typeColor: 'blue',
            emoji: '🚗',
        },
        {
            id: 4,
            text: 'Chợ - Siêu thị',
            type: 'Chi tiêu - Sinh hoạt',
            highlight: false,
            color: 'orange',
            typeColor: 'blue',
            emoji: '🏬',
        },
        {
            id: 5,
            text: 'Hóa đơn',
            type: 'Chi tiêu - Sinh hoạt',
            highlight: true,
            color: 'yellow',
            typeColor: 'blue',
            emoji: '🧾',
        },
        {
            id: 6,
            text: 'Khác',
            type: 'other',
            highlight: true,
            color: 'green',
            typeColor: 'yellow',
            emoji: '⋯',
        },
    ],
};
