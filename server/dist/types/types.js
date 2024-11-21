var MessageType;
(function (MessageType) {
    MessageType[MessageType["TEXT"] = 0] = "TEXT";
    MessageType[MessageType["IMAGE"] = 1] = "IMAGE";
    MessageType[MessageType["GROUP"] = 2] = "GROUP";
})(MessageType || (MessageType = {}));
var ChatType;
(function (ChatType) {
    ChatType["PRIVATE"] = "PRIVATE";
    ChatType["GROUP"] = "GROUP";
})(ChatType || (ChatType = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["PENDING"] = "PENDING";
    MessageStatus["SENT"] = "SENT";
    MessageStatus["DELIVERED"] = "DELIVERED";
    MessageStatus["READ"] = "READ";
})(MessageStatus || (MessageStatus = {}));
var EventType;
(function (EventType) {
    EventType[EventType["MESSAGE"] = 0] = "MESSAGE";
    EventType[EventType["TYPING"] = 1] = "TYPING";
})(EventType || (EventType = {}));
var MailType;
(function (MailType) {
    MailType[MailType["CONFIRMATION"] = 0] = "CONFIRMATION";
    MailType[MailType["RESET_PASSWORD"] = 1] = "RESET_PASSWORD";
    MailType[MailType["PASSWORD"] = 2] = "PASSWORD";
    MailType[MailType["VERIFY_EMAIL"] = 3] = "VERIFY_EMAIL";
})(MailType || (MailType = {}));
export { EventType, MailType, ChatType };
