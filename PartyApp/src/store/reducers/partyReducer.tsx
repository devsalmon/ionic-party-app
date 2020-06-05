const initState = {
    parties: [
        {id: '1', title: 'Brunos 17th'},
        {id: '2', title: 'Nicks 17th'},
        {id: '3', title: 'Paolos 17th'}
    ]
}

const partyReducer = (state=initState, action) => {
    switch (action.type) {
        case 'CREATE_PARTY':
            console.log('created project', action.party);
            return state;
        case 'CREATE_PARTY_ERROR':
            console.log('error creating project', action.err);
            return state;
        default:
            return state;
    }
}

export default partyReducer