/******************************************************************************/
// Quick Demo server
//
// It will serve statically all the files, the same way than BrowserSync does.
/******************************************************************************/

var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.listen(80);
