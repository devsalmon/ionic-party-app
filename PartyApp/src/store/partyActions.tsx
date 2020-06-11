
export const createParty = (party) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        firestore.collection('parties').add({
            ...party, 
            creatorFirstName: 'bruno',
            creatorLastName: 'cecco',
            creatorId: 12345,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_PARTY', party })
        }).catch((err) => {
            dispatch({ type: 'CREATE_PARTY_ERROR', err })
        })
    }
}