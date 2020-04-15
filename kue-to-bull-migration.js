const kue = require('kue');
const Job = require('./node_modules/kue/lib/queue/job.js')
const bullQueue = require('bull');
const Arena = require('bull-arena');
const express = require('express')
const moment = require('moment');
const router = express.Router();
const app = express()

var jobs = kue.createQueue();
var emailBullQueue = new bullQueue('email', 'redis://127.0.0.1:6379');


function calculateDelay(job){
    let requiredDelay;
    let jobCreatedAt = moment(parseInt(job.created_at,10));
    let jobStartAt = moment(jobCreatedAt).add(job._delay,'ms');
    let currentTime = moment();
    requiredDelay =  currentTime.isSameOrAfter(jobStartAt) ? 0: jobStartAt.diff(currentTime);
    return requiredDelay;
}

jobs.state('delayed',function(err,jobIds){
    const me = this;
    console.log(JSON.stringify(jobIds));
    jobIds.forEach(jobId => {
        Job.get(jobId,function(err,job){
            console.log(JSON.stringify(job));
            emailBullQueue.add(job.data,{
                 delay: calculateDelay(job) 
            });
            job.remove();
        })    
    });
    
})




const arenaConfig = Arena({
    queues: [
      {
        name: "email",
        hostId: "migratedQueues",
        redis: {
          port: 6379,
          host: '127.0.0.1'
        },
      },
    ],
  },
  {
    basePath: '/arena',
    disableListen: true
  });
  

app.use('/', arenaConfig);
app.listen(3001)

/*
command to start the service
 node kue-to-bull-migration.js
*/