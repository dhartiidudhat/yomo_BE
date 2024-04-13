import express from 'express';
import validate from '../middlewares/validate';
import localizValidation from '../customValidations/localizationValidation';
import localizController from '../controller/localizationController';
import { auth } from '../middlewares/auth';
import uploadInterestImage from '../middlewares/multerConfig';

const router = express.Router();

router.post('/addCountry', validate(localizValidation.Country), localizController.addCountry);
router.put('/updateCountry/:countryId', validate(localizValidation.updateCountry), localizController.updateCountry);
router.delete('/deleteCountry/:countryId', validate(localizValidation.deleteCountry), localizController.deleteCountry);
router.get('/getAllCountry', localizController.getCountry);
router.get('/getCountryById/:countryId', validate(localizValidation.deleteCountry), localizController.getBycountryId);

router.post('/addState', validate(localizValidation.State), localizController.addState);
router.get('/getAllStates', localizController.getState);
router.get('/getStateById/:stateId', validate(localizValidation.stateById), localizController.getByStateId);
router.get('/getStateByCountry/:countryId', validate(localizValidation.StateByCountry), localizController.getStateCountryId);
router.put('/updateState/:stateId', validate(localizValidation.updateState),localizController.updateState);
router.delete('/deleteState/:stateId', validate(localizValidation.stateById), localizController.deleteState);

router.post('/addCity', validate(localizValidation.City), localizController.addCity);
router.get('/getAllCity', localizController.getCity);
router.get('/getCityById/:cityId', validate(localizValidation.cityById), localizController.getByCityId);
router.get('/getCityByState/:stateId', validate(localizValidation.cityByState), localizController.getCityStateId);

router.post('/addLanguage', validate(localizValidation.language), localizController.addLanguage);
router.get('/getAllLanguage', localizController.getLanguages);

router.post('/addInterest', uploadInterestImage('interests', true).single('image'),validate(localizValidation.interest),localizController.addInterest);
router.get('/getAllInterest',localizController.getInterest);

router.post('/addIndustry', uploadInterestImage('industries', true).single('image'),validate(localizValidation.industry),localizController.addIndustry);
router.get('/getAllIndustry',localizController.getIndustry);

router.post('/addExperience',validate(localizValidation.Experience),localizController.addExperience);
router.get('/getAllExperience', localizController.getExperience);

export = router;





