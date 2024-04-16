'use strict';

import promisePool from '../../utils/database.js';

const addOrder = async (order) => {
  const {price, date, status, products} = order
  const sql= `INSERT INTO orders (price, date, status, products) VALUES (?, ?, ?, ?)`;
  const params = [price, date, status, products];
  await promisePool.execute(sql, params);
}

const getAllOrders = async () => {
  const [orders] = await promisePool.query('SELECT * from orders');
  return orders;
}

const getUserOrder = async (id) => {
  const [rows] = await promisePool.execute('SELECT * from orders WHERE orderer = ?', [id]);
  if(rows.length === 0) {
    return false;
  }
  return rows;
}

const delOrder = async (id) => {
  const sql = 'DELETE FROM orders WHERE id = ?';
  const [result] = await promisePool.execute(sql, [id]);
  if (result.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

const deliverOrder = async (id) => {
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  const status = 1;
  const [result] = await promisePool.execute(sql, [status, id]);
  if (result.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

export {addOrder, getAllOrders, getUserOrder, delOrder, deliverOrder};
