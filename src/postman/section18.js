const product = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};
// update all the product is call PUT method
db.collection('product').updateMany({}, { $set: product }, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// update d:3 => d:6 is call PATCH method
db.collection('product').updateMany(
  {},
  { $set: { 'c.d': 6 } },
  (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  }
);
