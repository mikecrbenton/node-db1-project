const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

// GET ALL ACCOUNTS======================================
server.get("/", async(req, res, next) => {
   try {
      //SELECT * FROM messages
      const accounts = await db.select("*").from("accounts")
      res.json(accounts)
   }catch(err){
      next(err)
   }
})

// GET BY ID==============================================
server.get("/:id", async(req, res, next) => {
   try { 
      const [account] = await db      
         .select("*")
         .from("accounts")
         .where("id", req.params.id)
         .limit(1)

      res.json(account)

   }catch(err){
      next(err)
   }
})

// POST A NEW ACCOUNT======================================
server.post("/", async(req, res, next) => {
   try{
      const payload = {
         name : req.body.name,
         budget : req.body.budget
      }

      if(!payload.name || !payload.budget) {
         return res.status(400).json( {message: "Need name and budget fields"})
      }
      // GETTING NEWLY CREATED ID FROM DB
      const [id] = await db.insert(payload).into("accounts")
      
      const createdAccount = await db
         .first("*") 
         .from("accounts")
         .where("id", id)

      res.status(201).json(createdAccount)

   }catch(err){
      next(err)
   }
})

// EDIT AN ACCOUNT==========================================
server.put("/:id", async(req, res, next) => {
   try{
      const payload = {
         name : req.body.name,
         budget : req.body.budget
      }

      if(!payload.name || !payload.budget) {
         return res.status(400).json( {message: "Need name and budget fields"})
      }

      // UPDATE messages SET title = ? AND contents = WHERE id= ?
      // DON'T NEED A VARIABLE
      await db("accounts").where("id", req.params.id).update(payload)

      // RETURN UPDATED MESSAGE
      const updatedAccount = await db
      .first("*") // shortcut instead of having to [destructure] and LIMIT 1
      .from("accounts")
      .where("id", req.params.id)

      res.json(updatedAccount)
      
   }catch(err){
      next(err)
   }
})

// DELETE AN ACCOUNT==========================================
server.delete("/:id", async(req, res, next) => {
   try{
      // DELETE FROM  messages WHERE id = ?  // DON'T FORGET WHERE!!!  DON'T DELETE YOUR DATABASE
      await db("accounts").where("id", req.params.id).del()
      res.status(204).end() // no resource to return 204 = success empty response
      
   }catch(err){
      next(err)
   }
})

module.exports = server;
