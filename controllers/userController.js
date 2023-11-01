


const login= async (req, res) =>{
    console.log("login için yönlendirme başarılı")
    return res.json(req.body)
}

module.exports={login}