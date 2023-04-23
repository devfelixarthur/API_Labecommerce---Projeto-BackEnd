export enum DESTINOS {
    AMERICA = 'America',
    EUROPA = 'Europa',
    AFRICA = 'Africa',
    ASIA = 'Asia',
    OCEANIA = 'Oceania'
}


export type TUser = {
    id: string,
    name: string,
    email: string,
    password: string,
    createAt: string
}

export type TPurchaseWithProduct = {
    id: string,
    buyer_id: string,
    buyer_name: string,
    totalPrice: number,
    createdAt: string,
    paid: boolean,
    products: TProduct[];
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: DESTINOS,
    description: string,
    imageUrl: string
}

export type TPurchase = {
    purchaseId: string,
    buyer_id: string,
    buyer_name: string,
    totalPrice: number,
    createdAt?: string,
    paid: number,
  }
