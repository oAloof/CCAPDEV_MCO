var register = function (Handlebars) {
    var helpers = {
        xDaysAgo: function (dateObject) {
            const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
            const today = new Date()
            const x = Math.round(Math.abs((dateObject - today) / oneDay))
            return (x<2)? 'Today': `${x-1} days ago`
        },
        xComments: function (collection) {
            return collection.length
        }
    }

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop])
        }
    } else {
        return helpers
    }

}

module.exports.register = register
module.exports.helpers = register(null)