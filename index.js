const express = require('express');
const sql = require('mssql')
const cors = require('cors')

const app=express()

app.use(express.json())
app.use(cors());

const config={
    user: "marc",
    password: "0000",
    server: "DESKTOP-PSDS24G",
    database: "Expressxnode",
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        instancename: "SQLEXPRESS",
    },
    port: 1433,
}

app.get('/users', async (req, res) => {
    try{
        const pool=await sql.connect(config);
        let data=pool.request().query('SELECT * FROM Users');
        data.then(res1=>{
            return res.json(res1.recordset)
        })
    }
    catch(err){
        console.log(err)
    }
})


app.get(`/users/:id`, async (req, res) => {
    try{
        let userId = parseInt(req.params.id);
       
            let sqlInput = `SELECT * FROM Users WHERE ID = ${userId}`;
            const pool=await sql.connect(config);
            let data = await pool.request().input("id", sql.Int, req.params.id).query(sqlInput);
                return res.json(data.recordset);
    }
    catch(err){
        console.log("Error getting user", err)
    }
})

app.post(`/users`, async (req, res) => {
    try{
        const {Name, Age, Email} = req.body;
        if(!Name || !Age || !Email){
            console.log("Variables not filled")
            return
        }
        let sqlInput = "INSERT INTO Users (Name, Age, Email) VALUES (@Name, @Age, @Email)";
        const pool=await sql.connect(config);
        let data = await pool.request().input("Name", sql.NVarChar, Name). input("Age", sql.Int, Age).input("Email", sql.NVarChar, Email).query(sqlInput);
        
        console.log("new user added")

        return res.json(data.recordset)
    }
    catch(err){
        console.log("Error adding user", err)
    }
})

app.put(`/users/:id`, async (req, res) => {
    try{
        let userId = parseInt(req.params.id);
        const {Name, Age, Email} = req.body;
        let sqlInput = `UPDATE Users SET Name = @Name, Age = @Age, Email = @Email WHERE ID = ${userId}`;

        const pool = await sql.connect(config);
        await pool.request().input("id", sql.Int, req.params.id).input("Name", sql.NVarChar, Name).input("Age", sql.Int, Age).input("Email", sql.NVarChar, Email).query(sqlInput);
        
        console.log(`User with id: ${userId} has been updated`)
    }
    catch{
        console.error("Error editing user");
    }
})

app.delete(`/users/:id`, async (req, res) => {
    try{
        let userId = parseInt(req.params.id);
        let sqlInput = `DELETE FROM Users WHERE ID = ${userId}`;

        const pool = await sql.connect(config);
        await pool.request().input("id", sql.Int, req.params.id).query(sqlInput);

        console.log(`User with id: ${userId} has been deleted`)
    }
    catch{
        console.log(`Error deleting user with id: ${userId}`)
    }
})

const server = app.listen(3000, ()=> {
    console.log("The server has started");
})

module.exports = app;