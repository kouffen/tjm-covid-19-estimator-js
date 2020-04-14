const getHospitalsBedAvailable = (totalHospitalBeds) => Math.round(totalHospitalBeds * 0.35);

const getNumberOfDays = (periodType, timeToElapse) => {
  if (periodType === 'weeks') {
    return timeToElapse * 7;
  } if (periodType === 'months') {
    return timeToElapse * 30;
  } if (periodType === 'days') {
    return timeToElapse;  
  }
  return timeToElapse;
};
const getPowerNumber = (periodType, timeToElapse) => Math.round(getNumberOfDays(periodType,
  timeToElapse) / 3);


const covid19ImpactEstimator = (data) => {
  // recuperation des entrance data
  // declaration of input variables

  const {
    region, periodType, timeToElapse, reportedCases,
    totalHospitalBeds
  } = data;

  // data output variables elements declariations
  const impact = {};

  const severeImpact = {};


  // estimation of currently infected people
  impact.currentlyInfected = reportedCases * 10;

  severeImpact.currentlyInfected = reportedCases * 50;

  // estimation over a period (period type convert to days if not)
  impact.infectionsByRequestedTime = impact.currentlyInfected
                                    * 2 ** getPowerNumber(periodType, timeToElapse);

  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected
                                           * 2 ** getPowerNumber(periodType, timeToElapse);

  // people who need hospitalization to recover their health
  impact.severeCasesByRequestedTime = Math.round(impact.infectionsByRequestedTime * 0.15);

  severeImpact.severeCasesByRequestedTime = Math.round(severeImpact.infectionsByRequestedTime
                                                        * 0.15);

  // beds consumption
  impact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds)
                                       - impact.severeCasesByRequestedTime;

  severeImpact.hospitalBedsByRequestedTime = getHospitalsBedAvailable(totalHospitalBeds)
                                             - severeImpact.severeCasesByRequestedTime;

  // number of positive cases that require ICU CARE
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;

  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  // number of positive cases that require ventilators
  impact.casesForVentilatorsByRequestedTime = Math.round(impact.infectionsByRequestedTime * 0.02);

  severeImpact.casesForVentilatorsByRequestedTime = Math.round(
    severeImpact.infectionsByRequestedTime * 0.02
  );

  // estimation of what covid-19 can make economy lost dayly
  impact.dollarsInflight = Math.round((impact.infectionsByRequestedTime
                                       * region.avgDailyIncomeInUSD
                                       * region.avgDailyIncomePopulation)
                                       / getNumberOfDays(timeToElapse));

  severeImpact.dollarsInflight = Math.round((severeImpact.infectionsByRequestedTime
                * region.avgDailyIncomeInUSD
                * region.avgDailyIncomePopulation)
                / getNumberOfDays(timeToElapse));

  return {
    data,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
