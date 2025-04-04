# OpenApiDoc
Библиотека для генерации документации по OpenApi 3.1.0 спецификации в полуавтоматическом режиме.

Рекомендуется ознакомиться с пунктом [Как работать с этой библиотекой. Рекомендации]() в [Другое](https://github.com/ivankrtv/OpenApiDoc/#другое)

## Установка

Для установки выполните команду 

```
npm i @ivankrtv/openapidoc
```

## Навигация

- [Описание документации](https://github.com/ivankrtv/OpenApiDoc/#описание-документации)
- [Описание схем](https://github.com/ivankrtv/OpenApiDoc/#описание-схем)
  - [Числовые типы](https://github.com/ivankrtv/OpenApiDoc/#числовые-типы)
  - [Строка](https://github.com/ivankrtv/OpenApiDoc/#строка)
  - [Булевое значение](https://github.com/ivankrtv/OpenApiDoc/#булевое-значение)
  - [Вложенный объект](https://github.com/ivankrtv/OpenApiDoc/#вложенный-объект)
  - [Массив](https://github.com/ivankrtv/OpenApiDoc/#массив)
    - [Типы элемента массива](https://github.com/ivankrtv/OpenApiDoc/#типы-элемента-массива)
  - [Enum](https://github.com/ivankrtv/OpenApiDoc/#enum)
  - [Ньюансы examples](https://github.com/ivankrtv/OpenApiDoc/#ньюансы-examples)
  - [Описание для схемы](https://github.com/ivankrtv/OpenApiDoc/#описание-для-схемы)
- [Описание методов (эндпоинтов)](https://github.com/ivankrtv/OpenApiDoc/#описание-методов-эндпоинтов)
  - [Описание метода](https://github.com/ivankrtv/OpenApiDoc/#описание-метода)
  - [Security](https://github.com/ivankrtv/OpenApiDoc/#security)
  - [Теги](https://github.com/ivankrtv/OpenApiDoc/#теги)
- [Другое](https://github.com/ivankrtv/OpenApiDoc/#другое)


---

## Описание документации

Все описание происходит с помощью класса `OpenApiDoc`. В конструктор передаются параметры с кратким описанием проекта

```ts
import { OpenApiDoc } from '@ivankrtv/openapidoc/dist';
import { OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';

const config: OpenAPIDocConfig = {
  title: 'Интерне-магазин',
  version: '0.1.0',
}

const openApiDoc = new OpenApiDoc(config);
```

- `title` и `version` - **обязательные** параметры
- `additionalDescription` - не обязательный параметр конфига. В нем передается путь до файла с расширением `.md`, в 
  котором в формате `markdown` описаны дополнительные сведения о проекте и/или документации. Описание из него будет дополнять 
  описание вашей документации. Подробнее смотри в [Additional description](https://github.com/ivankrtv/OpenApiDoc/#additional-description)

После того, как вы описали свою документацию, нужно вызвать метод `compileOpenApi()` который вернет вам собранный json.
```ts
const doc = openApiDoc.compileOpenApi(); 
```

---
## Описание схем

Описание схем производится с помощью декорирования параметров класса. Это сделано для того, чтобы вы могли типизировать как документацию, так и свой код. Предполагается, что для написания документации будут так же описываться DTO, которые так же будут использоваться для типизации методов (эндпоинтов)

Всего предоставлено 7 основных декораторов для описания базовых параметров, вы можете создать свое более обширное множество на их основе

Декораторы принимают обязательный аргумент - объект с параметрами. Это нужно для более детально и корректного описания.
**Обратите внимание:** практически все декораторы имеют **обязательные параметры** `description` и `example`, описывать их более чем полезно для лучшего понимания вашей документации.


### Числовые типы:

```ts
class ExampleDto {
  @IntProperty({ description: 'Возраст', example: 27 })
  age: number;

  @FloatProperty({ description: 'Рейтинг по 5-бальной шкале', example: 4.2 })
  rating: number;
}
```

Числовые типы имеют схожие параметры: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- **(required)** `example: any` - пример
- `examples: any[]` - массив примеров. [Сноска*](https://github.com/ivankrtv/OpenApiDoc/#ноюансы-examples)
- `maximum: number` -максимальное значение параметра
- `minimum: number` - минимальное значение параметра
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)



### Строка

```ts
class ExampleDto {

  @StringProperty({ description: 'Имя', example: 'Elon' })
  name: number;

}
```

Параметры строки: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- **(required)** `example: any` - пример
- `examples: any[]` - массив примеров [Сноска*](https://github.com/ivankrtv/OpenApiDoc/#ноюансы-examples)
- `format: string` - текстовое описание формата строки
- `maxLength: number` - максимальная длина строки
- `minLength: number` - минимальная длина строки
- `pattern: string` - паттерн формирования строки (`^[A-zА-яЁё]+$` - например, регулярное выражение)
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)



### Булевое значение

```ts
class ExampleDto {
  @BoolProperty({ description: 'Имя' })
  isActive: number;
}
```

Параметры булевого значения: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)



### Вложенный объект

```ts
// Пример класса User
class User {
  @StringProperty({ description: 'Имя', example: 'Евгений' })
  name: string;

  @IntProperty({ description: 'Возраст', example: 18 })
  age: number;
}

class Admin {
  @StringProperty({ description: 'Роль', example: 'superadmin' })
  role: string;

  @StringProperty({ description: 'Имя', example: 'Евгений' })
  name: string;
}

class ExampleDto {
  @ObjectProperty({ description: 'Пользователь' })
  user: User;

  @ObjectProperty({ description: 'Пользователь', oneOf: [User, Admin] })
  otherUser: User | Admin;
}
```

Параметры вложенного объекта: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)
- `oneOf: Array` - Параметр для установки нескольких возможных объектов. Принимает массив классов



### Массив

```ts
class ExampleDto {
  @ArrayProperty({ description: 'Массив пользователей', items: User })
  users: User[];
    
  @ArrayProperty({ description: 'Массив названий', items: 'string' })
  titles: string[];

  @ArrayProperty({
    description: 'Массив сумм',
    items: {
      type: 'number',
      description: 'сумма',
      esample: '4000'
    }
  }) 
  sums: number[];
}
```

Параметры массива: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- **(required)** `items` - [тип элемента массива](https://github.com/ivankrtv/OpenApiDoc/#типы-элемента-массива)
- `maxItems: number` - максимальное количество элементов массива
- `minItems: number` - минимальное количество элементов массива
- `uniqueItems: boolean` - флаг устанавливающий являются ли элементы массива уникальными (по умолчанию - `true`)
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)

#### Типы элемента массива

Декоратора массива поддерживает несколько видов передачи `items` (тип элемента массива).
1) `Класс` - так же как с вложенным объектом, можно передать другую описанную модель
2) `'number' | 'string'` - примитивный тип данных в виде строки. На данный момент может быть только число или строка
3) `Schema` - объект, содержащий дополнительные параметры для описания элемента массива **_по спецификации OpenAPI_** 
   (рекомендуется использовать этот способ, если элемент массива - примитив). Для создания схем рекомендуется 

Для создания схем, рекомендуется использовать методы:
- `stringSchema()`
- `integerSchema()`
- `floatSchema()`
- `enumSchema()`
- `objectSchema()`
- `dateSchema()`

**Пример:**

```ts
const uuidSchema = stringSchema({
  description: 'ID.',
  format: 'uuid',
  minLength: 32,
  maxLength: 32,
  example: 'e916020b-d094-44b0-b30c-72fb64013fcd',
})

class A {
  @ArrayProperty({ description: 'Массив ID.', items: uuidSchema })
  ids: Uuid[];
}
```



### Enum

```ts
// Пример енама
enum ExampleStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

class ExampleDto {
  @EnumProperty({ description: 'статус', enum: ExampleStatusEnum })
  status: ExampleStatusEnum;
}
```

Параметры енама: (**(required)** - обязательные параметры)
- **(required)** `description: string` - текстовое описание
- **(required)** `enum` - енам
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)



#### Ньюансы examples

В предоставленных выше декораторах вы можете заметить параметр `examples: any[]`. Есть несколько моментов, которые полезно знать для его использования.

1) `examples` разумно использовать только для описания параметров запроса (`path`, `query`, `cookie`, `headers`). В остальных случаях в документации не будут отображаться все примеры и отобразиться только 1й элемент массива.
2) Если вы хотите рендерить документацию с помощью `swagger`, то НЕ используйте этот параметр, `swagger` его не определяет. Вместо него используйте `example: any` и передавайте только один пример поля.

---

### Описание для схемы

Чтобы добавить текстовое описание для схемы, можете использовать на классе-DTO декоратор `@ModelDescription()`

Пример:

```ts
import { StringProperty } from '@ivankrtv/openapidoc/dist';
import { ModelDescription } from '@ivankrtv/openapidoc/dist';

@ModelDescription('Информация о пользователе')
class UserInfoDto {
  @StringProperty({description: 'Имя', example: 'Elon'})
  name: string;
}
```

## Описание методов (эндпоинтов)

Для описания методов используется класс `Controller`. Который создается методом `createController` класса `OpenApiDoc`

```ts
const controller = openApiDoc.createController('/user');

controller.addApiMethod(path, params) // функция добавляет метод в документацию
```

Функция `createController()` принимает два аргумента:
- `prefix: string` - не обязательный параметр, содержащий префикс пути. Этот перфикс будет добавлен ко всем методам, созданным с помощью этого контроллера
- `defaultTags: Tag | Tag[]` - не обязательный параметр, содержащий [тег](https://github.com/ivankrtv/OpenApiDoc/#теги) 
  или [массив тегов](https://github.com/ivankrtv/OpenApiDoc/#теги), которые будут указаны для всех методов, созданных с помощью этого контроллера

Функция `addApiMethod` принимает два аргумента:
- `path: string` - путь метода
- `params` - описание метода в объекте


Так же класс `Controller` умеет создавать дочерние классы `Controller`. Особенность дочерних классов в том, что они 
будут перенимать префиксы и теги по умолчанию родительских классов. То есть:
```ts
const controller = openApiDoc.createController('/user', tag);
controller.addApiMethod('/create', {...}); // создаст метод '/user/create' с тегом 'tag' 

const childController = controller.createController('/role');
childController.addApiMethod('/create', {...}); // создаст метод '/user/role/create' с тегом 'tag' 
```


### Описание метода

Параметры метода: (**(required)** - обязательные параметры)
- **(required)** `title: string` - Название метода.
- **(required)** `method` - Типа запроса. `'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'`
- **(required)** `isImplemented: post` - Флаг, который указывает, реализован ли метод в API или только описан в документации
- **(required)** `requiresAuthorization` - Флаг, который указывает необходимость авторизации для запроса
- `description` - Описание метода
- `deprecationMessage` - Сообщение о `deprecated` метода. Если параметр передан, метод помечается как `deprecated`, а текст сообщения добавляется к описанию метода. *(Если вам нечего писать в сообщение, но нужно пометить метод как `deprecated`, можете передать пустую строку: `''`)*
- `requestBody` - Тело запроса (Передается класс в котором используются [декораторы](https://github.com/ivankrtv/OpenApiDoc/#описание-схем))
- `pathParams` - Параметры в пути запроса (Передается класс в котором используются [декораторы](https://github.com/ivankrtv/OpenApiDoc/#описание-схем))
- `query` - Query-параметры (Передается класс в котором используются [декораторы](https://github.com/ivankrtv/OpenApiDoc/#описание-схем))
- `header` - Параметры заголовков (Передается класс в котором используются [декораторы](https://github.com/ivankrtv/OpenApiDoc/#описание-схем))
- `cookie` - Куки (Передается класс в котором используются [декораторы](https://github.com/ivankrtv/OpenApiDoc/#описание-схем))
- `tags` - [тег](https://github.com/ivankrtv/OpenApiDoc/#теги) или [массив тегов](https://github.com/ivankrtv/OpenApiDoc/#теги), к которым относится метод. **(Будьте внимательны, для одного метода набор тегов должен быть уникальным (уникальность оценивается по названию тега), если вы передали тег в дефолтные теги контроллера, то не нужно указывать его повторно для метода)**
- `responses` - Все возможные ответы на запрос в виде объекта (где ключами являются **статус-коды**, а значениями массивы классов в которых используются [декораторы]())
```ts
{
  responses: {
    '200': [SuccessResponseDto],
    '400': [DomainErrorDto, ValidationErrorDto],
  }
}
```


#### Пример

```ts
controller.addApiMethod('/createEntity', {
  title: 'Создание сущности',  
  isImplemented: true,  
  requiresAuthorization: true,  
  description: 'Создание сущности, вернется новая сущность',  
  method: 'POST',  
  requestBody: CreateEntityDto,  
  responses: {  
    '200': [CreateEntityResponseDto],  
    '400': [DomainErrorDto, ValidationErrorDto],
    '403': [UnauthorizedErrorDto],  
  },
});
```

### Security

Чтобы описать способы авторизации, используйте метод `setAuthorization()` класса `OpenApiDoc`

> **Note**
> При указании `requiresAuthorization: true` в
> [добавлении API метода](https://github.com/ivankrtv/OpenApiDoc/#описание-метода) схема авторизации будет получаться 
> из тех, что вы укажите здесь.

Функция `setAuthorization()` принимает всего один аргумент - объект с описанной схемой авторизации. Описание 
происходит по [спецификации OpenApi](https://swagger.io/docs/specification/authentication/)

**Пример:**

```ts
openApiDoc.setAuthorization({
  'Bearer': {
    type: 'http',
    scheme: 'Bearer',
    bearerFormat: 'Bearer ${access-token}',
    description: 'Нужно положить значение в `Headers` в поле `Authorization`',
  }
});
```


### Теги

Создание тега
```ts
const tag = openApiDoc.createTag('Пользователь', 'Методы для управления пользователем')
```

Функция `createTag()` - принимает два аргумента:
- **(required)** `name` - Название тега.
- `description` - Описание тега

#### Группа тегов

Так же доступно создание группы тегов. Группа тегов будет группировать теги. Может быть удобно чтобы логически разграничить какие то участки бизнес-логики, например, есть бизнес логика на создание магазина, но чтобы создать магазин, нужно создать продукты, тогда можно сделать теги `shop` и `products` и добавить их в группу тегов `shop`

Однако будьте внимательны, при использовании групп тегов, методы, которые не относятся к какому-либо тегу, не будут отображаться, если вы используете `redoc` для отрисовки документации

Создание группы тегов:

```ts
// Создаем теги
const shop = openApiDoc.createTag('Магазин', 'Методы для управления магазином');
const products = openApiDoc.createTag('Продукты', 'Методы для управления продуктами');

// Создаем группу тегов
const tagGroup = openApiDoc.addTagGroup('Магазин', [shop, products]);
```

Функция `addTagGroup()` - принимает два аргумента:
- **(required)** `name` - Название тега.
- **(required)** `tags` - Массив тегов, которые будут включены в группу тегов

---

## Другое

### Как работать с этой библиотекой. Рекомендации

Данная библиотека создана для возможности простого и эффективного описания документации. Чем не устраивают готовые
автоматические библиотеки и что подразумевается под эффективностью?

Готовые автоматически библиотеки не могут сгенерировать документацию по методом, по которым еще не написан код. Это
делает невозможным полноценную реализацию **"contract first"**

Данная библиотека сохраняет удобство типизации методов и документации автоматически, стоит описать DTO при написании
документации и при написании метода она уже будет готова, и вам или вашим коллегам уже не придется думать, что
должен принимать и отдавать метод, достаточно будет взять DTO из документации и начать работать.

Так же библиотека нужна чтобы документация получалась понятной для того, кто будет интегрировать ваше приложение с
ее помощью, поэтому во многих местах название или описание метода или параметра являются обязательными.
Авторы библиотеки считают, что если при использовании документации возникают вопросы "Что это?" или "Для чего
это?", то такая документация - плохая.

**Рекомендации по использованию:**

Так как библиотека является базовым инструментом для описания, подразумевается, что использовать ее вы будете так,
как вам будет удобнее всего. При генерации `OpenApi` вам отдается `json`. Это сделано для того, чтобы вы сами могли
решить что с ним делать, как с ним работать и т.д.

Например, как вы можете заметить при ознакомлении с библиотекой, при генерации схем, декораторы могут получиться
достаточно громоздкими, что сделает чтение ДТО не очень удобным и придется писать одно и то же из раза в раз, если несколько
ДТО используют один параметр.

Решение: создавать свое надмножество декораторов над основными
Допустим, у вас есть класс `User`, который содержит основные параметры пользователя, такие как `имя` и `возраст`.
Очевидно, что эти поля не раз встретятся у вас в разных DTO. Тогда разумнее описать эти поля максимально подробно и
четко и после обернуть это в один простой декоратор с говорящим названием. Если вы используете NestJS, то выглядеть
это будет следующим образом:

```ts
// file: user.decorators.ts

export function UserName() {
  return applyDecorators(
    StringProperty({
      description: 'Имя пользователя',
      example: 'Elon Mask',
      minLength: 3,
      maxLength: 40,
      nullable: true,
    })
  )
}

export function UserAge() {
  return applyDecorators(
    IntProperty({
      description: 'Возраст пользователя',
      example: 18,
      minimum: 14,
      maximum: 100,
      nullable: true,
    })
  )
}
```

Далее при использовании этих декораторов вам уже не придется задумываться какой максимальной длины может быть имя
или какое описание дать возрасту. По желанию, вы даже можете включить в это надмножество декораторы валидации.

---

### Additional description

Библиотекой подразумевается возможность более развернутого описания проекта. Полезно, если у вас есть какой-то
бизнес-процесс, и вам нужно описать какие методы API нужно использовать, в какой последовательности и как обрабатывать
их результаты.
Например, можно описать флоу авторизации или создания сложной сущности. Чтобы доавбить такое описание можно
использовать параметр `additionalDescription` в конфигурации `OpenApiDoc`.

Создайте `markdown` файл и описывайте в нем все, что вам нужно, в параметр `additionalDescription` в конструкторе
класса `OpenApiDoc` укажите путь до этого файла, все описанное вами попадет в итоговую документацию в виде текста с
формате `markdown`.

Пример:
```
doc
|-- Doc.md
|-- openApiBuild.ts
```

```ts
// openApiBuild.ts

const openApiDoc = new OpenApiDoc({
  title: 'Example',
  description: 'Example description',
  additionalDescription: path.resolve(__dirname, './Doc.md'),
});
```

##### Формирование маркдауна

Полезно правильно использовать в своем описании заголовки маркдауна. Особенно, если вы используете `redoc` для
генерации html-отображения вашей документации, так как он отображает структуру вашего описания в навигационном меню

- Начинайте всегда с заголовка первого уровня (`#`). Например, `# Описание ИмяПроекта API`
- Главы вашего описания обозначайте заголовками второго уровня (`##`). Например, `## Флоу авторизации`
 