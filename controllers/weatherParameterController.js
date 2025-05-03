import WeatherParameter from "../models/WeatherParameter.js";

// Get all weather parameters
export const getAllWeatherParameters = async (req, res) => {
  try {
    const parameters = await WeatherParameter.findAll();
    res.status(200).json(parameters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new weather parameter
export const createWeatherParameter = async (req, res) => {
  const { name} = req.body;
  try {
    const newParameter = await WeatherParameter.create({ name});
    res.status(201).json(newParameter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a weather parameter
export const updateWeatherParameter = async (req, res) => {
  const { id } = req.params;
  const { name} = req.body;
  try {
    const parameter = await WeatherParameter.findByPk(id);
    if (!parameter) return res.status(404).json({ message: "Weather Parameter not found" });
    parameter.name = name || parameter.name;
    await parameter.save();
    res.status(200).json(parameter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a weather parameter
export const deleteWeatherParameter = async (req, res) => {
  const { id } = req.params;
  try {
    const parameter = await WeatherParameter.findByPk(id);
    if (!parameter) return res.status(404).json({ message: "Weather Parameter not found" });

    await parameter.destroy();
    res.status(200).json({ message: "Weather Parameter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
