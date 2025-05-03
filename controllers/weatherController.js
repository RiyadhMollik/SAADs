import fs from 'fs';
import path from 'path';
import csvParser from 'fast-csv';
import { fileURLToPath } from 'url';
import haversine from 'haversine-distance';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to parse CSV file
const parseCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser.parse({ headers: true, trim: true }))
            .on('data', (row) => {
                row.datetime = new Date(row.datetime);
                row.lat = parseFloat(row.lat);
                row.lon = parseFloat(row.lon);
                row.rainfall = parseFloat(row.rainfall);
                row.temperature = parseFloat(row.temperature);
                row.humidity = parseFloat(row.humidity);
                row.soil_moisture = parseFloat(row.soil_moisture);
                results.push(row);
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Function to find the nearest location
const findNearestLocation = (data, targetLat, targetLon) => {
    let nearest = null;
    let minDistance = Infinity;

    data.forEach((item) => {
        const distance = haversine(
            { latitude: targetLat, longitude: targetLon },
            { latitude: item.lat, longitude: item.lon }
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = item;
        }
    });

    return nearest ? { lat: nearest.lat, lon: nearest.lon } : null;
};

const dataDir = path.join(__dirname, '../bmd_data');

// Function to get the latest file path
function getLatestFilePath() {
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {  // Checking up to the last 30 days
        const date = new Date();
        date.setDate(today.getDate() - i);

        const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        const filePath = path.join(dataDir, `bmd_${formattedDate}.csv`);

        if (fs.existsSync(filePath)) {
            return filePath; // Return the first available file
        }
    }

    return null; // No file found in the last 30 days
}

const cache = {}; // Simple in-memory cache object

// Cache expiration (24 hours)
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getWeatherDataByMetric = async (req, res, metric) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and longitude are required." });
        }

        const today = new Date().toISOString().split('T')[0]; // Get the current date (YYYY-MM-DD)

        // Check if data for today and the requested metric is already cached and is not expired
        if (cache[today] && cache[today][metric] && (Date.now() - cache[today][metric].timestamp < CACHE_EXPIRATION_TIME)) {
            console.log(`Returning cached data for ${cache[today][metric].data}:`, today);
            return res.json(cache[today][metric].data);
        }

        const filePath = getLatestFilePath();
        if (!filePath) {
            return res.status(404).json({ error: "No data available for the last 30 days." });
        }

        const data = await parseCSV(filePath);

        const targetLat = parseFloat(lat);
        const targetLon = parseFloat(lon);

        // Find the nearest location
        const nearestLocation = findNearestLocation(data, targetLat, targetLon);
        if (!nearestLocation) {
            return res.status(404).json({ error: "No nearest location found in data." });
        }

        // Filter data for the last 10 days
        const now = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(now.getDate() - 10);

        const filteredData = data.filter((row) =>
            row.lat === nearestLocation.lat &&
            row.lon === nearestLocation.lon &&
            row.datetime >= tenDaysAgo
        );

        // Aggregate data by date
        const weatherSummary = {};
        filteredData.forEach((row) => {
            const dateStr = row.datetime.toISOString().split('T')[0];

            if (!weatherSummary[dateStr]) {
                weatherSummary[dateStr] = { sum: 0, count: 0 };
            }

            weatherSummary[dateStr].sum += row[metric];
            weatherSummary[dateStr].count += 1;
        });

        // Compute the average
        Object.keys(weatherSummary).forEach((date) => {
            weatherSummary[date] = weatherSummary[date].count
                ? weatherSummary[date].sum / weatherSummary[date].count
                : 0;
        });

        const result = {
            location: nearestLocation,
            [metric]: weatherSummary
        };

        // Cache the result for today and metric
        if (!cache[today]) {
            cache[today] = {};  // Initialize the cache for today if not already initialized
        }

        cache[today][metric] = {
            data: result,
            timestamp: Date.now()  // Store timestamp of cache creation
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controllers for each metric
export const getRainfall = async (req, res) => getWeatherDataByMetric(req, res, "rainfall");
export const getTemperature = async (req, res) => getWeatherDataByMetric(req, res, "temperature");
export const getHumidity = async (req, res) => getWeatherDataByMetric(req, res, "humidity");
export const getSoilMoisture = async (req, res) => getWeatherDataByMetric(req, res, "soil_moisture");
