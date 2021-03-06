const { modrinth_base_url, modrinth_user_agent } = require('../api_config.json');
const { request } = require('undici');
const logger = require('../../logger');

async function searchProjects(query, maxAttempts) {
	if (maxAttempts === 0) {
		logger.warn('Modrunner was unable to establish a connection to Modrinth\'s API.\nRequest type: Search Projects');
		return null;
	}

	try {
		const responseData = await request(`${modrinth_base_url}/search?${new URLSearchParams({ query })}`, {
			headers: {
				'User-Agent': modrinth_user_agent,
			},
		});
		return responseData;
	} catch (error) {
		logger.info(`An ${error.name} occured while performing an API request to Modrinth.`);
		maxAttempts--;
		await searchProjects(query, maxAttempts);
	}
}

module.exports = { searchProjects };