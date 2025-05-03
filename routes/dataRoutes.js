import express from "express";
import { getAllData , getHotspots,
    getCSAByHotspot,
    getRegionsByCSA,
    getDivisionsByRegion,
    getDistrictsByDivision,
    getUpazilasByDistrict,
    getUnionsByUpazila,
    getBlocksByUnion, } from "../controllers/combindController.js";

const router = express.Router();

router.get("/", getAllData);
router.get("/hotspots", getHotspots);
router.get("/csa", getCSAByHotspot);
router.get("/regions", getRegionsByCSA);
router.get("/divisions", getDivisionsByRegion);
router.get("/districts", getDistrictsByDivision);
router.get("/upazilas", getUpazilasByDistrict);
router.get("/unions", getUnionsByUpazila);
router.get("/blocks", getBlocksByUnion);

export default router;
