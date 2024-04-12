const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
// [ 'name', 'email' ] => { name: 1, email: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const checkEnable = (value) => {
  return value === 'true';
};

// convert string to ObjectId for mongoose
const convert2ObjectId = (id) => {
  return new Types.ObjectId(id);
};

// Section 18: Update với POST, PUT, PATCH trong Product Service API
const removeAttrUndefined = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === null) delete object[key];
  });

  return object;
};

const updateNestedObjectParser = (obj) => {
  console.log('[1]::', obj);
  const final = {};
  Object.keys(obj).forEach((i) => {
    console.log('[3]::', i);
    if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
      const response = updateNestedObjectParser(obj[i]);
      Object.keys(obj[i]).forEach((j) => {
        console.log('[4]::', j);
        final[`${i}.${j}`] = response[j];
      });
    } else {
      final[i] = obj[i];
    }
  });
  console.log('[2]::', final);
  return final;
};
/*
const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
    f: {
      g: 5,
      h: 6,
    },
  },
};

- Sau khi chạy qua hàm updateNestedObjectParser, đối tượng trả về sẽ là:
{
  a: 1,
  b: 2,
  'c.d': 3,
  'c.e': 4,
  'c.f.g': 5,
  'c.f.h': 6,
}

ví dụ muốn db cập nhật mỗi giá trị của h:6 thành h:7

  db.collection.updateOne({
    _id: ObjectId('5f9d0b8c3b3b3b4f6b2c4f1d'),
  }, {
    $set: {
      'c.f.h': 7,
    },
  })
*/
module.exports = {
  checkEnable,
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeAttrUndefined,
  updateNestedObjectParser,
  convert2ObjectId,
};
