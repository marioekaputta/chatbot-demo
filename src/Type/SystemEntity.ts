export namespace SystemEntity {
  export type Address = {
    city: string | null,
    district: string | null,
    province: string | null,
    street: string,
    subdistrict: string | null,
    zipcode: string | null
  }

  export type Airport = {
    arrival_airport?: {
      city_code: string,
      city_name: string,
      code: string,
      name: string
    }[],
    departure_airport?: {
      city_code: string,
      city_name: string,
      code: string,
      name: string
    }[],
    airport?: {
      city_code: string,
      city_name: string,
      code: string,
      name: string
    }[]
  }

  export type Bank = {
    kode_bank: string,
    namabank: string,
    singkatan: string
  }

  export type City = {
    id: string,
    nama: string,
    tipe: string
  }

  export type Color = {
    nama: string
  }

  export type DataPackage = {
    data: string | number | null,
    money: number | null,
    durasi: string | null
  }

  /**
   * Assume that today is Monday, 8 January 2020
   *
   * If the chat is like `hari senin depan`, then it will return `2020-01-15`
   *
   * If the chat is like `hari senin`, then it will return `['2020-01-01', '2020-01-08']`
   */
  export type Date = string | string[]

  /**
   * Not recommended to use this yet. Combine the usage of `Date` and `Time` entity instead
   */
  export type DateTime = string

  export type Email = string

  export type Geocode = {
    address_components: {
      long_name: string,
      short_name: string,
      types: string[]
    }[],
    formatted_address: string,
    geometry: {
      bounds: {
        northeast: {
          lat: number,
          lng: number
        },
        southwest: {
          lat: number,
          lng: number
        }
      },
      location: {
        lat: number,
        lng: number
      },
      location_type: string,
      viewport: {
        northeast: {
          lat: number,
          lng: number
        },
        southwest: {
          lat: number,
          lng: number
        }
      }
    },
    place_id: string,
    types: string[]
  }

  export type IdCard = {
    area: string,
    birtdate: string,
    gender: string,
    number: string,
    type: string
  }

  export type Idx = {
    'Kode Perusahaan': string,
    'Nama Perusahaan': string,
    'Papan Pencatatan': string,
    Saham: string,
    Sektor: string,
    'Tanggal Pencatatan': string
  }

  export type Kecamatan = string

  export type Money = number

  export type Movie = {
    duration: string,
    genre: string,
    gojek_id: number,
    image: string,
    name: string,
    traler_id: string
  }[]

  export type NFlightPassenger = {
    adult: number,
    child: number,
    infant: number
  }

  export type NumberV2 = {
    value: number,
    ordinal: boolean | null
  }

  export type Ordinal = {
    number: number | null,
    order: number | 'last' | null
  }

  export type Phone = {
    number: string,
    operator: string
  }

  export type Province = {
    kode: string,
    kode_sni: string,
    provinsi: string
  }

  export type Pulsa = number

  export type Station = {
    station?: {
      city: string,
      id: string,
      name: string
    }[],
    arrival_station?: {
      city: string,
      id: string,
      name: string
    }[],
    departure_station?: {
      city: string,
      id: string,
      name: string
    }[]
  }

  export type Time = string[]

  export type URL = string

  export type ZipCode = {
    'kabupaten/kota': string,
    kecamatan: string,
    kelurahan: string,
    provinsi: string,
    tipe: string,
    zipcode: string
  }
}