import { JenisKelas} from './jeniskelas';
import { Program } from './program';

export type ReadFee = {
    id: string;
    program: string;
    jenisKelas: JenisKelas;
    baseFee: number;
    studentMultiplier: number;
    naxStudents: number;
    lastUpdated: string;
};

export type ReadFeeGrouped = {
    program: Program;
    listFee: ReadFee[];
};