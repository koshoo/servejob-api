/*jslint node:true, unparam:true, nomen:true*/
/*globals DB*/
'use strict';

var Feed = require('feed');

function getAllFeed(req, res) {
    var jobs, feed, key, filter, returnmsg;
    filter = {
        "compName": 1,
        "jobTitle": 1,
        "jobType": 1,
        "created_on": 1,
        "permalink": 1,
        "jobDesc": 1,
        "_id": 0
    };

    DB.collection('jobs').find({}, filter).limit(10).sort({"created_on": -1}).toArray(function (err, data) {
        if (err) {
            returnmsg = {
                "status": false,
                "message": [err]
            };

            res.send(returnmsg);
            return;
        }

        jobs = data;

        feed = new Feed({
            "title":       'ServeJob',
            "description": 'If you are seeking employment, their place here. No registration, no hassles, no ad, simple and objective.',
            "link":        'http://www.servejob.com',
            "image":       'http://www.servejob.com/img/logo.png',
            "copyright":   'All rights reserved',

            "author": {
                "name":    'ServeJob',
                "email":   'contact@servejob.com',
                "link":    'http://www.servejob.com'
            }
        });

        for (key = 0; key < jobs.length; key = key + 1) {
            feed.addItem({
                "title":          (jobs[key].jobType + ' | ' + jobs[key].jobTitle + ' | ' + jobs[key].compName),
                "link":           ('http://www.servejob.com/#!/job/' + jobs[key].permalink),
                "description":    jobs[key].jobDesc,
                "date":           jobs[key].created_on
            });
        }

        feed.addCategory('Technology');
        feed.addCategory('Jobs');
        res.header('Content-Type', 'text/xml; charset=utf-8');
        res.send(feed.render('atom-1.0'));
    });
}

exports.getAllFeed = getAllFeed;
