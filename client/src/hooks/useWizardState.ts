import { useState, useCallback } from "react";

export type WizardStep = 1 | 2 | 3 | 4;

export const STEP_LABELS: Record<WizardStep, string> = {
  1: "Revenue",
  2: "Business Model",
  3: "Allocations",
  4: "Upload Files",
};

export interface WizardState {
  // Navigation
  currentStep: WizardStep;
  completedSteps: Set<WizardStep>;
  next: () => void;
  back: () => void;
  goToStep: (step: WizardStep) => void;
  markComplete: (step: WizardStep) => void;

  // Profile (set before wizard, carried through)
  salonName: string;
  setSalonName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;

  // Step 1: Revenue
  totalServiceRevenue: string;
  setTotalServiceRevenue: (v: string) => void;
  totalRetailRevenue: string;
  setTotalRetailRevenue: (v: string) => void;
  totalClients: string;
  setTotalClients: (v: string) => void;
  desiredOwnerSalary: string;
  setDesiredOwnerSalary: (v: string) => void;
  cashReserves: string;
  setCashReserves: (v: string) => void;
  partsAndLaborEnabled: boolean;
  setPartsAndLaborEnabled: (v: boolean) => void;
  partsAndLaborAmount: string;
  setPartsAndLaborAmount: (v: string) => void;

  // Step 2: Business Model
  businessModel: string;
  setBusinessModel: (v: string) => void;
  totalPayroll: string;
  setTotalPayroll: (v: string) => void;
  numberOfEmployees: string;
  setNumberOfEmployees: (v: string) => void;
  avgHourlyWage: string;
  setAvgHourlyWage: (v: string) => void;
  totalHoursWorked: string;
  setTotalHoursWorked: (v: string) => void;
  hybridBoothRentalIncome: string;
  setHybridBoothRentalIncome: (v: string) => void;
  hybridEmployeeRevenue: string;
  setHybridEmployeeRevenue: (v: string) => void;
  hybridNumberOfBooth: string;
  setHybridNumberOfBooth: (v: string) => void;
  hybridNumberOfEmployees: string;
  setHybridNumberOfEmployees: (v: string) => void;

  // Step 3: Allocations
  currentProfitPct: string;
  setCurrentProfitPct: (v: string) => void;
  currentOwnerPayDollar: string;
  setCurrentOwnerPayDollar: (v: string) => void;
  currentTaxPct: string;
  setCurrentTaxPct: (v: string) => void;
  currentOpexPct: string;
  setCurrentOpexPct: (v: string) => void;
  targetProfitPct: string;
  setTargetProfitPct: (v: string) => void;
  targetOwnerPayPct: string;
  setTargetOwnerPayPct: (v: string) => void;
  targetTaxPct: string;
  setTargetTaxPct: (v: string) => void;
  targetOpexPct: string;
  setTargetOpexPct: (v: string) => void;

  // Step 4: File Uploads
  commissionFiles: File[];
  setCommissionFiles: (v: File[]) => void;
  bankFiles: File[];
  setBankFiles: (v: File[]) => void;

  // Reset all form state
  reset: () => void;
}

