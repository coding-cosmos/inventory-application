const Instrument = require('../models/instrument');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');


exports.index = asyncHandler(async (req, res, next) => {
  const [instruments, categories] = await Promise.all([
    Instrument.find({}, "name image").sort({ name: 1 }).limit(5).exec(),
    Category.find({}, "name").sort({ name: 1 }).limit(5).exec(),
  ]);

  res.render("home", {
    active: "",
    instruments: instruments,
    categories: categories,
  });
});
  
// Display list of all Categories.
exports.instrument_list = asyncHandler(async (req, res, next) => {
  const instruments = await Instrument.find({}).populate('category').sort({ name: 1 }).exec();
  res.render("instrument_list", {
    active: "instrument",
    instruments: instruments,
  });
  });
  
  // Display detail page for a specific Instrument.
  exports.instrument_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Instrument detail: ${req.params.id}`);
  });
  
  // Display Instrument create form on GET.
  exports.instrument_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument create GET");
  });
  
  // Handle Instrument create on POST.
  exports.instrument_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument create POST");
  });
  
  // Display Instrument delete form on GET.
  exports.instrument_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument delete GET");
  });
  
  // Handle Instrument delete on POST.
  exports.instrument_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument delete POST");
  });
  
  // Display Instrument update form on GET.
  exports.instrument_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument update GET");
  });
  
  // Handle Instrument update on POST.
  exports.instrument_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Instrument update POST");
  });