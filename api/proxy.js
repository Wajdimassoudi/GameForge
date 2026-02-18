
// This is a Vercel Serverless Function that acts as a CORS proxy.
// It allows our front-end application to securely access external APIs
// without running into browser security restrictions (CORS).
// Vercel automatically creates an API endpoint at `/api/proxy` from this file.

// Using CommonJS export for compatibility with the Vercel Node.js environment.
module.exports = async (request, response) => {
  // Extract the target API URL from the query parameters.
  // e.g., /api/proxy?url=https://www.freetogame.com/api/games
  const targetUrl = request.query.url;

  // If the 'url' parameter is missing, return an error.
  if (!targetUrl) {
    return response.status(400).json({ message: 'Error: The "url" query parameter is required.' });
  }

  try {
    // Make a request to the target API. `fetch` is globally available in Vercel's Node.js 18+ runtime.
    const apiResponse = await fetch(targetUrl, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // If the target API returns an error, forward that error to our client.
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`Error from target API (${targetUrl}): ${errorBody}`);
      return response.status(apiResponse.status).json({ message: `Failed to fetch data from the source API. Status: ${apiResponse.status}` });
    }

    // Parse the JSON data from the target API.
    const data = await apiResponse.json();

    // Set caching headers to improve performance.
    // s-maxage=60: Cache on Vercel's edge network for 60 seconds.
    // stale-while-revalidate=300: If data is stale, serve it while fetching fresh data in the background.
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    // Send the successful JSON response back to our client.
    return response.status(200).json(data);

  } catch (error) {
    // Handle network errors or other exceptions during the fetch.
    console.error('Proxy Internal Error:', error);
    return response.status(500).json({ message: `Internal Server Error in proxy: ${error.message}` });
  }
}
