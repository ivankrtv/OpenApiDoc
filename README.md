# OpenApiDoc
Библиотека для генерации документации по OpenApi 3.1.0 спецификации в полуавтоматическом режиме

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
- [Описание методов (эндпоинтов)](https://github.com/ivankrtv/OpenApiDoc/#описание-методов-эндпоинтов)
  - [Описание метода](https://github.com/ivankrtv/OpenApiDoc/#описание-метода)
  - [Теги](https://github.com/ivankrtv/OpenApiDoc/#теги)

---

## Описание документации

Все описание происходит с помощью класса `OpenApiDoc`. В конструктор передаются параметры с кратким описанием проекта

```ts
import { OpenApiDoc } from 'OpenApiDoc';
import { OpenAPIDocConfig } from 'OpenApiDoc';

const config: OpenAPIDocConfig = {
  title: 'Интерне-магазин',
  description: 'Документация API интернет-магазина',
}

const openApi = new OpenApiDoc(config);
```

- `title` и `description` - **обязательные** параметры
- `additionalDescription` - не обязательный параметр конфига. В нем передается путь до файла с расширением `.md`, в 
  котором в формате `markdown` описаны дополнительные сведения о проекте и/или документации. Описание из него будет дополнять 
  описание вашей документации. Подробнее смотри в [additionalDescription](https://github.com/ivankrtv/OpenApiDoc/#additionaldescription)


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

Числовые типы имеют схожие параметры: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
- <font color="red">*</font> `example: any` - пример
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

Параметры строки: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
- <font color="red">*</font> `example: any` - пример
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

Параметры булевого значения: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
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

class ExampleDto {
  @ObjectProperty({ description: 'Пользователь' })
  user: User;
}
```

Параметры вложенного объекта: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)

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

Параметры массива: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
- <font color="red">*</font> `items` - [тип элемента массива](https://github.com/ivankrtv/OpenApiDoc/#типы-элемента-массива)
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
3) `Объект` - объект, содержащий дополнительные параметры для описания элемента массива (рекомендуется использовать этот способ, если элемент массива - примитив)
   На данный момент `объект` можно описать для двух типов: `number` и `string` :
- **Строка**:
  `type: 'string'` - тип данных. Всегда `string`
  `format?: string` - текстовое описание формата строки
  `example: string` - пример строки

- **Число:**
  `type: 'number'` - тип данных. Всегда `number`
  `example: number` - пример строки

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

Параметры енама: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `description: string` - текстовое описание
- <font color="red">*</font> `enum` - енам
- `nullable: boolean` -флаг устанавливающий может ли поле быть `null` (по умолчанию - `false`)
- `deprecated: boolean` - флаг устанавливающий является ли поле `deprecated` (по умолчанию - `false`)
- `isOptional: boolean` - флаг устанавливающий является ли поле опциональным (по умолчанию - `false`)


### Ньюансы examples

В предоставленных выше декораторах вы можете заметить параметр `examples: any[]`. Есть несколько моментов, которые полезно знать для его использования.

1) `examples` разумно использовать только для описания параметров запроса (`path`, `query`, `cookie`, `headers`). В остальных случаях в документации не будут отображаться все примеры и отобразиться только 1й элемент массива.
2) Если вы хотите рендерить документацию с помощью `swagger`, то НЕ используйте этот параметр, `swagger` его не определяет. Вместо него используйте `example: any` и передавайте только один пример поля.

---
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


#### Описание метода

Параметры метода: (<font color="red">*</font> - обязательные параметры)
- <font color="red">*</font> `title: string` - Название метода.
- <font color="red">*</font> `method` - Типа запроса. `'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH'`
- <font color="red">*</font> `isImplemented: post` - Флаг, который указывает, реализован ли метод в API или только описан в документации
- <font color="red">*</font> `requiresAuthorization` - Флаг, который указывает необходимость авторизации для запроса
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


##### Пример

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


#### Теги

Создание тега
```ts
const tag = openApiDoc.createTag('Пользователь', 'Методы для управления пользователем')
```

Функция `createTag()` - принимает два аргумента:
- <font color="red">*</font> `name` - Название тега.
- `description` - Описание тега

##### Группа тегов

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
- <font color="red">*</font> `name` - Название тега.
- <font color="red">*</font> `tags` - Массив тегов, которые будут включены в группу тегов
