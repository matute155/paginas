// User Types
export const UserTypes = {
  OWNER: 'owner',
  GUEST: 'guest'
};

// Property Types
export const PropertyTypes = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  CABIN: 'cabin',
  STUDIO: 'studio'
};

// San Juan neighborhoods/areas
export const SanJuanAreas = {
  CENTRO: 'centro',
  VILLA_KRAUSE: 'villa_krause',
  CHIMBAS: 'chimbas',
  RAWSON: 'rawson',
  POCITO: 'pocito',
  SANTA_LUCIA: 'santa_lucia',
  ULLUM: 'ullum',
  ZONDA: 'zonda',
  CAUCETE: 'caucete',
  RIVADAVIA: 'rivadavia'
};

// Amenities
export const Amenities = {
  WIFI: 'wifi',
  PARKING: 'parking',
  POOL: 'pool',
  AIR_CONDITIONING: 'air_conditioning',
  HEATING: 'heating',
  KITCHEN: 'kitchen',
  WASHING_MACHINE: 'washing_machine',
  BBQ: 'bbq',
  GARDEN: 'garden',
  PETS_ALLOWED: 'pets_allowed'
};

// Property Status
export const PropertyStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING_APPROVAL: 'pending_approval'
};

// Sample data structures (as comments for reference)
/*
User = {
  id: string,
  email: string,
  phone: string,
  name: string,
  type: UserTypes,
  verified: boolean,
  createdAt: Date,
  whatsappNumber: string
}

Property = {
  id: string,
  ownerId: string,
  title: string,
  description: string,
  type: PropertyTypes,
  area: SanJuanAreas,
  address: string,
  coordinates: { lat: number, lng: number },
  images: string[],
  amenities: Amenities[],
  capacity: number,
  bedrooms: number,
  bathrooms: number,
  price: {
    daily: number,
    weekly: number,
    monthly: number
  },
  availability: {
    startDate: Date,
    endDate: Date,
    blockedDates: Date[]
  },
  status: PropertyStatus,
  createdAt: Date,
  updatedAt: Date
}

Inquiry = {
  id: string,
  propertyId: string,
  guestName: string,
  guestPhone: string,
  message: string,
  checkIn: Date,
  checkOut: Date,
  createdAt: Date
}
*/