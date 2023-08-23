import { createContext, Dispatch, SetStateAction } from 'react';

interface SharedContextProps {
    totalSum: number;
    setTotalSum: Dispatch<SetStateAction<number>>;
    nameCard: string;
    setNameCard: Dispatch<SetStateAction<string>>;
    cardNumber: string;
    setCardNumber: Dispatch<SetStateAction<string>>;
    expDate: Date;
    setExpDate: Dispatch<SetStateAction<Date>>;
    cvv: string;
    setCvv: Dispatch<SetStateAction<string>>;
    rememberDetails: boolean;
    setRememberDetails: Dispatch<SetStateAction<boolean>>;
    duration: string;
    setDuration: Dispatch<SetStateAction<string>>;
    useStorageCreditDetails: boolean;
    setUseStorageCreditDetails: Dispatch<SetStateAction<boolean>>;
    storageCreditDetails: number;
    setStorageCreditDetails: Dispatch<SetStateAction<number>>;

}

const SharedContext = createContext<SharedContextProps | null>(null);

export default SharedContext;
