require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


exports.homepage = async(req, res) => {
    
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const Sweets = await Recipe.find({'category': 'Sweets'}).limit(limitNumber);
        const Snacks = await Recipe.find({'category': 'Snacks'}).limit(limitNumber);
        const Indian = await Recipe.find({'category': 'Indian'}).limit(limitNumber);
        const American = await Recipe.find({'category': 'American'}).limit(limitNumber);
        const Italian = await Recipe.find({'category': 'Italian'}).limit(limitNumber);
        const Chinese = await Recipe.find({'category': 'Chinese'}).limit(limitNumber);
        const Desserts = await Recipe.find({'category': 'Desserts'}).limit(limitNumber);

        const food = { latest, Indian, Sweets, Italian, American };

        res.render('index', { title: 'Homepage', categories, food });
        
    } catch (error) {
        
        res.satus(500).send({message: error.message || "Error Occured"});

    }

}

exports.exploreCategories = async(req, res) => {
    
    try {

        const limitNumber = 10;
        const categories = await Category.find({});

        res.render('categories', { title: 'Categories', categories });
        
    } catch (error) {
        
        res.satus(500).send({message: error.message || "Error Occured"});

    }

}

exports.exploreCategoriesById = async(req, res) => {
    
    try {

        let CategoryId = req.params.id;

        const limitNumber = 20;
        const categoriesById = await Recipe.find({'category': CategoryId}).limit(limitNumber);

        res.render('categories', { title: 'Categories', categoriesById });
        
    } catch (error) {
        
        res.satus(500).send({message: error.message || "Error Occured"});

    }

}

exports.exploreRecipe = async(req, res) => {
    
    try {

        let recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', { title: 'Recipe', recipe });
        
    } catch (error) {
        
        res.satus(500).send({message: error.message || "Error Occured"});

    }

}

exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Cooking Blog - Search', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }

  exports.exploreLatest = async(req, res) => {

      try {
          const limitNumber = 20;
          const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
          res.render('explore-latest', { title: 'Explore Latest', recipe })
      } catch (error) {
        res.satus(500).send({message: error.message || "Error Occured" });
      }

  }

  exports.exploreRandom = async(req, res) => {

    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', { title: 'Explore Latest', recipe })
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }

}

exports.submitRecipe = async(req, res) => {

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj } );
}

exports.submitRecipeOnPost = async(req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files where uploaded.');
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() + imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.satus(500).send(err);
          })
    
        }
    
        const newRecipe = new Recipe({
          name: req.body.name,
          description: req.body.description,
          email: req.body.email,
          ingredients: req.body.ingredients,
          category: req.body.category,
          image: newImageName
        });
        
        await newRecipe.save();
    
        req.flash('infoSubmit', 'Recipe has been added.')
        res.redirect('/submit-recipe');
      } catch (error) {
        // res.json(error);
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
      }

}

// async function insertDymmyRecipeData(){

//     try {
//         await Recipe.insertMany([
//                    { 
//                      "name": "Samosa",
//                      "description": `Recipe Description Goes Here`,
//                      "email": "nemantaj@gmail.com",
//                      "ingredients": [
//                        "1 level teaspoon baking powder",
//                        "1 level teaspoon cayenne pepper",
//                        "1 level teaspoon hot smoked paprika",
//                      ],
//                      "category": "American", 
//                      "image": "samosa.jpeg"
//                    },
//                    { 
//                      "name": "Cookie",
//                      "description": `Recipe Description Goes Here`,
//                     "email": "nemantaj@gmail.com",
//                      "ingredients": [
//                        "1 level teaspoon baking powder",
//                        "1 level teaspoon cayenne pepper",
//                        "1 level teaspoon hot smoked paprika",
//                      ],
//                      "category": "Snacks", 
//                      "image": "samosa.jpeg"
//                   },
//                   { 
//                     "name": "Mixture",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Snacks", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Burger",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "American", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Paneer Chilli",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Indian", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Idli",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Indian", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Kaju Katli",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Sweets", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Milk Cake",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Sweets", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Hakaa Noodles",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Chinese", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Chowmin",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Chinese", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Pasta",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Italian", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Pizza Margarita",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Italian", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Ras Malai",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Desserts", 
//                     "image": "samosa.jpeg"
//                  },
//                  { 
//                     "name": "Cookie Cutter",
//                     "description": `Recipe Description Goes Here`,
//                    "email": "nemantaj@gmail.com",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Snacks", 
//                     "image": "samosa.jpeg"
//                  },
//                  ])
//     } catch (error) {
//         console.log('err', + error);
//     }

// }

