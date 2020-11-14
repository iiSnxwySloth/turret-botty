export interface settings {
    permission: "Public" | "Support" | "Supervisor" | "Developer";
    requiresAuth: boolean;
}

export type category =
    | "Economy"
    | "Support"
    | "Developer"
    | "Fun"
    | "Miscellaneous";

export interface help {
    usage: string;
    category: category;
    desc: string;
}
