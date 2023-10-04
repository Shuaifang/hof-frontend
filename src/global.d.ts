// Declaring this interface provides type safety for message keys
type Messages = typeof import('@/locale/messages/zh-CN.json');
declare interface IntlMessages extends Messages {}
