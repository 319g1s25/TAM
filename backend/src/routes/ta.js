// this is a router example and we should add the router files similarly
const path = require('path');

const express = require('express');

const taController = require('../controllers/taController');

const router = express.Router();

/**
 * we should add get and post functions in here like the following syntax
 * 
 * router.get('/log-task', taController.getLogTask);
 * router.post('/log-task', taController.postLogTask);
 * 
 * these will make the system use the implementations/functions under the controllers folder's file
 * 
 * ask chatgpt what does this do if you dont understand
 */

module.exports = router;
