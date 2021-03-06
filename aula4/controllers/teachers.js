const data = require('../data.json')
const fs = require('fs')
const {age, date} = require('../utils')
const Intl = require('intl')

exports.index = function(req, res){
    const teachers = data.teachers
    // for( teacher in teachers){
    //     teacher = {
    //         ...teacher,
    //         subjects: teacher.subjects.split(",")
    //     }
    // }

    return res.render("teachers/index", {teachers})
}
//create
exports.create = function(req, res){
    return res.render('teachers/create')
}
//post
exports.post = function(req, res){
    const keys = Object.keys(req.body)
    // Validação dos campos
    for(key of keys){
        if(req.body[key]==""){
            return res.send("Por favor, preencha todos os campos.")
        }
    }

    let{avatar_url, name, birth, scholarity, class_type, subjects} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id, avatar_url, name, birth, scholarity, class_type, subjects, created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        return res.redirect("/teachers")
    })

}
// Show
exports.show = function(req, res){
    const {id} = req.params
    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })
    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        subjects: foundTeacher.subjects.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)                                                                                            
    }

    return res.render("teachers/show", {teacher})
}
// Edit
exports.edit = function(req, res){
    const {id} = req.params
    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })
    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso,
        id: Number(foundTeacher.id)
    }

    return res.render('teachers/edit', {teacher})
}
// Update
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if(id == teacher.id){
            index = foundIndex
            return true
        }
    })

    if(!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Writing error")
        
        return res.redirect(`/teachers/${id}`)
    })
    
}
// Delete
exports.delete = function(req, res){
    const {id} = req.body
    const filteredTeacher = data.teachers.filter(function(teacher){
        return teacher.id != id
    })
    data.teachers = filteredTeacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error.")

        return res.redirect("/teachers")
    })
}