export function useWizardState(): WizardState {
  // Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  const markComplete = useCallback((step: WizardStep) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      markComplete(prev);
      return Math.min(prev + 1, 4) as WizardStep;
    });
  }, [markComplete]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, []);

  // Profile
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 1: Revenue
  const [totalServiceRevenue, setTotalServiceRevenue] = useState("");
  const [totalRetailRevenue, setTotalRetailRevenue] = useState("");
  const [totalClients, setTotalClients] = useState("");
  const [desiredOwnerSalary, setDesiredOwnerSalary] = useState("");
  const [cashReserves, setCashReserves] = useState("");
  const [partsAndLaborEnabled, setPartsAndLaborEnabled] = useState(false);
  const [partsAndLaborAmount, setPartsAndLaborAmount] = useState("");

  // Step 2: Business Model
  const [businessModel, setBusinessModel] = useState("Commission W-2");
  const [totalPayroll, setTotalPayroll] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [avgHourlyWage, setAvgHourlyWage] = useState("");
  const [totalHoursWorked, setTotalHoursWorked] = useState("");
  const [hybridBoothRentalIncome, setHybridBoothRentalIncome] = useState("");
  const [hybridEmployeeRevenue, setHybridEmployeeRevenue] = useState("");
  const [hybridNumberOfBooth, setHybridNumberOfBooth] = useState("");
  const [hybridNumberOfEmployees, setHybridNumberOfEmployees] = useState("");

  // Step 3: Allocations
  const [currentProfitPct, setCurrentProfitPct] = useState("");
  const [currentOwnerPayDollar, setCurrentOwnerPayDollar] = useState("");
  const [currentTaxPct, setCurrentTaxPct] = useState("");
  const [currentOpexPct, setCurrentOpexPct] = useState("");
  const [targetProfitPct, setTargetProfitPct] = useState("");
  const [targetOwnerPayPct, setTargetOwnerPayPct] = useState("");
  const [targetTaxPct, setTargetTaxPct] = useState("");
  const [targetOpexPct, setTargetOpexPct] = useState("");

  // Step 4: Files
  const [commissionFiles, setCommissionFiles] = useState<File[]>([]);
  const [bankFiles, setBankFiles] = useState<File[]>([]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setTotalServiceRevenue("");
    setTotalRetailRevenue("");
    setTotalClients("");
    setDesiredOwnerSalary("");
    setCashReserves("");
    setPartsAndLaborEnabled(false);
    setPartsAndLaborAmount("");
    setCurrentProfitPct("");
    setCurrentOwnerPayDollar("");
    setCurrentTaxPct("");
    setCurrentOpexPct("");
    setTargetProfitPct("");
    setTargetOwnerPayPct("");
    setTargetTaxPct("");
    setTargetOpexPct("");
    setTotalPayroll("");
    setNumberOfEmployees("");
    setAvgHourlyWage("");
    setTotalHoursWorked("");
    setHybridBoothRentalIncome("");
    setHybridEmployeeRevenue("");
    setHybridNumberOfBooth("");
    setHybridNumberOfEmployees("");
    setCommissionFiles([]);
    setBankFiles([]);
  }, []);

  return {
    currentStep,
    completedSteps,
    next,
    back,
    goToStep,
    markComplete,
    salonName, setSalonName,
    email, setEmail,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    totalServiceRevenue, setTotalServiceRevenue,
    totalRetailRevenue, setTotalRetailRevenue,
    totalClients, setTotalClients,
    desiredOwnerSalary, setDesiredOwnerSalary,
    cashReserves, setCashReserves,
    partsAndLaborEnabled, setPartsAndLaborEnabled,
    partsAndLaborAmount, setPartsAndLaborAmount,
    businessModel, setBusinessModel,
    totalPayroll, setTotalPayroll,
    numberOfEmployees, setNumberOfEmployees,
    avgHourlyWage, setAvgHourlyWage,
    totalHoursWorked, setTotalHoursWorked,
    hybridBoothRentalIncome, setHybridBoothRentalIncome,
    hybridEmployeeRevenue, setHybridEmployeeRevenue,
    hybridNumberOfBooth, setHybridNumberOfBooth,
    hybridNumberOfEmployees, setHybridNumberOfEmployees,
    currentProfitPct, setCurrentProfitPct,
    currentOwnerPayDollar, setCurrentOwnerPayDollar,
    currentTaxPct, setCurrentTaxPct,
    currentOpexPct, setCurrentOpexPct,
    targetProfitPct, setTargetProfitPct,
    targetOwnerPayPct, setTargetOwnerPayPct,
    targetTaxPct, setTargetTaxPct,
    targetOpexPct, setTargetOpexPct,
    commissionFiles, setCommissionFiles,
    bankFiles, setBankFiles,
    reset,
  };
}
