import Union from '../models/Union.js';

// Get all unions
export const getUnions = async (req, res) => {
    try {
        const unions = await Union.findAll();
        res.json(unions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get single union by ID
export const getUnionById = async (req, res) => {
    try {
        const union = await Union.findByPk(req.params.id);
        if (!union) return res.status(404).json({ error: 'Union not found' });
        res.json(union);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new union
export const createUnion = async (req, res) => {
    try {
        const { name } = req.body;
        const newUnion = await Union.create({ name });
        res.status(201).json(newUnion);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an existing union
export const updateUnion = async (req, res) => {
    try {
        const { name } = req.body;
        const union = await Union.findByPk(req.params.id);
        if (!union) return res.status(404).json({ error: 'Union not found' });

        union.name = name;
        await union.save();
        res.json(union);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a union
export const deleteUnion = async (req, res) => {
    try {
        const union = await Union.findByPk(req.params.id);
        if (!union) return res.status(404).json({ error: 'Union not found' });

        await union.destroy();
        res.json({ message: 'Union deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
