/** @format */
interface anyObject {
  [prop: string]: any;
}

const isObjectValueEqual = (obj1: anyObject, obj2: anyObject) => {
  if (obj1 === obj2) return true;

  const obj1Props = Object.getOwnPropertyNames(obj1);
  const obj2Props = Object.getOwnPropertyNames(obj2);
  if (obj1Props.length !== obj2Props.length) return false;

  for (const prop in obj1) {
    if (obj2.hasOwnProperty(prop)) {
      if (typeof obj1[prop] === 'object') {
        if (!isObjectValueEqual(obj1[prop], obj2[prop])) return false;
      } else if (obj1[prop] !== obj2[prop]) return false;
    } else return false;
  }

  return true;
};

export { isObjectValueEqual };
