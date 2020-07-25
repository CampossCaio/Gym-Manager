const { age, date } = require('../../lib/utils');
const Instructor = require('../../model/instructor');
const db = require('../../config/db');

module.exports = {
    
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors) {

                const pagination = {
                    total: Math.ceil(instructors[0].total / limit),
                    page
                }
               
                return res.render("Instructors/index", {instructors, filter, pagination});
            }
        }

        Instructor.paginate(params);

    },
    create(req, res) {

        return res.render('Instructors/create');

    },
    post(req, res) {
        
        const keys = Object.keys(req.body);

        for(key of keys) {
            // req.body.key == ""
            if (req.body[key] == "") {
                return res.send('Please, fill all fields');
            }
        }

        Instructor.create(req.body, function(instructor) {
            res.redirect(`/instructors/${instructor.id}`);
        });
 
    },
    show(req, res) {

        const { id } = req.params;
        
        Instructor.find(id, function(instructor) {
            if(!instructor) return res.send("Instructor not found!");

            instructor.age = age(instructor.birth);
            instructor.services = instructor.services.split(",");
            instructor.created_at = date(instructor.created_at).format;

            return res.render("Instructors/show", { instructor });
        });

    },
    edit(req, res) {
        
        const { id } = req.params;
        
        Instructor.find(id, function(instructor) {
            if(!instructor) return res.send("Instructor not found!");

            instructor.birth = date(instructor.birth).iso;
        
            return res.render("Instructors/edit", { instructor });
        });

    },
    update(req, res) {

        const keys = Object.keys(req.body);

        for(key of keys) {
            // req.body.key == ""
            if (req.body[key] == "") {
                return res.send('Please, fill all fields');
            }
        }
    
       Instructor.update(req.body, function() {
           return res.redirect(`/instructors/${req.body.id}`);
       })

    },
    delete(req, res) {

        Instructor.delete(req.body.id, function() {
            return res.redirect(`/instructors`);
        })
        
    },
}
