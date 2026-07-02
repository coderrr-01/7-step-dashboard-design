import React, { useState } from "react";
import "../../assets/styles/chat-style.css"


const ChatCard = () => {


    const [message, setMessage] = useState("");

    const [showOptions, setShowOptions] = useState(true);



    const [messages, setMessages] = useState([

        {
            text: "Welcome back, Julian. Please select your room type.",
            type: "bot"
        }

    ]);



    const options = [

        {
            title: "Single Room",
            desc: "Private Solitude",
            icon: (
                <svg
                    className="option-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                </svg>
            )
        },

        {
            title: "Executive Room",
            desc: "Executive Suite",
            icon: (
                <svg class="option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                </svg>
            )
        },

        {
            title: "Both",
            desc: "Extended Options",
            icon: (
                <svg class="option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                </svg>
            )
        }


    ];





    const selectOption = (option) => {


        // user message add

        setMessages(prev => [

            ...prev,

            {
                text: option.title,
                type: "user"
            }


        ]);



        // options hide

        setShowOptions(false);



        // bot reply

        setTimeout(() => {


            setMessages(prev => [

                ...prev,

                {
                    text: `Great choice! You selected ${option.title}. I will help you with next steps.`,
                    type: "bot"
                }


            ])


        }, 500)



    }







    const sendMessage = () => {


        if (!message.trim()) return;



        setMessages([

            ...messages,

            {
                text: message,
                type: "user"
            }

        ]);


        setMessage("");

    }





    return (


        <div className="chat-card">



            <div className="chat-header">

                <h3>Online</h3>

            </div>




            <div className="chat-history">


                {

                    messages.map((item, index) => (


                        <div
                            key={index}
                            className={`message-row ${item.type}`}
                        >


                            <div className="message-bubble">

                                {item.text}

                            </div>


                        </div>


                    ))


                }





                {
                    showOptions && (

                        <div className="options-row">


                            {

                                options.map((item, index) => (


                                    <button

                                        key={index}

                                        className="option-button"

                                        onClick={() => selectOption(item)}

                                    >
                                        {item.icon}
                                        <h4>{item.title}</h4>

                                        <p>{item.desc}</p>


                                    </button>


                                ))


                            }


                        </div>

                    )

                }



            </div>





            <div className="chat-input-area">
                <div class="input-wrapper mb-3">
                    <input class="chat-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your inquiry here..." />
                    <button onClick={sendMessage} class="btn p-0 border-0 chat-send-btn">
                        <svg fill="currentColor" height="20" class="chat-send-icon" viewBox="0 0 24 24" width="20">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </div>


            </div>






        </div>


    )


}


export default ChatCard;