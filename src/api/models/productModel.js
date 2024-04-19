'use strict';

import promisePool from '../../utils/database.js';

const addProduct = async (product) => {
  const {name, price, desc, img} = product;
  const sql= `INSERT INTO products (name, price, desc, img) VALUES (?, ?, ?, ?)`;
  const params = [name, price, desc, img];
  await promisePool.execute(sql, params);
}

// Todo : Update product write function
// Todo : Delete product read function
// Todo : Get product by id read function

export {addProduct};
