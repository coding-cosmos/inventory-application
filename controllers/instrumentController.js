const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const uploadImageAndGetURL = require('../scripts/cloudinary');
const db = require('../db/queries');

exports.index = asyncHandler(async (req, res, next) => {
  const [instruments, categories] = await Promise.all([
    db.getAllInstruments(),
    db.getAllCategories(),
  ]);

  res.render("home", {
    active: "",
    instruments: instruments,
    categories: categories,
  });
});
  
// Display list of all Instruments.
exports.instrument_list = asyncHandler(async (req, res, next) => {
  const instruments = await db.getAllInstruments();
  res.render("instrument_list", {
    active: "instrument",
    instruments: instruments,
  });
  });
  
  // Display detail page for a specific Instrument.
  exports.instrument_detail = asyncHandler(async (req, res, next) => {
    const instrument = await db.getInstrument(req.params.id);

    res.render("instrument_detail",{
      active:"instrument",
      instrument: instrument,
    });
  });
  
  // Display Instrument create form on GET.
  exports.instrument_create_get = asyncHandler(async (req, res, next) => {
    const categories = await db.getAllCategories();
    console.log(categories);
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

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);
      const url = await uploadImageAndGetURL(req,res);
      
      const instrument = {
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
        image:url,
        number:req.body.number
      };

      if(errors.isEmpty()){
        const insertedInstrument = await db.insertInstrument(instrument.name,instrument.category,instrument.description,instrument.price,instrument.image,instrument.number);

        res.redirect(insertedInstrument.url);
      }else{
        const categories = await db.getAllCategories();

        res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:instrument,errors:errors.array()});
      }
    }),
    
  ];
  
  // Display Instrument delete form on GET.
  exports.instrument_delete_get = asyncHandler(async (req, res, next) => {
    const instrument = await db.getInstrument(req.params.id);
    res.render('instrument_delete',{active:"instruments",instrument:instrument});
  });
  
  // Handle Instrument delete on POST.
  exports.instrument_delete_post = asyncHandler(async (req, res, next) => {
    await db.deleteInstrument(req.body.instrumentid);
    res.redirect("/catalog/instrument");
  });
  
  // Display Instrument update form on GET.
  exports.instrument_update_get = asyncHandler(async (req, res, next) => {
    const [categories,instrument] = await Promise.all([
      db.getAllCategories(),
      db.getInstrument(req.params.id)
    ]);
    

    res.render('instrument_form',{title:"Update the Instrument",active:"instrument",categories:categories,instrument:instrument,errors:null});
  });
  
  // Handle Instrument update on POST.
  exports.instrument_update_post =[
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

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);
      const url = await uploadImageAndGetURL(req,res);
      
      const instrument = {
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
        image:url,
        number:req.body.number,
        _id:req.params.id
      };

      if(errors.isEmpty()){
        const updatedInstrument = 
        await db.updateInstrument(req.params.id,instrument.name,instrument.category,instrument.description,instrument.price,instrument.image,instrument.number);

        res.redirect(updatedInstrument.url);
      }else{
        const categories = db.getAllCategories();

        res.render('instrument_form',{title:"Add a new instrument",active:"instrument",categories:categories,instrument:instrument,errors:errors.array()});
      }
    }),
    
  ];