"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Calls.module.css";
import NavBar from "../components/navPolice";
import { BiError } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { GiPoliceCar } from "react-icons/gi";
import Location from "../components/locationComponent";

export default function PoliceChat() {
    const [currentStep, setCurrentStep] = useState("Inicial");
    const [numeroViatura, setNumeroViatura] = useState(null);
    const [idViatura, setIdViatura] = useState(null); // ID da viatura logada
    const [idChat, setIdChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Função para buscar ocorrência e chat da viatura
    useEffect(() => {
        async function fetchOccurrences() {
            try {
                const response = await fetch("/api/getViaturaOccurrences");
                const data = await response.json();

                if (response.ok) {
                    setCurrentStep("chatLiberado");
                    setNumeroViatura(data.numeroViatura);
                    setIdChat(data.idChat);
                    setIdViatura(data.idViatura); // Define o ID da viatura logada
                } else {
                    setCurrentStep("Inicial");
                }
            } catch (error) {
                console.error("Erro ao buscar ocorrência:", error);
            }
        }

        fetchOccurrences();
    }, []);

    // Função para buscar mensagens
    useEffect(() => {
        if (idChat) {
            async function fetchMessages() {
                try {
                    const response = await fetch(`/api/getMessages?idChat=${idChat}`);
                    const data = await response.json();
                    if (response.ok) setMessages(data);
                } catch (error) {
                    console.error("Erro ao buscar mensagens:", error);
                }
            }

            fetchMessages();
        }
    }, [idChat]);

    // Função para enviar mensagem
    async function sendMessage() {
        if (!input.trim()) return;

        try {
            const response = await fetch("/api/sendMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: input, idChat }),
            });

            if (response.ok) {
                const { novaMensagem } = await response.json();
                setMessages((prevMessages) => [...prevMessages, novaMensagem]);
                setInput("");
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }

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
                                    (msg.user?.id === idChat ? styles.sentMessage : styles.receivedMessage) ||
                                    (msg.viatura?.id === numeroViatura ? styles.receivedMessage : styles.sentMessage)
                                }
                            >
                                <div className={styles.messageAuthor}>
                                    {msg.user?.fullName || msg.viatura?.numeroViatura || "Autor desconhecido"}
                                </div>
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
