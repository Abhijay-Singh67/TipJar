import React from 'react'

const username = async ({ params }) => {

    let username = await params.username;

    return (
        <div>
            {username}
        </div>
    )
}

export default username
