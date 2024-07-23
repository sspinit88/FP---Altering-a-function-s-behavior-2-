/*

function onceAndAfter<T extends (...args: any[]) => any>(
  f: T,
  g: T
): (...args: Parameters<T>) => ReturnType<T> {
  let done = false;
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!done) {
      done = true;
      return f(...args);
    } else {
      return g(...args);
    }
  }) as T;
}

We can rewrite this if we remember that functions are first-order objects. 
Instead of using a flag to remember which function to call, we can use a toCall 
variable to directly store whichever function needs to be called. 
Logically, that variable will be initialized to the first function but will then change 
to the second one. The following code implements that change:

*/

function onceAndAfter2<T extends (...args: any[]) => any>(
  f: T,
  g: T
): (...args: Parameters<T>) => ReturnType<T> {
  let toCall = f;
  return ((...args: Parameters<T>): ReturnType<T> => {
    let result = toCall(...args);
    toCall = g;
    return result;
  }) as T;
}

const squeak = (x: string) => console.log(x, 'squeak!!');
const creak = (x: string) => console.log(x, 'creak!!');
const makeSound = onceAndAfter2(squeak, creak);
makeSound('door'); // "door squeak!!"
makeSound('door'); // "door creak!!"
makeSound('door'); // "door creak!!"
makeSound('door'); // "door creak!!"

/* NOT
  Working in a functional way, we can write an HOF that will take any predicate, evaluate it, 
  and then negate its result. A possible implementation would be pretty straightforward,

  const not = (fn) => (...args) => !fn(...args);
*/

// Определение функции not
const not =
  (fn) =>
  (...args) =>
    !fn(...args);

// Пример функции для тестирования
const isEven = (num) => num % 2 === 0;

// Используем функцию not для создания новой функции isOdd
const isOdd = not(isEven);

// Проверка и вывод результатов в консоль
console.log('isEven(2):', isEven(2)); // true
console.log('isEven(3):', isEven(3)); // false

console.log('isOdd(2):', isOdd(2)); // false
console.log('isOdd(3):', isOdd(3)); // true

// Дополнительные примеры
const isPositive = (num) => num > 0;
const isNonPositive = not(isPositive);

console.log('isPositive(1):', isPositive(1)); // true
console.log('isPositive(-1):', isPositive(-1)); // false

console.log('isNonPositive(1):', isNonPositive(1)); // false
console.log('isNonPositive(-1):', isNonPositive(-1)); // true

/*
  INVERT

  Let’s opt for the second option and write an invert() function that will change the comparison result.

  const invert = (fn) => (...args) => -fn(...args);
*/

// Определение функции invert
const invert =
  (fn) =>
  (...args) =>
    -fn(...args);

// Пример функции для тестирования
const double = (num) => num * 2;

// Используем функцию invert для создания новой функции invertedDouble
const invertedDouble = invert(double);

// Проверка и вывод результатов в консоль
console.log('double(2):', double(2)); // 4
console.log('double(3):', double(3)); // 6

console.log('invertedDouble(2):', invertedDouble(2)); // -4
console.log('invertedDouble(3):', invertedDouble(3)); // -6

// Дополнительные примеры
const addFive = (num) => num + 5;
const invertedAddFive = invert(addFive);

console.log('addFive(1):', addFive(1)); // 6
console.log('addFive(10):', addFive(10)); // 15

console.log('invertedAddFive(1):', invertedAddFive(1)); // -6
console.log('invertedAddFive(10):', invertedAddFive(10)); // -
