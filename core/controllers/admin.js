//import use cases
const addAdmin = require("../usecases/admin/addAdmin")
const getAdmin = require("../usecases/admin/getAdmin")

const updateAdmin = require("../usecases/admin/updateAdmin")
const jwt = require("jsonwebtoken");
const comparaPassword = require("../usecases/admin/comparePassword");


//import bcrypt for pasword hashing
const bcrypt = require("bcrypt");


exports.getAdminDetails = async() =>{

    let adminRecord = await getAdmin({});
    if(!adminRecord) return null;
    return {
        name: adminRecord.name,
        email: adminRecord.email,
        phone: adminRecord.phone,
        company: adminRecord.company
    }
}

//Add admin
exports.addAdmin = async (admin)=>{

    if (!admin.name) throw new Error('admin Name is Required');
    if (!admin.email) throw new Error('admin email is Required');
    if (!admin.phone) throw new Error('admin phone is Required');
    if (!admin.company) throw new Error('admin company is Required');
    if (!admin.password) throw new Error('admin password is Required');

    //hashing password
    let passwordHash = bcrypt.hashSync(admin.password,10);
    
    let newadmin = {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        company:admin.company,
        profile_pic:null,
        password_hash:passwordHash,
        created_on: new Date(Date.now())
    }
    let savedadmin = await addAdmin(newadmin);

    delete savedadmin.__v
    delete savedadmin.modified_on
    delete savedadmin.created_on
    delete savedadmin.password_hash

    return savedadmin;
}

exports.adminLogin = async(adminprops)=>{
    let adminRecord = await getAdmin({email:adminprops.email})

    if(!adminRecord)
        return {Error:"Invalid Email"}
    const PasswordMatch = await bcrypt.compare(adminprops.password, adminRecord.password_hash);
    if(!PasswordMatch)
        return {Error:"Password not matched"}
   
    const token = jwt.sign(
            {
                Id: adminRecord._id,
                Name:adminRecord.name,
                Company:adminRecord.company,
                Email:adminRecord.email,
                Phone:adminRecord.phone,
                Profile_pic:adminRecord.profile_pic
            },
            "secret"
            ,
            { expiresIn: 619999}
        );

    adminRecord =  {
        token:token
    }
    return adminRecord;
}

exports.adminProfile = async(admin)=>{
   let adminData = {
        id:admin.Id,
        name:admin.Name,
        email:admin.Email,
        phone:admin.Phone,
        company:admin.Company,
        profile_pic:admin.Profile_pic
   };
   return adminData;
}

//update admin
exports.updateAdmin = async(pic,props)=>{
    let adminId = props.id;
    if(!props.id) throw new Error("Please provide admin Id");
    let filter = {}
    if(props.name) filter.name = props.name;
    if(props.company) filter.company = props.company;
    if(props.email) filter.email = props.email;
    if(props.phone) filter.phone = props.phone;
    if (pic) filter.profile_pic = pic.path;

    filter.modified_on = new Date(Date.now());
    let adminRecord = await updateAdmin(adminId,filter);
    return adminRecord;
}

exports.changePassword = async(props)=>{
    let adminId = props.id;
    if(!props.id) throw new Error("Please provide rep Id");
    if(!props.oldPassword) throw new Error("Please provide Old Password");
    if(!props.newPassword) throw new Error("Please provide New Password");

    let id = props.id;
    let oldPassword = props.oldPassword;
    let response = await comparaPassword(id,oldPassword);
    if(!response) throw new Error("Password Not Matched!")
    
    let filter = {}
    filter.password_hash = bcrypt.hashSync(props.newPassword,10);
    filter.modified_on = new Date(Date.now());
    let adminRecord = await updateAdmin(adminId,filter);
    return adminRecord
}
