type OBHPhone = {
  fax: string[];
  telpon: string[];
  handphone: string[];
};

type OBH = {
  id: number;
  obh_name: string;
  obh_email: string;
  obh_phone_json: OBHPhone;
  obh_address: string;
  latitude: number;
  longitude: number;
  jarak_meter: number;
};

type Posbankum = {
  id: number;
  posbankum_name: string;
  posbankum_email: string;
  phone: string;
  posbankum_address: string;
  city_name: string;
  province_name: string;
  district_name: string;
  posbankum_village: string;
  latitude: number;
  longitude: number;
  jarak_meter: number;
}


export type { OBH, OBHPhone, Posbankum };
