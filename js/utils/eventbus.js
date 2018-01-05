const EventBus = {

    init: function () {
        var eventBus;
        eventBus = document.getElementsByTagName('event-bus')[0];
        if (eventBus != undefined && eventBus.id === 'event-bus') return;
        eventBus = document.createElement('event-bus');
        eventBus.setAttribute('id', 'event-bus');
        eventBus.setAttribute('style', 'display:none;');
        document.body.appendChild(eventBus);
    },

    destroy: function () {
        var eventBus = document.getElementsByTagName('event-bus')[0];
        if (eventBus == undefined || eventBus.id != 'event-bus') return;
        document.body.removeChild(eventBus);
    },

    register: function (eventName, callbackFunction) {
        var eventBus = document.getElementsByTagName('event-bus')[0];
        if (eventBus == undefined || eventBus.id != 'event-bus') return;
        this.unregister(eventName, callbackFunction);
        eventBus.addEventListener(eventName, callbackFunction);
    },

    unregister: function (eventName, callbackFunction) {
        var eventBus = document.getElementsByTagName('event-bus')[0];
        if (eventBus == undefined || eventBus.id != 'event-bus') return;
        eventBus.removeEventListener(eventName, callbackFunction);
    },

    dispatch: function (eventName, data) {
        var eventBus = document.getElementsByTagName('event-bus')[0];
        if (eventBus == undefined || eventBus.id != 'event-bus') return;
        eventBus.dispatchEvent(new CustomEvent(eventName, {
            'detail': {
                'EventBus': true,
                'data': data
            }
        }));
    }
}

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