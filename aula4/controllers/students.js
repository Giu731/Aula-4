const data = require('../data.json')
const fs = require('fs')
const {date, grade} = require('../utils')

exports.index = function(req, res){
    const students = data.students

    for(student of students){
         student = {
            ...data.student,
            school_level: grade(student.school_level)
        }
    }

    return res.render("students/index", {students})
}
//Create
exports.create = function(req, res){
    return res.render('students/create')
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

    let{avatar_url, name, email, birth, school_level, amount_hours} = req.body

    birth = Date.parse(birth)
    let id = 1
    const lastStudent = data.students[data.students.length - 1]
    if(lastStudent){
        id = lastStudent.id +1
    }

    data.students.push({
        id, avatar_url, name, email, birth, school_level, amount_hours
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        return res.redirect("/students")
    })

}
// Show
exports.show = function(req, res){
    const {id} = req.params
    const foundStudent = data.students.find(function(student){
        return student.id == id
    })
    if(!foundStudent) return res.send("Student not found")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).birthDay,
        school_level: grade(foundStudent.school_level)
    }

    return res.render("students/show", {student})
}
// Edit
exports.edit = function(req, res){
    const {id} = req.params
    const foundStudent = data.students.find(function(student){
        return student.id == id
    })
    if(!foundStudent) return res.send("Student not found")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso,
        id: Number(foundStudent.id)
    }

    return res.render('students/edit', {student})
}
// Update
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if(id == student.id){
            index = foundIndex
            return true
        }
    })

    if(!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Writing error")
        
        return res.redirect(`/students/${id}`)
    })
    
}
// Delete
exports.delete = function(req, res){
    const {id} = req.body
    const filteredStudent = data.students.filter(function(student){
        return student.id != id
    })
    data.students = filteredStudent

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error.")

        return res.redirect("/students")
    })
}
