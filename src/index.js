export default {
	async fetch(request, env) {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', {
				status: 405,
				headers: corsHeaders,
			});
		}

		const contentType = request.headers.get('Content-Type') || '';
		if (!contentType.includes('text/csv')) {
			return new Response('Only CSV content allowed', {
				status: 400,
				headers: corsHeaders,
			});
		}

		const key = `csv/${Date.now()}.csv`;
		const body = request.body;

		await env.MY_BUCKET.put(key, body, {
			httpMetadata: {
				contentType: 'text/csv',
			},
		});

		return new Response(`CSV uploaded as: ${key}`, {
			status: 200,
			headers: corsHeaders,
		});
	},
};

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};
