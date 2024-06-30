const Instrument = require('../models/instrument');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


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
    const instrument = await Instrument.findById(req.params.id).populate('category').exec();

    res.render("instrument_detail",{
      active:"instrument",
      instrument: instrument,
    });
  });
  
  // Display Instrument create form on GET.
  exports.instrument_create_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).sort({ name: 1 }).exec();

    res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:null,errors:null});
  });
  
  // Handle Instrument create on POST.
  exports.instrument_create_post = [
    body('name','Name must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('description','Description must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('category','Category must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('price','Price must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('number','Availble number must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('image','Image URL must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      
      const instrument = new Instrument({
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image,
        number:req.body.number
      });

      if(errors.isEmpty()){
        await instrument.save();

        res.redirect(instrument.url);
      }else{
        const categories = await Category.find({}).sort({ name: 1 }).exec();

        res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:instrument,errors:errors.array()});
      }
    }),
    
  ];
  
  // Display Instrument delete form on GET.
  exports.instrument_delete_get = asyncHandler(async (req, res, next) => {
    const instrument = await Instrument.findById(req.params.id).exec();
    res.render('instrument_delete',{active:"instruments",instrument:instrument});
  });
  
  // Handle Instrument delete on POST.
  exports.instrument_delete_post = asyncHandler(async (req, res, next) => {
    await Instrument.findByIdAndDelete(req.body.instrumentid);
    res.redirect("/catalog/instrument");
  });
  
  // Display Instrument update form on GET.
  exports.instrument_update_get = asyncHandler(async (req, res, next) => {
    const [categories,instrument] = await Promise.all([
      Category.find({}).sort({ name: 1 }).exec(),
      Instrument.findById(req.params.id).populate("category").exec()
    ]);
    

    res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:instrument,errors:null});
  });
  
  // Handle Instrument update on POST.
  exports.instrument_update_post = [
    body('name','Name must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('description','Description must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('category','Category must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('price','Price must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('number','Availble number must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    body('image','Image URL must not be empty.')
    .trim()
    .isLength({min:1})
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      
      const instrument = new Instrument({
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
        image:req.body.image,
        number:req.body.number,
        _id:req.params.id
      });

      if(errors.isEmpty()){
        const updatedInstrument = await Instrument.findByIdAndUpdate(req.params.id,instrument,{});

        res.redirect(updatedInstrument.url);
      }else{
        const categories = await Category.find({}).sort({ name: 1 }).exec();

        res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:instrument,errors:errors.array()});
      }
    }),
    
  ];