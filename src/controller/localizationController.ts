import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { createResponse } from "../utils/response";
import { message } from "../utils/messages";
import { cityCreate, countryCreate, countryDelete, countryGet, countryGetById, countryUpdate, experienceCreate, experienceGet, getAllCity, getAllIndustry, getAllInterest, getAllLanguages, getAllState, getCityById, getCityByState, getStateByCountry, getStateById, industryCreate, interestCreate, languageCreate, stateCreate, stateDelete } from "../services/localizationService";


const addCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Country: any = await countryCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.COUNTRY_CREATED, Country);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countryId: any = req.params.countryId;
        const Country: any = await countryUpdate(req.body, countryId);
        return await createResponse(res, httpStatus.CREATED, message.COUNTRY_UPDATE, Country);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countryId: any = req.params.countryId;
        const Country: any = await countryDelete(countryId);
        return await createResponse(res, httpStatus.CREATED, message.COUNTRY_DELETE, Country);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countries: any = await countryGet();      
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Country'), countries);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getBycountryId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const country: any = await countryGetById(Number(req.params.countryId));       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Country'), country);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//State

const addState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const state: any = await stateCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.STATE_CREATED, state);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const states: any = await getAllState();       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'State'), states);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getByStateId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const state: any = await getStateById(Number(req.params.stateId));       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'State'), state);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getStateCountryId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countryState: any = await getStateByCountry(Number(req.params.countryId));        
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'State'), countryState);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const updateState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stateId: any = req.params.stateId;
        const state: any = await countryUpdate(req.body, stateId);
        return await createResponse(res, httpStatus.CREATED, message.STATE_UPDATE, state);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const deleteState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stateId: any = req.params.stateId;
        const State: any = await stateDelete(stateId);
        return await createResponse(res, httpStatus.CREATED, message.STATE_DELETE, State);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//City

const addCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const city: any = await cityCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.CITY_CREATED, city);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities: any = await getAllCity();        
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'City'), cities);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getByCityId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const city: any = await getCityById(Number(req.params.cityId));      
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'City'), city);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getCityStateId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stateCity: any = await getCityByState(Number(req.params.stateId));        
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'State'), stateCity);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//User Languages

const addLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language: any = await languageCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.LANGUAGE_CREATED, language);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getLanguages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const languages: any = await getAllLanguages();       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Languages'), languages);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//Interests

const addInterest = async (req: any, res: Response, next: NextFunction) => {
    try {
        let filename: any = null;
        if (req.file) {
            filename = req.file.filename;
        }
        const interest: any = await interestCreate(req.body, filename);
        return await createResponse(res, httpStatus.OK, message.INTEREST_CREATE, interest)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getInterest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interest: any = await getAllInterest();       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Interest'), interest);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//Industry

const addIndustry = async (req: any, res: Response, next: NextFunction) => {
    try {
        let filename: any = null;
        if (req.file) {
            filename = req.file.filename;
        }
        const industry: any = await industryCreate(req.body, filename);
        return await createResponse(res, httpStatus.OK, message.INDUSTRY_CREATE, industry)
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getIndustry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const industry: any = await getAllIndustry();        
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Industry'), industry);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

//Experiences

const addExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Experience: any = await experienceCreate(req.body);
        return await createResponse(res, httpStatus.CREATED, message.EXP_CREATED, Experience);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}

const getExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const experience: any = await experienceGet();       
        return await createResponse(res, httpStatus.OK, message.FOUND.replace('#', 'Experience'), experience);
    } catch (error: any) {
        return await createResponse(res, error.statusCode ? error.statusCode : httpStatus.SERVICE_UNAVAILABLE, error.message, {})
    }
}


export = {
    addCountry,
    updateCountry,
    deleteCountry,
    getCountry,
    getBycountryId,
    //State
    addState,
    getState,
    getByStateId,
    getStateCountryId,
    updateState,
    deleteState,
    //City
    addCity,
    getCity,
    getByCityId,
    getCityStateId,
    //Languages
    addLanguage,
    getLanguages,
    //Interest
    addInterest,
    getInterest,
    //Industry
    addIndustry,
    getIndustry,
    //Experience
    addExperience,
    getExperience

}