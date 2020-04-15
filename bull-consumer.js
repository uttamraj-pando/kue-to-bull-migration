const queue = require('bull');
const util = require('util');

var emailBullQueue = new queue('email', 'redis://127.0.0.1:6379');

emailBullQueue.process(function(job,done){
    done(null,{job: JSON.stringify(job)})
});

emailBullQueue.on('completed',function(job,result){
    console.log(`email job has been completed with result : ${(util.inspect(result, {depth: null}))}`)
})

/*
command to start the consumer:
node bull-consumer.js
*/