'use strict';

import {addOrder, getAllOrders, getUserOrder, delOrder} from '../models/orderModel.js';

const postOrder = async (req, res) => {
  try {
    const result = await addOrder(req.body);
    if(result) {
      res.status(201).json({message: 'order posted'});
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const getOrders = async (req, res) => {
  try {
    res.json(await getAllOrders());
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const getUserOrders = async (req, res) => {
  try {
    const result = await getUserOrder(req.params.id);
    if (result) {
      res.json(result)
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const deleteOrder = async (req, res) => {
  try {
    const result = await delOrder(req.params.id);
    if(result) {
      res.status(201).json({message: 'order posted'});
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

const putDelivery = async (req, res) => {
  try {
    const result = await deliverOrder(req.params.id);
    if (result) {
      res.status(201).json({message: `order ${req.params.id} delivered`});
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
}

export {postOrder, getOrders, getUserOrders, deleteOrder, putDelivery};
