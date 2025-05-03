import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Union = sequelize.define('Union', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'unions',
    timestamps: false, // Disable createdAt & updatedAt fields
});

export default Union;
