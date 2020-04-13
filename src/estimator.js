const covid19ImpactEstimator = (data) =>{
    
    //recuperation des entrance data 
    //declaration of input variables
    const [inputs] = {data} ;    
    const {region,periodType,timeToElapse,reportedCases,
       population,totalHospitalBeds} = inputs ;

    // data output variables elements declariations
      
    const impact = {};
    
    const severeImpact = {};

    const output = {
        inputs,
        impact,
        severeImpact
    }
    
    //estimation of currently infected people
    impact.currentlyInfected = reportedCases * 10 ;

    severeImpact.currentlyInfected = reportedCases * 50 ;

    //estimation over a period (period type convert to days if not)
    impact.infectionsByRequestedTime = impact.currentlyInfected * Math.pow(2, getPowerNumber(getNumberOfDays(periodType,timeToElapse)));
    
    severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * Math.pow(2, getPowerNumber(getNumberOfDays(periodType,timeToElapse)));
    
    //people who need hospitalization to recover their health
    impact.severeCasesByRequestedTime =math.trunc((impact.infectionsByRequestedTime * 15) /100);

    severeImpact.severeCasesByRequestedTime =math.trunc((severeImpact.infectionsByRequestedTime * 15) /100);

    //beds consumption
    impact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds) - impact.severeCasesByRequestedTime  ;
    severeImpact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds) - severeImpact.severeCasesByRequestedTime ;

    //number of positive cases that require ICU CARE
    impact.casesForICUByRequestedTime =  getFivePercentOfGiftedNum(impact.infectionsByRequestedTime);
    severeImpact.casesForICUByRequestedTime = getFivePercentOfGiftedNum(severeImpact.infectionsByRequestedTime);
    
    //number of positive cases that require ventilators
    impact.casesForVentilatorsByRequestedTime = math.trunc((impact.infectionsByRequestedTime * 2) /100);
    severeImpact.casesForVentilatorsByRequestedTime = math.trunc((severeImpact.infectionsByRequestedTime * 2)/100);
  
    //estimation of what covid-19 can make economy lost dayly
    impact.dollarsInflight =math.trunc((impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation )/getNumberOfDays(timeToElapse));
    severeImpact.dollarsInflight=math.trunc((severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation )/getNumberOfDays(timeToElapse));
    
    
return output;

} ;

const getFivePercentOfGiftedNum = (number) =>{

     return number * 5 /100
}

const getHospitalsBedAvailable =(totalHospitalBeds) =>{
  return totalHospitalBeds * 15 / 100
}

const getPowerNumber =(numberOfDays) =>{
    return Math.trunc(numberOfDays/3)
}

const getNumberOfDays =(periodType,timeToElapse) =>{
     if(periodType ==="days") 
       return timeToElapse

     else if (periodType === "weeks") 
       return timeToElapse * 7 

     else if (periodType ==="months") 
       return timeToElapse * 30
    
}



export default covid19ImpactEstimator;
