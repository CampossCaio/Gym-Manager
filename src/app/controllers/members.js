const { age, date } = require('../../lib/utils');
const Member = require('../../model/member');
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
            callback(members) {

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }
               
                return res.render("Members/index", {members, filter, pagination});
            }
        }

        Member.paginate(params);

    },
    create(req, res) {

        Member.instructorSelectOptions(function(options){
            return res.render('Members/create', {instructorOptions: options});
        });
    },
    post(req, res) {
        
        const keys = Object.keys(req.body);

        for(key of keys) {
            // req.body.key == ""
            if (req.body[key] == "") {
                return res.send('Please, fill all fields');
            }
        }

        Member.create(req.body, function(member) {
            res.redirect(`/members/${member.id}`);
        });
 
    },
    show(req, res) {

        const { id } = req.params;
        
        Member.find(id, function(member) {
            if(!member) return res.send("Member not found!");

            member.birth = date(member.birth).birthDay;
            return res.render("Members/show", { member });
        });

    },
    edit(req, res) {
        
        const { id } = req.params;
        
        Member.find(id, function(member) {
            if(!member) return res.send("Member not found!");

            member.birth = date(member.birth).iso;

            Member.instructorSelectOptions(function(options){
                return res.render('Members/edit', {member, instructorOptions: options});
            });
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
    
       Member.update(req.body, function() {
           return res.redirect(`/members/${req.body.id}`);
       })

    },
    delete(req, res) {

        Member.delete(req.body.id, function() {
            return res.redirect(`/members`);
        })
        
    },
}
