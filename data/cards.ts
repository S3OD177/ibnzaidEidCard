export type Card = {
    id: number;
    title: string;
    imgLink: string;
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
    txtSize: number;
    txtColor?: string;
    occasion: string;
}

export const cardsData: Card[] = [
    {
        id: 1,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/bg1-2.jpg",
        x: null,
        y: 3000,
        width: null,
        height: null,
        txtSize: 150,
        occasion: "عيد الأضحى"
    },
    {
        id: 2,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/eidf1.jpeg",
        x: null,
        y: 950,
        width: null,
        height: null,
        txtSize: 60,
        occasion: "عيد الفطر"
    },
    {
        id: 3,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/ram1.jpeg",
        x: null,
        y: 950,
        width: null,
        height: null,
        txtSize: 55,
        occasion: "رمضان"
    },
    {
        id: 4,
        title: "",
        imgLink: "https://saud.imgix.net/cardsImg/ram2.jpeg",
        x: null,
        y: 755,
        width: null,
        height: null,
        txtSize: 50,
        occasion: "رمضان"
    },
    {
        id: 5,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/ram3.jpeg",
        x: null,
        y: 800,
        width: null,
        height: null,
        txtSize: 50,
        txtColor: "white",
        occasion: "رمضان"
    },
    {
        id: 6,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/eidf2.jpeg",
        x: null,
        y: 995,
        width: null,
        height: null,
        txtSize: 58,
        occasion: "عيد الفطر"
    },
    {
        id: 7,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/eidf3.jpeg",
        x: null,
        y: 1010,
        width: null,
        height: null,
        txtSize: 55,
        occasion: "عيد الفطر"
    },
    {
        id: 8,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/eidf4.jpeg",
        x: null,
        y: 700,
        width: null,
        height: null,
        txtSize: 55,
        occasion: "عيد الأضحى"
    },
    {
        id: 9,
        title: " ",
        imgLink: "https://saud.imgix.net/cardsImg/eid2.jpeg",
        x: null,
        y: 660,
        width: null,
        height: null,
        txtSize: 50,
        occasion: "عيد الأضحى"
    }
]
