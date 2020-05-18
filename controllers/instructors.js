const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../utils');


exports.index = (req, res) => {
    return res.render("Instructors/index", { instructors: data.instructors });
}
exports.show = (req, res) => {
    const { id } = req.params;

    const foundInstructor = data.instructors.find(intructor => intructor.id == id);

    if(!foundInstructor) {
        res.json({ error: 'Instructor not found'})
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render("Instructors/show", { instructor });
}
exports.create = (req, res) => {
    return res.render('Instructors/create');
}
exports.post = (req, res) => {

    
    const keys = Object.keys(req.body);

    for(key of keys) {
        // req.body.key == ""
        if (req.body[key] == "") {
            return res.send('Please, fill all fields');
        }
    }

    let { avatar_url, birth, gender, services, name } = req.body;

    birth = Date.parse(birth); // transformando a data em milisegundos
    const created_at = req.body.created_at = Date.now();
    const id = Number(data.instructors.length + 1); // Adicionando id ao instructor

    

    data.instructors.push({
        id,
        avatar_url,
        birth,
        created_at,
        gender,
        services,
        name
    }); // [{...}, {...}]

    fs.writeFile("data.json", JSON.stringify(data,null, 2), (err) => {
        if(err) {
            return res.send("Write file error");
        }

        return res.redirect("/instructors");
    });

    return res.send(req.body);
}
exports.edit = (req, res) => {

    const { id } = req.params;

    const foundInstructor = data.instructors.find(instructor => instructor.id == id);

    if(!foundInstructor) {
        res.json({ error: "Instructor not found"});
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso,
    }

    return res.render("Instructors/edit", { instructor });
}
exports.update = (req, res ) => {

    const { id } = req.body;
    let index = 0;

    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if(instructor.id == id) {
            index = foundIndex;
            return true;
        }
    });

    if(!foundInstructor) {
        res.json({ error: "Instructor not found"});
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

    data.instructors[index] = instructor;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.json({ error: "Write error!"})

        return res.redirect(`instructors/${id}`);
    })
}
exports.delete = (req, res) => {
    const { id } = req.body;
    
    //Exemplo de filter sem arrow function
    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id;
    });

    data.instructors = filteredInstructors;

    fs.writeFile("data.json",JSON.stringify(data, null, 2), (error) => {
        if(error) {
            res.json({ error: "Write file error!" });
        }

        return res.redirect("/instructors");
    });
}