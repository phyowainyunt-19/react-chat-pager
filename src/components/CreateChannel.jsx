import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
    //? get own id
    //? react hooks
    // const { client, setActiveChannel } = useChatContext();

    //? to keep track of which ones are toggled on and which ones are not
    // const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

    const handleChange = (e) => {
        e.preventDefault();

        setChannelName(e.target.value);
    }
    return (
        <div className="channel-name-input__wrapper">
            <p className="">Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" type="text" />
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {

    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [channelName, setChannelName] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();

        try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName,
                members: selectedUsers
            });
            //? keep watching that channel (like new messages come in)
            await newChannel.watch();

            //? reset create channel input area
            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
            <UserList setSelectedUsers={setSelectedUsers} />

            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>
                    {createType === 'team' ? 'Create Channel' : 'Create Chat Group'}
                </p>
            </div>
        </div>
    )
}

export default CreateChannel
