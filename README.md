# AsteriskNG 

Виджет телефонии для amoCRM с поддержкой Click2Call, управлением звонком и телефонной книгой.

## Сборка проекта.
После сборки виджет представляет из себя ZIP-архив (widget.zip).
Вы можете воспользоваться уже собранной версией из  *./build/widget.zip*.

```bash
$ npm install
$ npm run build.prod # For production.
$ npm run build.dev # For developing.
```

## Установка.

AsteriskNG уже доступен в amoCRM.
Если Вы хотите использовать собственную сборку, то создайте *приватная интеграция* в amoCRM [подробнее](https://www.amocrm.ru/developers/content/integrations/intro#generation).


## Для разработчиков.


### Пример backend`а.

Для тестирования вы можете использовать тестовый backend [AsteriskNG-Server](https://github.com/iqtek/asterisk_ng_server). 


### Константы сборки.

+ SETTINGS_FIELD: имя поля с настройками из manifest.json.
+ NOTIFICATON_DELAY: минимальная задержка между уведомлениями.
+ MIN_LENGTH_INTERNAL_NUMBER: минимальная длина внутреннего номера.

###  Структура каталогов.

```bash
./src/
├── blank (заготовка)
│   ├── i18n (файлы локализации)
│   │   ├── en.json
│   │   └── ru.json
│   ├── images (иконки виджета в PNG)
│   │   ├── logo_dp.png
│   │   ├── logo_main.png
│   │   ├── logo_medium.png
│   │   ├── logo_min.png
│   │   ├── logo.png
│   │   └── logo_small.png
│   └── manifest.json
├── createCallbacks.ts (основная функция)
├── domain
├── infrastructure
├── script.ts (точка входа для amoCRM)
└── system
```


### Протокол клиент-серверного взаимодействия.

Любой запрос на сервер производится с помощью проксирования средствами amoCRM.
Для аутентификации используется *secret_key*, отправляемый как query параметр.
Ниже приведен пример url запроса, где *domain.com/asterisk_ng* - адрес сервера, указанный в настройках виджета.

> https://domain.com/asterisk_ng?secret_key=secret_key

Из-за ограничений amoCRM на сервер отправляется POST запрос с форм-датой, содержащей поле **json**.

В **headers** хранится метаинформация для идентификации виджета и управляющего им пользователя.
В **data** хранится стандартная для jsonprc команда, за тем исключением, что требуется указывать **только именованные аргументы**.

Пример запроса для команды оригинации (поле **json**):

```json
{
    "headers": {
        "amouser_email": "myname@mail.com",
        "amouser_id": 7461242,
        "widget_version":"1.0.0"
    },
    "content":{
        "id":18,
        "jsonrpc":"2.0",
        "method":"originate",
        "params":{"phone":"123456"}
    }
}
```

Пример ответа: 

```json
{
    "headers": {
        "status_code": 200,
        "detail": "success"
    },
    "content": {
        "jsonrpc": "2.0",
        "result": {
            "result": {"foo": "bar"},
            "exception": null,
            "exception_params": null,
        },
        "id": 18
    }
}
```

### Общие status_codes.

+ 200 - Success. Команда успешно выполнена.
+ 401 - Unauthorized. Неверный *secret_key*.
+ 400 - Bad Request. Некорректная FormData.
+ 404 - Unknown method. Неизвестный метод.
+ 409 - Incompatible version of the widget. Сервер не поддерживает такую версию виджета.
+ 410 - Invalid method parameters method. Недопустимые параметры метода.

### Замечания

+ Максимальное время запроса через проксирование amoCRM - 10 секунд.
+ Запрос на "method": "ping" имеет таймаут 3 секунды.
+ Запрос на "method": "get_agent_status" работет в режиме LongPool и имеет таймаут 10 секунд.

node version: v14.17.0
