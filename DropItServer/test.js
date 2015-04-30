/**
 * Created by lior on 30/04/2015.
 */
global.__base = __dirname + '/';
var jf = require('jsonfile');
var util = require('util');
var users_file = __base + 'users.json'

jf.writeFileSync(users_file, {a: []});