import { ReduxInterface } from "../interface/main.interface"

const initialState: ReduxInterface = {
    code: '',
    login: false,
    name: '',
    surn: '',
    fullname: '',
    pren: '',
}

const IndexReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                login: true,
                name: action.payload.name,
                surn: action.payload.surn,
                code: action.payload.code,
                fullname: action.payload.fullname,
                pren: action.payload.pren
            }
        case 'LOGOUT':
            return {
                ...state,
                login: false,
                name: '',
                surn: '',
                code: ''
            }
        default:
            return state
    }
}
export default IndexReducer;
