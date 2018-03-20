const execSync = require('child_process').execSync;
var express = require('express');
var router = express.Router();
var Record = require(__base + 'models/record');
console.log(__base);

//API
router.get('/api/records', function(req, res) {
  Record.find(function(err, records) {
    if (err)
      res.send(err);
    //res.json({ "person": records});
    res.json(records);
  });
});

router.route('/record/:record_id')
.get(function(req, res) {
  Record.findOne({record_id: req.params.record_id}, function(err, record) {
    if (err)
      res.send(err);
      res.send(record.source.join("<br>") 
      );
  });
})

router.route('/api/records/:record_id')
  .get(function(req, res) {
    Record.findOne({record_id: req.params.record_id}, function(err, record) {
      if (err)
        res.send(err);
      res.jsonp(record);
    });
  })
  .delete(function(req, res){
    Record.remove({
      record_id: req.params.record_id}, function(err, task) {
          if (err)
          res.send(err);
          res.json({ message: 'Record successfully deleted'  });
    });
  })
  .post(function(req, res) {
    Record.findOne({record_id: req.params.record_id}, function(err, record) {
      if (err)
        res.send(err);
      record.english = req.body.english;
      record.french = req.body.french;
      record.german = req.body.german;
      record.italian = req.body.italian;
      record.updated_at = new Date().toISOString();
      record.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Record updated!'  });
      });
    })
  });

router.route('/api/record/new')
.post(function(req, res) {
  var record = new Record();
  record.title = req.body.title;
  var findQuery = Record.find().sort({record_id : -1}).limit(1);
  var record;
  findQuery.exec(function(err, maxResult){
    if (err) {return err;}
    record.record_id = maxResult[0].record_id + 1;
    record.save(function(err) {
      if (err)
        res.send(err);
        res.json({ message: 'Record created!'  });
      });
  });
});

//HTML
router.get('/records', function(req, res) {
  res.sendFile(__base + 'views/record/record.html');
});

//router.get('/records/:item', function(req, res) {
//  console.log(__base);
//  res.sendFile(__base + 'views/record/show.html');
//});

router.get('/about', function(req, res) {
  res.sendFile(__base + 'views/about.html');
});


module.exports = router;
