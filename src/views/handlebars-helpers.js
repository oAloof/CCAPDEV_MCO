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
        },
        include: function(opts) {
            var context = {},
                mergeContext = function(obj) {
                    for(var k in obj) context[k]=obj[k]
                };
            mergeContext(this)
            mergeContext(opts.hash)
            return opts.fn(context)
        },
        if_equal: function(a, b, opts) {
            if (a == b) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
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