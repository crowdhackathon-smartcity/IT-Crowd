	'use strict'

	const express = require('express')
	const bodyParser = require('body-parser')
	const request = require('request')
	const sleep = require('system-sleep')
	const nodemailer = require('nodemailer')
	const JsonDB = require('node-json-db')
	const app = express()

	app.set('port', (process.env.PORT || 5000))

	// Allows us to process the data
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(bodyParser.json())
	
	var db = new JsonDB("myDataBase", true, false);
	initializeKeywords()
	db.push("/arraytest/myarray[0]", {name:'test1'}, true)
	db.push("/arraytest/myarray[1]", {problem:'test2'}, true)

	// ROUTES
	let transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'citysens.contanct@gmail.com',
	        pass: 'bethesensor'
	    }
	})
	let mailOptions = {
	    from: '<nikos.fourtounis95@gmail.com>', // sender address
	    to: 'nickfortune@windowslive.com', // list of receivers
	    subject: 'Hello', // Subject line
	    text: 'Hello world ?', // plain text body
	    html: '<b>Hello world ?</b>' // html body
	}
	app.get('/', function(req, res) {
		res.send("Hi I am a chatbot")
	})

	let token = "EAAKsBmgEABIBANS3iAOZBKwZBSsaAPuYYDU8d5mI12ZCZApIosyqWsZBE8VYQZCMV7gRHuoBY8D9cWZANEv9fGlhXpFb09PQ86zXp2bqLGX0On5tnU6HyuNYFoWhV8JdcBYFqYpFKhXJBb9hMSMhF3y0yoE0gmJ2GekRZB8PaRKyXQZDZD"

	// Facebook 

	app.get('/webhook/', function(req, res) {
		if (req.query['hub.verify_token'] === "CitySens") {
			res.send(req.query['hub.challenge'])
		}
		res.send("Wrong token")
	})
	app.post('/webhook/', function(req, res) {
		let messaging_events = req.body.entry[0].messaging
		let attachment
		let issue=""
		let pendingtext='false'
		for (let i = 0; i < messaging_events.length; i++) {
			let event = messaging_events[i]
			let sender = event.sender.id
			console.dir(event)
			if(event.message && event.message.text){
				db.push("/"+event.sender.id+"/myarray[0]", {name:event.sender.id})
				//db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'false'})
				try{
					let a=db.getData("/"+event.sender.id+"/myarray[3]/pendingtext")
				}catch(error){
					db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'false'})
				}
				
			}	
			if(event.postback && event.postback.payload=="payload1"){
				flow1(sender)
			}
			else if(event.postback && event.postback.payload=="payload2"){
				flow2(sender)
			}
			else if(event.postback && event.postback.payload=="payload3"){
				db.push("/"+event.sender.id+"/myarray[2]", {who:'Πολίτης'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[2]/who")
				sendText(sender, "Περιέγραψε το θέμα: ")
			}
			else if(event.postback && event.postback.payload=="payload4"){
				db.push("/"+event.sender.id+"/myarray[2]", {who:'Επιχείρηση'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[2]/who")
				sendText(sender, "Περιέγραψε το θέμα: ")
			}
			else if(event.postback && event.postback.payload=="payload5"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Σύλλογος/Σωματείο'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload6"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Κοινωνικός φορέας'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload7"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Πολιτιστικός φορέας'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload8"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Συνδικαλιστική Οργάνωση'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload9"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Συλλογικότητα πολιτών'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload10"){
				db.push("/"+event.sender.id+"/myarray[1]", {who:'Άλλο'}, true)
				db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'true'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload11"){
				db.push("/"+event.sender.id+"/myarray[1]", {problem:'POS'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Αίτημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload12"){
				db.push("/"+event.sender.id+"/myarray[1]", {problem:'Parking'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Πρόβλημα: "+data2)
			}
			else if(event.postback && event.postback.payload=="payload13"){
				db.push("/"+event.sender.id+"/myarray[1]", {problem:'Υπηρεσίας'}, true)
				var data = db.getData("/"+event.sender.id+"/myarray[0]/name")
				var data2 = db.getData("/"+event.sender.id+"/myarray[1]/problem")
				sendText(sender, "Χρήστης: "+data+",\n Πρόβλημα: "+data2)
			}
			/*else if (event.message && event.message.text && db.getData("/"+event.sender.id+"/myarray[3]/pendingtext")) {
				sleep(100)
				processText(event.message.text,sender)
			}*/
			else if (event.message && event.message.text) {
				try{
					let pendingtext=db.getData("/"+event.sender.id+"/myarray[3]/pendingtext")
					if(pendingtext=='true'){
						processText(sender,event.message.text)
					}
					else{
						db.push("/"+event.sender.id+"/myarray[0]", {name:event.sender.id}, true)
						db.push("/"+event.sender.id+"/myarray[3]", {pendingtext:'false'})
						sendText(sender, "Καλησπέρα "+event.sender.id)
						flow(sender)
					}
				} catch(error){
					sendText(sender, error)
				}
				
				
			}
			/*else if (event.message && event.messsage.text) {
				let text = event.message.text
				sendText(sender, "Μήνυμα Ελήφθη: "+text.substring(0, 200))
				sleep(300)
				if(text.indexOf('pos') > -1) {
					sendText(sender, "Παραβίαση POS" )
					sleep(300)
				}
				if(text.indexOf('parking') > -1) {
					sendText(sender, "Παραβίαση parking" )
					sleep(300)
				}
				sendText(sender, "Ευχαριστούμε πολύ")
			}
			else if (event.message && event.message.attachments && event.message.attachments.length > 0){
				attachment = event.message.attachments[0];
				if (attachment.type === 'location') {
					sendText(sender, "Τοποθεσία Ελήφθη")
	                sendText(sender, attachment.payload.coordinates.long )
	                sendText(sender, attachment.payload.coordinates.lat )
	            }
			}*/
		}
		res.sendStatus(200)
	})
	function sendEmail(){
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
			   	sendText(sender,error)
			    return console.log(error);
			}
			sendText(sender,info.messageId, info.response)
			console.log('Message %s sent: %s', info.messageId, info.response);			    
		})
	}
	function flow(sender) {
			let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε κατηγορία:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Υποβολή θέματος",
				                "payload": "payload1"
				              },
				              {
				                "type": "postback",
				                "title": "Υποβολή ελέγχου",
				                "payload": "payload2"
				              }
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function flow1(sender) {
			let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε κατηγορία:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Πολίτης",
				                "payload": "payload3"
				              },
				              {
				                "type": "postback",
				                "title": "Επιχείρηση",
				                "payload": "payload4"
				              },
				              {
				                "type": "postback",
				                "title": "Σύλλογος/Σωματείο",
				                "payload": "payload5"
				              },
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function flow2(sender) {
		let messageData = {
			    "attachment": {
				    "type": "template",
				      "payload": {
				        "template_type": "button",
				          "text": "Διάλεξε έλεγχο:",
				            "buttons": [
				              {
				                "type": "postback",
				                "title": "Έλεγχος POS",
				                "payload": "payload11"
				              },
				              {
				                "type": "postback",
				                "title": "Έλεγχος parking",
				                "payload": "payload12"
				              },
				              {
				                "type": "postback",
				                "title": "Έλεγχος υπηρεσίας",
				                "payload": "payload13"
				              },
				            ]
				      }
				}
	    	}
		sendGenericMessage(sender,messageData)
	}
	function processText(sender,text){
		//if(text.toLowerCase().indexOf('parking') > -1)
		let finaltext="text: "
		var sendername=db.getData("/"+sender+"/myarray[0]/name")
		for(let i = 0; i < 14; i++){
			var data=db.getData("/keywords/myarray["+i+"]/name")
			if(text.toLowerCase().indexOf(data) > -1){
				finaltext=finaltext.concat(data)
				finaltext=finaltext.concat(" ")
			}
		}
		db.push("/"+sender+"/myarray[3]", {pendingtext:'false'})
		sendText(sender,finaltext)
		sleep(100)
		sendText(sender,". Η υποβολή έγινε απο "+sendername)
	}
	function initializeKeywords(){
		db.push("/keywords/myarray[0]", {name:'δεν'}, true)
		db.push("/keywords/myarray[1]", {name:'πρεπει'}, true)
		db.push("/keywords/myarray[2]", {name:'υπαρχει'}, true)
		db.push("/keywords/myarray[3]", {name:'λακουβα'}, true)
		db.push("/keywords/myarray[4]", {name:'παρατηρηση' }, true)
		db.push("/keywords/myarray[5]", {name:'αλλαγη'}, true)
		db.push("/keywords/myarray[6]", {name:'κυρωσεις'}, true)
		db.push("/keywords/myarray[7]", {name:'τροποποιηση'}, true)
		db.push("/keywords/myarray[8]", {name:'αργοπορια'}, true)
		db.push("/keywords/myarray[9]", {name:'καθυστερηση'}, true)
		db.push("/keywords/myarray[10]", {name:'υπηρεσια'}, true)
		db.push("/keywords/myarray[11]", {name:'αρθρο'}, true)
		db.push("/keywords/myarray[12]", {name:'ταμειο'}, true)
		db.push("/keywords/myarray[13]", {name:'εφορια'}, true)
	}
	function sendGenericMessage(sender,messageData){
		request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
		    json: {
			    recipient: {id:sender},
			    message: messageData,
		    }
	    }, function(error, response, body) {
		    if (error) {
			    console.log('Error sending messages: ', error)
		    } else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
	}
	function sendText(sender, text) {
		let messageData = {text: text}
		request({
			url: "https://graph.facebook.com/v2.6/me/messages",
			qs : {access_token: token},
			method: "POST",
			json: {
				recipient: {id: sender},
				message : messageData,
			}
		}, function(error, response, body) {
			if (error) {
				console.log("sending error")
			} else if (response.body.error) {
				console.log("response body error")
			}
		})
	}

	app.listen(app.get('port'), function() {
		console.log("running: port")
	})