var kue = require( 'kue' );
var jobs = kue.createQueue();



var minute = 60000;// one minute

var email = jobs.create( 'email', {
  title: 'Account renewal required', to: 'tj@learnboost.com', template: 'renewal-email'
} ).delay( minute )
  .priority( 'high' )
  .save();

jobs.create( 'email', {
  title: 'Account expired', to: 'tj@learnboost.com', template: 'expired-email'
} ).delay( minute * 10 )
  .priority( 'high' )
  .save();


jobs.process( 'email', 10, function ( job, done ) {
    console.log("\n");
    console.log("job title : " + job.data.title);
  setTimeout( function () {
    
    done();
  }, Math.random() * 5000 );
} );

// start the UI
kue.app.listen( 3000 );
console.log( 'UI started on port 3000' );
/*
command to start :
  node kue-delayed-jobs-producer.js 
*/