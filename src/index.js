export default {
	async fetch(request, env) {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || typeof file === 'string') {
			return new Response('No file uploaded', { status: 400 });
		}

		// File type check (optional but safe)
		if (!file.name.endsWith('.csv')) {
			return new Response('Only CSV files are allowed', { status: 400 });
		}

		const key = `csv/${Date.now()}-${file.name}`;

		await env.MY_BUCKET.put(key, file.stream(), {
			httpMetadata: {
				contentType: file.type || 'text/csv',
			},
		});

		return new Response(`CSV file uploaded as: ${key}`);
	},
};
