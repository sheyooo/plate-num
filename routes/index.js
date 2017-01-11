var express = require('express');
var router = express.Router();
var request = require('superagent');
var dom = require('jsdom');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lagos Plates API' });
});

router.get('/api/plates/:plate', function(req, res) {
  if (req.params.plate) {
    var plate = req.params.plate;
    request.get('http://www.lsmvaapvs.org/search.php?vpn=' + plate)
      .end(function(err, response) {
        if (response.ok) {
          dom.env({ 
            html: response.text,
            done: function(err, window) {
              var cells = window.document.querySelectorAll('td');
              if (cells.length > 13) {
                var plateData = {
                  plateNumber: cells[1].innerHTML,
                  color: cells[3].innerHTML,
                  model: cells[5].innerHTML,
                  chasis: cells[7].innerHTML,
                  status: cells[9].innerHTML,
                  licenseIssueDate: cells[11].innerHTML,
                  licenseExpiryDate: cells[13].innerHTML
                }
                res.json(plateData);
              } else {
                var upPlate = plate.toUpperCase();
                res.status(404).json({ 
                  message: 'Plate number \'' + upPlate + '\' not registered.'
                });
              }
              
            }
          });
        }
      })
  } else {

  }
});

router.get('*', function(req, res) {
  res.send('Consume API like this ==> GET /api/plates/FST918EH');
});

module.exports = router;
