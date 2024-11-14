import React from 'react'
import './styles.scss'


interface Props {
    username: string;
}
const ChatBubble : React.FC<Props> = ({username}) => {
    return (
        <div className="chat-bubble">
            <div className="text-xs text-font_dark">{username}</div>
            <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}

export default ChatBubble
