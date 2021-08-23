const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user")


router.get("/", (req,res)=>{
    if(req.session.user) res.redirect("home")
    res.render("signin", {err:""})
})

router.post("/", async (req,res)=>{
    const{email, password} = req.body;
    if(email === 'admin@gmail.com' && password === 'admin'){
        req.session.user = 'admin';
        req.session.role === 'ADMIN';
        res.redirect("home")
    }
    const user = await User.findOne({email:email});
    console.log(user)
    if(user===null|| user===undefined){
        res.render("signin", {err:"Provide a valid email"})
    }else{
        if(!bcrypt.compareSync(password, user.password)){
            return res.render("signin", {err:"Incorrect Password"})
        }
        req.session.user = user; 
        res.redirect("home")
    }
})

router.get("/signup", (req,res)=>{
    if(req.session.user) res.redirect("home")
    res.render("signup", {err:""})
})
router.post("/signup", async(req,res)=>{
    const{email, password, name} = req.body;

    const user = await User.findOne({email:email});
    if(user){
        res.render("signup", {err:"Email already present!"})
        return 
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({email, password: hashedPassword, name})
    await newUser.save();
    res.redirect("/")
})

router.get("/home", async(req, res)=>{
    const user = req.session.user;
  
    if(user==undefined) res.redirect("/")
    if(user  === 'admin'){
        res.render("home",{name:"Admin"});
    }
    res.render("home", {name:user.name})
})
router.get("/signout", (req,res)=>{
    req.session.destroy(err => {
        res.clearCookie('my-session')
        res.redirect("/")
    })
})



module.exports = router