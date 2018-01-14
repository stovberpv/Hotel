const EVENT_BUS = {

    _id: 'event-bus',
    _tag: 'event-bus',
    _style: 'display:none;',
    _eventBus: '',

    init: function () {
        if (this._isInitialized()) return;
        this._create();
        this._set(this._find());
    },

    destroy: function () {
        if (!this._isInitialized()) return;
        document.body.removeChild(this._get());
    },

    register: function (eventName, callbackFunction) {
        if (!this._isInitialized()) return;
        this.unregister(eventName, callbackFunction);
        this._get().addEventListener(eventName, callbackFunction);
    },

    unregister: function (eventName, callbackFunction) {
        if (!this._isInitialized()) return;
        this._get().removeEventListener(eventName, callbackFunction);
    },

    dispatch: function (eventName, data) {
        if (!this._isInitialized()) return;
        this._get().dispatchEvent(new CustomEvent(eventName, {
            'detail': {
                'EventBus': true,
                'data': data
            }
        }));
    },

    _set: function (eventBus) {
        this._eventBus = eventBus;
    },

    _get: function () {
        return this._eventBus;
    },

    _isInitialized: function () {
        var eb = this._get();
        return !!(eb && eb.nodeType === 1) && eb.id === this._id;
    },

    _find: function () {
        return document.getElementsByTagName(this._tag)[0];
    },

    _create: function () {
        var tree = new DOMTree([{ tag: this._tag, id: this._id, style: this._style }]);
        tree.cultivate();
        document.body.appendChild(tree);
    }
}

UTILS.DEEPF_REEZE(EVENT_BUS);

// /**
//  * Автобус уведомлений
//  * Хранит полученные уведомления и осуществляет вызов подписчиков
//  * с привязкой данных, полученных от отправителей.
//  */
// const EventBus = {
//     /** 
//      * (Для внутреннего использования!)
//      * 
//      * Зарегистрированные подписчики и отправителей.
//      */
//     _bus: {},
//     /** 
//      * (Для внутреннего использования!)
//      * 
//      * Типы уведомлений.
//      */
//     _eventType: {
//         publisher: 'publisher',
//         subscriber: 'subscriber',
//     },
//     /** 
//      * (Для внутреннего использования!)
//      * 
//      * Регистрация подписчиков и отправителей.
//      * Создается новое уведомление если оно новое.
//      * К созданному уведомлению добавляется подписчик с указанием вызываемой функции
//      * и отпарвитель с полученными данными.
//      */
//     _register: function (eventName, eventType, receiver = {}, functionName, dataHolder = []) {
//         !this._bus[eventName] && (this._bus[eventName] = {});
//         this._bus[eventName][eventType] = {
//             functionName: functionName,
//             receiver: receiver,
//             data: dataHolder
//         }
//     },
//     /**
//      * (Для внутреннего использования!)
//      * 
//      * Отмена регистрации подписчиков и отпарвителей для уведомления.
//      */
//     _unregister: function (eventName) {
//         this._bus[eventName] = {};
//     },
//     /**
//      * (Для внутреннего использования!)
//      *
//      * При наличии записи подписчика и отправителя для увдомления, вызывается
//      * функция объявленная подписчиком с прикреплением к ней данных полученных
//      * от отправителя.
//      * Проихводится отмена регистрации для данного уведомления
//      */
//     _dispatch: function (eventName) {
//         var subscriber = this._bus[eventName][this._eventType.subscriber],
//             publisher = this._bus[eventName][this._eventType.publisher];
//         if (!subscriber || !publisher) return;
//         this._unregister(eventName);
//         var receiver = subscriber.receiver.bind({
//             EventBus: eventName,
//             data: publisher.dataHolder
//         });
//         receiver();
//     },
//     /**
//      * Регистрация отправителя.
//      */
//     publish: function (eventName, functionName, dataHolder) {
//         this._register(eventName, this._eventType.publisher, '', functionName, dataHolder);
//         this._dispatch(eventName);
//     },
//     /**
//      * Регистрация подписчика.
//      */
//     subscribe: function (eventName, receiver, functionName) {
//         this._register(eventName, this._eventType.subscriber, receiver, functionName);
//         this._dispatch(eventName);
//     }
// }