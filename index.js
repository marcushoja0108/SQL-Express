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
        
        console.log(req.body);

        if(!Name || !Age || !Email){
            console.log("Variables not filled")
            return res.status(400).json({error: "Missing required fields"}); //Sier her hvilken error jeg forventer
        }
        let sqlInput = "INSERT INTO Users (Name, Age, Email) VALUES (@Name, @Age, @Email)";
        const pool=await sql.connect(config);
        await pool.request().input("Name", sql.NVarChar, Name). input("Age", sql.Int, Age).input("Email", sql.NVarChar, Email).query(sqlInput);
        
        console.log("new user added")

        return res.status(201).json({Name, Age, Email})
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
        return res.json({Name, Age, Email})
    }
    catch{
        console.error("Error editing user");
    }
})

app.delete(`/users/:id`, async (req, res) => {
    try{
        let userId = parseInt(req.params.id);
        if(isNaN(userId)){
            return res.status(400).json({error: "Invalid user ID"});
        };
        let sqlInput = `DELETE FROM Users WHERE ID = ${userId}`;

        const pool = await sql.connect(config);
        const result = await pool.request().input("id", sql.Int, req.params.id).query(sqlInput);

        if(result.rowsAffected[0] === 0){
            return res.status(404).json({error: "User not found"});
        }

        console.log(`User with id: ${userId} has been deleted`);
        return res.status(200).json({message: `User with id: ${userId} has been deleted`});
    }
    catch{
        console.log(`Error deleting user with id: ${userId}`);
        return res.status(500).json();
    }
})

const server = app.listen(3000, ()=> {
    console.log("The server has started");
})

module.exports = app;