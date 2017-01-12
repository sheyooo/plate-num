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
    var plate = req.params.plate.replace(/\s/g, '');
    request.get('http://www.lsmvaapvs.org/search.php?vpn=' + plate)
      .end(function(err, response) {
        if (response.ok) {
          dom.env({ 
            html: response.text,
            done: function(err, window) {
              var elem = window.document.querySelector('.form-group');
              elem.innerHTML = elem.innerHTML.replace('<!--', '').replace('-->', '');              
              var cells = window.document.querySelectorAll('.form-group p');
              if (cells.length > 13) {
                var plateData = {
                  plateNumber: cells[1].innerHTML,
                  name: cells[3].innerHTML,
                  color: cells[5].innerHTML,
                  model: cells[7].innerHTML,
                  chasis: cells[9].innerHTML,
                  status: cells[11].innerHTML,
                  licenseIssueDate: cells[13].innerHTML,
                  licenseExpiryDate: cells[15].innerHTML
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
