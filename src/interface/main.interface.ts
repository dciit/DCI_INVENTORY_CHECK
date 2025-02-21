export interface ContextInterface {
    appname?: string;
    style?: StyleInterface;
}
export interface StyleInterface {
    baseColorText?: string;
}
export interface ReduxInterface {
    login: boolean;
    authen: AuthenInfo; 
}

export interface AuthenInfo {
    code?:       string;
    sName?:      string;
    lName?:      string;
    wsts?:       string;
    posit?:      string;
    costCenter?: string;
    dvcd?:       string;
    dvcdName?:   string;
    dept?:       string;
    lineCode?:   string;
    mSetInfo?:   MSetInfo;
    role?:       string;
}

export interface MSetInfo {
    setCode?:  string;
    ym?:      string;
    ymd?:      string;
    rev?:      string;
    dataBy?:   string;
    dataDate?: Date;
    status?:   string;
}