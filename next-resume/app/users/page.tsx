import React from 'react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

const Userpage = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {cache: "no-cache"});
    const users: User[] = await res.json() as User[];

    return (
        <>
            <h1>Users</h1>
            <p>{new Date().toLocaleTimeString()}</p>

            <ul>
                {users.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
        </>
    )
}


export default Userpage;
