export type Train = {
  id: string;
  name: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  price: number;
  class: string;
};

export const SAMPLE_TRAINS: Train[] = [
  {
    id: "G101",
    name: "Argo Luxury",
    from: "Jakarta",
    to: "Surabaya",
    depart: "06:30",
    arrive: "13:15",
    duration: "6h 45m",
    price: 650000,
    class: "Executive",
  },
  {
    id: "G205",
    name: "Parahyangan Premium",
    from: "Bandung",
    to: "Jakarta",
    depart: "09:00",
    arrive: "11:45",
    duration: "2h 45m",
    price: 320000,
    class: "Business",
  },
  {
    id: "R404",
    name: "Lokal Elegance",
    from: "Yogyakarta",
    to: "Solo",
    depart: "14:10",
    arrive: "15:05",
    duration: "0h 55m",
    price: 75000,
    class: "Economy",
  },
];

export const fmtIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    value
  );
