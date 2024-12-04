"use client";

import styles from "../styles/Calls.module.css";
import NavBar from "../components/nav";
import { BiError } from "react-icons/bi";
import Location from "../components/locationComponent";
import { IoIosArrowForward } from "react-icons/io";
import { GiPoliceCar } from "react-icons/gi";
import Pusher from "pusher-js";
import { useState, useEffect } from "react";

export default function Calls() {
    const [currentStep, setCurrentStep] = useState("Inicial");
    const [numeroViatura, setNumeroViatura] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [idChat, setIdChat] = useState(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        async function fetchOccurrences() {
            try {
                const response = await fetch("/api/getUserOccurrences", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.idChat) {
                        setCurrentStep("chatLiberado");
                        setNumeroViatura(data.numeroViatura || null);
                        setIdChat(data.idChat);
                    } else {
                        setCurrentStep("Inicial");
                    }
                } else {
                    console.error("Falha ao buscar ocorrências:", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao buscar ocorrência ativa:", error);
            }
        }

        fetchOccurrences();
    }, []);

    useEffect(() => {
        if (idChat) {
            const fetchMessages = async () => {
                try {
                    const response = await fetch(`/api/getMessages?idChat=${idChat}`);
                    if (response.ok) {
                        const data = await response.json();
                        setMessages(data); // Carrega as mensagens existentes
                        localStorage.setItem("messages", JSON.stringify(data)); // Armazena no localStorage
                    } else {
                        console.error("Erro ao buscar mensagens:", response.statusText);
                    }
                } catch (error) {
                    console.error("Erro ao buscar mensagens:", error);
                }
            };
            fetchMessages();
    
            const pusher = new Pusher('aa4c044f44f54ec4ab00', {
                cluster: 'sa1',
            });
    
            const channel = pusher.subscribe(`chat-${idChat}`);
            channel.bind("nova-mensagem", (data) => {
                setMessages((prev) => {
                    // Filtra para evitar duplicação
                    const updatedMessages = prev.some((msg) => msg.id === data.id)
                        ? prev
                        : [...prev, data];
    
                    // Atualiza o localStorage
                    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    
                    return updatedMessages;
                });
            });
    
            return () => {
                pusher.unsubscribe(`chat-${idChat}`);
            };
        }
    }, [idChat]);

    const sendMessage = async () => {
        if (!idChat) {
            console.error("idChat não definido. Verifique a lógica anterior.");
            return;
        }
    
        if (input.trim()) {
            try {
                const response = await fetch("/api/sendMessage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idChat, texto: input }),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    console.error("Erro ao enviar mensagem:", data.message);
                    return;
                }
    
                setMessages((prev) => {
                    // Verifica e adiciona a mensagem sem duplicação
                    const updatedMessages = prev.some((msg) => msg.id === data.novaMensagem.id)
                        ? prev
                        : [...prev, data.novaMensagem];
    
                    // Atualiza o localStorage
                    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    
                    return updatedMessages;
                });
    
                setInput(""); // Limpa o campo de entrada
            } catch (error) {
                console.error("Erro ao enviar mensagem:", error.message);
            }
        }
    };

    return (
        <div>
            <div className={styles.leftContainer}>
                <h1 className={styles.text}>Conversas</h1>
                <Location />

                <div className={styles.settingBox}>
                    <div className={styles.historyBox}>
                        <button type="button" className={styles.navigationButton}>
                            <div className={styles.boxCircle}>
                                <GiPoliceCar className={styles.boxIcons} />
                                <p className={styles.boxText}>
                                    {numeroViatura ? `Viatura ${numeroViatura}` : "Viatura não pareada"}
                                </p>
                                <IoIosArrowForward className={styles.boxArrow} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                {currentStep === "Inicial" && (
                    <>
                        <div className={styles.boxError}>
                            <BiError className={styles.BiError} />
                        </div>
                        <h1 className={styles.Alert}>AVISO!</h1>
                        <h3 className={styles.AlertText}>
                            Você precisa ter uma ocorrência ativa para utilizar essa página.
                        </h3>
                    </>
                )}

                {currentStep === "chatLiberado" && (
                    <>
                        <div className={styles.chatBox}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.user?.id === idChat
                                        ? styles.sentMessage
                                        : styles.receivedMessage
                                }
                            >
                                <div className={styles.messageAuthor}>{msg.user?.fullName || "Usuário desconhecido"}</div>
                                <div className={styles.messageContent}>{msg.texto}</div>
                            </div>
                        ))}
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escreva sua mensagem"
                                className={styles.messageInput}
                            />
                            <button onClick={sendMessage} className={styles.sendButton}>
                                Enviar
                            </button>
                        </div>
                    </>
                )}
            </div>
            <NavBar />
        </div>
    );
}
