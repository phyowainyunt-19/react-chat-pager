import React, { useState } from 'react'
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

//? get auth tokens
const cookies = new Cookies();

const apiKey = "bpvf784ukj45";

const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

//? create user if there is auth token
if (authToken) {
    client.connectUser({
        //! we use cookies.get()
        id: cookies.get('userID'),
        name: cookies.get('userName'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
        phoneNumber: cookies.get('phoneNumber'),
    }, authToken);
}

const App = () => {

    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState('');
    const [isEditing, setIsEditing] = useState('');


    if (!authToken) return <Auth />

    return (
        <div className="app__wrapper">
            <Chat client={client} theme="team light">
                <ChannelListContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                />

                <ChannelContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}

                />
            </Chat>
        </div>
    )
}

export default App
