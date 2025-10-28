export type ShortFullInfo = {
    short: string,
    full: string
}

export const units: ShortFullInfo[] = [
    {short: "Bch.", full: "Becher"},
    {short: "Bd./Bn.", full: "Bund"},
    {short: "Bl.", full: "Blatt"},
    {short: "Btl.", full: "Beutel"},
    {short: "Do.", full: "Dose"},
    {short: "EL", full: "Esslöffel"},
    {short: "Gl.", full: "Glas"},
    {short: "g", full: "Gramm"},
    {short: "kg", full: "Kilogramm"},
    {short: "L", full: "Liter"},
    {short: "Msp.", full: "Messerspitze (1g - 2g)"},
    {short: "ml", full: "Milliliter"},
    {short: "nB.", full: "nach Belieben"},
    {short: "Pck.", full: "Päckchen"},
    {short: "Pr.", full: "Prise (1 g)"},
    {short: "Stg.", full: "Stange"},
    {short: "Stk.", full: "Stück"},
    {short: "Tas.", full: "Tasse"},
    {short: "TL", full: "Teelöffel"},
    {short: "Tr.", full: "Tropfen"},
    {short: "Wf.", full: "Würfel"},
    {short: "Z.", full: "Zehe"},
];

export const dimensions: ShortFullInfo[] = [
    {short: "1 TL", full: "5 ml"},
    {short: "1 EL", full: "15 ml"},
    {short: "1 Tasse", full: "120 - 150 ml"},
    {short: "1 Gl", full: "250 ml"},
    {short: "1 L", full: "1000 ml"},
];