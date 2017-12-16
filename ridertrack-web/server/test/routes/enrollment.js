
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var server = require('../../../server');
var uuid = require('uuid');
var supertest = require('supertest');
var mongoose = require('mongoose');

var mockdata = require('../helpers');

global.server = server;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(server);

var Enrollment = require('../../models/enrollment');
var User = require('../../models/user');
var Event = require('../../models/event');


describe('Enrollment API tests', function () {
    
	//TODO maybe this can be also in mock data but then user and event must be in describe part
	var userToken = '';
	var userId = '';
	var event1Id = '';
	var event2Id = '';

	// this will run before every test to clear the database
    beforeEach(function (done) {
        Enrollment.remove({}, function (err) {
			User.remove({},function(){
				Event.remove({},function(){
					done();
				});
			});
        });
    });


	//register user and recieve userToken and userId for other usage
	beforeEach (function(done){
		var user = mockdata.createUserByNumber(0)
		request.post('/api/auth/register')
			.send(user)
			.end(function(err,res){
				userId = res.body.userId;
				userToken = "JWT " + res.body.jwtToken;

				var event1 = mockdata.createEventByNumber(0)
				
				//set enrollment (otherwise enrollment fails)
				var currentDate = new Date()
				currentDate.setYear(currentDate.getFullYear() - 1)
				event1.enrollmentOpeningAt = currentDate.toString()
				currentDate.setYear(currentDate.getFullYear() + 2)
				event1.enrollmentClosingAt = currentDate.toString()
				
				var event2 = mockdata.createEventByNumber(1)
				event2.enrollmentOpeningAt = event1.enrollmentOpeningAt
				event2.enrollmentClosingAt = event1.enrollmentClosingAt

				Event.create(userId,event1,function(err,createdEvent1){
					event1Id = createdEvent1._id;
					Event.create(userId,event2,function(err,createdEvent2){
						event2Id = createdEvent2._id;
							done();
					});
				});
			});
		});



    describe('POST /enrollments', function () {
        it('it should NOT add a new enrollment because eventId field is missing', function (done) {
            let enrollment =  new Enrollment({
                userId :userId,
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            request.post('/api/enrollments')
				.set('Authorization',userToken)
                .send(enrollment)
                .end(function (err, res) {
                    expect(res.status).to.be.eql(400);
                    expect(res.body).to.have.property('errors');
                    done()
                })
        });

		it('it should not add an enrollment because event with this id was not created',function(done){
			
			let enrollment = new Enrollment({
				userId:userId,
				eventId:mongoose.Types.ObjectId(),
				additionalInfo:Object,
				trackingSources:[]
			})
				
			request.post('/api/enrollments')
				.set('Authorization',userToken)
				.send(enrollment)
				.end(function(err,res){
					expect(res.status).to.be.eql(400);
					expect(res.body).to.have.property('errors')
					console.log(res.body.errors)
					//expect(res.body.errors).to.have.property("{message: 'Event does not exist.'}")
					done()
				})
		})
		
		it('it should not add an enrollment because enrollmentOpeningAt has not been set',function(done){
			
			let enrollment = new Enrollment({
				userId:userId,
				eventId:event1Id,
				additionalInfo:Object,
				trackingSources:[]
			})
			
			
			Event.findByEventId(event1Id,function(err,event){
				event.enrollmentOpeningAt = null
				event.save(() => {
					request.post('/api/enrollments')
						.set('Authorization',userToken)
						.send(enrollment)
						.end((err,res) => {
							expect(res.status).to.be.eql(400);
							expect(res.body).to.have.property('errors')
							done()
						});
				})
			})
		})
		
		it('it should not add an enrollment because enrollmentClosingAt has not been set',function(done){
			
			let enrollment = new Enrollment({
				userId:userId,
				eventId:event1Id,
				additionalInfo:Object,
				trackingSources:[]
			})
			
			Event.findByEventId(event1Id,(err,event) => {
					event.enrollmentClosingAt = null
					event.enrollmentOpeningAt = null
					event.save(() => {
						request.post('/api/enrollments')
							.set('Authorization',userToken)
							.send(enrollment)
							.end((err,res) =>{
								expect(res.status).to.be.eql(400)
								expect(res.body).to.have.property('errors')
								done()
							})
					})
			})
		})
		
		it ('should not add an enrollment because enrollment has not been started yet',(done) => {
			let enrollment = new Enrollment({
				userId:userId,
				eventId:event1Id,
				additionalInfo:Object
			})
			
			Event.findByEventId(event1Id,(err,event) =>{
				currentDate = new Date()
				currentDate.setDate(currentDate.getDate() + 1)
				event.enrollmentOpeningAt = currentDate
			
				//console.log(event.enrollmentOpeningAt.toString())
				event.save(() => {
					request.post('/api/enrollments')
						.set('Authorization',userToken)
						.send(enrollment)
						.end((err,res) =>{
							expect(res.status).to.be.eql(400)
							expect(res.body).to.have.property('errors')
							done()
						})
				})
			})
		})
		
		it('should not add an enrollment because enrollment finished',(done) => {
			let enrollment = new Enrollment({
				userId:userId,
				eventId:event1Id
			})
			
			Event.findByEventId(event1Id,(err,event) =>{
				currentDate = new Date()
				currentDate.setDate(currentDate.getDate() - 1)
				event.enrollmentClosingAt = currentDate
				
				event.save(() =>{
					request.post('/api/enrollments')
						.set('Authorization',userToken)
						.send(enrollment)
						.end((err,res) => {
							expect(res.status).to.be.eql(400)
							expect(res.body).to.have.property('errors')
							done()
						})
				})
				
			})
		})
		
		it('should not add an enrollment because maxNumberOfParticipants has been reached',function(done){
			
			var enrollment1 = {
				userId:userId,
				eventId:event1Id
			}
			
			var user2 = mockdata.createUserByNumber(1)
			
			Event.findByEventId(event1Id,(err,event) =>{
				event.maxParticipants = 1
				event.save(() =>{
					//enroll first user
					request.post('/api/enrollments')
						.set('Authorization',userToken)
						.send(enrollment1)
						.end((err,enrollRes) => {
							expect(enrollRes.status).to.be.eql(200)
							
						//register second one
							request.post('/api/auth/register')
								.send(user2)
								.end((err,authResponse) => {
									console.log(authResponse.body)
									user2Token = "JWT " + authResponse.body.jwtToken
									user2Id = authResponse.body.userId
							
									var enrollment2 = {
										userId:user2Id,
										eventId:event1Id
									}
									//try to enroll
									request.post('/api/enrollments')
										.set('Authorization',user2Token)
										.send(enrollment2)
										.end((err,res) => {
											console.log(res.body)
											expect(res.status).to.be.eql(400)
											expect(res.body).to.have.property('errors')
											done()
									})
							
								})
						})
					})
			})
		})
		
        it('it should add an enrollment', function (done) {
            let enrollment = new Enrollment({

                eventId: event1Id,
                userId :userId
            });
			
			Event.findByEventId(event1Id,(err,event) => {
				request.post('/api/enrollments')
					.set('Authorization',userToken)
					.send(enrollment)
					.end((err, res) => {
						console.log(res.body)
						expect(res.status).to.be.eql(200);
						expect(res.body).to.be.an('object');
						expect(res.body).to.not.have.property('errors');
						expect(res.body).to.have.property('enrollment');
						done()
					})
				})
			})
	})
	
	describe('/GET enrollments',function(){
        it('it should return a list with two object', function (done) {
            let enrollment1 = new Enrollment({
                eventId: event1Id,
                userId :"first_user",
                additionalInfo : Object,
                trackingSources: [],
            });
            let enrollment2 = new Enrollment( {
                eventId: event2Id,
                userId :"second_user",
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });
            enrollment1.save(function () {
                enrollment2.save(function () {
                    request.get('/api/enrollments')
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.enrollments).to.be.an('array');
                            expect(res.body.enrollments.length).to.be.eql(2);
                            done();
                        })
                })
            });
        });

        it('it should return a list with one object', function (done) {
            let enrollment1 = new Enrollment({
                eventId: event1Id,
                userId :"first_user",
                additionalInfo : Object,
                trackingSources: [],
            });
            let enrollment2 = new Enrollment( {
                eventId: event2Id,
                userId :"second_user",
                additionalInfo : Object,
                trackingSources: [],
            });
            enrollment1.save(function () {
                enrollment2.save(function () {
                    request.get('/api/enrollments?userId=' + enrollment1.userId)
                        .end(function (err, res) {
                            expect(res.status).to.be.eql(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.enrollments).to.be.an('array');
                            expect(res.body.enrollments.length).to.be.eql(1);
                            done();
                        })
                })
            });

        });
	})
	describe('/PUT enrollments',function(){
        it('it should returns ok even if we changed to ask nothing', function (done) {
            let enrollment = new Enrollment({

                eventId: event1Id,
                userId :userId,
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            let change = {};

            enrollment.save(function () {
                request.put('/api/enrollments/' + enrollment._id)
					.set('Authorization',userToken)
                    .send(change)
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.not.have.property('errors');
                        expect(res.body).to.have.property('enrollment');
                        done()
                    })
            });
        });

        it('it should NOT update the eventId of an enrollment', function (done) {
            let enrollment = new Enrollment({

                eventId: event1Id,
                userId :userId,
                additionalInfo : Object,
                trackingSources: [],
                created_at: "2017-09-10T00:00:00.000Z",
                updated_at: "2017-09-10T00:00:00.000Z"
            });

            let change = {
                eventId: 'new_eventId'
            };

            enrollment.save(function () {
                request.put('/api/enrollments/' + enrollment._id)
					.set('Authorization',userToken)
                    .send(change)
                    .end(function (err, res) {
                        expect(res.status).to.be.eql(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('errors');
                        done()
                    })
            });
        });
		
	})
	describe('DELETE /enrollments', function () {
		
		//enroll to event
		beforeEach(function(done){
			var enrollment = new Enrollment({
				eventId:event1Id,
				userId:userId
			})
			
			request.post('/api/enrollments')
				.send(enrollment)
				.set('Authorization',userToken)
				.end(() => done())
		})
		
		
		
        // TODO Same test but without specifying one, should return an error, currently does not.
        it('it should add a new enrollment then delete it!', function (done) {
			
			request.delete('/api/enrollments/' +  event1Id +'/' + userId)
				.set('Authorization', userToken)
				.end(function (err, res) {
					console.log(res.body)
					expect(res.status).to.be.eql(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.not.have.property('errors');
					request.get('/api/enrollments/?eventId=' + event1Id + '\&userId' + userId)
						.end((err,getResponse) =>{
							console.log(getResponse.body)
							expect(getResponse.body.enrollments.length).to.be.eql(0)
							done()
						})
				})
		})
		
		it('should not be allowed to delete other user enrollments',function(done){
			//register as an secondary user
			var user = mockdata.createUserByNumber(1)
			
			request.post('/api/auth/register')
				.send(user)
				.end((err,authRes) =>{
					user2Token = "JWT " + authRes.body.jwtToken
					
					request.delete('/api/enrollments/' +  event1Id +'/' + userId)
						.set('Authorization',user2Token)
						.end((err,res) =>{
							expect(res.status).to.be.eql(401)
							expect(res.body).to.have.property('errors')
							done()
						})
					
					
				})
			
		})
		
		
	})

    // it closes the server at the end
    after(function (done) {
        server.close();
        done()
    });
})