import { ReduxInterface } from "../interface/main.interface"

const initialState: ReduxInterface = {
    login: false,
    authen: {}
}

const IndexReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            // console.log(action.payload)
            return {
                ...state,
                login: true,
                authen: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                authen: {},
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
