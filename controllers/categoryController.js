const Category = require("../models/category");
const Instrument = require("../models/instrument");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require('../db/queries');


// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await db.getAllCategories();

  res.render("category_list", {
    active: "category",
    categories: categories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await db.getCategory(req.params.id);
  const instruments = await db.getInstrumentsWithCategory(req.params.id);

  res.render("category_detail", {
    active: "category",
    category: category,
    instruments: instruments,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form",{ title: "Create New Category",active:"category",category:undefined,errors:null});  
});

// Handle Category create on POST.
exports.category_create_post = [
  body("name","Category name must not be empty.")
  .trim()
  .isLength({min:1})
  .escape(),

  body("description","Description must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);
    
    const category = {name:req.body.name,description:req.body.description};

    if(errors.isEmpty()){
      await db.insertCategory(category.name,category.description);
      res.render("category_detail",{active:"category",category:category,instruments:undefined});
    }else{
      res.render("category_form",{title:"Create New Category",active:"category",category:category,errors:errors.array()});
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, instruments] = await Promise.all([
    db.getCategory(req.params.id),
    db.getInstrumentsWithCategory(req.params.id)
  ]);

  if (category === null) {
    res.redirect("/catalog/category");
  }

  res.render("category_delete", {
    active: "category",
    title: "Delete Category",
    category: category,
    instruments: instruments,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, instruments] = await Promise.all([
    db.getCategory(req.params.id),
    db.getInstrumentsWithCategory(req.params.id)
  ]);

  if (instruments.length > 0) {   
    res.render("category_delete", {
      active:"category",
      title: "Delete Category",
      category: category,
      instruments: instruments,
    });
    return;
  } else {   
    await db.deleteCategory(req.body.categoryid);
    res.redirect("/catalog/category");
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await db.getCategory(req.params.id);

  res.render("category_form",{title:"Update Category",active:"category",category:category,errors:null}); 
});

// Handle Category update on POST.
exports.category_update_post = [
  body("name","Category name must not be empty.")
  .trim()
  .isLength({min:1})
  .escape(),

  body("description","Description must not be empty")
  .trim()
  .isLength({min:1})
  .escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);
    
    const category = {name:req.body.name,description:req.body.description};

    if(errors.isEmpty()){
     const updatedCategory = await db.updateCategory(req.params.id,category.name,category.description);

     res.redirect(updatedCategory.url);
    }else{
      res.render("category_form",{title:"Create New Category",active:"category",category:category,errors:errors.array()});
    }
  }),
];
