import dayjs from 'dayjs/esm';

export interface IOwner {
  id: number;
  firstName?: string | null;
  secondName?: string | null;
  firstLastName?: string | null;
  secondLastName?: string | null;
  phoneNumber?: number | null;
  photo?: string | null;
  identityNumber?: string | null;
  adress?: string | null;
  province?: string | null;
  canton?: string | null;
  district?: string | null;
  email?: string | null;
  userPassword?: string | null;
  otp?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
}

export type NewOwner = Omit<IOwner, 'id'> & { id: null };
