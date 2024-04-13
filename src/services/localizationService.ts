import { database } from "../utils/mysqlConnector";
import { appError } from "../utils/appError";
import httpStatus from "http-status";
import { message } from "../utils/messages";


const checkCountryById = async (countryId: number) => {
    return await database.Countries.findByPk(countryId);
}

const checkExitsingCountry = async (countryName: string, countryCode: string) => {
    const checkCountry = await database.Countries.findOne({
        where: {
            countryName: countryName,
            countryCode: countryCode,
        }
    });
    return checkCountry;
}

const countryCreate = async (body: any) => {
    try {
        const alreadyCountry: any = await checkExitsingCountry(body.countryName.toLowerCase(),body.countryCode);
        if (alreadyCountry) {
            throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_ADDED.replace('#', 'Country'));
        }
        const country: any = { countryName: body.countryName, countryCode: body.countryCode }
        return await database.Countries.create(country);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const countryUpdate = async (body: any, countryId: number) => {
    try {
        const country = await database.Countries.update(
            { countryName: body.countryName,countryCode: body.countryCode },
            { where: { id: countryId } }
        );
        return country;    
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const countryDelete = async (countryId: number) => {
    try {
        const deletedCountry = await database.Countries.destroy({
            where: { id: countryId }
        });
        return deletedCountry;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const countryGet = async () => {
    try {
        const getCountry = await database.Countries.findAll({});
        return getCountry;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const countryGetById = async (countryId: number) => {
    try {
        const getCountry = await database.Countries.findOne({ where: { id: countryId } });
        return getCountry;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//State

const checkExitsingState = async (stateName: string) => {
    const checkState = await database.States.findOne({
        where: {
            stateName: stateName
        }
    });
    return await checkState;
}

const checkStateById = async (stateId: number) => {
    return await database.States.findByPk(stateId);
}

const stateCreate = async (body: any) => {
    try {
        const alreadyState: any = await checkExitsingState(body.stateName.toLowerCase());
        const alreadyCountry: any = await checkCountryById(body.countryId);
        if (alreadyState) {
            throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_ADDED.replace('#', 'State'));
        }
        if (alreadyCountry == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.NOT_FOUND.replace('#', 'Country'));
        }
        const state: any = {
            stateName: body.stateName,
            countryId: body.countryId
        }
        return await database.States.create(state);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getAllState = async () => {
    try {
        const getState = await database.States.findAll({});
        return getState;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getStateById = async (stateId: number) => {
    try {
        const getState: any = await database.States.findOne({ where: { id: stateId } });
        return getState;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getStateByCountry = async (countryId: number) => {
    try {
        const getState: any = await database.States.findAll({ where: { countryId: countryId } });
        return getState;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const stateUpdate = async (body: any, stateId: number) => {
    try {
        const state = await database.States.update(
            { stateName: body.stateName },
            { where: { id: stateId } }
        );
        return state;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const stateDelete = async (stateId: number) => {
    try {
        const deleteState = await database.States.destroy({
            where: { id: stateId }
        });
        return deleteState;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//City

const checkExitsingCity = async (cityName: string) => {
    const checkCity = await database.Cities.findOne({
        where: {
            cityName: cityName
        }
    });
    return checkCity;
}

const cityCreate = async (body: any) => {
    try {
        const alreadyCity: any = await checkExitsingCity(body.cityName.toLowerCase());
        const alreadyState: any = await checkStateById(body.stateId);
        if (alreadyCity) {
            throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_ADDED.replace('#', 'City'));
        }
        if (alreadyState == null) {
            throw new appError(httpStatus.BAD_REQUEST, message.NOT_FOUND.replace('#', 'State'));
        }
        const city: any = {
            cityName: body.cityName,
            stateId: body.stateId
        }
        return await database.Cities.create(city);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getAllCity = async () => {
    try {
        const getCity = await database.Cities.findAll({});
        return getCity;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getCityById = async (cityId: number) => {
    try {
        const getCity: any = await database.Cities.findOne({ where: { id: cityId } });
        return getCity;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getCityByState = async (stateId: number) => {
    try {
        const getCity: any = await database.Cities.findAll({ where: { stateId: stateId } });
        return getCity;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//User Languages

const checkExitsingLanguage = async (languageName: string) => {
    const checkLanguage = await database.Languages.findOne({
        where: {
            languageName: languageName
        }
    });
    return checkLanguage;
}

const languageCreate = async (body: any) => {
    try {
        const alreadyLanguage = await checkExitsingLanguage(body.languageName.toLowerCase());
        if (alreadyLanguage) {
            throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_ADDED.replace('#', 'Language'));
        }
        const language: any = {
            languageName: body.languageName,
        }
        return await database.Languages.create(language);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getAllLanguages = async () => {
    try {
        const getLanguages = await database.Languages.findAll({});
        return getLanguages;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//Interest

const interestCreate = async (body: any,fileName: string) => {
    try {
        const interest: any = {
            name: body.name,
        }
        if (fileName !== null) {
            interest.image = `uploads/interests/${body.name.toLowerCase()}/${fileName}`;
        }
        return await database.Interest.create(interest);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getAllInterest = async () => {
    try {
        const getInterest = await database.Interest.findAll({});
        return getInterest;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//Industry

const industryCreate = async (body: any,fileName: string) => {
    try {
        const industry: any = {
            name: body.name,
        }
        if (fileName !== null) {
            industry.image = `uploads/industries/${body.name.toLowerCase()}/${fileName}`;
        }
        return await database.Industries.create(industry);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const getAllIndustry = async () => {
    try {
        const getIndustry = await database.Industries.findAll({});
        return getIndustry;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

//Experience

// const checkExperienceById = async (ExpId: number) => {
//     return await database.Experiences.findByPk(ExpId);
// }

const checkExitsingExperience = async (experience:number) => {
    const checkExperience = await database.Experiences.findOne({
        where: {
            experience: experience,
        }
    });
    return checkExperience;
}

const experienceCreate = async (body: any) => {
    try {
        const alreadyExperience: any = await checkExitsingExperience(body);
        if (alreadyExperience) {
            throw new appError(httpStatus.BAD_REQUEST, message.ALREADY_ADDED.replace('#', 'Experience'));
        }

        const experienceRange = {
            lower: body.lower,
            upper: body.upper
        };

        const exp: any = { experience: experienceRange }
        return await database.Experiences.create(exp);
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

const experienceGet = async () => {
    try {
        const getExperience = await database.Experiences.findAll({});
        return getExperience;
    } catch (error: any) {
        throw new appError(error.statusCode, error.message);
    }
}

export {
    countryCreate,
    countryUpdate,
    countryDelete,
    countryGet,
    countryGetById,
    //State
    stateCreate,
    getAllState,
    getStateById,
    getStateByCountry,
    stateUpdate,
    stateDelete,
    //City
    cityCreate,
    getAllCity,
    getCityById,
    getCityByState,
    //Languages
    languageCreate,
    getAllLanguages,
    //Interest
    interestCreate,
    getAllInterest,
    //Industry
    industryCreate,
    getAllIndustry,
    //Experience
    experienceCreate,
    experienceGet
}