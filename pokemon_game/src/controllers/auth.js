const {request, response} = require('express');
const bcrypt = require('bcrypt');

const login = async (req = request, res = response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).send({
            Message: "some fields are missing"})
            }
        let conn;
        try{
            conn = await pool.getConnection();
            const user = await conn.query(userQueries.getByEmail, [email]);

            if(!user){
                res.status(404).send({message: "User not found"});
                return;
            const valid = await bcrypt.compare(password, user.password);
            
            if (!valid) {
                res.status(401).send({ message: "invalid password" });
                return;
        }
        res.status(200).send({message: "logged in successfully"});
        }
        }catch (error) {
            res.status(500).send(error);
            return
        }finally{
            if (conn) conn.end();
        }
     }

