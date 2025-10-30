const Joi=require("joi");
//create for listing

//create for reviews
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required(),
});

///validation it not used in app.js beacuse of ExpreesError error