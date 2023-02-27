const { QueryTypes } = require('sequelize')
const sosmedBase = require('../databases/sosmedConnection')

const register = async (req, res) =>{
    
    let {username, password, nama, alamat, nohp} = req.body
    if(await isDup(username))
        return res.status(400).send({
            'message': 'Username tidak boleh sama PLIZZZ!'
        })
    let newIdPrefix = username.substring(0,2).toUpperCase()
    let keyword = `%${newIdPrefix}%`
    let similarUID = await sosmedBase.query(
        `select * from users where id_user like ?`,
        {
            type: QueryTypes.SELECT,
            replacements: [keyword]
        }
    )
    let newId = newIdPrefix + (similarUID.length+1).toString().padStart(3, '0')

    let [result, metadata] = await sosmedBase.query(
        `insert into users (id_user, username, password, nama, alamat, nohp) values(:id_user, :username, :password, :nama, :alamat, :nohp)`,
        {
            replacements: {
                id_user: newId,
                username: username, 
                password : password,
                nama: nama,
                alamat: alamat,
                nohp: nohp
            }
        }
    )
    return res.status(201).send({
        'message': 'User successfully registered',
        'id_user': newId,
        "username" : username,
        "nama" : nama,
        "alamat" : alamat,
        "nohp" : nohp
    })
}

const login = async (req, res)=>{
    let {username, password} = req.body;
    let match = await sosmedBase.query(
    `select * from users where username like ? and password like ? `,{
            type: QueryTypes.SELECT,
            replacements:[
            username, password
    ]});
    if(match.length < 1){
        return res.status(200).json({'message' : 'Login Gagal'});
    }
    else{
        return res.status(200).json({'message' : 'Login Berhasil'});
    }
}
const editProfile = async (req, res)=>{
    let {username} = req.params;
    let {nama, alamat, nohp, oldpassword, newpassword} = req.body;
    let matchPassword = sosmedBase.query(
        `select * from users where password like ? `,{
                type: QueryTypes.SELECT,
                replacements:[
                oldpassword
        ]});
    if(matchPassword.length < 1){
        return res.status(200).json({'message' : 'Update Berhasil'});
    }
    else{
        if(!await userExist(username)){
            return res.status(404).send({
                'message': 'User tidak ditemukan'
            });
        }
        else{
            let [result, metadata] = await sosmedBase.query(
                `update users set nama = :nama, password = :newpassword , alamat = :alamat, nohp = :nohp where username = :username`,
                {
                    replacements:{
                        username:username,
                        nama: nama,
                        newpassword:newpassword,
                        password: newpassword,
                        alamat: alamat,
                        nohp:nohp
                    }
                });
            return res.status(200).send({
                "message":"Data berhasil diubah"
            })
        }
    }
}
const addFriend = async (req, res) =>{
    let {username, password, usercari} = req.body;
    let match = await sosmedBase.query(
    `select * from users where username like ? and password like ? `,{
            type: QueryTypes.SELECT,
            replacements:[
            username, password
    ]});
    if(match.length < 1){
        return res.status(200).json({'message' : 'Login Gagal'});
    }
    // else{
    //     let [result, metadata] = await sosmedBase.query(
    //         `insert into listfriend
    //         select * from users where username ?`,
    //         {
    //             replacements: {
    //                 username
    //             }
    //         }
    //     )   
    // }
}
module.exports = {
    register,
    login,
    editProfile
}
async function isDup(username){
    let dup = await sosmedBase.query(
        `select * from users where username = ?`,
        {
            type: QueryTypes.SELECT,
            replacements: [username]
        }
    )
    return dup.length > 0
}
async function selectUserByUsername(username){
    let [user, metadata] = await sosmedBase.query(
        `select * from users where username = :username`,
        {
            replacements:{
                username: username
            }
        }
    )
    return user[0]
}
async function userExist(username){
    let select = await selectUserByUsername(username)
    return !!select
}