
export const createParty = (party) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        dispatch({ type: 'CREATE_PARTY', party })
    }
}