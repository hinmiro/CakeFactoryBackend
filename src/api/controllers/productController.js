'use strict';

import {addProduct} from '../models/productModel.js';

const postProduct = async (req, res) => {
  try {
    const result = await addProduct(req.body);
    if (result) {
      res.status(201).json({message: 'product added'});
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

//Todo: connect getProduct function
//Todo: connect deleteProduct function
//Todo: connect updateProduct function

export {postProduct};
