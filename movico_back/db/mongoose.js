const mongoose = require('mongoose')

if (!process.env.NODE_ENV) {
	const misc = require('../misc.js')
	var connectionURL = misc.dbData
} 
else 
{
	if(process.env.NODE_ENV == 'production') {
		var connectionURL = process.env.connectionURL
	}
}

mongoose.set('useFindAndModify', false);

mongoose.connect( connectionURL, {
	useNewUrlParser : true,
	useCreateIndex: true
})
