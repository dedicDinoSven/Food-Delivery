const seeder = require('mongoose-seed');
const mongo = '';

seeder.connect(mongo, function () {
	seeder.loadModels(['./models/UserType']);

	seeder.clearModels(['UserType'], () => {
		seeder.populateModels(data, (err, done) => {
			if (err) {
				return console.log('Seed error: ', err);
			}
			if (done) {
				return console.log('Seed done: ', done);
			}

			seeder.disconnect();
		});
	});
});

const data = [
	{
		'model': 'UserType',
		'documents': [
			{ 'name': 'SuperAdmin' },
			{ 'name': 'Admin' },
			{ 'name': 'Courier' },
			{ 'name': 'Customer' },
		],
	},
];
