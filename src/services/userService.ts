import { database } from '../utils/mysqlConnector';
import { appError } from '../utils/appError';
import { Op, Sequelize } from 'sequelize';
import httpStatus from 'http-status';
import { sendMessage } from '../utils/smsService';
import { message } from '../utils/messages';
import { REQUEST, STATUS } from '../config/constants';
import config from '../config/config';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { createDialog, createUser, updateEmailQuickblox, updateMobileQuickblox, updateProfileChat } from './chatService';
import { sendMail } from '../utils/mailingService'

const checkExisting = async (mobile: number, email: string) => {
    const checkNumber = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            [Op.or]: [{ email: email }, { mobileNumber: mobile }],
        },
        // attributes : ['id']
    });    

    return  checkNumber;
}

const getOppRequest = async (body: any) => {
    return await database.Requests.findAll({
        where: {
            to: body.to,
            roleId: body.role
        }
    })
}

const getUserQuickBlox = async (to: Number) => {
    const userReceivedQuickBlox = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            quickbloxId: to
        }
    });
    return  userReceivedQuickBlox;
}

const getAlreadyRequest = async (body: any) => {
    const requestData = await database.Requests.findOne({
        where: {
            to: body.to,
            from: body.from
        }
    });
    return  requestData;
}

const getRequestById = async (id: number) => {
    const requestData = await database.Requests.findByPk(id)
    return  requestData;
}

const updateData = async (id: number, body: any) => {
    return await database.Users.update(body, {
        where: { id: id }
    });
}

const checkByNumber = async (mobile: number, countryCode: string) => {
    const checkNumber = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            [Op.and]: [{ countryCode: countryCode }, { mobileNumber: mobile }],
        },
        // attributes : ['id','isVerify']
    });
    return checkNumber;
}

const generateCode = async () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateToken = async (userId: number, userRole: string) => {
    const expirationSeconds = Number(config.jwt.accessExpirationMinutes) * 60;
    const payload = {
        sub: { user: userId, role: userRole },
        iat: moment().unix()
    }
    return jwt.sign(payload, config.jwt.secret, { expiresIn: expirationSeconds })
}

const userCreate = async (body: any) => {
    try {
        const alreadyUser: any = await checkExisting(body.mobile, body.email);
        if (alreadyUser) {
            throw new appError(httpStatus.BAD_REQUEST, message.SIGNUP_ERROR);
        } else {
        //     const bodyData: any = {                
        //         name: body.name,
        //         email:body.email,
        //         countryCode:body.countryCode,
        //         mobile: body.mobile                
        // };
        // bodyData.custom_data = 'uploads/default/shield.png'
        // const quickbloxUser =  await createUser(bodyData);          
            const codeGenerate: number = await generateCode();
            await sendMessage(body.mobile, body.countryCode, `OTP for authentication is ${codeGenerate}`);
            const params: any = {
                email: body.email,
                mobileNumber: body.mobile,
                countryCode: body.countryCode,
                name: body.name,
                otp: codeGenerate,
                userStatus: STATUS.INACTIVE,
                isverify: false,
                roleId: 3,
                // quickbloxId: quickbloxUser.id
            }
            let user = await database.Users.create(params);
            return {
                id: user.id, quickbloxId: user.quickbloxId, isverify: false
            }
        }
    } catch (error: any) {        
        throw new appError(error.statusCode, error.message)
    }
}

