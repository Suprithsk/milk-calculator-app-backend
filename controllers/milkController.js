const Milk=require('../models/Milk');
const Curd=require('../models/Curd');
const User=require('../models/User');
const Purchase=require('../models/Purchase');


const addMilk=async(req,res)=>{
    const {price}=req.body;
    try{
        const user=await User.findOne({username:req.user.username})
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        await Milk.deleteOne({User:user._id})
        const newMilk=new Milk({price,User:user._id})
        await newMilk.save();
        res.status(201).send({msg:"Milk added successfully"})
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
}
const addCurd=async(req,res)=>{
    const {price}=req.body;
    try{
        const user=await User.findOne({username:req.user.username})
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        await Curd.deleteOne({User:user._id})
        const curd=new Curd({price,User:user._id})
        await curd.save();
        res.status(201).send({msg:"Curd added successfully"})
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
}

const getMilk=async(req,res)=>{
    try{
        const user=await User.findOne({username:req.user.username})
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        const milk=await Milk.find({User:user._id}).populate('User')
        if(!milk){
            return res.status(400).send({msg:"Milk price not found"})
        }
        res.status(200).send(milk)
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
}

const getCurd=async(req,res)=>{
    try{
        const user=await User.findOne({username:req.user.username})
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        const curd=await Curd.find({User:user._id}).populate('User')
        if(!curd){
            return res.status(400).send({msg:"Curd price not found"})
        }
        res.status(200).send(curd)
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
}


const purchaseMilkOrCurd=async(req,res)=>{
    const { milk, curd, purchasedDate }=req.body;
    try{
        const user=await User.findOne({username: req.user.username});
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        const alreadyPurchase=await Purchase.findOne({User:user._id,purchaseDate:purchasedDate})
        if(alreadyPurchase){
            await Purchase.deleteOne({User:user._id,purchaseDate:purchasedDate})
        }
        const purchase = new Purchase({ User: user._id, purchaseDate: purchasedDate });
        let totalPrice = 0;
 
        if (milk) {
            const milkPrice = await Milk.findOne({User: user._id});
            if(!milkPrice){
                return res.status(400).send({msg:"Milk price not found"})
            }
            purchase.milk = {milkId: milkPrice._id, quantity: milk.quantity};
            totalPrice += milk.quantity * milkPrice.price;
        }

        if (curd) {
            const curdPrice = await Curd.findOne({User: user._id});
            if(!curdPrice){
                return res.status(400).send({msg:"Curd price not found"})
            }
            purchase.curd = {curdId: curdPrice._id, quantity: curd.quantity};
            totalPrice += curd.quantity * curdPrice.price;
        }

        if (!milk && !curd) {
            return res.status(400).send({ msg: "Either milk or curd must be present in purchase" });
        }
 
        purchase.totalPriceOfPurchase = totalPrice;
        await purchase.save();
        res.status(201).send({ msg: "Purchase added successfully" });
    
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
        
}

const getMilkPurchaseAmountToday=async(req,res)=>{
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        const purchases = await Purchase.find({
            User: user._id,
            purchaseDate: {
                $gte: startOfMonth,
                $lte: today
            }
        }); 

        const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalPriceOfPurchase, 0);

        res.status(200).send({
            purchases,
            totalAmount,
            startDate: startOfMonth,
            endDate: today
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Server error" });
    }
}
const getAllMissedDates=async(req,res)=>{
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
        
        startOfMonth.setUTCHours(0, 0, 0, 0);

        const purchases = await Purchase.find({
            User: user._id,
            purchaseDate: {
                $gte: startOfMonth,
                $lte: today
            }
        });

        const dates = purchases.map(purchase => {
            const date = new Date(purchase.purchaseDate);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        });
        const allDates = [];
        for (let date = new Date(startOfMonth); date.getDate() <= today.getDate(); date.setDate(date.getDate() + 1)) {
            date.setUTCHours(0, 0, 0, 0);
            if (!dates.some(d => d.getTime() === date.getTime())) {
                allDates.push(new Date(date));
            }
        }

        res.status(200).send(allDates);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Server error" });
    }
} 
const getMissedDatesOfThatMonth=async(req,res)=>{
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const month = parseInt(req.params.month) - 1;
        const year = parseInt(req.params.year);
        const startOfMonth = new Date(year, month, 2);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        let endOfTheMonth;
        if(Number(req.params.month)===new Date().getMonth()+1){
            endOfTheMonth=new Date();
        }else{
            endOfTheMonth = new Date(year, month + 1, 1);
        }
        // endOfTheMonth = new Date(year, month + 1, 1);
        endOfTheMonth.setUTCHours(0, 0, 0, 0);
        const purchases = await Purchase.find({
            User: user._id,
            purchaseDate: {
                $gte: startOfMonth,
                $lte: endOfTheMonth
            }
        });

        const dates = purchases.map(purchase => purchase.purchaseDate);
        const allDates = [];
        for (let date = new Date(startOfMonth); date <= endOfTheMonth; date.setDate(date.getDate() + 1)) {
            date.setUTCHours(0, 0, 0, 0);
            if (!dates.some(d => d.getTime() === date.getTime())) {
                allDates.push(new Date(date));
            }
        }

        res.status(200).send(allDates);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Server error" });
    }
}
const getPriceOfThatMonth=async(req,res)=>{
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(400).send({ msg: "User not found" });
        }

        const month = parseInt(req.params.month) - 1;
        const year = parseInt(req.params.year);
        const startOfMonth = new Date(year, month, 2);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        const endOfTheMonth = new Date(year, month + 1, 1);
        endOfTheMonth.setUTCHours(0, 0, 0, 0);

        const purchases = await Purchase.find({
            User: user._id,
            purchaseDate: {
                $gte: startOfMonth,
                $lte: endOfTheMonth
            }
        });

        const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalPriceOfPurchase, 0);

        res.status(200).send({
            purchases,
            totalAmount,
            startDate: startOfMonth,
            endDate: endOfTheMonth
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Server error" });
    }
}

module.exports={addMilk,addCurd,getMilk,getCurd,purchaseMilkOrCurd,getMilkPurchaseAmountToday,getAllMissedDates,getMissedDatesOfThatMonth,getPriceOfThatMonth}
