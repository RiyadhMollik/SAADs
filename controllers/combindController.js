import AEZ from "../models/AEZ.js";
import District from "../models/District.js";
import Division from "../models/Division.js";
import Hotspot from "../models/Hotspot.js";
import Region from "../models/Region.js";
import Upazila from "../models/Upazila.js";
import Union from "../models/Union.js";
import Block from "../models/block.js";
import { Op } from 'sequelize';

export const getAllData = async (req, res) => {
    try {
        const [aez,  districts, divisions, hotspots, regions, upazilas, unions, blocks] = await Promise.all([
            AEZ.findAll(),
            District.findAll(),
            Division.findAll(),
            Hotspot.findAll(),
            Region.findAll(),
            Upazila.findAll(),
            Union.findAll(),
            Block.findAll(),
        ]);

        res.json({
            aez,
            districts,
            divisions,
            hotspots,
            regions,
            upazilas,
            unions,
            blocks,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getHotspots = async (req, res) => {
  try {
    const hotspots = await Block.findAll({
      attributes: ["hotspot"],
      group: ["hotspot"],
    });

    res.json(hotspots.map((item) => item.hotspot));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique CSA based on selected Hotspot
export const getCSAByHotspot = async (req, res) => {
  try {
    const { hotspot } = req.query;

    const csaList = await Block.findAll({
      attributes: ["csa"],
      where: { hotspot },
      group: ["csa"],
    });

    res.json(csaList.map((item) => item.csa));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique Regions based on Hotspot and CSA
export const getRegionsByCSA = async (req, res) => {
  try {
    let { hotspot } = req.query;

    // Handle comma-separated or array inputs
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    const whereClause = hotspot.length
      ? { hotspot: { [Op.in]: hotspot } }
      : {};

    const regions = await Block.findAll({
      attributes: ["region"],
      where: whereClause,
      group: ["region"],
    });

    const result = regions
      .map((item) => item.region)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Divisions based on Region
export const getDivisionsByRegion = async (req, res) => {
  try {
    let { hotspot, region } = req.query;

    // Handle comma-separated or array inputs for 'hotspot'
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Region is always a single value (string), so no need to split
    if (typeof region !== "string") {
      region = "";  // Default to an empty string if region is not a string
    }

    // Build the where clause
    const whereClause = {
      ...(hotspot.length ? { hotspot: { [Op.in]: hotspot } } : {}),
      ...(region ? { region } : {}),
    };

    // Fetch divisions based on 'hotspot' and 'region'
    const divisions = await Block.findAll({
      attributes: ["division"],
      where: whereClause,
      group: ["division"],
    });

    // Respond with the list of divisions
    res.json(divisions.map((item) => item.division));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Districts based on Division
export const getDistrictsByDivision = async (req, res) => {
  try {
    let { hotspot, region, division } = req.query;

    // Handle comma-separated or array inputs for 'hotspot'
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Region and division are always single values (strings)
    if (typeof region !== "string") {
      region = "";  // Default to an empty string if region is not a string
    }
    if (typeof division !== "string") {
      division = "";  // Default to an empty string if division is not a string
    }

    // Build the where clause
    const whereClause = {
      ...(hotspot.length ? { hotspot: { [Op.in]: hotspot } } : {}),
      ...(region ? { region } : {}),
      ...(division ? { division } : {}),
    };

    // Fetch districts based on 'hotspot', 'region', and 'division'
    const districts = await Block.findAll({
      attributes: ["district"],
      where: whereClause,
      group: ["district"],
    });

    // Respond with the list of districts
    res.json(districts.map((item) => item.district));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Upazilas based on District
export const getUpazilasByDistrict = async (req, res) => {
  try {
    let { hotspot, region, division, district } = req.query;

    // Handle comma-separated or array inputs for 'hotspot'
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Region, division, and district are always single values (strings)
    if (typeof region !== "string") {
      region = "";  // Default to an empty string if region is not a string
    }
    if (typeof division !== "string") {
      division = "";  // Default to an empty string if division is not a string
    }
    if (typeof district !== "string") {
      district = "";  // Default to an empty string if district is not a string
    }

    // Build the where clause
    const whereClause = {
      ...(hotspot.length ? { hotspot: { [Op.in]: hotspot } } : {}),
      ...(region ? { region } : {}),
      ...(division ? { division } : {}),
      ...(district ? { district } : {}),
    };

    // Fetch upazilas based on 'hotspot', 'region', 'division', and 'district'
    const upazilas = await Block.findAll({
      attributes: ["upazila"],
      where: whereClause,
      group: ["upazila"],
    });

    // Respond with the list of upazilas
    res.json(upazilas.map((item) => item.upazila));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Unions based on Upazila
export const getUnionsByUpazila = async (req, res) => {
  try {
    let { hotspot, region, division, district, upazila } = req.query;

    // Handle comma-separated or array inputs for 'hotspot'
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Region, division, district, and upazila are always single values (strings)
    if (typeof region !== "string") {
      region = "";  // Default to an empty string if region is not a string
    }
    if (typeof division !== "string") {
      division = "";  // Default to an empty string if division is not a string
    }
    if (typeof district !== "string") {
      district = "";  // Default to an empty string if district is not a string
    }
    if (typeof upazila !== "string") {
      upazila = "";  // Default to an empty string if upazila is not a string
    }

    // Build the where clause
    const whereClause = {
      ...(hotspot.length ? { hotspot: { [Op.in]: hotspot } } : {}),
      ...(region ? { region } : {}),
      ...(division ? { division } : {}),
      ...(district ? { district } : {}),
      ...(upazila ? { upazila } : {}),
    };

    // Fetch unions based on 'hotspot', 'region', 'division', 'district', and 'upazila'
    const unions = await Block.findAll({
      attributes: ["union"],
      where: whereClause,
      group: ["union"],
    });

    // Respond with the list of unions
    res.json(unions.map((item) => item.union));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get unique Blocks based on Union
export const getBlocksByUnion = async (req, res) => {
  try {
    let { hotspot, region, division, district, upazila, union } = req.query;

    // Handle comma-separated or array inputs for 'hotspot'
    if (typeof hotspot === "string") {
      hotspot = hotspot.split(",").map((s) => s.trim());
    } else if (!Array.isArray(hotspot)) {
      hotspot = [];
    }

    // Ensure all other parameters are single values (strings)
    if (typeof region !== "string") {
      region = "";  // Default to an empty string if region is not a string
    }
    if (typeof division !== "string") {
      division = "";  // Default to an empty string if division is not a string
    }
    if (typeof district !== "string") {
      district = "";  // Default to an empty string if district is not a string
    }
    if (typeof upazila !== "string") {
      upazila = "";  // Default to an empty string if upazila is not a string
    }
    if (typeof union !== "string") {
      union = "";  // Default to an empty string if union is not a string
    }

    // Build the where clause
    const whereClause = {
      ...(hotspot.length ? { hotspot: { [Op.in]: hotspot } } : {}),
      ...(region ? { region } : {}),
      ...(division ? { division } : {}),
      ...(district ? { district } : {}),
      ...(upazila ? { upazila } : {}),
      ...(union ? { union } : {}),
    };

    // Fetch blocks based on the provided parameters
    const blocks = await Block.findAll({
      attributes: ["block"],
      where: whereClause,
      group: ["block"],
    });

    // Respond with the list of blocks
    res.json(blocks.map((item) => item.block));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
