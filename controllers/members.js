const fs = require('fs');
const data = require('../data.json');
const { date } = require('../utils');

exports.index = (req, res) => {
    return res.render("Members/index", { members: data.members });
}
exports.show = (req, res) => {
    const { id } = req.params;

    const foundMember = data.members.find(member => member.id == id);

    if(!foundMember) {
        res.json({ error: 'Member not found'})
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay,
    }

    return res.render("Members/show", { member });
}
exports.create = (req, res) => {
    return res.render("Members/create");
}
exports.post = (req, res) => {

    
    const keys = Object.keys(req.body);

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Please, fill all fields');
        }
    }


    birth = Date.parse(req.body.birth); // transformando a data em milisegundos

    let id = 1;
    const lastMember = data.members[data.members.length - 1];

    if (lastMember) {
        id = lastMember.id +1;
    }

    data.members.push({
        id,
        ...req.body,
        birth,
    }); // [{...}, {...}]

    fs.writeFile("data.json", JSON.stringify(data,null, 2), (err) => {
        if(err) {
            return res.send("Write file error");
        }
    });

    return res.redirect(`/members/${id}`);
}
exports.edit = (req, res) => {

    const { id } = req.params;

    const foundMember = data.members.find(member => member.id == id);

    if(!foundMember) {
        res.json({ error: "Member not found"});
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso,
    }

    return res.render("Members/edit", { member });
}
exports.update = (req, res ) => {

    const { id } = req.body;
    let index = 0;

    const foundMember = data.members.find((member, foundIndex) => {
        if(member.id == id) {
            index = foundIndex;
            return true;
        }
    });

    if(!foundMember) {
        res.json({ error: "Member not found"});
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

    data.members[index] = member;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.json({ error: "Write error!"})  

        return res.redirect(`members/${id}`);
    })
   
}
exports.delete = (req, res) => {
    const { id } = req.body;
    
    //Exemplo de filter sem arrow function
    const filteredMembers = data.members.filter(function(member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json",JSON.stringify(data, null, 2), (error) => {
        if(error) {
            res.json({ error: "Write file error!" });
        }

        return res.redirect("/members");
    });
}