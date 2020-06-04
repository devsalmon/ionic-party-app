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
            console.log('created project', action.party)
    }
    return state
}

export default partyReducer