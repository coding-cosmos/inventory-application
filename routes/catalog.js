const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const instrument_controller = require("../controllers/instrumentController");

/// Category ROUTES ///

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category items.
router.get("/category", category_controller.category_list);

/// Instrument ROUTES ///

// GET catalog home page.
router.get("/", instrument_controller.index);

// GET request for creating Instrument. NOTE This must come before route for id (i.e. display instrument).
router.get("/instrument/create", instrument_controller.instrument_create_get);

// POST request for creating Instrument.
router.post("/instrument/create", instrument_controller.instrument_create_post);

// GET request to delete Instrument.
router.get("/instrument/:id/delete", instrument_controller.instrument_delete_get);

// POST request to delete Instrument.
router.post("/instrument/:id/delete", instrument_controller.instrument_delete_post);

// GET request to update Instrument.
router.get("/instrument/:id/update", instrument_controller.instrument_update_get);

// POST request to update Instrument.
router.post("/instrument/:id/update", instrument_controller.instrument_update_post);

// GET request for one Instrument.
router.get("/instrument/:id", instrument_controller.instrument_detail);

// GET request for list of all Instrument.
router.get("/instrument", instrument_controller.instrument_list);

