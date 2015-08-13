# Задание №2

1. Найдите ошибку в коде приложения, из-за которой реальный результат работы отличается от ожидаемого. Опишите, как эта ошибка могла возникнуть и как её избежать в будущем.
2. Добавьте в приложение новую возможность — диалог с пользователем. Приложение спрашивает название страны или города, а затем показывает численность населения. Для диалога можно использовать window.prompt.

## Решение

В коде приведена довольно известная ошибка вызова асинхронных функций в цикле. Возникает она в результате того, что на момент выполнения функции обратного вызова, цикл уже завершился, а значит значение i равно индексу последнего элемента массива.

Есть много способов избежать данной ошибки.

Например использовать let request, вместо var. Не забудем конечно же добавить директиву "use strict". Инструкция let в отличии от var объявляет переменную переменную видимую внутри блока. В нашем случае будут созданы 3 переменных request, имеющих определенное значение для каждого колбэка.
```javascript
"use strict"

for (var i = 0; i < 3; i++) {
    let request = requests[i];
    var callback = function (error, result) {
	  ...
}
```

Или обернуть callback в самовызывающуюся функцию для сохранения значения request.
```javascript
for (var i = 0; i < 3; i++) {
  var request = requests[i];
  (function(request){
    var callback = function (error, result) {
      ...   
    };
	
    getData(request, callback);
  })(request);
}
```

Я решил переписать код с использованием Promise, вместо функции обратного вызова. 
