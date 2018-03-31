/**
 *
 *
 * @class Tasker
 */
class Tasker {
    constructor(opts) {
        this.id;
        /*
         * интервал запуска задачи
         * значение по-умолчанию 10 минут == 600000 мс
         */
        this.interval = opts ? opts.interval : 600000,
        /*
         * разница между текущим временем и временем запуска задачи
         * по достижении и превышении которого задача должна быть запущена
         * значение по-умолчанию 30 минут == 1800000 мс
         */
        this.threshold = opts ? opts.interval : 1800000;

        /*
         * Пользовательская выполняемая функция
         */
        this.userFunction = opts ? opts.fn : null;

        /*
         * Базовая выполняемая функция с callback-функциями
         */
        this.preDef = {
            callback: {
                finish: function(e) {
                    let target = e.target.closest('.msg-box'),
                        select, update;

                    const E = GL.CONST.EVENTS.TODOLIST;
                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    (async () => {
                        try {
                            let opts = { types: 'i', param: [target.dataset.id] };
                            select = await new Select('', opts).select('*').from('tasks').where('id=?').connect();
                        } catch (e) {
                            // TODO error
                        }
                        (async () => {
                            if (!select.affectedRows) {
                                // TODO error
                                return;
                            }
                            if (select.data[0].status === S.FINISHED) return;
                            try {
                                let opts = { types: 'si', param: ['finished',target.dataset.id] };
                                update = await new Update('', opts).update('tasks').set('status=?').where('id=?').connect();
                            } catch (e) {
                                // TODO error
                            }
                            if (!update.affectedRows && !update.status) {
                                // TODO error
                                return;
                            }
                            EVENT_BUS.dispatch(E.FINISH, target.dataset.id);
                        })();
                        target.parentElement.removeChild(target);
                    })();
                },

                delay: function(e) {
                    let target = e.target.closest('.msg-box'),
                        result, select, update;

                    const E = GL.CONST.EVENTS.TODOLIST;
                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    (async () => {
                        try {
                            result = await new DateTimePicker(e.target, '', { promise: true, format: 'd.m.Y h:i' }).getPromise();
                        } catch (e) {
                            // TODO error
                            return;
                        }
                        let planned = new Date(result).getTime();

                        try {
                            let opts = { types: 'i', param: [target.dataset.id] };
                            select = await new Select('', opts).select('*').from('tasks').where('id=?').connect();
                        } catch (e) {
                            // TODO error
                        }
                        (async () => {
                            if (!select.affectedRows) {
                                // TODO error
                                return;
                            }
                            if (select.data[0].status === S.FINISHED) return;
                            try {
                                let opts = { types: 'ii', param: [planned,target.dataset.id] };
                                update = await new Update('', opts).update('tasks').set('planned=?').where('id=?').connect();
                            } catch (e) {
                                // TODO error
                            }
                            if (!update.affectedRows && !update.status) {
                                // TODO error
                                return;
                            }
                            EVENT_BUS.dispatch(E.DELAY, { id: target.dataset.id, planned: planned });
                        })();
                        target.parentElement.removeChild(target);

                    })();
                },

                cancel: function(e) {
                    let target = e.target.closest('.msg-box'),
                        select, del;

                    const E = GL.CONST.EVENTS.TODOLIST;

                    (async () => {
                        try {
                            let opts = { types: 'i', param: [target.dataset.id] };
                            select = await new Select('', opts).select('*').from('tasks').where('id=?').connect();
                        } catch (e) {
                            // TODO error
                        }
                        (async () => {
                            if (!select.affectedRows) {
                                // TODO error
                                return;
                            }
                            try {
                            let opts = { types: 'i', param: [target.dataset.id] };
                            del = await new Delete('', opts).from('tasks').where('id=?').connect();
                            } catch (e) {
                                // TODO error
                            }
                            if (!del.affectedRows) {
                                // TODO error
                                return;
                            }
                            EVENT_BUS.dispatch(E.DELETE, target.dataset.id);
                        })();
                        target.parentElement.removeChild(target);
                    })();
                }
            },

            timerFunction: function() {
                let self = this;
                UTILS.LOG('info','TASKER','STARTED');
                (async () => {
                    try {
                        let select = await new Select().select('*').from('tasks').connect();
                        if (!select.affectedRows) return;
                        const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;
                        select.data.forEach(task => {
                            if (task.status === S.FINISHED) return false;
                            if (new Date().getTime() < (task.planned - self.threshold)) return false;
                            if (document.getElementById('msg-box-wrapper').querySelector(`div.msg-box[data-id='${task.id}']`)) return false;
                            new MessageBox({
                                text: `${task.text} ${new Date(task.planned).format('dd-mm-yyyy HH:MM')}`,
                                withControl: true,
                                level : 'error',
                                dataset: {
                                    id: task.id,
                                    status: task.status,
                                    planned: task.planned,
                                    user: task.user
                                },
                                cb: {
                                    el1: self.preDef.callback.finish,
                                    el2: self.preDef.callback.delay,
                                    el3: self.preDef.callback.cancel
                                }
                            }).add();
                        });
                    } catch (e) {
                    }
                })();
            }
        }

        return this;
    }

    /**
     * Запуск таймера-планировщика.
     * Если в параметрах конструктора не была определена пользовательская функция,
     * то будет вызвана функция предустановленная по-умолчанию.
     *
     * @returns {number} Идентификатор таймера-планировщика
     * @memberof Tasker
     */
    run () {
        this.id = setInterval((this.userFunction || this.preDef.timerFunction.bind(this)), this.interval);
        // this.id = setInterval(this.preDef.timerFunction, this.interval);
        return this.id;
    }

    /**
     * Остановка таймера-планировщика
     *
     * @param {number} [timerId] Идентификатор таймера. Может быть пустым, в таком случае будет очищен идентификатор инстанции, если имеется.
     * @memberof Tasker
     */
    stop (timerId) { clearInterval(timerId || this.id); }

};