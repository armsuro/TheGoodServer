module.exports = {
	hookTimeout: 60000000,
 	sockets: {
 		adapter: 'memory'
 	},
 	models: {
	  connection: 'mysqlServer',
	  migrate: 'safe'
	}
};
