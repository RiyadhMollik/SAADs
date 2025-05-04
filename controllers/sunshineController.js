import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import moment from 'moment';

// Load CSV data into memory
let sunshineData = [];
const csvFilePath = '/var/www/SAADs/controllers/sunshine.csv';

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    let predictedSunshine = parseFloat(row['Predicted Sunshine']);
    if (predictedSunshine < 0) {
      predictedSunshine = 0;
    }
    sunshineData.push({
      lat: parseFloat(row.lat),
      lon: parseFloat(row.lon),
      location: row.Location,
      year: parseInt(row.Year),
      month: parseInt(row.Month),
      day: parseInt(row.Day),
      predictedSunshine: predictedSunshine,
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

export const getSunshineData = (req, res) => {
  const { lat, lon } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  const today = moment();
  const next7Days = [];

  for (let i = 0; i < 7; i++) {
    const targetDate = today.clone().add(i, 'days');
    const year = targetDate.year();
    const month = targetDate.month() + 1;
    const day = targetDate.date();

    const record = sunshineData.find(
      (entry) =>
        entry.lat === latitude &&
        entry.lon === longitude &&
        entry.year === year &&
        entry.month === month &&
        entry.day === day
    );

    if (record) {
      next7Days.push(record);
    }
  }

  res.json(next7Days);
};