const userLogin = async (body: any) => {
    try {
        const checkNumber: any = await checkByNumber(body.mobile, body.countryCode);
        if (checkNumber == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.LOGIN_ERROR);
        }
        const codeGenerate: number = await generateCode();
        await sendMessage(body.mobile, body.countryCode, `OTP for authentication is ${codeGenerate}`);
        const login: any = await database.Users.update(
            { otp: codeGenerate, userStatus: STATUS.ACTIVE },
            {
                where: { id: checkNumber.id }
            }
        )
        return {
            id: checkNumber ? checkNumber.id : login.id, isVerify: checkNumber.isVerify, otp: codeGenerate
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const verifyUser = async (userId: number, otp: number) => {
    try {
        const verifiedUser: any = await database.Users.findOne({
            where: {
                id: userId,
                otp: otp,
            },
            // attributes : ['id','quickbloxId','isVerify'],
            include: [{ model: database.Roles }]
        });                
        if (verifiedUser) {  
            if(verifiedUser.quickbloxId === null){
                const data:any = {
                    "name":verifiedUser.name,
                    "email":verifiedUser.email,
                    "countryCode":verifiedUser.countryCode,
                    "mobile": verifiedUser.mobileNumber
                }
                data.custom_data = 'uploads/default/shield.png'
                const quickbloxUser =  await createUser(data);  
                verifiedUser.quickbloxId =  quickbloxUser.id;                           
            }       
            const token: string = await generateToken(verifiedUser.id, verifiedUser.role.role);
            await database.Users.update(
                {
                    otp: null,
                    isLoggedIn: true,
                    userStatus: STATUS.ACTIVE,
                    token: token,
                    quickbloxId : verifiedUser.quickbloxId
                },
                {
                    where: { id: verifiedUser.id }
                })
            return {
                id: verifiedUser.id,
                token: token,
                userStatus: STATUS.ACTIVE,
                chatId: verifiedUser.quickbloxId,
                isVerify: verifiedUser.isVerify,
                roleId : verifiedUser.roleId
            }
        } else {
            throw new appError(httpStatus.BAD_REQUEST, message.INVALID_OTP);
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const refreshToken = async (body: any) => {
    try {
        const alreadyUser = await getUserId(body.userId);
        if (alreadyUser == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.NOT_FOUND.replace('#', 'User'));
        }
        const tokenFromDatabase = await database.Users.findOne({
            attributes: ['token', 'roleId'],
            where: { id: body.userId }
        })
        const oldToken = body.token;

        if (tokenFromDatabase && tokenFromDatabase.token === oldToken) {
            if (alreadyUser.id === body.userId && tokenFromDatabase.roleId === body.roleId) {
                const newToken: string = await generateToken(body.userId, body.roleId);
                await database.Users.update(
                    {
                        token: newToken,
                    },
                    {
                        where: { id: body.userId }
                    }
                )
                return {
                    userId: body.userId,
                    token: newToken,
                    userStatus: STATUS.ACTIVE,
                    isverify: true
                }
            }
            else {
                throw new appError(httpStatus.BAD_REQUEST, "Mismatch between userId and roleId.");
            }
        }
        else {
            throw new appError(httpStatus.BAD_REQUEST, "Invalid old token.");
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const otpResend = async (body: any) => {
    try {
        const checkNumber: any = await checkByNumber(body.mobile, body.countryCode);
        if (checkNumber) {
            const codeGenerate: number = await generateCode();
            await sendMessage(body.mobile, body.countryCode, `OTP for authentication is ${codeGenerate}`);
            await database.Users.update(
                { otp: codeGenerate, userStatus: STATUS.ACTIVE },
                {
                    where: { id: checkNumber.id }
                })
            return {
                id: checkNumber.id, isVerify: checkNumber.isVerify
            }
        } else {
            throw new appError(httpStatus.CONFLICT, message.VALID_INPUT.replace('#', 'mobile number'))
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getUserId = async (userId: number) => {    
    const checkUserId = await database.Users.findByPk(userId)
    return checkUserId;
}

const updateProfile = async (userId: number, body: any, userLogged: any) => {
    try {
        if (userLogged && userLogged.user != userId) {
            throw new appError(httpStatus.UNAUTHORIZED, message.UNAUTHORIZED_ACTION);
        }
        const alreadyUser: any = await getUserId(userId);
        if (alreadyUser) {
            body.isVerify = true
            const params: any = { ...body }
            // if (params.userLanguage) {
            //     params.userLanguage = JSON.parse(params.userLanguage)
            // }
            const quickBloxParams: any = {
                "user": {
                    "tag_list": `${body.roleId}`
                }
            }
            await updateProfileChat(alreadyUser.quickbloxId, quickBloxParams)
            if (params.roleId) {
                params.roleId.toLowerCase() === "social" ? params.roleId = 2 : params.roleId = 3
            }
            return await database.Users.update(params, {
                where: { id: alreadyUser.id }
            })
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const updateProfileImage = async (userId: number, fileName: string) => {
    try {
        const alreadyUser: any = await getUserId(userId);
        if (alreadyUser) {
            if (fileName !== null) {
                const profileImage = `uploads/profiles/${userId}/${fileName}`;
                const quickBloxParams: any = {
                    "user": {
                        "custom_data": profileImage
                    }
                }
                await updateProfileChat(alreadyUser.quickbloxId, quickBloxParams)
                return await database.Users.update({ profileImage: profileImage }, {
                    where: { id: alreadyUser.id }
                })
            }
            else {
                return "File Not Found";
            }
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const getUser = async (userId: number) => {
    try {
        const user: any = await database.Users.findByPk(userId, {
            attributes: {
                exclude: ['otp', 'token', 'isVerify', 'entryAt']
            },
            include: [{
                model: database.Experiences,
                attrributes: ['experience']
            }]
        });
        const dislikeIds = user.dislikeId || [];
        const industryIds = user.industryId || [];

        const dislikedInterests = await database.Interest.findAll({
            attributes: ['name'],
            where: {
                id: dislikeIds
            }
        });
        const dislikedIndustries = await database.Industries.findAll({
            attributes: ['name'],
            where: {
                id: industryIds
            }
        });
        const dislikedInterestNames = dislikedInterests.map((interest: any) => interest.name);
        const dislikedIndustryNames = dislikedIndustries.map((industry: any) => industry.name);
        user.dislikeId = dislikedInterestNames;
        user.industryId = dislikedIndustryNames;
        return user;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const allUser = async () => {
    try {
        const users: any = await database.Users.findAll();
        return await users;
    } catch (error: any) {
        throw new appError(httpStatus.BAD_REQUEST, message.SERVICE_UNAVILABLE);
    }
}

const allUserFilter = async (latitude: number, longitude: number, maxDistance: number, userId: number, gender?: string, minAge?: number, maxAge?: number, dislikeId?: number[], industryId?: number[], distance?: number, roleId?: any, minExperience?: number, maxExperience?: number) => {
    try {
        const effectiveDistance = distance !== undefined ? distance : maxDistance;
        const whereClause: any = {
            id: {
                [Op.ne]: userId
            },
            [Op.or]: Sequelize.where(
                Sequelize.fn(
                    '6371 * acos',
                    Sequelize.literal(
                        `cos(radians(:lat)) * cos(radians(latitude)) * 
                        cos(radians(longitude) - radians(:lng)) + 
                        sin(radians(:lat)) * sin(radians(latitude))`
                    )
                ),
                '<',
                effectiveDistance
            ),
        };

        if (gender) {
            whereClause.gender = gender;
        }

        if (minAge !== undefined && maxAge !== undefined) {
            whereClause.age = Sequelize.where(
                Sequelize.fn(
                    'TIMESTAMPDIFF',
                    Sequelize.literal('YEAR'),
                    Sequelize.col('dob'),
                    Sequelize.fn('NOW')
                ),
                'BETWEEN',
                [minAge, maxAge]
            );
        }

        if (dislikeId && dislikeId.length > 0) {
            whereClause.dislikeId = {
                [Op.or]: dislikeId.map(id => Sequelize.literal(`JSON_CONTAINS(dislikeId, '${id}')`))
            };
        }

        if (industryId && industryId.length > 0) {
            whereClause.industryId = {
                [Op.or]: industryId.map(id => Sequelize.literal(`JSON_CONTAINS(industryId, '${id}')`))
            };
        }

        if (minExperience !== undefined && maxExperience !== undefined) {
            const expRange = await database.Experiences.findAll({
                where: {
                    [Op.and]: [
                        Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(experience, '$.lower')) <= ${maxExperience}`),
                        Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(experience, '$.upper')) >= ${minExperience}`)
                    ]
                },
                attributes: ['id']
            });

            if (expRange) {
                whereClause.experienceId = {
                    [Op.in]: expRange.map((exp: any) => exp.id)
                };
            }
        }

        if (roleId !== undefined) {
            if (typeof roleId == 'string') {
                const roleName: any = roleId;
                roleName.toLowerCase() == "social" ? roleId = 2 : roleId = 3;
            }
            whereClause['$role.id$'] = roleId; // Use the alias 'role'
        }

        const users: any = await database.Users.findAll({
            attributes: [
                'id',
                'latitude',
                'longitude',
                'name',
                'gender',
                'bio',
                'dislikeId',
                'dob',
                'experienceId',
                'industryId',
                'profileImage',
                [
                    Sequelize.fn(
                        '6371 * acos',
                        Sequelize.literal(
                            `cos(radians(:lat)) * cos(radians(latitude)) * 
                            cos(radians(longitude) - radians(:lng)) + 
                            sin(radians(:lat)) * sin(radians(latitude))`
                        )
                    ),
                    'distance',
                ],
            ],
            where: whereClause,
            having: distance ? {
                distance: {
                    [Op.lte]: effectiveDistance,
                },
            } : undefined,
            replacements: { lat: latitude, lng: longitude },
            order: [['distance', 'ASC']],
            include: [
                {
                    model: database.Roles,
                    as: roleId,
                    attributes: ['role']
                }
            ],
        });
        return users;
    } catch (error: any) {
        throw new appError(httpStatus.BAD_REQUEST, message.SERVICE_UNAVILABLE);
    }
}

const getMessageConnection = async (user: any, body: any) => {
    try {           
        // const getUserfrom: any = await getUserId(id);
        const getUserTo: any = await getUserQuickBlox(body.to);
        const alreadyRequest: any = await getAlreadyRequest({ to: getUserTo?.id, from: user.user });
        if (alreadyRequest) {
            throw new appError(httpStatus.ALREADY_REPORTED, message.ALREADY_SENT);
        }
        if (getUserTo) {
            const createRequest: any = await database.Requests.create({
                from: user.user,
                to: getUserTo?.id,
                roleId: user.role.toLowerCase() == "social" ? 2 : 3,
                status: REQUEST.PENDING
            })                        
            // const alreadyRequests: any = getUserfrom.requestId ? getUserfrom.requestId : [];
            // alreadyRequests.push(createRequest.id)
            // await database.Users.update({ requestId: alreadyRequests }, {
            //     where: { id: id }
            // })
            return {
                // from: id,
                // to: body.to,
                // roleId: getUserfrom.roleId,
                // status: createRequest.status
            }
        } else {
            throw new appError(httpStatus.BAD_REQUEST, message.RECEIVER_NOT_FOUND);
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const updateRequest = async (userLogged: number, body: any) => {
    try {
        const alreadyRequest: any = await getRequestById(body.requestId);
        if (!alreadyRequest) {
            throw new appError(httpStatus.NOT_FOUND, message.NOT_FOUND.replace('#', 'Request'));
        }
        const loggedUser: any = await getUserId(userLogged);
        const requestedBy: any = await getUserId(alreadyRequest.from);
        console.log("requestedBy",requestedBy);        
        if (!loggedUser || !requestedBy) {
            throw new appError(httpStatus.CONFLICT, message.NOT_FOUND.replace('#', 'User'));
        }
        // const alreadyRequestData: any = [];
        // alreadyRequestData.pop(body.requestId);
        if (body.status == REQUEST.APPROVED) {
            const connectedToChats: any =  loggedUser.connectedChats ?  loggedUser.connectedChats : [];
            const connectedByChats: any =  requestedBy.connectedChats ?  requestedBy.connectedChats : [];
            await connectedToChats.push(requestedBy.quickbloxId);
            await connectedByChats.push(loggedUser.quickbloxId);
            await updateData(loggedUser.id, { connectedChats: connectedToChats });
            await updateData(requestedBy.id, { connectedChats: connectedByChats });
            const params: any = {
                to: requestedBy.quickbloxId,
                img: { to: requestedBy.profileImage, from: loggedUser.profileImage },
                userType: body.userRoleData
            }
            let dialog = await createDialog(body.QB, params)                        
            body.dialog = dialog;
        }        

        await database.Requests.update(
            {  status : body.status},
            { where: { id: body.requestId } }
        );
        // await updateData(requestedBy.id, { requestId: alreadyRequestData })
        if (body.status == REQUEST.DECLINE) {
            await alreadyRequest.destroy();
        }
        
        return true;
    } catch (error: any) {                              
        throw new appError(error.statusCode, error.message)
    }
}

const getSendRequest = async (userId: Number) => {
    try {
        const requestSent: any = await database.Requests.findAll({
            where: { from: userId }, include: [
                {
                    model: database.Users,
                    as: 'receiver',
                    attributes: ['id', 'name', 'email', 'quickbloxId', 'bio', 'gender', 'profileImage'] // Specify the columns you want from the User table
                }
            ]
        });
        return  requestSent;
    } catch (error: any) {
        throw new appError(httpStatus.BAD_REQUEST, message.SERVICE_UNAVILABLE);
    }
}

const getRequest = async (userId: Number,role : any) => {
    try {        
        let roleId = role.toLowerCase() == "social" ? 2 :3;                
        const requestGet: any = await database.Requests.findAll({
            where: { to: userId ,roleId : roleId}, include: [
                {
                    model: database.Users,
                    as: 'sender',
                    attributes: ['id', 'name', 'email', 'quickbloxId', 'bio', 'gender', 'profileImage'] // Specify the columns you want from the User table
                }
            ],
            order: [['entryAt', 'Desc']]
        });        
        return  requestGet;                
    } catch (error: any) {                
        throw new appError(httpStatus.BAD_REQUEST, message.SERVICE_UNAVILABLE);
    }
}

const logoutUser = async (userId: number) => {
    try {
        const user = await getUserId(userId);
        if (user == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.NOT_FOUND.replace('#', 'user'));
        }
        await database.Users.update(
            {
                token: null,
                isLoggedIn: false,
            },
            {
                where: { id: userId }
            }
        );
        return true;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}

const checkExistingEmail = async (email: string, userId: number) => {
    const checkNumber = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            email: email,
            id: userId
        },
        attributes: ['id', 'quickbloxId','name']
    });
    return checkNumber;
}

const checkNewEmail = async (email: string) => {
    const checkEmail = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            email: email
        },
        attributes: ['id', 'quickbloxId']

    });
    return checkEmail;
}

const updateEmail = async (body: any, userId: number) => {
    try {
        const existingUser = await checkExistingEmail(body.existEmail, userId);
        if (!existingUser) {
            throw new appError(httpStatus.BAD_REQUEST, 'Please check your existing email.');
        }
        const checknewEmail = await checkNewEmail(body.newEmail);
        if (checknewEmail) {
            throw new appError(httpStatus.BAD_REQUEST, 'Email already exist.');
        }
        const codeGenerate: number = await generateCode();
        let mailOption = {
            to: body.newEmail,
            subject: "Yomo Otp Verification"
        }
        const emailData = {
            "{USERNAME}": existingUser.name,
            "{HEADER}": "Verify Email OTP for update email",
            "{BODY}": `<br>Here is your OTP <b>${codeGenerate}</b></br>`,
            "{REGARDS_MESSAGE}": 'YOMO Team',
        };
        await sendMail(mailOption.to, mailOption.subject, emailData);       
        await database.Users.update(
            { otp: codeGenerate, userStatus: STATUS.ACTIVE },
            {
                where: { id: existingUser.id }
            }
        );
        return true;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const checkExistingMobile = async (mobileNumber: number, countryCode: string, userId: number) => {
    const checkNumber = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            mobileNumber: mobileNumber,
            countryCode: countryCode,
            id: userId
        },
        attributes: ['id', 'quickbloxId']
    });
    return checkNumber;
}

const checkNewMobile = async (mobileNumber: number, countryCode: number) => {
    const checkNumber = await database.Users.findOne({
        where: {
            userStatus: {
                [Op.ne]: STATUS.DELETE
            },
            mobileNumber: mobileNumber,
            countryCode: countryCode
        },
        attributes: ['id', 'quickbloxId']
    });
    return checkNumber;
}

const updateMobile = async (body: any, userId: number) => {
    try {
        const existingUser = await checkExistingMobile(body.existMobile, body.existCountryCode, userId);
        if (!existingUser) {
            throw new appError(httpStatus.BAD_REQUEST, 'Please check your existing mobile number');
        }
        const checknewMobile = await checkNewMobile(body.newMobile, body.newCountryCode);
        if (checknewMobile == null) {
            const codeGenerate: number = await generateCode();
            await sendMessage(body.newMobile, body.newCountryCode, `OTP for authentication is ${codeGenerate}`);
            await database.Users.update(
                { otp: codeGenerate, userStatus: STATUS.ACTIVE },
                {
                    where: { id: existingUser.id }
                }
            );
            return { otp: codeGenerate };
        }
        else {
            throw new appError(httpStatus.BAD_REQUEST, 'Mobile number already exist');
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const verifyOtpNumber = async (userId: number, body: any) => {
    try {
        const verifiedUser: any = await database.Users.findOne({
            where: {
                id: userId,
                otp: body.otp,
            },
            attributes: ['id', 'quickbloxId',]
        });
        if (verifiedUser) {
            const quickBloxParams: any = {
                "user": {
                    "phone": `${body.newMobile}`
                }
            }
            const quickbloxMobile = await updateMobileQuickblox(verifiedUser.quickbloxId, quickBloxParams)
            if (quickbloxMobile) {
                await database.Users.update(
                    { mobileNumber: body.newMobile, countryCode: body.newCountryCode, otp: null },
                    { where: { id: userId } }
                );
                return true;
            } else {
                throw new appError(httpStatus.BAD_REQUEST, 'Quickblox Server error');
            }
        } else {
            throw new appError(httpStatus.BAD_REQUEST, message.INVALID_OTP);
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}


const verifyEmail = async (body: any, userId: number) => {
    try {
        const verifiedUser: any = await database.Users.findOne({
            where: {
                id: userId,
                otp: body.emailOtp,
            },
            attributes: ['id', 'quickbloxId',]
        });
        if (verifiedUser) {
            const quickBloxParams: any = {
                "user": {
                    "email": `${body.newEmail}`,
                    "login": `${body.newEmail}`
                }
            }
            const quickbloxEmail = await updateEmailQuickblox(verifiedUser.quickbloxId, quickBloxParams);
            if (quickbloxEmail) {
                await database.Users.update(
                    { email: body.newEmail, otp: null },
                    { where: { id: userId } }
                );
                return true;
            } else {
                throw new appError(httpStatus.BAD_REQUEST, 'Quickblox Server error');
            }
        } else {
            throw new appError(httpStatus.BAD_REQUEST, message.INVALID_OTP);
        }
    } catch (error: any) {
        throw new appError(error.statusCode, error.message)
    }
}



export {
    userCreate,
    verifyUser,
    otpResend,
    updateProfile,
    getUser,
    allUser,
    userLogin,
    updateProfileImage,
    getUserId,
    allUserFilter,
    getMessageConnection,
    updateRequest,
    getSendRequest,
    getRequest,
    getOppRequest,
    refreshToken,
    logoutUser,
    getUserQuickBlox,
    updateEmail,
    updateMobile,
    verifyOtpNumber,
    verifyEmail
} 