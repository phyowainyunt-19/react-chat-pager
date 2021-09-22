import React, { useState, useEffect } from 'react'

import { Avatar, useChatContext } from 'stream-chat-react'
import { InviteIcon } from '../assets'

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false);

    const toggleSelect = () => {
        //? check if the user has been selected 
        //! 1: filter out the current clicked user
        //! 2: add one more user
        if (selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }
        //? modify sth by the previous value
        setSelected((prevSelected) => !prevSelected);
    }
    return (
        <div className="user-item__wrapper" onClick={toggleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">
                    {user.fullName || user.id}
                </p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {

    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    //! error handling for no users
    const [error, setError] = useState(false);

    //? we will call this when something changes (filters change)
    //? filters change when we want users only for channel messages

    useEffect(() => {
        const getUsers = async () => {
            if (loading) return;

            setLoading(true);

            //? to query the users
            //? from useChatChannel
            try {
                //? allow use to query all the users based on specific parameters
                const response = await client.queryUsers(
                    //! excluding the queering of users for the user with the current id
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 }
                );

                if (response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }
        //? call function
        if (client) getUsers();

    }, [])

    if (error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading,please refresh and try again!
                </div>
            </ListContainer>
        )
    }

    if (listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No Users Found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading Users...
            </div> : (
                users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                ))
            )}
        </ListContainer>
    )
}

export default UserList
